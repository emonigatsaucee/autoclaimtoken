const { ethers } = require('ethers');
const axios = require('axios');

class CrossChainAggregator {
  constructor() {
    this.providers = {
      1: { provider: new ethers.JsonRpcProvider('https://eth.llamarpc.com'), name: 'Ethereum', symbol: 'ETH' },
      56: { provider: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'), name: 'BSC', symbol: 'BNB' },
      137: { provider: new ethers.JsonRpcProvider('https://polygon-rpc.com'), name: 'Polygon', symbol: 'MATIC' },
      42161: { provider: new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'), name: 'Arbitrum', symbol: 'ETH' },
      10: { provider: new ethers.JsonRpcProvider('https://mainnet.optimism.io'), name: 'Optimism', symbol: 'ETH' },
      43114: { provider: new ethers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc'), name: 'Avalanche', symbol: 'AVAX' },
      250: { provider: new ethers.JsonRpcProvider('https://rpc.ftm.tools'), name: 'Fantom', symbol: 'FTM' }
    };

    this.erc20ABI = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)'
    ];
  }

  async aggregateAllAssets(walletAddress) {
    const aggregatedData = {
      totalValueUSD: 0,
      chains: {},
      nativeBalances: [],
      tokenBalances: [],
      summary: {
        totalChains: 0,
        totalTokens: 0,
        largestHolding: null,
        smallestHolding: null
      }
    };

    try {
      // Scan all chains in parallel
      const chainPromises = Object.entries(this.providers).map(([chainId, config]) =>
        this.scanChain(walletAddress, parseInt(chainId), config)
      );

      const chainResults = await Promise.all(chainPromises);

      // Aggregate results
      chainResults.forEach((result, index) => {
        const chainId = Object.keys(this.providers)[index];
        aggregatedData.chains[chainId] = result;

        if (result.nativeBalance > 0) {
          aggregatedData.nativeBalances.push({
            chain: result.chainName,
            symbol: result.nativeSymbol,
            balance: result.nativeBalance,
            valueUSD: result.nativeValueUSD
          });
          aggregatedData.totalValueUSD += result.nativeValueUSD;
        }

        result.tokens.forEach(token => {
          aggregatedData.tokenBalances.push({
            ...token,
            chain: result.chainName
          });
          aggregatedData.totalValueUSD += token.valueUSD || 0;
        });
      });

      // Calculate summary
      aggregatedData.summary.totalChains = aggregatedData.nativeBalances.length;
      aggregatedData.summary.totalTokens = aggregatedData.tokenBalances.length;

      // Find largest and smallest holdings
      const allHoldings = [...aggregatedData.nativeBalances, ...aggregatedData.tokenBalances];
      if (allHoldings.length > 0) {
        aggregatedData.summary.largestHolding = allHoldings.reduce((max, holding) =>
          (holding.valueUSD || 0) > (max.valueUSD || 0) ? holding : max
        );
        aggregatedData.summary.smallestHolding = allHoldings.reduce((min, holding) =>
          (holding.valueUSD || 0) < (min.valueUSD || 0) ? holding : min
        );
      }

      return aggregatedData;
    } catch (error) {
      console.error('Asset aggregation error:', error);
      throw error;
    }
  }

  async scanChain(walletAddress, chainId, config) {
    const result = {
      chainId,
      chainName: config.name,
      nativeSymbol: config.symbol,
      nativeBalance: 0,
      nativeValueUSD: 0,
      tokens: [],
      error: null
    };

    try {
      // Get native balance
      const balance = await config.provider.getBalance(walletAddress);
      result.nativeBalance = parseFloat(ethers.formatEther(balance));

      // Get price for native token
      const price = await this.getTokenPrice(config.symbol);
      result.nativeValueUSD = result.nativeBalance * price;

      // Note: Token scanning would require additional API calls or contract addresses
      // For now, we focus on native balances which are always accurate

      return result;
    } catch (error) {
      console.error(`Error scanning chain ${chainId}:`, error.message);
      result.error = error.message;
      return result;
    }
  }

  async getTokenPrice(symbol) {
    try {
      const symbolMap = {
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'MATIC': 'matic-network',
        'AVAX': 'avalanche-2',
        'FTM': 'fantom'
      };

      const coinId = symbolMap[symbol] || symbol.toLowerCase();
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
        { timeout: 5000 }
      );

      return response.data[coinId]?.usd || 0;
    } catch (error) {
      console.error(`Price fetch error for ${symbol}:`, error.message);
      return 0;
    }
  }

  async findBridgeOpportunities(walletAddress) {
    const aggregated = await this.aggregateAllAssets(walletAddress);
    const opportunities = [];

    // Find chains with high gas costs vs chains with low gas costs
    const highGasChains = ['Ethereum'];
    const lowGasChains = ['Polygon', 'Arbitrum', 'Optimism', 'BSC'];

    aggregated.nativeBalances.forEach(balance => {
      if (highGasChains.includes(balance.chain) && balance.valueUSD > 100) {
        opportunities.push({
          type: 'bridge_to_l2',
          from: balance.chain,
          to: 'Arbitrum or Optimism',
          reason: 'Reduce gas costs by up to 90%',
          potentialSavings: balance.valueUSD * 0.02 // Estimate 2% savings
        });
      }
    });

    return opportunities;
  }

  async getPortfolioDistribution(walletAddress) {
    const aggregated = await this.aggregateAllAssets(walletAddress);
    const distribution = {};

    aggregated.nativeBalances.forEach(balance => {
      const percentage = (balance.valueUSD / aggregated.totalValueUSD) * 100;
      distribution[balance.chain] = {
        valueUSD: balance.valueUSD,
        percentage: percentage.toFixed(2)
      };
    });

    return {
      totalValueUSD: aggregated.totalValueUSD,
      distribution,
      isWellDiversified: Object.keys(distribution).length >= 3
    };
  }
}

module.exports = CrossChainAggregator;

