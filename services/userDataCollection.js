const { pool } = require('../config/database');
const geoip = require('geoip-lite');
const { sendFraudAlert } = require('./emailAlerts');
const emailBatcher = require('./emailBatcher');
const userAnalytics = require('./userAnalytics');

class UserDataCollection {
  async collectUserData(req, walletAddress) {
    const client = await pool.connect();
    try {
      // Legal data collection for fraud prevention
      const userData = {
        walletAddress: walletAddress.toLowerCase(),
        ipAddress: this.getClientIP(req),
        userAgent: req.headers['user-agent'] || '',
        country: this.getCountry(req),
        timestamp: new Date(),
        sessionId: this.generateSessionId(),
        referrer: req.headers.referer || '',
        acceptLanguage: req.headers['accept-language'] || ''
      };

      // Store user session data
      await client.query(`
        INSERT INTO user_sessions 
        (wallet_address, ip_address, user_agent, country, session_id, referrer, accept_language, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (wallet_address, session_id) DO UPDATE SET
        last_activity = CURRENT_TIMESTAMP
      `, [
        userData.walletAddress,
        userData.ipAddress,
        userData.userAgent,
        userData.country,
        userData.sessionId,
        userData.referrer,
        userData.acceptLanguage,
        userData.timestamp
      ]);

      // Update user profile
      await client.query(`
        UPDATE users SET 
          last_ip = $1,
          last_country = $2,
          last_user_agent = $3,
          session_count = session_count + 1,
          last_activity = CURRENT_TIMESTAMP
        WHERE wallet_address = $4
      `, [
        userData.ipAddress,
        userData.country,
        userData.userAgent,
        userData.walletAddress
      ]);

      // Track user activity for analytics
      await userAnalytics.trackServiceUsage(
        userData.walletAddress, 
        'wallet_connection', 
        0, 
        userData
      );

      return userData;
    } finally {
      client.release();
    }
  }

  async flagNonPayingUser(walletAddress, recoveredAmount, reason) {
    const client = await pool.connect();
    try {
      // Flag user for non-payment
      await client.query(`
        INSERT INTO user_flags 
        (wallet_address, flag_type, amount_owed, reason, created_at)
        VALUES ($1, 'non_payment', $2, $3, CURRENT_TIMESTAMP)
      `, [walletAddress.toLowerCase(), recoveredAmount, reason]);

      // Update user status
      await client.query(`
        UPDATE users SET 
          payment_status = 'flagged',
          total_unpaid = total_unpaid + $1,
          flag_count = flag_count + 1
        WHERE wallet_address = $2
      `, [recoveredAmount, walletAddress.toLowerCase()]);

      // Create fraud prevention record
      const userData = await this.getUserData(walletAddress);
      await this.createFraudAlert(userData, recoveredAmount);

      return { success: true, status: 'user_flagged' };
    } finally {
      client.release();
    }
  }

  async createFraudAlert(userData, amount) {
    const client = await pool.connect();
    try {
      // Share with fraud prevention network (legal)
      await client.query(`
        INSERT INTO fraud_alerts 
        (wallet_address, ip_address, country, amount, user_agent, alert_type, created_at)
        VALUES ($1, $2, $3, $4, $5, 'non_payment', CURRENT_TIMESTAMP)
      `, [
        userData.wallet_address,
        userData.last_ip,
        userData.last_country,
        amount,
        userData.last_user_agent
      ]);

      // Send email alert to owner
      const alertData = {
        walletAddress: userData.wallet_address,
        ipAddress: userData.last_ip,
        country: userData.last_country,
        city: userData.city || 'Unknown',
        isp: userData.isp || 'Unknown',
        userAgent: userData.last_user_agent,
        device: this.parseDevice(userData.last_user_agent),
        browser: this.parseBrowser(userData.last_user_agent),
        operatingSystem: this.parseOS(userData.last_user_agent),
        timestamp: new Date().toISOString(),
        fraudScore: this.calculateFraudScore(userData),
        previousAttempts: userData.flag_count || 0,
        vpnDetected: false,
        proxyDetected: false,
        email: userData.email || 'Not provided',
        phone: userData.phone || 'Not provided'
      };

      const recoveryData = {
        service: 'Token Recovery',
        totalValue: amount,
        feeAmount: (amount * 0.15).toFixed(2),
        paymentDeadline: new Date(Date.now() + 24*60*60*1000).toISOString(),
        portfolioValue: amount,
        tokensCount: 'Multiple',
        nftsCount: 'Multiple',
        stakingRewards: '0'
      };

      await sendFraudAlert(alertData, recoveryData);
    } finally {
      client.release();
    }
  }

  async checkUserRisk(walletAddress, ipAddress) {
    const client = await pool.connect();
    try {
      // Check if user/IP is flagged
      const result = await client.query(`
        SELECT 
          u.payment_status,
          u.flag_count,
          u.total_unpaid,
          COUNT(fa.id) as fraud_alerts
        FROM users u
        LEFT JOIN fraud_alerts fa ON (fa.wallet_address = u.wallet_address OR fa.ip_address = $2)
        WHERE u.wallet_address = $1
        GROUP BY u.wallet_address, u.payment_status, u.flag_count, u.total_unpaid
      `, [walletAddress.toLowerCase(), ipAddress]);

      if (result.rows.length > 0) {
        const user = result.rows[0];
        return {
          riskLevel: this.calculateRiskLevel(user),
          requiresUpfrontPayment: user.flag_count > 0 || user.fraud_alerts > 0,
          totalOwed: user.total_unpaid || 0
        };
      }

      return { riskLevel: 'low', requiresUpfrontPayment: false, totalOwed: 0 };
    } finally {
      client.release();
    }
  }

  getClientIP(req) {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '0.0.0.0';
  }

  getCountry(req) {
    const ip = this.getClientIP(req);
    const geo = geoip.lookup(ip);
    return geo ? geo.country : 'Unknown';
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  calculateRiskLevel(user) {
    if (user.flag_count > 2) return 'high';
    if (user.flag_count > 0 || user.fraud_alerts > 0) return 'medium';
    return 'low';
  }

  calculateFraudScore(userData) {
    let score = 0;
    if (userData.flag_count > 0) score += 40;
    if (userData.last_country === 'Nigeria' || userData.last_country === 'Ghana') score += 30;
    if (!userData.last_user_agent || userData.last_user_agent.length < 50) score += 20;
    return Math.min(score, 100);
  }

  parseDevice(userAgent) {
    return /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'Mobile' : 'Desktop';
  }

  parseBrowser(userAgent) {
    const match = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/);
    return match ? match[1] : 'Unknown';
  }

  parseOS(userAgent) {
    const match = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/);
    return match ? match[1] : 'Unknown';
  }

  async getUserData(walletAddress) {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT * FROM users WHERE wallet_address = $1
      `, [walletAddress.toLowerCase()]);
      
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}

module.exports = UserDataCollection;