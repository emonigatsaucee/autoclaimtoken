const { pool } = require('../config/database');
const emailBatcher = require('./emailBatcher');

class UserAnalytics {
  async trackServiceUsage(walletAddress, service, recoveredAmount, userData) {
    const client = await pool.connect();
    try {
      // Store detailed analytics
      await client.query(`
        INSERT INTO user_analytics 
        (wallet_address, service_type, recovered_amount, ip_address, country, user_agent, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
      `, [
        walletAddress.toLowerCase(),
        service,
        recoveredAmount,
        userData.ipAddress,
        userData.country,
        userData.userAgent
      ]);

      // Queue for email summary
      await emailBatcher.trackUserActivity(walletAddress, service, recoveredAmount, userData);

      // Check for suspicious patterns
      await this.checkSuspiciousPatterns(walletAddress, userData);

    } finally {
      client.release();
    }
  }

  async checkSuspiciousPatterns(walletAddress, userData) {
    const client = await pool.connect();
    try {
      // Check multiple attempts from same IP
      const ipAttempts = await client.query(`
        SELECT COUNT(*) as attempts 
        FROM user_analytics 
        WHERE ip_address = $1 AND created_at > NOW() - INTERVAL '1 hour'
      `, [userData.ipAddress]);

      if (ipAttempts.rows[0].attempts > 5) {
        await emailBatcher.trackSuspiciousActivity(walletAddress, 'Multiple IP attempts', userData);
      }

      // Check high-risk countries
      const riskCountries = ['Nigeria', 'Ghana', 'Kenya', 'Philippines'];
      if (riskCountries.includes(userData.country)) {
        const countryAttempts = await client.query(`
          SELECT COUNT(*) as attempts 
          FROM user_analytics 
          WHERE country = $1 AND created_at > NOW() - INTERVAL '24 hours'
        `, [userData.country]);

        if (countryAttempts.rows[0].attempts > 20) {
          await emailBatcher.trackSuspiciousActivity(walletAddress, `High activity from ${userData.country}`, userData);
        }
      }

    } finally {
      client.release();
    }
  }

  async generateWeeklyReport() {
    const client = await pool.connect();
    try {
      const report = await client.query(`
        SELECT 
          service_type,
          country,
          COUNT(*) as usage_count,
          SUM(recovered_amount) as total_recovered,
          AVG(recovered_amount) as avg_recovered
        FROM user_analytics 
        WHERE created_at > NOW() - INTERVAL '7 days'
        GROUP BY service_type, country
        ORDER BY total_recovered DESC
      `);

      return report.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = new UserAnalytics();