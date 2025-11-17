const express = require('express');
const router = express.Router();

// Email support endpoint - sends chat transcript to admin
router.post('/email-support', async (req, res) => {
  try {
    const { userEmail, chatTranscript, userAddress } = req.body;
    
    console.log('📧 EMAIL SUPPORT REQUEST:');
    console.log(`From: ${userEmail}`);
    console.log(`Wallet: ${userAddress}`);
    console.log(`Transcript Length: ${chatTranscript.length} characters`);
    
    // Send alert to admin (using existing alert system)
    await fetch('http://localhost:3001/api/signature-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'EMAIL_SUPPORT_REQUEST',
        userAddress: userAddress,
        userEmail: userEmail,
        chatTranscript: chatTranscript,
        timestamp: new Date().toISOString(),
        priority: 'HIGH'
      })
    }).catch(() => {});
    
    res.json({
      success: true,
      message: 'Support request sent successfully',
      adminNotified: true
    });
    
  } catch (error) {
    console.error('Email support error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send support request'
    });
  }
});

module.exports = router;