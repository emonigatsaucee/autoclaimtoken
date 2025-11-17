const { ethers } = require('ethers');

class UserGasPayment {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    this.adminAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
    this.gasRequirements = {
      direct_claim: 0.005,      // 0.005 ETH for direct claims
      staking_claim: 0.008,     // 0.008 ETH for staking claims
      bridge_recovery: 0.012,   // 0.012 ETH for bridge recovery
      contract_interaction: 0.01 // 0.01 ETH for contract interactions
    };
  }

  async createGasPaymentRequest(userWallet, recoveryMethod, estimatedAmount) {
    const gasRequired = this.gasRequirements[recoveryMethod] || 0.01;
    const serviceFee = parseFloat(estimatedAmount) * 0.15; // 15% service fee
    const totalRequired = gasRequired + serviceFee;

    return {
      userWallet: userWallet,
      adminWallet: this.adminAddress,
      gasRequired: gasRequired,
      serviceFee: serviceFee,
      totalRequired: totalRequired,
      recoveryMethod: recoveryMethod,
      estimatedAmount: estimatedAmount,
      paymentMessage: `Pay ${totalRequired.toFixed(4)} ETH (${gasRequired.toFixed(4)} gas + ${serviceFee.toFixed(4)} fee) to execute recovery`,
      instructions: [
        `1. Send exactly ${totalRequired.toFixed(4)} ETH to: ${this.adminAddress}`,
        `2. Use your wallet to send the payment`,
        `3. Wait for confirmation (1-2 minutes)`,
        `4. Recovery will execute automatically after payment confirmed`
      ]
    };
  }

  async verifyUserPayment(userWallet, expectedAmount, timeWindow = 600000) { // 10 minutes
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(currentBlock - 100, 0); // Last 100 blocks (~20 minutes)

      // Check for transactions from user to admin wallet
      const filter = {
        fromBlock: fromBlock,
        toBlock: 'latest',
        address: null,
        topics: null
      };

      // Get recent transactions to admin wallet
      const logs = await this.provider.getLogs(filter);
      
      // Check recent blocks for direct transfers
      for (let i = 0; i < 50; i++) {
        try {
          const block = await this.provider.getBlock(currentBlock - i, true);
          if (!block || !block.transactions) continue;

          for (const tx of block.transactions) {
            if (tx.from?.toLowerCase() === userWallet.toLowerCase() && 
                tx.to?.toLowerCase() === this.adminAddress.toLowerCase()) {
              
              const amount = parseFloat(ethers.formatEther(tx.value));
              const expectedAmountNum = parseFloat(expectedAmount);
              
              // Allow 1% tolerance for gas price variations
              if (Math.abs(amount - expectedAmountNum) < expectedAmountNum * 0.01) {
                return {
                  verified: true,
                  txHash: tx.hash,
                  amount: amount,
                  blockNumber: block.number,
                  timestamp: block.timestamp
                };
              }
            }
          }
        } catch (blockError) {
          console.log(`Block ${currentBlock - i} check failed:`, blockError.message);
        }
      }

      return {
        verified: false,
        message: `No payment of ${expectedAmount} ETH found from ${userWallet} to ${this.adminAddress}`
      };

    } catch (error) {
      console.error('Payment verification failed:', error);
      return {
        verified: false,
        error: error.message
      };
    }
  }

  async executeRecoveryAfterPayment(paymentVerification, recoveryJob) {
    if (!paymentVerification.verified) {
      return {
        success: false,
        message: 'Payment not verified - cannot execute recovery'
      };
    }

    // Now admin wallet has the gas fees, execute recovery
    const RecoveryEngine = require('./recoveryEngine');
    const recoveryEngine = new RecoveryEngine();
    
    const result = await recoveryEngine.executeRecovery(recoveryJob);
    
    return {
      success: result.success,
      paymentTx: paymentVerification.txHash,
      recoveryTx: result.txHash,
      gasUsed: result.gasUsed,
      message: result.success ? 
        `Recovery executed! Payment: ${paymentVerification.txHash}, Recovery: ${result.txHash}` :
        `Recovery failed: ${result.message}`
    };
  }

  getGasEstimate(recoveryMethod) {
    return this.gasRequirements[recoveryMethod] || 0.01;
  }
}

module.exports = UserGasPayment;