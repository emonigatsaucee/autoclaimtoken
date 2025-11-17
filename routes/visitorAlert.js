const express = require('express');
const adminAlertSystem = require('../services/adminAlertSystem');
const router = express.Router();

// Visitor tracking endpoint
router.post('/visitor-alert', async (req, res) => {
  try {
    const { visitorData } = req.body;
    
    // Enhanced visitor info for admin
    const visitorInfo = {
      // Security data
      ip: visitorData.ip,
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
    
    // Send admin alert
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

module.exports = router;