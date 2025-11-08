require('dotenv').config();
const nodemailer = require('nodemailer');

// Use exact same config as production
const emailTransporter = nodemailer.createTransport({
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

async function sendAdminNotification(subject, message) {
  try {
    console.log('Sending admin notification:', subject);
    const result = await emailTransporter.sendMail({
      from: `CryptoRecover <${process.env.OWNER_EMAIL}>`,
      to: process.env.OWNER_EMAIL,
      subject: subject,
      text: message
    });
    console.log('✅ Admin notification sent successfully:', result.messageId);
    return true;
  } catch (error) {
    console.error('❌ Email notification failed:', error.message);
    return false;
  }
}

async function testProductionEmail() {
  console.log('🧪 Testing Production Email Configuration...\n');
  
  const testWallet = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6';
  
  // Test wallet connection email
  await sendAdminNotification(
    `🔗 PRODUCTION TEST: New Wallet Connected - ${testWallet}`,
    `Production email test - New user connected wallet: ${testWallet}\nIP: 127.0.0.1\nUser Agent: Test Browser\nTime: ${new Date().toISOString()}\n\nThis email confirms the production email system is working.`
  );
  
  // Test recovery email
  await sendAdminNotification(
    `💰 PRODUCTION TEST: Recovery Completed - 1.5 ETH`,
    `Production email test - Successful recovery executed:\nWallet: ${testWallet}\nAmount: 1.5 ETH\nMethod: staking_claim\nTx Hash: 0xtest123\nFee Earned: 0.225 ETH\n\nThis email confirms recovery alerts are working.`
  );
  
  console.log('\n📧 Production email test complete!');
  console.log('Check your inbox: skillstakes01@gmail.com');
}

testProductionEmail();