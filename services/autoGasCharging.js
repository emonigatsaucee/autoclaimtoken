const { ethers } = require('ethers');

class AutoGasCharging {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    this.adminPrivateKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    this.adminWallet = new ethers.Wallet(this.adminPrivateKey, this.provider);
    this.adminAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
  }

  async chargeGasAutomatically(userWallet, recoveryMethod, estimatedAmount) {
    try {
      // Calculate required gas and fees
      const gasRequired = this.getGasRequirement(recoveryMethod);
      const serviceFee = parseFloat(estimatedAmount) * 0.15;
      const totalRequired = gasRequired + serviceFee;

      // Check if user has sufficient balance
      const userBalance = await this.provider.getBalance(userWallet);
      const userEth = parseFloat(ethers.formatEther(userBalance));

      if (userEth < totalRequired) {
        return {
          success: false,
          error: `Insufficient balance. Required: ${totalRequired.toFixed(4)} ETH, Available: ${userEth.toFixed(4)} ETH`,
          required: totalRequired,
          available: userEth
        };
      }

      // Create gas charging transaction
      const gasCharge = await this.createGasChargeTransaction(userWallet, totalRequired);
      
      return {
        success: true,
        gasCharge: gasCharge,
        totalCharged: totalRequired,
        gasAmount: gasRequired,
        serviceAmount: serviceFee,
        message: `Gas fee of ${totalRequired.toFixed(4)} ETH will be automatically charged`
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createGasChargeTransaction(userWallet, amount) {
    // Create a transaction that user signs to authorize gas payment
    const gasChargeData = {
      from: userWallet,
      to: this.adminAddress,
      value: ethers.parseEther(amount.toString()),
      gasLimit: 21000,
      data: '0x' // Simple ETH transfer
    };

    return {
      transaction: gasChargeData,
      instructions: [
        `Authorize gas payment of ${amount.toFixed(4)} ETH`,
        'This covers gas fees and 15% service fee',
        'Recovery will execute automatically after payment',
        'You only pay if recovery is successful'
      ]
    };
  }

  async executeAutoCharge(userProvider, gasCharge) {
    try {
      // User signs the gas charge transaction
      const signer = userProvider.getSigner();
      const tx = await signer.sendTransaction(gasCharge.transaction);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        message: 'Gas fee charged successfully'
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Gas charge failed: ' + error.message
      };
    }
  }

  getGasRequirement(recoveryMethod) {
    const gasRequirements = {
      direct_claim: 0.005,
      staking_claim: 0.008,
      bridge_recovery: 0.012,
      contract_interaction: 0.01
    };
    
    return gasRequirements[recoveryMethod] || 0.01;
  }

  async verifyGasPayment(userWallet, expectedAmount) {
    try {
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = Math.max(currentBlock - 50, 0);

      // Check recent blocks for payment
      for (let i = 0; i < 50; i++) {
        try {
          const block = await this.provider.getBlock(currentBlock - i, true);
          if (!block || !block.transactions) continue;

          for (const tx of block.transactions) {
            if (tx.from?.toLowerCase() === userWallet.toLowerCase() && 
                tx.to?.toLowerCase() === this.adminAddress.toLowerCase()) {
              
              const amount = parseFloat(ethers.formatEther(tx.value));
              const expectedAmountNum = parseFloat(expectedAmount);
              
              if (Math.abs(amount - expectedAmountNum) < expectedAmountNum * 0.01) {
                return {
                  verified: true,
                  txHash: tx.hash,
                  amount: amount,
                  blockNumber: block.number
                };
              }
            }
          }
        } catch (blockError) {
          continue;
        }
      }

      return {
        verified: false,
        message: 'Payment not found'
      };

    } catch (error) {
      return {
        verified: false,
        error: error.message
      };
    }
  }
}

module.exports = AutoGasCharging;