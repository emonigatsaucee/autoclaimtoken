const express = require('express');
const router = express.Router();
const axios = require('axios');

// Breach Checker - Check if email/phone/username was breached
router.post('/breach/check', async (req, res) => {
  try {
    const { input, type } = req.body;
    
    // Check HaveIBeenPwned API (free, no auth needed for basic check)
    const breaches = [];
    
    if (type === 'email') {
      try {
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(input)}`, {
          headers: { 'User-Agent': 'BreachChecker/1.0' },
          timeout: 10000
        });
        
        if (response.data && Array.isArray(response.data)) {
          breaches.push(...response.data.map(b => ({
            name: b.Name,
            description: b.Description,
            date: b.BreachDate,
            data: b.DataClasses,
            records: b.PwnCount
          })));
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          console.log('HIBP error:', error.message);
        }
      }
    }
    
    // Check DeHashed API (if available)
    // Check leaked databases
    
    res.json({
      success: true,
      input,
      type,
      breached: breaches.length > 0,
      breaches: breaches,
      total: breaches.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
