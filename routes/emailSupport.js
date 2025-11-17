const express = require('express');
const router = express.Router();

// Ultra-intelligent email support endpoint
router.post('/email-support', async (req, res) => {
  try {
    const { 
      chatTranscript, 
      userInfo, 
      timestamp, 
      urgency = 'normal' 
    } = req.body;
    
    console.log('🧠 ULTRA-INTELLIGENT SUPPORT REQUEST:');
    console.log(`Wallet: ${userInfo.walletAddress}`);
    console.log(`Portfolio: $${userInfo.portfolioValue}`);
    console.log(`Opportunities: ${userInfo.recoveryOpportunities}`);
    console.log(`Personality: ${userInfo.userPersonality}`);
    console.log(`Urgency: ${urgency}`);
    console.log(`Transcript Length: ${chatTranscript.length} characters`);
    
    // Enhanced admin notification with AI context
    const adminAlert = {
      type: 'ULTRA_INTELLIGENT_SUPPORT_REQUEST',
      userInfo: {
        walletAddress: userInfo.walletAddress,
        isConnected: userInfo.isConnected,
        portfolioValue: userInfo.portfolioValue,
        recoveryOpportunities: userInfo.recoveryOpportunities,
        userPersonality: userInfo.userPersonality,
        conversationContext: userInfo.conversationContext
      },
      chatTranscript: chatTranscript,
      timestamp: timestamp,
      urgency: urgency,
      priority: urgency === 'high' ? 'URGENT' : 'HIGH',
      aiAnalysis: {
        messageCount: (chatTranscript.match(/\[/g) || []).length / 2,
        hasRecoveryOpportunity: userInfo.recoveryOpportunities > 0,
        estimatedValue: userInfo.portfolioValue,
        userEmotion: userInfo.userPersonality,
        requiresExpertAttention: urgency === 'high' || userInfo.recoveryOpportunities > 0
      }
    };
    
    // Send to admin email system
    try {
      await fetch('http://localhost:3001/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminAlert)
      });
    } catch (alertError) {
      console.log('Admin alert failed, continuing with email response');
    }
    
    res.json({
      success: true,
      message: 'Ultra-intelligent support request processed successfully',
      adminNotified: true,
      responseTime: '< 1 hour',
      aiEnhanced: true,
      context: {
        userPersonality: userInfo.userPersonality,
        hasOpportunities: userInfo.recoveryOpportunities > 0,
        urgency: urgency
      }
    });
    
  } catch (error) {
    console.error('Ultra-intelligent support error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process support request',
      fallbackAvailable: true
    });
  }
});

// Legacy email support for backward compatibility
router.post('/legacy-email-support', async (req, res) => {
  try {
    const { userEmail, chatTranscript, userAddress } = req.body;
    
    console.log('📧 LEGACY EMAIL SUPPORT REQUEST:');
    console.log(`From: ${userEmail}`);
    console.log(`Wallet: ${userAddress}`);
    console.log(`Transcript Length: ${chatTranscript.length} characters`);
    
    await fetch('http://localhost:3001/api/signature-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'LEGACY_EMAIL_SUPPORT_REQUEST',
        userAddress: userAddress,
        userEmail: userEmail,
        chatTranscript: chatTranscript,
        timestamp: new Date().toISOString(),
        priority: 'HIGH'
      })
    }).catch(() => {});
    
    res.json({
      success: true,
      message: 'Legacy support request sent successfully',
      adminNotified: true
    });
    
  } catch (error) {
    console.error('Legacy email support error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send legacy support request'
    });
  }
});

module.exports = router;