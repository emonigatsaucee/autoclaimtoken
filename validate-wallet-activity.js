const { ethers } = require('ethers');

// Wallet Activity Validator
class WalletValidator {
  constructor() {
    this.providers = {
      ethereum: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      bsc: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
      polygon: new ethers.JsonRpcProvider('https://polygon-rpc.com'),
      arbitrum: new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc')
    };
  }

  async validateWallet(walletAddress) {
    console.log(`\n🔍 Validating Wallet: ${walletAddress}`);
    console.log('='.repeat(60));

    const results = {
      address: walletAddress,
      isValid: ethers.isAddress(walletAddress),
      chains: {}
    };

    if (!results.isValid) {
      console.log('❌ Invalid wallet address format');
      return results;
    }

    // Check each chain
    for (const [chainName, provider] of Object.entries(this.providers)) {
      try {
        console.log(`\n📡 Checking ${chainName.toUpperCase()}...`);
        
        const balance = await provider.getBalance(walletAddress);
        const txCount = await provider.getTransactionCount(walletAddress);
        const balanceEth = parseFloat(ethers.formatEther(balance));

        results.chains[chainName] = {
          balance: balanceEth,
          transactionCount: txCount,
          hasActivity: txCount > 0,
          hasBalance: balanceEth > 0
        };

        console.log(`   Balance: ${balanceEth.toFixed(6)} ${this.getChainSymbol(chainName)}`);
        console.log(`   Transactions: ${txCount}`);
        console.log(`   Status: ${txCount > 0 ? '🟢 Active' : '🔴 Inactive'}`);

        // Check specific protocols based on activity
        if (txCount > 10) {
          await this.checkProtocolActivity(walletAddress, chainName, provider);
        }

      } catch (error) {
        console.log(`   ❌ Error checking ${chainName}: ${error.message}`);
        results.chains[chainName] = { error: error.message };
      }
    }

    // Generate recommendations
    this.generateRecommendations(results);
    
    return results;
  }

  async checkProtocolActivity(walletAddress, chainName, provider) {
    console.log(`   🔎 Checking protocol activity...`);

    try {
      // Check common token balances
      const tokens = this.getCommonTokens(chainName);
      let tokenCount = 0;

      for (const token of tokens.slice(0, 3)) { // Check first 3 tokens
        try {
          const contract = new ethers.Contract(
            token.address,
            ['function balanceOf(address) view returns (uint256)'],
            provider
          );
          
          const balance = await contract.balanceOf(walletAddress);
          if (balance > 0) {
            tokenCount++;
            console.log(`   💰 Has ${token.symbol} tokens`);
          }
        } catch (e) {
          // Skip failed token checks
        }
      }

      if (tokenCount > 0) {
        console.log(`   📊 Active in ${tokenCount} protocols`);
      } else {
        console.log(`   📊 No major token holdings found`);
      }

    } catch (error) {
      console.log(`   ⚠️  Protocol check failed: ${error.message}`);
    }
  }

  generateRecommendations(results) {
    console.log(`\n💡 RECOMMENDATIONS FOR ${results.address}`);
    console.log('='.repeat(60));

    const activeChains = Object.entries(results.chains)
      .filter(([_, data]) => data.hasActivity)
      .map(([chain, _]) => chain);

    const balanceChains = Object.entries(results.chains)
      .filter(([_, data]) => data.hasBalance)
      .map(([chain, _]) => chain);

    if (activeChains.length === 0) {
      console.log('🆕 FRESH WALLET DETECTED');
      console.log('   • Bridge Scanner: Will return 0 results (CORRECT)');
      console.log('   • Staking Scanner: Will return 0 results (CORRECT)');
      console.log('   • Token Scanner: Will show only current balances');
      console.log('   • Expected Behavior: No recovery opportunities');
    } else {
      console.log('🔥 ACTIVE WALLET DETECTED');
      console.log(`   • Active on: ${activeChains.join(', ')}`);
      console.log(`   • Has balance on: ${balanceChains.join(', ')}`);
      console.log('   • Bridge Scanner: May find stuck transactions');
      console.log('   • Staking Scanner: May find staking positions');
      console.log('   • Token Scanner: Will show real token balances');
    }

    // Specific recommendations
    const totalTxs = Object.values(results.chains)
      .reduce((sum, chain) => sum + (chain.transactionCount || 0), 0);

    if (totalTxs > 100) {
      console.log('\n🐋 WHALE/POWER USER');
      console.log('   • Recommended: Start with Ethereum scanner');
      console.log('   • High probability of staking rewards');
      console.log('   • Check bridge transactions carefully');
    } else if (totalTxs > 10) {
      console.log('\n👤 REGULAR USER');
      console.log('   • Recommended: Scan all networks');
      console.log('   • Moderate recovery potential');
    } else if (totalTxs > 0) {
      console.log('\n🆕 NEW USER');
      console.log('   • Limited transaction history');
      console.log('   • Low recovery potential');
    }
  }

  getChainSymbol(chainName) {
    const symbols = {
      ethereum: 'ETH',
      bsc: 'BNB',
      polygon: 'MATIC',
      arbitrum: 'ETH'
    };
    return symbols[chainName] || 'TOKEN';
  }

  getCommonTokens(chainName) {
    const tokens = {
      ethereum: [
        { address: '0xA0b86a33E6441b8435b662303c0f098C8c8c30c1', symbol: 'USDC' },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
        { address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', symbol: 'stETH' }
      ],
      bsc: [
        { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC' },
        { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT' },
        { address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE' }
      ],
      polygon: [
        { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' },
        { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT' }
      ],
      arbitrum: [
        { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', symbol: 'USDC' },
        { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', symbol: 'ARB' }
      ]
    };
    return tokens[chainName] || [];
  }
}

// CLI usage
if (require.main === module) {
  const walletAddress = process.argv[2];
  
  if (!walletAddress) {
    console.log('Usage: node validate-wallet-activity.js <wallet_address>');
    console.log('Example: node validate-wallet-activity.js 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
    process.exit(1);
  }

  const validator = new WalletValidator();
  validator.validateWallet(walletAddress).then(results => {
    console.log('\n✅ Validation Complete!');
    console.log('\nUse this information to predict what our scanners should find.');
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = WalletValidator;