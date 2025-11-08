// Test email directly on production environment
const axios = require('axios');

async function testLiveEmail() {
  console.log('🧪 Testing Live Email on Production...\n');
  
  try {
    // Test wallet connection endpoint
    const response = await axios.post('https://autoclaimtoken.onrender.com/api/connect-wallet', {
      walletAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      signature: '0xdemo',
      message: 'Connect wallet for CryptoRecover'
    });
    
    console.log('✅ Wallet connection successful');
    console.log('Response:', response.data.success);
    
    // Wait a moment for email processing
    console.log('⏳ Waiting for email processing...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('📧 Check your email: skillstakes01@gmail.com');
    console.log('You should receive a wallet connection alert if emails are working.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testLiveEmail();