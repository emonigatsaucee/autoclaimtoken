const express = require('express');
const { pool } = require('../config/mockDatabase');
const BlockchainScanner = require('../services/blockchainScanner');
const RecoveryEngine = require('../services/recoveryEngine');
const { ethers } = require('ethers');

const router = express.Router();
const scanner = new BlockchainScanner();
const recoveryEngine = new RecoveryEngine();

// Wallet connection and user registration
router.post('/connect-wallet', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const client = await pool.connect();
    try {
      // Check if user exists
      let result = await client.query(
        'SELECT * FROM users WHERE wallet_address = $1',
        [walletAddress.toLowerCase()]
      );

      let user;
      if (result.rows.length === 0) {
        // Create new user
        result = await client.query(
          'INSERT INTO users (wallet_address) VALUES ($1) RETURNING *',
          [walletAddress.toLowerCase()]
        );
        user = result.rows[0];
      } else {
        user = result.rows[0];
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.wallet_address,
          totalRecovered: user.total_recovered,
          successRate: user.success_rate,
          lastScan: user.last_scan
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scan wallet for claimable tokens
router.post('/scan-wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Simulate realistic scan results for demo
    const scanResults = [
      {
        chainId: 1,
        protocol: 'uniswap',
        tokenSymbol: 'UNI',
        amount: '127.45',
        claimable: true,
        contractAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
      },
      {
        chainId: 1,
        protocol: 'compound',
        tokenSymbol: 'COMP',
        amount: '23.67',
        claimable: true,
        contractAddress: '0xc00e94cb662c3520282e6f5717214004a7f26888'
      },
      {
        chainId: 137,
        protocol: 'aave',
        tokenSymbol: 'AAVE',
        amount: '45.23',
        claimable: true,
        contractAddress: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'
      },
      {
        chainId: 56,
        protocol: 'pancakeswap',
        tokenSymbol: 'CAKE',
        amount: '89.12',
        claimable: true,
        contractAddress: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
      }
    ];
    
    // Update user's last scan time
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE users SET last_scan = CURRENT_TIMESTAMP WHERE wallet_address = $1',
        [walletAddress.toLowerCase()]
      );
    } finally {
      client.release();
    }

    // Calculate realistic total value
    const tokenPrices = { UNI: 8.45, COMP: 65.23, AAVE: 89.67, CAKE: 2.34 };
    const totalValue = scanResults.reduce((sum, result) => {
      const price = tokenPrices[result.tokenSymbol] || 1;
      return sum + (parseFloat(result.amount) * price);
    }, 0);

    res.json({
      success: true,
      results: scanResults,
      summary: {
        totalTokens: scanResults.length,
        totalValue: totalValue.toFixed(2),
        claimableTokens: scanResults.filter(r => r.claimable).length,
        chains: [...new Set(scanResults.map(r => r.chainId))].length
      }
    });
  } catch (error) {
    console.error('Scan wallet error:', error);
    res.status(500).json({ error: 'Failed to scan wallet' });
  }
});

// Analyze recovery potential
router.post('/analyze-recovery', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const analysis = await recoveryEngine.analyzeRecoveryPotential(walletAddress);
    
    res.json({
      success: true,
      analysis: {
        totalRecoverable: analysis.totalRecoverable.toFixed(4),
        opportunities: {
          high: analysis.highProbability.length,
          medium: analysis.mediumProbability.length,
          low: analysis.lowProbability.length
        },
        details: {
          highProbability: analysis.highProbability.slice(0, 5), // Limit for response size
          mediumProbability: analysis.mediumProbability.slice(0, 3),
          lowProbability: analysis.lowProbability.slice(0, 2)
        },
        estimatedFees: (analysis.totalRecoverable * 0.15).toFixed(4), // 15% fee
        netRecovery: (analysis.totalRecoverable * 0.85).toFixed(4)
      }
    });
  } catch (error) {
    console.error('Analyze recovery error:', error);
    res.status(500).json({ error: 'Failed to analyze recovery potential' });
  }
});

// Create recovery job
router.post('/create-recovery-job', async (req, res) => {
  try {
    const { 
      walletAddress, 
      tokenAddress, 
      tokenSymbol, 
      estimatedAmount, 
      recoveryMethod 
    } = req.body;

    if (!walletAddress || !ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const client = await pool.connect();
    try {
      // Get user ID
      const userResult = await client.query(
        'SELECT id FROM users WHERE wallet_address = $1',
        [walletAddress.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userId = userResult.rows[0].id;

      // Calculate success probability based on method and amount
      let successProbability = 0.5;
      switch (recoveryMethod) {
        case 'direct_claim':
          successProbability = 0.9;
          break;
        case 'contract_interaction':
          successProbability = 0.7;
          break;
        case 'multicall_batch':
          successProbability = 0.75;
          break;
        case 'flashloan_recovery':
          successProbability = 0.4;
          break;
        case 'social_recovery':
          successProbability = 0.3;
          break;
      }

      // Create recovery job
      const result = await client.query(`
        INSERT INTO recovery_jobs 
        (user_id, wallet_address, token_address, token_symbol, estimated_amount, recovery_method, success_probability)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        userId,
        walletAddress.toLowerCase(),
        tokenAddress,
        tokenSymbol,
        estimatedAmount,
        recoveryMethod,
        successProbability
      ]);

      const job = result.rows[0];

      res.json({
        success: true,
        job: {
          id: job.id,
          estimatedAmount: job.estimated_amount,
          method: job.recovery_method,
          successProbability: job.success_probability,
          status: job.status,
          estimatedFee: (parseFloat(job.estimated_amount) * 0.15).toFixed(4),
          netRecovery: (parseFloat(job.estimated_amount) * 0.85).toFixed(4)
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create recovery job error:', error);
    res.status(500).json({ error: 'Failed to create recovery job' });
  }
});

// Execute recovery job
router.post('/execute-recovery/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userSignature } = req.body;

    const client = await pool.connect();
    try {
      // Get job details
      const result = await client.query(
        'SELECT * FROM recovery_jobs WHERE id = $1 AND status = $2',
        [jobId, 'pending']
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Job not found or already processed' });
      }

      const job = result.rows[0];

      // Execute recovery
      const executionResult = await recoveryEngine.executeRecovery(job);

      res.json({
        success: true,
        result: {
          executed: executionResult.success,
          actualAmount: executionResult.amount,
          txHash: executionResult.txHash,
          gasUsed: executionResult.gasUsed,
          fee: executionResult.success ? (executionResult.amount * 0.15).toFixed(4) : 0,
          netAmount: executionResult.success ? (executionResult.amount * 0.85).toFixed(4) : 0
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Execute recovery error:', error);
    res.status(500).json({ error: 'Failed to execute recovery' });
  }
});

// Get user dashboard data
router.get('/dashboard/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!ethers.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    const client = await pool.connect();
    try {
      // Get user stats
      const userResult = await client.query(
        'SELECT * FROM users WHERE wallet_address = $1',
        [walletAddress.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = userResult.rows[0];

      // Get recent recovery jobs
      const jobsResult = await client.query(`
        SELECT * FROM recovery_jobs 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT 10
      `, [user.id]);

      // Get recent scans
      const scansResult = await client.query(`
        SELECT * FROM blockchain_scans 
        WHERE wallet_address = $1 
        ORDER BY last_updated DESC 
        LIMIT 20
      `, [walletAddress.toLowerCase()]);

      res.json({
        success: true,
        dashboard: {
          user: {
            walletAddress: user.wallet_address,
            totalRecovered: user.total_recovered,
            successRate: user.success_rate,
            lastScan: user.last_scan,
            memberSince: user.created_at
          },
          recentJobs: jobsResult.rows.map(job => ({
            id: job.id,
            tokenSymbol: job.token_symbol,
            estimatedAmount: job.estimated_amount,
            actualAmount: job.actual_amount,
            status: job.status,
            method: job.recovery_method,
            createdAt: job.created_at,
            completedAt: job.completed_at
          })),
          availableTokens: scansResult.rows.map(scan => ({
            protocol: scan.protocol_name,
            tokenSymbol: scan.token_symbol,
            amount: scan.claimable_amount,
            chainId: scan.chain_id,
            claimable: scan.gas_estimate > 0
          }))
        }
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

module.exports = router;