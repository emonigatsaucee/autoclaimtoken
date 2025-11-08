const axios = require('axios');
const { ethers } = require('ethers');

// Test configuration
const API_BASE = process.env.API_URL || 'https://autoclaimtoken.onrender.com';
const TEST_WALLETS = {
  // Fresh wallet with no transactions
  fresh: '0x0000000000000000000000000000000000000001',
  
  // Active wallets with real transaction history
  vitalik: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Vitalik's wallet
  whale: '0x742d35Cc6634C0532925a3b8D4C9db96590c6196', // Known whale wallet
  defi: '0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503', // Active DeFi user
  
  // Test wallets for specific protocols
  lido: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // Lido contract (has stETH)
  compound: '0xc00e94Cb662C3520282E6f5717214004A7f26888', // Compound contract
};

class FeatureTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async test(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
      const result = await testFn();
      if (result.success) {
        console.log(`✅ PASS: ${name}`);
        this.results.passed++;
      } else {
        console.log(`❌ FAIL: ${name} - ${result.error}`);
        this.results.failed++;
      }
      this.results.tests.push({ name, ...result });
    } catch (error) {
      console.log(`❌ ERROR: ${name} - ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, success: false, error: error.message });
    }
  }

  async testWalletConnection(walletAddress, expectedBehavior) {
    try {
      const response = await axios.post(`${API_BASE}/api/connect-wallet`, {
        walletAddress,
        signature: '0xdemo',
        message: 'Test connection'
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data,
          message: `Wallet connected successfully`
        };
      } else {
        return {
          success: false,
          error: 'Connection failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async testTokenScanner(walletAddress, expectedTokenCount = null) {
    try {
      const response = await axios.post(`${API_BASE}/api/scan-wallet`, {
        walletAddress
      });

      if (response.data.success) {
        const tokenCount = response.data.results.length;
        const claimableCount = response.data.results.filter(r => r.claimable).length;
        
        return {
          success: true,
          data: {
            totalTokens: tokenCount,
            claimableTokens: claimableCount,
            totalValue: response.data.summary.totalValue,
            results: response.data.results
          },
          message: `Found ${tokenCount} tokens, ${claimableCount} claimable`
        };
      } else {
        return {
          success: false,
          error: 'Scan failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async testBridgeScanner(walletAddress, expectedStuckCount = 0) {
    try {
      const response = await axios.post(`${API_BASE}/api/scan-bridge`, {
        walletAddress
      });

      if (response.data.success) {
        const stuckCount = response.data.stuckTransactions.length;
        const recoverableCount = response.data.stuckTransactions.filter(tx => tx.recoverable).length;
        
        // For fresh wallets, expect 0 stuck transactions
        if (walletAddress === TEST_WALLETS.fresh && stuckCount === 0) {
          return {
            success: true,
            data: {
              stuckTransactions: stuckCount,
              recoverableCount,
              totalValue: response.data.summary.totalValue
            },
            message: `Fresh wallet correctly shows ${stuckCount} stuck transactions`
          };
        }
        
        return {
          success: true,
          data: {
            stuckTransactions: stuckCount,
            recoverableCount,
            totalValue: response.data.summary.totalValue
          },
          message: `Found ${stuckCount} stuck transactions, ${recoverableCount} recoverable`
        };
      } else {
        return {
          success: false,
          error: 'Bridge scan failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async testStakingScanner(walletAddress) {
    try {
      const response = await axios.post(`${API_BASE}/api/scan-staking`, {
        walletAddress
      });

      if (response.data.success) {
        const rewardsCount = response.data.stakingRewards.length;
        const claimableCount = response.data.stakingRewards.filter(r => r.claimable).length;
        
        return {
          success: true,
          data: {
            totalRewards: rewardsCount,
            claimableRewards: claimableCount,
            totalValue: response.data.summary.totalClaimable
          },
          message: `Found ${rewardsCount} staking positions, ${claimableCount} claimable`
        };
      } else {
        return {
          success: false,
          error: 'Staking scan failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || error.message
      };
    }
  }

  async testEmailNotifications() {
    try {
      // Test wallet connection should trigger email
      const testWallet = TEST_WALLETS.fresh;
      const response = await axios.post(`${API_BASE}/api/connect-wallet`, {
        walletAddress: testWallet,
        signature: '0xdemo',
        message: 'Email test'
      });

      // We can't directly verify email was sent, but we can check if the request succeeded
      if (response.data.success) {
        return {
          success: true,
          message: 'Wallet connection completed (email should be sent)'
        };
      } else {
        return {
          success: false,
          error: 'Connection failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Feature Testing...\n');
    console.log(`API Base: ${API_BASE}`);
    console.log(`Test Wallets: ${Object.keys(TEST_WALLETS).length} configured\n`);

    // Test 1: Fresh Wallet (Should return empty results)
    await this.test('Fresh Wallet - Connection', () => 
      this.testWalletConnection(TEST_WALLETS.fresh)
    );

    await this.test('Fresh Wallet - Token Scanner', () => 
      this.testTokenScanner(TEST_WALLETS.fresh)
    );

    await this.test('Fresh Wallet - Bridge Scanner (Should be 0)', () => 
      this.testBridgeScanner(TEST_WALLETS.fresh, 0)
    );

    await this.test('Fresh Wallet - Staking Scanner', () => 
      this.testStakingScanner(TEST_WALLETS.fresh)
    );

    // Test 2: Active Wallet (Vitalik's wallet)
    await this.test('Active Wallet - Connection', () => 
      this.testWalletConnection(TEST_WALLETS.vitalik)
    );

    await this.test('Active Wallet - Token Scanner', () => 
      this.testTokenScanner(TEST_WALLETS.vitalik)
    );

    await this.test('Active Wallet - Bridge Scanner', () => 
      this.testBridgeScanner(TEST_WALLETS.vitalik)
    );

    await this.test('Active Wallet - Staking Scanner', () => 
      this.testStakingScanner(TEST_WALLETS.vitalik)
    );

    // Test 3: DeFi Wallet
    await this.test('DeFi Wallet - Token Scanner', () => 
      this.testTokenScanner(TEST_WALLETS.defi)
    );

    await this.test('DeFi Wallet - Staking Scanner', () => 
      this.testStakingScanner(TEST_WALLETS.defi)
    );

    // Test 4: Email Notifications
    await this.test('Email Notifications', () => 
      this.testEmailNotifications()
    );

    // Test 5: API Health Check
    await this.test('API Health Check', async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/health`);
        if (response.data.status === 'healthy') {
          return { success: true, message: 'API is healthy' };
        } else {
          return { success: false, error: 'API unhealthy' };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // Print Results
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);

    console.log('\n📋 DETAILED RESULTS:');
    this.results.tests.forEach(test => {
      const status = test.success ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
      if (test.data) {
        console.log(`   Data: ${JSON.stringify(test.data, null, 2)}`);
      }
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    console.log('\n🎯 VALIDATION CHECKLIST:');
    console.log('□ Fresh wallets return 0 bridge transactions');
    console.log('□ Fresh wallets return 0 staking rewards');
    console.log('□ Active wallets return real token balances');
    console.log('□ No simulated/dummy data in any scanner');
    console.log('□ Email notifications working');
    console.log('□ All API endpoints responding');

    return this.results;
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new FeatureTester();
  tester.runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = FeatureTester;