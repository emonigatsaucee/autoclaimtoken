#!/usr/bin/env node

const FeatureTester = require('./test-all-features');
const WalletValidator = require('./validate-wallet-activity');

async function main() {
  console.log('🚀 CryptoRecover Feature Testing Suite');
  console.log('=====================================\n');

  const args = process.argv.slice(2);
  const command = args[0];
  const walletAddress = args[1];

  switch (command) {
    case 'validate':
      if (!walletAddress) {
        console.log('Usage: node run-tests.js validate <wallet_address>');
        console.log('Example: node run-tests.js validate 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
        process.exit(1);
      }
      
      console.log('🔍 STEP 1: Validating wallet activity...\n');
      const validator = new WalletValidator();
      await validator.validateWallet(walletAddress);
      
      console.log('\n🧪 STEP 2: Testing API with this wallet...\n');
      const tester = new FeatureTester();
      
      // Test specific wallet
      console.log(`Testing wallet: ${walletAddress}`);
      
      const connectionTest = await tester.testWalletConnection(walletAddress);
      console.log('Connection:', connectionTest.success ? '✅' : '❌', connectionTest.message || connectionTest.error);
      
      const tokenTest = await tester.testTokenScanner(walletAddress);
      console.log('Token Scanner:', tokenTest.success ? '✅' : '❌', tokenTest.message || tokenTest.error);
      
      const bridgeTest = await tester.testBridgeScanner(walletAddress);
      console.log('Bridge Scanner:', bridgeTest.success ? '✅' : '❌', bridgeTest.message || bridgeTest.error);
      
      const stakingTest = await tester.testStakingScanner(walletAddress);
      console.log('Staking Scanner:', stakingTest.success ? '✅' : '❌', stakingTest.message || stakingTest.error);
      
      break;

    case 'full':
      console.log('🧪 Running full test suite...\n');
      const fullTester = new FeatureTester();
      await fullTester.runAllTests();
      break;

    case 'fresh':
      console.log('🆕 Testing fresh wallet behavior...\n');
      const freshWallet = '0x0000000000000000000000000000000000000001';
      
      const freshValidator = new WalletValidator();
      await freshValidator.validateWallet(freshWallet);
      
      const freshTester = new FeatureTester();
      
      const freshBridge = await freshTester.testBridgeScanner(freshWallet);
      console.log('Fresh Wallet Bridge Scanner:', freshBridge.success ? '✅' : '❌');
      console.log('Expected: 0 stuck transactions, Got:', freshBridge.data?.stuckTransactions || 'Error');
      
      const freshStaking = await freshTester.testStakingScanner(freshWallet);
      console.log('Fresh Wallet Staking Scanner:', freshStaking.success ? '✅' : '❌');
      console.log('Expected: 0 staking rewards, Got:', freshStaking.data?.totalRewards || 'Error');
      
      break;

    default:
      console.log('Available commands:');
      console.log('  validate <wallet>  - Validate wallet and test API');
      console.log('  full              - Run complete test suite');
      console.log('  fresh             - Test fresh wallet behavior');
      console.log('');
      console.log('Examples:');
      console.log('  node run-tests.js validate 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
      console.log('  node run-tests.js fresh');
      console.log('  node run-tests.js full');
      break;
  }
}

main().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});