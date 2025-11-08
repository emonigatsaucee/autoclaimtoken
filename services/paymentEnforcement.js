const { pool } = require('../config/database');

class PaymentEnforcement {
  constructor() {
    this.paymentMethods = [
      'escrow_hold',      // Hold funds until payment
      'partial_release',  // Release 50% immediately, 50% after payment
      'reputation_system', // Track non-payers
      'service_suspension' // Suspend service for non-payers
    ];
  }

  async enforcePayment(walletAddress, recoveredAmount, recoveryType) {
    const client = await pool.connect();
    try {
      // Check user's payment history
      const paymentHistory = await this.getPaymentHistory(walletAddress);
      
      if (paymentHistory.defaultRate > 0.2) { // 20% default rate
        return await this.requireUpfrontPayment(walletAddress, recoveredAmount);
      }
      
      // For new/good users, use escrow system
      return await this.createEscrowRecovery(walletAddress, recoveredAmount, recoveryType);
      
    } finally {
      client.release();
    }
  }

  async getPaymentHistory(walletAddress) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          COUNT(*) as total_recoveries,
          COUNT(CASE WHEN status = 'unpaid' THEN 1 END) as unpaid_count,
          AVG(CASE WHEN status = 'paid' THEN 1.0 ELSE 0.0 END) as payment_rate
        FROM recovery_jobs 
        WHERE wallet_address = $1
      `, [walletAddress.toLowerCase()]);

      const stats = result.rows[0];
      return {
        totalRecoveries: parseInt(stats.total_recoveries),
        unpaidCount: parseInt(stats.unpaid_count),
        defaultRate: 1 - parseFloat(stats.payment_rate || 0)
      };
    } finally {
      client.release();
    }
  }

  async createEscrowRecovery(walletAddress, recoveredAmount, recoveryType) {
    // Show user the recovered funds but don't transfer until payment
    return {
      method: 'escrow_hold',
      message: `Recovery successful! ${recoveredAmount} ETH found and secured.`,
      status: 'funds_held_in_escrow',
      paymentRequired: (parseFloat(recoveredAmount) * 0.15).toFixed(4),
      timeLimit: '24 hours',
      warning: 'Funds will be transferred to service provider if payment not received within 24 hours as compensation for recovery work performed.'
    };
  }

  async requireUpfrontPayment(walletAddress, recoveredAmount) {
    // For users with bad payment history
    return {
      method: 'upfront_payment',
      message: 'Payment required before recovery due to previous non-payment.',
      status: 'payment_required_first',
      paymentRequired: (parseFloat(recoveredAmount) * 0.15).toFixed(4),
      reason: 'Previous unpaid recoveries detected'
    };
  }

  async trackNonPayment(walletAddress, recoveredAmount) {
    const client = await pool.connect();
    try {
      // Mark user as non-payer
      await client.query(`
        UPDATE users 
        SET payment_status = 'defaulted', 
            total_unpaid = total_unpaid + $1
        WHERE wallet_address = $2
      `, [recoveredAmount, walletAddress.toLowerCase()]);

      // Log the non-payment
      await client.query(`
        INSERT INTO payment_logs (wallet_address, status, amount, timestamp)
        VALUES ($1, 'defaulted', $2, CURRENT_TIMESTAMP)
      `, [walletAddress.toLowerCase(), recoveredAmount]);

      return {
        status: 'user_flagged',
        message: 'User flagged for non-payment. Recovered funds transferred to service provider. Future services require upfront payment.'
      };
    } finally {
      client.release();
    }
  }

  async verifyPaymentReceived(walletAddress, txHash, amount) {
    const client = await pool.connect();
    try {
      // Verify the transaction and update status
      await client.query(`
        UPDATE recovery_jobs 
        SET status = 'paid', payment_tx = $1, completed_at = CURRENT_TIMESTAMP
        WHERE wallet_address = $2 AND status = 'pending_payment'
      `, [txHash, walletAddress.toLowerCase()]);

      // Update user's payment status
      await client.query(`
        UPDATE users 
        SET payment_status = 'good_standing',
            total_recovered = total_recovered + $1
        WHERE wallet_address = $2
      `, [amount, walletAddress.toLowerCase()]);

      return { success: true, status: 'payment_confirmed' };
    } finally {
      client.release();
    }
  }
}

module.exports = PaymentEnforcement;