const { ethers } = require('ethers');

class ReliableRPC {
  constructor() {
    this.ethRPCs = [
      'https://rpc.ankr.com/eth',
      'https://ethereum.publicnode.com',
      'https://eth.drpc.org',
      'https://cloudflare-eth.com'
    ];
    
    this.bscRPCs = [
      'https://rpc.ankr.com/bsc',
      'https://bsc.publicnode.com',
      'https://bsc.drpc.org'
    ];
  }

  async getEthProvider() {
    for (const url of this.ethRPCs) {
      try {
        const provider = new ethers.JsonRpcProvider(url);
        await Promise.race([
          provider.getBlockNumber(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        return provider;
      } catch (e) {
        continue;
      }
    }
    throw new Error('All ETH RPC endpoints failed');
  }

  async getBSCProvider() {
    for (const url of this.bscRPCs) {
      try {
        const provider = new ethers.JsonRpcProvider(url);
        await Promise.race([
          provider.getBlockNumber(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
        ]);
        return provider;
      } catch (e) {
        continue;
      }
    }
    return null; // BSC is optional
  }

  async getBalance(address) {
    try {
      const provider = await this.getEthProvider();
      return await Promise.race([
        provider.getBalance(address),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
    } catch (e) {
      return ethers.parseEther('0');
    }
  }
}

module.exports = ReliableRPC;