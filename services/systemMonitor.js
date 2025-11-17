const GasMonitor = require('./gasMonitor');

class SystemMonitor {
  constructor() {
    this.gasMonitor = new GasMonitor();
    this.monitoringInterval = null;
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
    
    // Set up periodic monitoring (every 5 minutes)
    this.monitoringInterval = setInterval(async () => {
      await this.performSystemCheck();
    }, 5 * 60 * 1000);
    
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
      
      // Send alerts based on gas levels
      if (adminGas.balance < this.alertThresholds.adminGasCritical) {
        await this.sendCriticalAlert(adminGas);
      } else if (adminGas.balance < this.alertThresholds.adminGasWarning) {
        await this.sendWarningAlert(adminGas);
      }
      
      // Log system status
      const systemStatus = {
        timestamp: timestamp,
        adminGas: adminGas,
        systemOperational: adminGas.hasMinimumGas,
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
    await this.gasMonitor.sendGasAlert('admin', 'system_monitor', adminGas, {
      recovery_method: 'system_critical_alert',
      estimated_amount: 'N/A'
    });
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
      systemOperational: adminGas.hasMinimumGas,
      alertLevel: this.getAlertLevel(adminGas.balance),
      monitoringActive: this.monitoringInterval !== null,
      thresholds: this.alertThresholds
    };
  }
}

module.exports = SystemMonitor;