const { pool } = require('../config/database');

class ServiceAgreement {
  static async createAgreement(walletAddress, userInfo) {
    const client = await pool.connect();
    try {
      // Store user information for legitimate business purposes
      await client.query(`
        UPDATE users SET 
          email = $1,
          ip_address = $2,
          user_agent = $3,
          country = $4,
          service_agreement_accepted = true
        WHERE wallet_address = $5
      `, [
        userInfo.email,
        userInfo.ipAddress,
        userInfo.userAgent,
        userInfo.country,
        walletAddress.toLowerCase()
      ]);

      return { success: true };
    } finally {
      client.release();
    }
  }

  static async trackPaymentStatus(walletAddress, status, amount = 0) {
    const client = await pool.connect();
    try {
      await client.query(`
        UPDATE users SET 
          payment_status = $1,
          total_recovered = total_recovered + $2
        WHERE wallet_address = $3
      `, [status, amount, walletAddress.toLowerCase()]);

      // Log payment event
      await client.query(`
        INSERT INTO payment_logs (wallet_address, status, amount, timestamp)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      `, [walletAddress.toLowerCase(), status, amount]);

      return { success: true };
    } finally {
      client.release();
    }
  }
}

module.exports = ServiceAgreement;