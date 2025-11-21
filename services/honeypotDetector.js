const { ethers } = require('ethers');

class HoneypotDetector {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  }

  // Main honeypot detection function
  async analyzeWallet(address) {
    try {
      const analysis = {
        address: address,
        isHoneypot: false,
        riskLevel: 'LOW',
        warnings: [],
        trapType: null,
        recommendation: 'SAFE',
        details: {}
      };

      // Check basic balance pattern
      const balanceCheck = await this.checkBalancePattern(address);
      analysis.details.balancePattern = balanceCheck;

      // Check transaction history
      const txCheck = await this.checkTransactionPattern(address);
      analysis.details.transactionPattern = txCheck;

      // Check smart contract interactions
      const contractCheck = await this.checkContractInteractions(address);
      analysis.details.contractInteractions = contractCheck;

      // Calculate risk score
      const riskScore = this.calculateRiskScore(balanceCheck, txCheck, contractCheck);
      analysis.riskLevel = this.getRiskLevel(riskScore);
      analysis.isHoneypot = riskScore > 70;

      // Determine trap type
      if (analysis.isHoneypot) {
        analysis.trapType = this.identifyTrapType(balanceCheck, txCheck, contractCheck);
        analysis.recommendation = 'AVOID - HONEYPOT DETECTED';
        analysis.warnings = this.generateWarnings(analysis.trapType);
      }

      return analysis;
    } catch (error) {
      return {
        address: address,
        error: error.message,
        isHoneypot: false,
        riskLevel: 'UNKNOWN'
      };
    }
  }

  // Check suspicious balance patterns
  async checkBalancePattern(address) {
    try {
      const ethBalance = await this.provider.getBalance(address);
      const ethAmount = parseFloat(ethers.formatEther(ethBalance));

      // Check major tokens
      const tokens = await this.checkTokenBalances(address);
      const totalTokenValue = tokens.reduce((sum, token) => sum + token.usdValue, 0);

      return {
        ethBalance: ethAmount,
        tokenCount: tokens.length,
        totalTokenValue: totalTokenValue,
        suspiciousRatio: totalTokenValue > 100 && ethAmount < 0.001,
        tokens: tokens
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Check token balances for common honeypot tokens
  async checkTokenBalances(address) {
    const tokens = [];
    const commonTokens = [
      { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6, price: 1 },
      { address: '0xA0b86a33E6441b8435b662303c0f098C8c5c0f87', symbol: 'USDC', decimals: 6, price: 1 },
      { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC', decimals: 8, price: 45000 }
    ];

    for (const token of commonTokens) {
      try {
        const contract = new ethers.Contract(token.address, [
          'function balanceOf(address) view returns (uint256)',
          'function transfer(address, uint256) view returns (bool)'
        ], this.provider);

        const balance = await contract.balanceOf(address);
        const amount = parseFloat(balance) / Math.pow(10, token.decimals);

        if (amount > 0) {
          tokens.push({
            symbol: token.symbol,
            balance: amount,
            usdValue: amount * token.price,
            contractAddress: token.address
          });
        }
      } catch (e) {
        // Token check failed, continue
      }
    }

    return tokens;
  }

  // Check transaction patterns
  async checkTransactionPattern(address) {
    try {
      const txCount = await this.provider.getTransactionCount(address);
      
      return {
        transactionCount: txCount,
        isNewWallet: txCount === 0,
        hasActivity: txCount > 0,
        suspiciousActivity: txCount === 0 && 'has tokens but no transactions'
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Check smart contract interactions
  async checkContractInteractions(address) {
    try {
      // Check if address is a contract
      const code = await this.provider.getCode(address);
      const isContract = code !== '0x';

      return {
        isContract: isContract,
        hasCode: code.length > 2,
        codeLength: code.length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Calculate overall risk score (0-100)
  calculateRiskScore(balanceCheck, txCheck, contractCheck) {
    let score = 0;

    // High token value, no ETH = major red flag
    if (balanceCheck.suspiciousRatio) {
      score += 50;
    }

    // No transactions but has tokens = suspicious
    if (txCheck.isNewWallet && balanceCheck.tokenCount > 0) {
      score += 30;
    }

    // Multiple high-value tokens = potential bait
    if (balanceCheck.totalTokenValue > 1000) {
      score += 20;
    }

    // Contract address with tokens = possible trap
    if (contractCheck.isContract && balanceCheck.tokenCount > 0) {
      score += 25;
    }

    return Math.min(score, 100);
  }

  // Convert risk score to level
  getRiskLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    if (score >= 20) return 'LOW';
    return 'MINIMAL';
  }

  // Identify specific trap type
  identifyTrapType(balanceCheck, txCheck, contractCheck) {
    if (balanceCheck.suspiciousRatio && txCheck.isNewWallet) {
      return 'GAS_DRAIN_TRAP';
    }
    
    if (contractCheck.isContract) {
      return 'SMART_CONTRACT_LOCK';
    }
    
    if (balanceCheck.totalTokenValue > 1000 && balanceCheck.ethBalance < 0.001) {
      return 'TOKEN_HONEYPOT';
    }
    
    return 'UNKNOWN_TRAP';
  }

  // Generate specific warnings
  generateWarnings(trapType) {
    const warnings = {
      'GAS_DRAIN_TRAP': [
        '⚠️ Classic honeypot: High token value, no ETH for gas',
        '🤖 Bots monitor this wallet - will steal any ETH added',
        '💸 DO NOT send ETH for gas fees'
      ],
      'SMART_CONTRACT_LOCK': [
        '⚠️ Smart contract may have withdrawal restrictions',
        '🔒 Tokens might be permanently locked',
        '📋 Check contract code before interacting'
      ],
      'TOKEN_HONEYPOT': [
        '⚠️ Suspicious token distribution pattern',
        '🍯 Likely designed to attract victims',
        '💰 Tokens may not be transferable'
      ],
      'UNKNOWN_TRAP': [
        '⚠️ Unusual wallet pattern detected',
        '🔍 Requires manual investigation',
        '⚡ Proceed with extreme caution'
      ]
    };

    return warnings[trapType] || ['⚠️ Potential honeypot detected'];
  }

  // Batch analyze multiple wallets
  async analyzeBatch(addresses) {
    const results = [];
    
    for (const address of addresses) {
      const analysis = await this.analyzeWallet(address);
      results.push(analysis);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return results;
  }

  // Get honeypot statistics
  getHoneypotStats(analyses) {
    const total = analyses.length;
    const honeypots = analyses.filter(a => a.isHoneypot).length;
    const riskLevels = analyses.reduce((acc, a) => {
      acc[a.riskLevel] = (acc[a.riskLevel] || 0) + 1;
      return acc;
    }, {});

    return {
      total: total,
      honeypots: honeypots,
      safeWallets: total - honeypots,
      honeypotRate: ((honeypots / total) * 100).toFixed(2) + '%',
      riskDistribution: riskLevels
    };
  }
}

module.exports = HoneypotDetector;