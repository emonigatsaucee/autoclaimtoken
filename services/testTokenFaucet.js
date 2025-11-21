const { ethers } = require('ethers');

class TestTokenFaucet {
  constructor() {
    // Use Sepolia testnet (free)
    this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/84842078b09946638c03157f83405213');
    this.adminKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    this.adminWallet = new ethers.Wallet(this.adminKey, this.provider);
    
    // Pre-deployed test token contract on Sepolia
    this.tokenAddress = '0x779877A7B0D9E8603169DdbD7836e478b4624789'; // LINK token on Sepolia
    this.tokenContract = new ethers.Contract(this.tokenAddress, [
      'function transfer(address to, uint256 amount) returns (bool)',
      'function balanceOf(address account) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ], this.adminWallet);
  }

  // Send test tokens to user (appears real in wallet)
  async sendTestTokens(userAddress, amount = '100') {
    try {
      // Check if we have testnet ETH for gas
      const balance = await this.provider.getBalance(this.adminWallet.address);
      
      if (balance < ethers.parseEther('0.001')) {
        // Get free testnet ETH from faucet API
        await this.getFreeTestnetETH();
      }

      // Send test tokens (LINK tokens on Sepolia)
      const tokenAmount = ethers.parseEther(amount);
      const tx = await this.tokenContract.transfer(userAddress, tokenAmount);
      
      return {
        success: true,
        txHash: tx.hash,
        network: 'Sepolia Testnet',
        tokenAddress: this.tokenAddress,
        amount: amount,
        message: 'Test tokens sent successfully'
      };
    } catch (error) {
      // Fallback: Send testnet ETH instead
      return await this.sendTestnetETH(userAddress);
    }
  }

  // Send testnet ETH directly
  async sendTestnetETH(userAddress, amount = '0.05') {
    try {
      const tx = await this.adminWallet.sendTransaction({
        to: userAddress,
        value: ethers.parseEther(amount)
      });

      return {
        success: true,
        txHash: tx.hash,
        network: 'Sepolia Testnet',
        amount: amount + ' ETH',
        message: 'Testnet ETH sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Auto-get free testnet ETH from faucet
  async getFreeTestnetETH() {
    try {
      const axios = require('axios');
      
      // Use Alchemy faucet API
      await axios.post('https://sepoliafaucet.com/api/faucet', {
        address: this.adminWallet.address,
        amount: 0.5
      });
      
      console.log('✅ Got free testnet ETH from faucet');
    } catch (error) {
      console.log('❌ Faucet failed:', error.message);
    }
  }

  // Check admin wallet balance
  async checkBalance() {
    try {
      const ethBalance = await this.provider.getBalance(this.adminWallet.address);
      const tokenBalance = await this.tokenContract.balanceOf(this.adminWallet.address);
      
      return {
        ethBalance: ethers.formatEther(ethBalance),
        tokenBalance: ethers.formatEther(tokenBalance),
        address: this.adminWallet.address
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = TestTokenFaucet;