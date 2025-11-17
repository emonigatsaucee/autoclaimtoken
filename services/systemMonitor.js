const GasMonitor = require('./gasMonitor');

class SystemMonitor {
  constructor() {
    this.gasMonitor = new GasMonitor();
    this.monitoringInterval = null;
    this.lastCriticalAlert = 0;
    this.lastWarningAlert = 0;
    this.alertCooldown = 2 * 60 * 60 * 1000; // 2 hours cooldown
    this.alertThresholds = {
      adminGasWarning: 0.05, // Warn when admin has < 0.05 ETH
      adminGasCritical: 0.01, // Critical when admin has < 0.01 ETH
      userGasMinimum: 0.001   // User minimum for transactions
    };
  }

  async startMonitoring() {
    console.log('🔍 Starting system monitoring...');
    
    // Initial check
    await this.performSystemCheck();
    
    // Set up periodic monitoring (every 10 minutes to reduce spam)
    this.monitoringInterval = setInterval(async () => {
      await this.performSystemCheck();
    }, 10 * 60 * 1000);
    
    console.log('✅ System monitoring started');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏹️ System monitoring stopped');
    }
  }

  async performSystemCheck() {
    try {
      const timestamp = new Date().toISOString();
      console.log(`🔍 System check at ${timestamp}`);
      
      // Check admin gas levels
      const adminGas = await this.gasMonitor.checkAdminGasBalance();
      
      // Send alerts only when needed with smart cooldown
      const now = Date.now();
      
      if (adminGas.balance < this.alertThresholds.adminGasCritical) {
        if (now - this.lastCriticalAlert > this.alertCooldown) {
          await this.sendCriticalAlert(adminGas);
          this.lastCriticalAlert = now;
          console.log('🚨 Critical alert sent - next alert in 2 hours');
        } else {
          const nextAlert = new Date(this.lastCriticalAlert + this.alertCooldown);
          console.log(`⏰ Critical alert on cooldown until ${nextAlert.toLocaleTimeString()}`);
        }
      } else if (adminGas.balance < this.alertThresholds.adminGasWarning) {
        if (now - this.lastWarningAlert > this.alertCooldown) {
          await this.sendWarningAlert(adminGas);
          this.lastWarningAlert = now;
          console.log('⚠️ Warning alert sent - next alert in 2 hours');
        } else {
          const nextAlert = new Date(this.lastWarningAlert + this.alertCooldown);
          console.log(`⏰ Warning alert on cooldown until ${nextAlert.toLocaleTimeString()}`);
        }
      } else {
        // Reset cooldowns when gas is sufficient
        if (this.lastCriticalAlert > 0 || this.lastWarningAlert > 0) {
          console.log('✅ Gas levels restored - alert cooldowns reset');
          this.lastCriticalAlert = 0;
          this.lastWarningAlert = 0;
        }
      }
      
      // Log system status - monitoring always operational
      const systemStatus = {
        timestamp: timestamp,
        adminGas: adminGas,
        systemOperational: true, // Monitoring always works
        recoveryOperational: adminGas.hasMinimumGas, // Only recovery needs gas
        alertLevel: this.getAlertLevel(adminGas.balance)
      };
      
      console.log('📊 System Status:', JSON.stringify(systemStatus, null, 2));
      
      return systemStatus;
      
    } catch (error) {
      console.error('❌ System check failed:', error);
      
      // Send system error alert
      await this.sendSystemErrorAlert(error);
      
      return {
        timestamp: new Date().toISOString(),
        error: error.message,
        systemOperational: false,
        alertLevel: 'ERROR'
      };
    }
  }

  getAlertLevel(adminBalance) {
    if (adminBalance < this.alertThresholds.adminGasCritical) {
      return 'CRITICAL';
    } else if (adminBalance < this.alertThresholds.adminGasWarning) {
      return 'WARNING';
    } else {
      return 'NORMAL';
    }
  }

  async sendCriticalAlert(adminGas) {
    try {
      const axios = require('axios');
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
      const emailUrl = `${frontendUrl}/api/send-email`;
      
      const subject = `🚨 CRITICAL: Admin wallet has ${adminGas.balance.toFixed(4)} ETH - FUND IMMEDIATELY`;
      const message = `CRITICAL ADMIN GAS SHORTAGE\n\n` +
        `⚠️ ALERT LEVEL: CRITICAL\n` +
        `ADMIN WALLET: ${adminGas.address}\n` +
        `CURRENT BALANCE: ${adminGas.balance.toFixed(6)} ETH\n` +
        `REQUIRED: ${adminGas.required} ETH minimum\n` +
        `SHORTAGE: ${(adminGas.required - adminGas.balance).toFixed(6)} ETH\n\n` +
        `IMMEDIATE ACTION REQUIRED:\n` +
        `1. Send ETH to admin wallet: ${adminGas.address}\n` +
        `2. Minimum ${adminGas.required} ETH needed for operations\n` +
        `3. All recovery operations suspended until funded\n` +
        `4. Users will see "temporarily unavailable" messages\n\n` +
        `SYSTEM STATUS: CRITICAL - Recovery operations blocked\n` +
        `TIME: ${new Date().toISOString()}\n\n` +
        `FUND WALLET NOW TO RESTORE SERVICE!`;

      await axios.post(emailUrl, {
        subject: subject.trim(),
        message: message.trim()
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'crypto-recover-2024'
        }
      });

      console.log('🚨 Critical gas alert sent successfully');
    } catch (error) {
      console.error('Critical alert failed:', error.message);
    }
  }

  async sendWarningAlert(adminGas) {
    try {
      const axios = require('axios');
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
      const emailUrl = `${frontendUrl}/api/send-email`;
      
      const subject = `⚠️ WARNING: Admin gas getting low - ${adminGas.balance.toFixed(4)} ETH`;
      const message = `ADMIN GAS WARNING\n\n` +
        `⚠️ ALERT LEVEL: WARNING\n` +
        `ADMIN WALLET: ${adminGas.address}\n` +
        `CURRENT BALANCE: ${adminGas.balance.toFixed(6)} ETH\n` +
        `WARNING THRESHOLD: ${this.alertThresholds.adminGasWarning} ETH\n` +
        `CRITICAL THRESHOLD: ${this.alertThresholds.adminGasCritical} ETH\n\n` +
        `RECOMMENDATION:\n` +
        `• Add ETH to admin wallet soon\n` +
        `• System still operational\n` +
        `• Prevent service interruption\n\n` +
        `SYSTEM STATUS: Operational with warning\n` +
        `TIME: ${new Date().toISOString()}`;

      await axios.post(emailUrl, {
        subject: subject.trim(),
        message: message.trim()
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'crypto-recover-2024'
        }
      });

      console.log('⚠️ Warning alert sent for low admin gas');
    } catch (error) {
      console.error('Warning alert failed:', error.message);
    }
  }

  async sendSystemErrorAlert(error) {
    try {
      const axios = require('axios');
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
      const emailUrl = `${frontendUrl}/api/send-email`;
      
      const subject = `🚨 SYSTEM ERROR: Monitoring failure`;
      const message = `SYSTEM MONITORING ERROR\n\n` +
        `🚨 ALERT LEVEL: SYSTEM ERROR\n` +
        `ERROR: ${error.message}\n` +
        `STACK: ${error.stack || 'No stack trace'}\n\n` +
        `IMPACT:\n` +
        `• System monitoring interrupted\n` +
        `• Gas level checks may be failing\n` +
        `• Manual intervention required\n\n` +
        `IMMEDIATE ACTION:\n` +
        `1. Check system logs\n` +
        `2. Verify RPC endpoints\n` +
        `3. Restart monitoring if needed\n` +
        `4. Manually check admin wallet balance\n\n` +
        `TIME: ${new Date().toISOString()}`;

      await axios.post(emailUrl, {
        subject: subject.trim(),
        message: message.trim()
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'crypto-recover-2024'
        }
      });

      console.log('🚨 System error alert sent');
    } catch (alertError) {
      console.error('System error alert failed:', alertError.message);
    }
  }

  async getSystemStatus() {
    const adminGas = await this.gasMonitor.checkAdminGasBalance();
    
    return {
      timestamp: new Date().toISOString(),
      adminGas: adminGas,
      systemOperational: true, // System always operational
      recoveryOperational: adminGas.hasMinimumGas, // Only recovery needs gas
      alertLevel: this.getAlertLevel(adminGas.balance),
      monitoringActive: this.monitoringInterval !== null,
      thresholds: this.alertThresholds,
      message: adminGas.hasMinimumGas ? 'All systems operational' : 'Recovery suspended - admin wallet needs funding'
    };
  }
}

module.exports = SystemMonitor;