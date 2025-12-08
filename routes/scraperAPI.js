const express = require('express');
const router = express.Router();
const credentialScraper = require('../services/credentialScraper');

// Admin authentication middleware
const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'] || req.body.adminKey;
  if (adminKey === process.env.ADMIN_SECRET_KEY || adminKey === 'Peace@25') {
    next();
  } else {
    res.status(403).json({ error: 'Unauthorized access' });
  }
};

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

    const result = await pool.query(
      `SELECT * FROM scraped_credentials 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM scraped_credentials');
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
