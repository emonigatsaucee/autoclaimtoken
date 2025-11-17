const express = require('express');
const { ethers } = require('ethers');
const UserGasPayment = require('../services/userGasPayment');

const router = express.Router();
const gasPayment = new UserGasPayment();

// Get gas payment requirements for recovery method
router.post('/gas-quote', async (req, res) => {
  try {
    const { walletAddress, recoveryMethod, estimatedAmount } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const paymentRequest = await gasPayment.createGasPaymentRequest(
      walletAddress,
      recoveryMethod,
      estimatedAmount
    );

    res.json({
      success: true,
      gasQuote: paymentRequest
    });
  } catch (error) {
    console.error('Gas quote error:', error);
    res.status(500).json({ error: 'Failed to generate gas quote' });
  }
});

// Verify user payment
router.post('/verify-payment', async (req, res) => {
  try {
    const { walletAddress, expectedAmount } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const verification = await gasPayment.verifyUserPayment(walletAddress, expectedAmount);

    res.json({
      success: true,
      paymentVerification: verification
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Check payment status
router.get('/payment-status/:walletAddress/:expectedAmount', async (req, res) => {
  try {
    const { walletAddress, expectedAmount } = req.params;
    
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const verification = await gasPayment.verifyUserPayment(walletAddress, expectedAmount);

    res.json({
      success: true,
      status: verification.verified ? 'paid' : 'pending',
      verification: verification
    });
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Failed to check payment status' });
  }
});

module.exports = router;