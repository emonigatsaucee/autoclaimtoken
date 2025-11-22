export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress, adminWallet, amount, method } = req.body;

  try {
    // Log the buy attempt for admin monitoring
    console.log('🎯 BUY ATTEMPT:', {
      user: userAddress,
      admin: adminWallet,
      amount: amount + ' ETH',
      method: method,
      timestamp: new Date().toISOString(),
      usdValue: (parseFloat(amount) * 3200).toFixed(2)
    });

    // In a real implementation, you would:
    // 1. Create a session with MoonPay/Transak with admin wallet as recipient
    // 2. Return the payment URL
    // 3. Handle webhooks when payment completes

    // For now, return success to allow the payment gateway to open
    res.status(200).json({
      success: true,
      sessionId: 'session_' + Date.now(),
      paymentUrl: `https://buy.moonpay.com/?apiKey=pk_live_xNzApykiCupr6QYvAccQ5MFEvsNzpS7&currencyCode=eth&walletAddress=${adminWallet}&baseCurrencyAmount=${parseFloat(amount) * 320}`,
      message: 'Buy session created successfully'
    });

  } catch (error) {
    console.error('Buy session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create buy session'
    });
  }
}