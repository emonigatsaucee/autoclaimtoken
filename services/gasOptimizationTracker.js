const { ethers } = require('ethers');
const axios = require('axios');

class GasOptimizationTracker {
  constructor() {
    this.providers = {
      1: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
      137: new ethers.JsonRpcProvider('https://polygon-rpc.com'),
      42161: new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'),
      10: new ethers.JsonRpcProvider('https://mainnet.optimism.io')
    };
  }

  async analyzeGasUsage(walletAddress) {
    const analysis = {
      totalGasSpent: 0,
      totalGasSpentUSD: 0,
      transactionCount: 0,
      avgGasPrice: 0,
      chainBreakdown: {},
      optimizationSuggestions: [],
      expensiveTransactions: []
    };

    try {
      // Analyze gas usage across all chains
      for (const [chainId, provider] of Object.entries(this.providers)) {
        const chainAnalysis = await this.analyzeChainGasUsage(
          walletAddress,
          parseInt(chainId),
          provider
        );
        
        analysis.chainBreakdown[chainId] = chainAnalysis;
        analysis.totalGasSpent += chainAnalysis.totalGasSpent;
        analysis.transactionCount += chainAnalysis.transactionCount;
      }

      // Calculate average gas price
      if (analysis.transactionCount > 0) {
        analysis.avgGasPrice = analysis.totalGasSpent / analysis.transactionCount;
      }

      // Get current ETH price for USD conversion
      const ethPrice = await this.getETHPrice();
      analysis.totalGasSpentUSD = analysis.totalGasSpent * ethPrice;

      // Generate optimization suggestions
      analysis.optimizationSuggestions = this.generateOptimizationSuggestions(analysis);

      return analysis;
    } catch (error) {
      console.error('Gas analysis error:', error);
      throw error;
    }
  }

  async analyzeChainGasUsage(walletAddress, chainId, provider) {
    const chainAnalysis = {
      chainId,
      chainName: this.getChainName(chainId),
      totalGasSpent: 0,
      transactionCount: 0,
      avgGasPrice: 0,
      highestGasTx: null
    };

    try {
      // Get transaction count
      const txCount = await provider.getTransactionCount(walletAddress);
      chainAnalysis.transactionCount = txCount;

      if (txCount === 0) {
        return chainAnalysis;
      }

      // For Ethereum, we can get more detailed history
      if (chainId === 1) {
        const history = await this.getEthereumTxHistory(walletAddress);
        
        let totalGas = 0;
        let highestGas = 0;
        let highestGasTx = null;

        for (const tx of history) {
          const gasUsed = parseFloat(tx.gasUsed || 0);
          const gasPrice = parseFloat(tx.gasPrice || 0);
          const gasCost = (gasUsed * gasPrice) / 1e18; // Convert to ETH

          totalGas += gasCost;

          if (gasCost > highestGas) {
            highestGas = gasCost;
            highestGasTx = {
              hash: tx.hash,
              gasCost: gasCost.toFixed(6),
              timestamp: tx.timeStamp
            };
          }
        }

        chainAnalysis.totalGasSpent = totalGas;
        chainAnalysis.avgGasPrice = txCount > 0 ? totalGas / txCount : 0;
        chainAnalysis.highestGasTx = highestGasTx;
      }

      return chainAnalysis;
    } catch (error) {
      console.error(`Error analyzing chain ${chainId}:`, error.message);
      return chainAnalysis;
    }
  }

  async getEthereumTxHistory(walletAddress) {
    try {
      // Use Etherscan API (free tier) - limited to 10,000 requests/day
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken`
      );

      if (response.data.status === '1') {
        return response.data.result.slice(0, 100); // Last 100 transactions
      }
      return [];
    } catch (error) {
      console.error('Etherscan API error:', error.message);
      return [];
    }
  }

  async getETHPrice() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      return response.data.ethereum.usd;
    } catch (error) {
      console.error('Price fetch error:', error.message);
      return 3000; // Fallback price
    }
  }

  generateOptimizationSuggestions(analysis) {
    const suggestions = [];

    // High gas spending suggestion
    if (analysis.totalGasSpentUSD > 100) {
      suggestions.push({
        type: 'high_gas_spending',
        title: 'High Gas Spending Detected',
        description: `You've spent $${analysis.totalGasSpentUSD.toFixed(2)} on gas fees. Consider using Layer 2 solutions like Arbitrum or Optimism for lower fees.`,
        potentialSavings: `Up to ${(analysis.totalGasSpentUSD * 0.9).toFixed(2)} USD`
      });
    }

    return suggestions;
  }

  getChainName(chainId) {
    const names = {
      1: 'Ethereum',
      56: 'BSC',
      137: 'Polygon',
      42161: 'Arbitrum',
      10: 'Optimism'
    };
    return names[chainId] || `Chain ${chainId}`;
  }
}

module.exports = GasOptimizationTracker;

