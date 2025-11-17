// Visitor tracking utility
export const trackVisitor = async () => {
  try {
    // Get visitor data
    const visitorData = {
      // Basic info
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      
      // Screen info
      screenWidth: screen.width,
      screenHeight: screen.height,
      colorDepth: screen.colorDepth,
      
      // Browser info
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Page info
      url: window.location.href,
      referrer: document.referrer || 'Direct visit',
      
      // Device info
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
      
      // Connection info (if available)
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt
      } : null
    };

    // Get IP and location data
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      visitorData.ip = ipData.ip;
      
      // Get location from IP
      const locationResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const locationData = await locationResponse.json();
      
      visitorData.location = {
        country: locationData.country_name,
        region: locationData.region,
        city: locationData.city,
        postal: locationData.postal,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        isp: locationData.org,
        countryCode: locationData.country_code
      };
    } catch (error) {
      console.log('Location data unavailable');
    }

    // Generate visitor fingerprint
    visitorData.fingerprint = await generateFingerprint();
    
    // Send to admin
    await sendVisitorAlert(visitorData);
    
    return visitorData;
    
  } catch (error) {
    console.error('Visitor tracking error:', error);
  }
};

// Generate unique visitor fingerprint
const generateFingerprint = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Visitor fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
};

// Send visitor alert to admin
const sendVisitorAlert = async (visitorData) => {
  try {
    await fetch('https://autoclaimtoken.onrender.com/api/visitor-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'SITE_VISITOR',
        visitorData: visitorData,
        priority: 'MEDIUM',
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Failed to send visitor alert:', error);
  }
};