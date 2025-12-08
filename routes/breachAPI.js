const express = require('express');
const router = express.Router();
const axios = require('axios');

// Breach Checker - Search GitHub for leaked credentials
router.post('/breach/check', async (req, res) => {
  try {
    const { input, type } = req.body;
    const breaches = [];
    
    // Search GitHub for leaked data
    const searches = [
      `"${input}" password`,
      `"${input}" credentials`,
      `"${input}" leaked`,
      `"${input}" dump`,
      `"${input}" breach`
    ];
    
    for (const search of searches) {
      try {
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'BreachChecker/1.0'
        };
        if (process.env.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }
        
        const response = await axios.get('https://api.github.com/search/code', {
          params: { q: search, per_page: 10 },
          headers,
          timeout: 10000
        });
        
        if (response.data.items && response.data.items.length > 0) {
          for (const item of response.data.items) {
            breaches.push({
              name: item.repository.full_name,
              description: `Found in ${item.name}`,
              url: item.html_url,
              repo: item.repository.html_url,
              data: ['Email', 'Password', 'Credentials'],
              date: item.repository.updated_at?.split('T')[0]
            });
          }
        }
      } catch (error) {
        console.log('GitHub search error:', error.message);
      }
    }
    
    // Search Pastebin dumps
    try {
      const response = await axios.get(`https://psbdmp.ws/api/search/${encodeURIComponent(input)}`, {
        timeout: 10000
      });
      
      if (response.data && Array.isArray(response.data)) {
        response.data.slice(0, 5).forEach(paste => {
          breaches.push({
            name: 'Pastebin Dump',
            description: `Found in paste ${paste.id}`,
            url: `https://pastebin.com/${paste.id}`,
            data: ['Email', 'Password', 'Personal Info'],
            date: paste.time
          });
        });
      }
    } catch (error) {
      console.log('Pastebin error:', error.message);
    }
    
    res.json({
      success: true,
      input,
      type,
      breached: breaches.length > 0,
      breaches: breaches,
      total: breaches.length,
      message: breaches.length > 0 ? `Found ${breaches.length} potential leaks` : 'No leaks found in public sources'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});}

module.exports = router;
