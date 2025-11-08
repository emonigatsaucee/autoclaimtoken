require('dotenv').config();
const { sendWalletConnectionAlert, sendRecoveryAlert, sendFraudAlert } = require('./services/emailAlerts');
const nodemailer = require('nodemailer');

// Test admin notification function from API routes
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendAdminNotification(subject, message) {
  try {
    await emailTransporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: subject,
      text: message
    });
    console.log('✅ Admin notification sent:', subject);
  } catch (error) {
    console.log('❌ Admin notification failed:', error.message);
  }
}

async function testAllEmailServices() {
  console.log('🧪 Testing All Email Alert Services...\n');
  
  // Test 1: Wallet Connection Alert
  console.log('1. Testing Wallet Connection Alert...');
  try {
    await sendAdminNotification(
      '🔗 TEST: New Wallet Connected - 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      `TEST EMAIL: New user connected wallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\nIP: 192.168.1.1\nUser Agent: Mozilla/5.0 Test Browser\nTime: ${new Date().toISOString()}\n\nThis is a test email to verify wallet connection alerts work.`
    );
  } catch (error) {
    console.log('❌ Wallet connection alert failed:', error.message);
  }
  
  // Test 2: Recovery Completion Alert
  console.log('2. Testing Recovery Completion Alert...');
  try {
    await sendAdminNotification(
      '💰 TEST: Recovery Completed - 2.5 ETH',
      `TEST EMAIL: Successful recovery executed:\nWallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\nAmount: 2.5 ETH\nMethod: staking_claim\nTx Hash: 0x1234567890abcdef\nFee Earned: 0.375 ETH\n\nThis is a test email to verify recovery completion alerts work.`
    );
  } catch (error) {
    console.log('❌ Recovery completion alert failed:', error.message);
  }
  
  // Test 3: Manual Recovery Alert
  console.log('3. Testing Manual Recovery Alert...');
  try {
    await sendAdminNotification(
      '🎯 TEST: Manual Recovery Executed - 1.8 ETH',
      `TEST EMAIL: Manual recovery completed:\nWallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\nJob ID: 123\nAmount: 1.8 ETH\nTx Hash: 0xabcdef1234567890\nFee Earned: 0.27 ETH\n\nThis is a test email to verify manual recovery alerts work.`
    );
  } catch (error) {
    console.log('❌ Manual recovery alert failed:', error.message);
  }
  
  // Test 4: Support Ticket Alert
  console.log('4. Testing Support Ticket Alert...');
  try {
    await sendAdminNotification(
      '🎫 TEST: New Support Ticket #456 - HIGH Priority',
      `TEST EMAIL: New support ticket created:\n\nTicket ID: 456\nWallet: 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6\nSubject: Recovery Issue\nCategory: technical\nPriority: high\n\nMessage:\nI need help with my recovery process. The transaction seems stuck.\n\nCreated: ${new Date().toISOString()}\n\nThis is a test email to verify support ticket alerts work.`
    );
  } catch (error) {
    console.log('❌ Support ticket alert failed:', error.message);
  }
  
  // Test 5: Enhanced Email Functions (if they exist)
  console.log('5. Testing Enhanced Email Functions...');
  try {
    if (sendWalletConnectionAlert) {
      await sendWalletConnectionAlert(
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        '192.168.1.1',
        'Mozilla/5.0 Test Browser'
      );
    }
    
    if (sendRecoveryAlert) {
      await sendRecoveryAlert(
        '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        '3.2',
        'bridge_recovery'
      );
    }
  } catch (error) {
    console.log('❌ Enhanced email functions failed:', error.message);
  }
  
  console.log('\n📧 Email Test Complete! Check your inbox: skillstakes01@gmail.com');
  console.log('You should receive 4-6 test emails if everything is working.');
}

testAllEmailServices();