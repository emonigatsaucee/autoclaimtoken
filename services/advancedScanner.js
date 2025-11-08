const { ethers } = require('ethers');
const axios = require('axios');

class AdvancedProtocolScanner {
  constructor() {
    this.protocols = {
      // DeFi Protocols with real reward contracts
      ethereum: [
        { name: 'Compound', rewardContract: '0xc00e94cb662c3520282e6f5717214004a7f26888' },
        { name: 'Aave', rewardContract: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' },
        { name: 'Uniswap V3', rewardContract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984' },
        { name: 'Curve', rewardContract: '0xD533a949740bb3306d119CC777fa900bA034cd52' },
        { name: 'Yearn', rewardContract: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e' }
      ],
      bsc: [
        { name: 'PancakeSwap', rewardContract: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' },
        { name: 'Venus', rewardContract: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63' }
      ],
      polygon: [
        { name: 'QuickSwap', rewardContract: '0x831753DD7087CaC61aB5644b308642cc1c33Dc13' },
        { name: 'Aave Polygon', rewardContract: '0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4' }
      ]
    };
  }

  async scanForUnclaimedRewards(walletAddress, chainId) {
    const provider = new ethers.JsonRpcProvider(this.getRpcUrl(chainId));
    const rewards = [];
    
    const protocolList = this.protocols[this.getChainName(chainId)] || [];
    
    for (const protocol of protocolList) {
      try {
        const balance = await this.checkProtocolBalance(
          walletAddress, 
          protocol.rewardContract, 
          provider
        );
        
        if (balance > 0) {
          const usdValue = await this.getTokenUSDValue(protocol.rewardContract, balance);
          
          rewards.push({
            protocol: protocol.name,
            tokenAmount: balance,
            usdValue: usdValue,
            contractAddress: protocol.rewardContract,
            claimable: true,
            estimatedGas: 150000
          });
        }
      } catch (error) {
        console.error(`Error scanning ${protocol.name}:`, error.message);
      }
    }
    
    return rewards;
  }

  async checkProtocolBalance(walletAddress, contractAddress, provider) {
    const contract = new ethers.Contract(
      contractAddress,
      ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
      provider
    );
    
    const balance = await contract.balanceOf(walletAddress);
    const decimals = await contract.decimals();
    
    return parseFloat(ethers.formatUnits(balance, decimals));
  }

  async getTokenUSDValue(contractAddress, amount) {
    try {
      // Use CoinGecko API for real prices
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${contractAddress}&vs_currencies=usd`
      );
      
      const price = response.data[contractAddress.toLowerCase()]?.usd || 0;
      return (amount * price).toFixed(2);
    } catch (error) {
      return '0.00';
    }
  }

  getRpcUrl(chainId) {
    const urls = {
      1: process.env.ETHEREUM_RPC_URL,
      56: process.env.BSC_RPC_URL,
      137: process.env.POLYGON_RPC_URL
    };
    return urls[chainId];
  }

  getChainName(chainId) {
    const names = { 1: 'ethereum', 56: 'bsc', 137: 'polygon' };
    return names[chainId];
  }
}

module.exports = AdvancedProtocolScanner;