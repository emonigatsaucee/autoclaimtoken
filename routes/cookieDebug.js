const express = require('express');
const router = express.Router();

// Debug endpoint to check if cookie harvester is working
router.post('/cookie-debug', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;
  console.log(`🍪 COOKIE DEBUG: Request from ${ip}`);
  console.log(`🍪 COOKIE DEBUG: Body:`, JSON.stringify(req.body, null, 2));
  
  res.json({ 
    success: true, 
    message: 'Cookie debug received',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;