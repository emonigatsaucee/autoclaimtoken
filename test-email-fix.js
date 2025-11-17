const axios = require('axios');

async function testEmailFix() {
  console.log('🧪 Testing email fix...');
  
  try {
    // Test direct API call
    const response = await axios.post('https://autoclaimtoken.vercel.app/api/send-email', {
      subject: 'TEST: Email Fix Verification',
      message: 'This is a test to verify the email fix is working.\n\nTimestamp: ' + new Date().toISOString()
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'crypto-recover-2024'
      },
      timeout: 10000
    });
    
    console.log('✅ Email API test successful:', response.data);
    
    // Test backend notification function
    const backendResponse = await axios.post('https://autoclaimtoken.onrender.com/api/connect-wallet', {
      walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      signature: '0xdemo',
      message: 'Test connection for email verification'
    });
    
    console.log('✅ Backend test successful - email should be sent');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testEmailFix();