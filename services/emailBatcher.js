const { sendFraudAlert } = require('./emailAlerts');
const { pool } = require('../config/database');

class EmailBatcher {
  constructor() {
    this.emailQueue = [];
    this.batchSize = 5;
    this.batchInterval = 5 * 60 * 1000; // 5 minutes
    this.dailyLimit = 100;
    this.sentToday = 0;
    
    // Start batch processor
    setInterval(() => this.processBatch(), this.batchInterval);
    
    // Reset daily counter at midnight
    setInterval(() => this.resetDailyCounter(), 24 * 60 * 60 * 1000);
  }

  async queueEmail(type, data) {
    if (this.sentToday >= this.dailyLimit) return;
    
    this.emailQueue.push({
      type,
      data,
      timestamp: Date.now(),
      priority: this.getPriority(type, data)
    });
  }

  async processBatch() {
    if (this.emailQueue.length === 0 || this.sentToday >= this.dailyLimit) return;
    
    // Send ALL alerts individually
    const batch = this.emailQueue.splice(0, this.batchSize);
    
    for (const alert of batch) {
      if (this.sentToday >= this.dailyLimit) break;
      await this.sendIndividualAlert(alert);
      this.sentToday++;
    }
  }

  createBatchSummary(batch) {
    const highPriority = batch.filter(item => item.priority >= 8);
    const regularEvents = batch.filter(item => item.priority < 8);
    
    return { highPriority, regularEvents };
  }

  async sendIndividualAlert(alert) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.OWNER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    let subject, content;
    
    switch (alert.type) {
      case 'non_payment':
        await sendFraudAlert(alert.data.userData, alert.data.recoveryData);
        return;
        
      case 'service_usage':
        subject = `🔍 Service Used: ${alert.data.service} - ${alert.data.walletAddress.slice(0,8)}...`;
        content = `
USER ACTIVITY ALERT

Wallet: ${alert.data.walletAddress}
Service: ${alert.data.service}
Amount: $${alert.data.amount}
Country: ${alert.data.country}
Time: ${alert.data.timestamp}
Fraud Score: ${alert.data.fraudScore}/100
`;
        break;
        
      case 'high_value_recovery':
        subject = `💰 High Value: $${alert.data.amount} - ${alert.data.walletAddress.slice(0,8)}...`;
        content = `
HIGH VALUE RECOVERY

Wallet: ${alert.data.walletAddress}
Service: ${alert.data.service}
Amount: $${alert.data.amount}
Country: ${alert.data.userData.country}
IP: ${alert.data.userData.ipAddress}
`;
        break;
        
      case 'suspicious_activity':
        subject = `⚠️ Suspicious: ${alert.data.reason} - ${alert.data.walletAddress.slice(0,8)}...`;
        content = `
SUSPICIOUS ACTIVITY

Wallet: ${alert.data.walletAddress}
Reason: ${alert.data.reason}
Country: ${alert.data.userData.country}
IP: ${alert.data.userData.ipAddress}
Time: ${alert.data.timestamp}
`;
        break;
        
      default:
        subject = `📊 User Activity: ${alert.type}`;
        content = `\nUser activity detected:\n${JSON.stringify(alert.data, null, 2)}`;
    }

    await transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject,
      text: content
    });
  }

  generateSummaryReport(events) {
    const stats = {
      totalUsers: events.length,
      countries: {},
      services: {},
      totalValue: 0,
      riskUsers: 0
    };

    events.forEach(event => {
      const data = event.data;
      stats.countries[data.country] = (stats.countries[data.country] || 0) + 1;
      stats.services[data.service] = (stats.services[data.service] || 0) + 1;
      stats.totalValue += parseFloat(data.amount || 0);
      if (data.fraudScore > 70) stats.riskUsers++;
    });

    return stats;
  }

  async sendSummaryEmail(stats) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.OWNER_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const topCountries = Object.entries(stats.countries)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => `${country}: ${count}`)
      .join('\n');

    const emailContent = `
📊 DAILY USER ACTIVITY SUMMARY

OVERVIEW:
- Total Users: ${stats.totalUsers}
- High Risk Users: ${stats.riskUsers}
- Total Value Scanned: $${stats.totalValue.toLocaleString()}

TOP COUNTRIES:
${topCountries}

SERVICES USED:
${Object.entries(stats.services).map(([service, count]) => `${service}: ${count}`).join('\n')}

This is a batched summary to protect SMTP limits.
High-priority alerts are sent immediately.
    `;

    await transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: `📊 Daily Summary: ${stats.totalUsers} Users, ${stats.riskUsers} High Risk`,
      text: emailContent
    });
  }

  getPriority(type, data) {
    switch (type) {
      case 'non_payment': return 10;
      case 'high_value_recovery': return data.amount > 10000 ? 9 : 7;
      case 'suspicious_activity': return 8;
      case 'new_user': return 3;
      case 'service_usage': return 2;
      default: return 1;
    }
  }

  resetDailyCounter() {
    this.sentToday = 0;
  }

  // Track all user activities
  async trackUserActivity(walletAddress, service, amount, userData) {
    await this.queueEmail('service_usage', {
      walletAddress,
      service,
      amount,
      country: userData.country,
      fraudScore: userData.fraudScore || 0,
      timestamp: new Date().toISOString()
    });

    // High value recovery gets priority
    if (amount > 5000) {
      await this.queueEmail('high_value_recovery', {
        walletAddress,
        service,
        amount,
        userData
      });
    }
  }

  async trackSuspiciousActivity(walletAddress, reason, userData) {
    await this.queueEmail('suspicious_activity', {
      walletAddress,
      reason,
      userData,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new EmailBatcher();