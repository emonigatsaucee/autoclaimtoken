const nodemailer = require('nodemailer');
require('dotenv').config();

const testEmail = async () => {
  console.log('Testing email with credentials:');
  console.log('Email:', process.env.OWNER_EMAIL);
  console.log('Password:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.OWNER_EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.OWNER_EMAIL,
      to: process.env.OWNER_EMAIL,
      subject: '🧪 Email System Test - AutoClaimToken',
      text: `
EMAIL SYSTEM TEST SUCCESSFUL ✅

This confirms your email alert system is working:
- SMTP connection: Working
- Gmail authentication: Success
- Render deployment: Ready

You will now receive alerts for:
- User wallet connections
- Service usage
- Recovery attempts
- Non-payments
- Suspicious activity

Test completed at: ${new Date().toISOString()}
      `
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Check your Gmail inbox:', process.env.OWNER_EMAIL);
  } catch (error) {
    console.log('❌ Email failed:', error.message);
  }
};

testEmail();