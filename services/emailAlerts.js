const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

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

module.exports = { sendFraudAlert };