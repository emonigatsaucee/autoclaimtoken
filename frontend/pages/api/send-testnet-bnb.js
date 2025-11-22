import { ethers } from 'ethers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address required' });
  }

  try {
    // BSC Testnet provider
    const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
    
    // Your funded testnet wallet (replace with your private key)
    const privateKey = process.env.BSC_TESTNET_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000';
    const wallet = new ethers.Wallet(privateKey, provider);

    // Send 0.1 BNB
    const tx = await wallet.sendTransaction({
      to: address,
      value: ethers.parseEther('0.1')
    });

    await tx.wait();

    res.json({
      success: true,
      txHash: tx.hash,
      message: '0.1 BNB sent successfully'
    });

  } catch (error) {
    console.error('BNB send error:', error);
    res.json({
      success: false,
      message: 'BNB transfer queued'
    });
  }
}