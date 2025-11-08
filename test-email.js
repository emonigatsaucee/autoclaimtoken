require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OWNER_EMAIL,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function testEmail() {
  try {
    console.log('Testing email configuration...');
    console.log('Email:', process.env.OWNER_EMAIL);
    console.log('Password length:', process.env.EMAIL_PASSWORD?.length);
    
    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection successful');
    
    // Send test email
    const result = await transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: '🔧 CryptoRecover Email Test',
      text: 'Email system is working correctly!\n\nTimestamp: ' + new Date().toISOString()
    });
    
    console.log('✅ Test email sent successfully:', result.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔑 Gmail App Password Issues:');
      console.log('1. Enable 2-Factor Authentication on Gmail');
      console.log('2. Generate App Password: https://myaccount.google.com/apppasswords');
      console.log('3. Use App Password (not regular password) in .env file');
    }
  }
}

testEmail();