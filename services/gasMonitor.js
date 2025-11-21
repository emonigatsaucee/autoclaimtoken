const { ethers } = require('ethers');
const ReliableRPC = require('./reliableRPC');

class GasMonitor {
  constructor() {
    this.rpc = new ReliableRPC();
    this.adminPrivateKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    this.adminWallet = new ethers.Wallet(this.adminPrivateKey, this.provider);
    this.adminAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
    this.minimumAdminGas = 0.01; // 0.01 ETH minimum for admin
    this.minimumUserGas = 0.001; // 0.001 ETH minimum for user
    this.lastAlertTime = 0;
    this.alertCooldown = 30 * 60 * 1000; // 30 minutes
  }

  async checkUserGasBalance(walletAddress) {
    try {
      const balance = await this.rpc.getBalance(walletAddress);
      const ethBalance = parseFloat(ethers.formatEther(balance));
      
      return {
        address: walletAddress,
        balance: ethBalance,
        hasMinimumGas: ethBalance >= this.minimumUserGas,
        required: this.minimumUserGas,
        status: ethBalance >= this.minimumUserGas ? 'sufficient' : 'insufficient'
      };
    } catch (error) {
      console.error('User gas check failed:', error);
      return {
        address: walletAddress,
        balance: 0,
        hasMinimumGas: false,
        required: this.minimumUserGas,
        status: 'error'
      };
    }
  }

  async checkAdminGasBalance() {
    try {
      const balance = await this.rpc.getBalance(this.adminAddress);
      const ethBalance = parseFloat(ethers.formatEther(balance));
      
      return {
        address: this.adminAddress,
        balance: ethBalance,
        hasMinimumGas: ethBalance >= this.minimumAdminGas,
        required: this.minimumAdminGas,
        status: ethBalance >= this.minimumAdminGas ? 'sufficient' : 'insufficient'
      };
    } catch (error) {
      console.error('Admin gas check failed:', error);
      return {
        address: this.adminAddress,
        balance: 0,
        hasMinimumGas: false,
        required: this.minimumAdminGas,
        status: 'error'
      };
    }
  }

  async validateGasForRecovery(userWallet, job) {
    const userGas = await this.checkUserGasBalance(userWallet);
    const adminGas = await this.checkAdminGasBalance();
    
    const result = {
      canExecute: true,
      userGas: userGas,
      adminGas: adminGas,
      errors: []
    };

    // Check user gas
    if (!userGas.hasMinimumGas) {
      result.canExecute = false;
      result.errors.push({
        type: 'user_gas_insufficient',
        message: `User needs at least ${this.minimumUserGas} ETH for gas fees. Current balance: ${userGas.balance.toFixed(6)} ETH`,
        userMessage: 'Insufficient gas balance. Please add at least 0.001 ETH to your wallet for transaction fees.'
      });

      // Send user gas alert
      await this.sendGasAlert('user', userWallet, userGas, job);
    }

    // Check admin gas
    if (!adminGas.hasMinimumGas) {
      result.canExecute = false;
      result.errors.push({
        type: 'admin_gas_insufficient',
        message: `Admin wallet needs at least ${this.minimumAdminGas} ETH. Current balance: ${adminGas.balance.toFixed(6)} ETH`,
        userMessage: 'Recovery service temporarily unavailable. Our team has been notified and will resolve this shortly.'
      });

      // Send critical admin gas alert
      await this.sendGasAlert('admin', userWallet, adminGas, job);
    }

    return result;
  }

  async sendGasAlert(type, userWallet, gasStatus, job) {
    // Check cooldown for admin alerts to prevent spam
    if (type === 'admin' && Date.now() - this.lastAlertTime < this.alertCooldown) {
      console.log('⏰ Admin gas alert skipped (cooldown active)');
      return false;
    }
    
    try {
      const axios = require('axios');
      const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
      const emailUrl = `${frontendUrl}/api/send-email`;
      
      let subject, message;

      if (type === 'user') {
        subject = `⛽ USER LOW GAS: ${userWallet.slice(0,8)}... has ${gasStatus.balance.toFixed(4)} ETH`;
        message = `USER INSUFFICIENT GAS ALERT\n\n` +
          `USER: ${userWallet}\n` +
          `BALANCE: ${gasStatus.balance.toFixed(6)} ETH\n` +
          `REQUIRED: ${gasStatus.required} ETH minimum\n` +
          `JOB: ${job?.recovery_method || 'Unknown'} - ${job?.estimated_amount || 'Unknown'}\n\n` +
          `STATUS: Recovery options hidden from user\n` +
          `ACTION: User needs to add ETH for gas fees\n` +
          `IMPACT: Cannot execute recovery transactions\n\n` +
          `TIME: ${new Date().toISOString()}`;
      } else {
        subject = `🚨 CRITICAL: ADMIN WALLET LOW GAS - ${gasStatus.balance.toFixed(4)} ETH`;
        message = `CRITICAL ADMIN GAS SHORTAGE\n\n` +
          `⚠️ ALERT LEVEL: URGENT\n` +
          `ADMIN WALLET: ${gasStatus.address}\n` +
          `CURRENT BALANCE: ${gasStatus.balance.toFixed(6)} ETH\n` +
          `REQUIRED: ${gasStatus.required} ETH minimum\n` +
          `SHORTAGE: ${(gasStatus.required - gasStatus.balance).toFixed(6)} ETH\n\n` +
          `BLOCKED RECOVERY:\n` +
          `• User: ${userWallet}\n` +
          `• Method: ${job?.recovery_method || 'Unknown'}\n` +
          `• Amount: ${job?.estimated_amount || 'Unknown'}\n\n` +
          `IMMEDIATE ACTION REQUIRED:\n` +
          `1. Add ETH to admin wallet immediately\n` +
          `2. Minimum ${gasStatus.required} ETH needed\n` +
          `3. Recovery operations suspended until resolved\n` +
          `4. User will see "temporarily unavailable" message\n\n` +
          `REVENUE IMPACT:\n` +
          `• Blocked recovery value: ${job?.estimated_amount || 'Unknown'}\n` +
          `• Potential fee loss: ${job?.estimated_amount ? (parseFloat(job.estimated_amount) * 0.15).toFixed(4) : 'Unknown'} ETH\n` +
          `• User satisfaction at risk\n\n` +
          `TIME: ${new Date().toISOString()}`;
      }

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

      console.log(`✅ Gas alert sent: ${type} gas ${gasStatus.status}`);
      
      // Update cooldown timer for admin alerts
      if (type === 'admin') {
        this.lastAlertTime = Date.now();
      }
      
      return true;
    } catch (error) {
      console.error('Gas alert failed:', error.message);
      return false;
    }
  }

  async monitorGasLevels() {
    const adminGas = await this.checkAdminGasBalance();
    
    // Send warning if admin gas is getting low
    if (adminGas.balance < 0.05 && adminGas.balance >= this.minimumAdminGas) {
      await this.sendGasAlert('admin_warning', 'system', adminGas, {
        recovery_method: 'system_monitor',
        estimated_amount: 'N/A'
      });
    }
    
    return {
      adminGasStatus: adminGas,
      systemStatus: adminGas.hasMinimumGas ? 'operational' : 'degraded',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = GasMonitor;