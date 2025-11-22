const { ethers } = require('ethers');
const { pool } = require('../config/database');

class AutoWorkerPayment {
  constructor() {
    this.adminPrivateKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    this.adminWallet = new ethers.Wallet(this.adminPrivateKey, this.provider);
  }

  // Pay worker commission automatically
  async payWorkerCommission(workerCode, recoveredAmount, userWallet) {
    try {
      const workerReward = parseFloat(recoveredAmount) * 0.03; // 3% to worker
      const adminFee = parseFloat(recoveredAmount) * 0.12;     // 12% to admin
      
      // Get worker wallet address
      const client = await pool.connect();
      const worker = await client.query(
        'SELECT * FROM workers WHERE worker_code = $1',
        [workerCode]
      );
      
      if (worker.rows.length === 0) {
        client.release();
        return { success: false, error: 'Worker not found' };
      }
      
      const workerData = worker.rows[0];
      const workerWallet = workerData.wallet_address;
      
      if (!workerWallet) {
        client.release();
        return { success: false, error: 'Worker wallet not set' };
      }
      
      // Send payment to worker
      const workerTx = await this.adminWallet.sendTransaction({
        to: workerWallet,
        value: ethers.parseEther(workerReward.toString())
      });
      
      // Record payment in database
      await client.query(`
        INSERT INTO worker_payments 
        (worker_code, amount, user_wallet, recovery_amount, tx_hash, payment_date)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [workerCode, workerReward, userWallet, recoveredAmount, workerTx.hash, new Date()]);
      
      // Update worker total earnings
      await client.query(`
        UPDATE workers 
        SET total_earned = COALESCE(total_earned, 0) + $1,
            successful_referrals = COALESCE(successful_referrals, 0) + 1
        WHERE worker_code = $2
      `, [workerReward, workerCode]);
      
      client.release();
      
      // Send payment notification
      await this.sendPaymentNotification(workerCode, workerReward, userWallet, workerTx.hash);
      
      return {
        success: true,
        workerReward,
        adminFee,
        workerTx: workerTx.hash
      };
      
    } catch (error) {
      console.error('Worker payment failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Send payment notification
  async sendPaymentNotification(workerCode, amount, userWallet, txHash) {
    try {
      const axios = require('axios');
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
      
      await axios.post(`${frontendUrl}/api/send-email`, {
        subject: `💰 WORKER PAID: ${workerCode} earned ${amount} ETH`,
        message: `WORKER COMMISSION PAID AUTOMATICALLY\n\n` +
          `Worker: ${workerCode}\n` +
          `Amount: ${amount} ETH\n` +
          `Client: ${userWallet}\n` +
          `TX Hash: ${txHash}\n` +
          `Time: ${new Date().toISOString()}\n\n` +
          `Payment sent automatically from recovery fees.`
      }, {
        timeout: 10000,
        headers: { 'x-api-key': 'crypto-recover-2024' }
      });
    } catch (error) {
      console.error('Payment notification failed:', error);
    }
  }
}

module.exports = AutoWorkerPayment;