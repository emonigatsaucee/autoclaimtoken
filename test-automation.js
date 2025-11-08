const axios = require('axios');
const { execSync } = require('child_process');

const API_BASE = 'http://localhost:3001/api';
const FRONTEND_BASE = 'http://localhost:3000';
const TEST_WALLET = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Valid Ethereum address

async function runTests() {
  console.log('🚀 Starting Automated Tests...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Test 1: Backend Health Check
  try {
    console.log('1️⃣ Testing Backend Health...');
    const health = await axios.get(`${API_BASE}/health`);
    if (health.data.status === 'healthy') {
      console.log('✅ Backend is healthy');
      results.passed++;
      results.tests.push({ name: 'Backend Health', status: 'PASS' });
    } else {
      throw new Error('Backend unhealthy');
    }
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Backend Health', status: 'FAIL', error: error.message });
  }

  // Test 2: Frontend Accessibility
  try {
    console.log('2️⃣ Testing Frontend Accessibility...');
    const frontend = await axios.get(FRONTEND_BASE);
    if (frontend.status === 200) {
      console.log('✅ Frontend is accessible');
      results.passed++;
      results.tests.push({ name: 'Frontend Access', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Frontend accessibility failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Frontend Access', status: 'FAIL', error: error.message });
  }

  // Test 3: Wallet Connection API
  try {
    console.log('3️⃣ Testing Wallet Connection...');
    const walletTest = await axios.post(`${API_BASE}/connect-wallet`, {
      walletAddress: TEST_WALLET,
      signature: '0xdemo',
      message: 'test'
    });
    if (walletTest.data.success) {
      console.log('✅ Wallet connection works');
      results.passed++;
      results.tests.push({ name: 'Wallet Connection', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Wallet connection failed:', error.response?.data?.error || error.message);
    results.failed++;
    results.tests.push({ name: 'Wallet Connection', status: 'FAIL', error: error.response?.data?.error || error.message });
  }

  // Test 4: Token Scanner
  try {
    console.log('4️⃣ Testing Token Scanner...');
    const scanTest = await axios.post(`${API_BASE}/scan-wallet`, {
      walletAddress: TEST_WALLET
    });
    if (scanTest.data.success) {
      console.log('✅ Token scanner works');
      results.passed++;
      results.tests.push({ name: 'Token Scanner', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Token scanner failed:', error.response?.data?.error || error.message);
    results.failed++;
    results.tests.push({ name: 'Token Scanner', status: 'FAIL', error: error.response?.data?.error || error.message });
  }

  // Test 5: Staking Scanner (Multi-chain)
  try {
    console.log('5️⃣ Testing Multi-chain Staking Scanner...');
    const stakingTest = await axios.post(`${API_BASE}/scan-staking`, {
      walletAddress: TEST_WALLET
    });
    if (stakingTest.data.success) {
      console.log('✅ Multi-chain staking scanner works');
      console.log(`   Found ${stakingTest.data.summary.totalProtocols} protocols`);
      results.passed++;
      results.tests.push({ name: 'Staking Scanner', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Staking scanner failed:', error.response?.data?.error || error.message);
    results.failed++;
    results.tests.push({ name: 'Staking Scanner', status: 'FAIL', error: error.response?.data?.error || error.message });
  }

  // Test 6: Recovery Job Creation (requires user first)
  try {
    console.log('6️⃣ Testing Recovery Job Creation...');
    // First ensure user exists
    await axios.post(`${API_BASE}/connect-wallet`, {
      walletAddress: TEST_WALLET,
      signature: '0xdemo',
      message: 'test'
    }).catch(() => {}); // Ignore if user already exists
    
    const recoveryTest = await axios.post(`${API_BASE}/create-recovery-job`, {
      walletAddress: TEST_WALLET,
      tokenAddress: '0x0000000000000000000000000000000000000000',
      tokenSymbol: 'ETH',
      estimatedAmount: '6.4',
      recoveryMethod: 'staking_claim'
    });
    if (recoveryTest.data.success) {
      console.log('✅ Recovery job creation works');
      console.log(`   Job status: ${recoveryTest.data.job.status}`);
      results.passed++;
      results.tests.push({ name: 'Recovery Job', status: 'PASS' });
    }
  } catch (error) {
    console.log('❌ Recovery job creation failed:', error.response?.data?.error || error.message);
    results.failed++;
    results.tests.push({ name: 'Recovery Job', status: 'FAIL', error: error.response?.data?.error || error.message });
  }

  // Test 7: Git Status Check
  try {
    console.log('7️⃣ Checking Git Status...');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim() === '') {
      console.log('✅ All changes committed');
      results.passed++;
      results.tests.push({ name: 'Git Status', status: 'PASS' });
    } else {
      console.log('⚠️ Uncommitted changes found');
      results.tests.push({ name: 'Git Status', status: 'WARN', error: 'Uncommitted changes' });
    }
  } catch (error) {
    console.log('❌ Git status check failed:', error.message);
    results.failed++;
    results.tests.push({ name: 'Git Status', status: 'FAIL', error: error.message });
  }

  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📋 Total: ${results.tests.length}`);
  
  console.log('\n📋 Detailed Results:');
  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : test.status === 'WARN' ? '⚠️' : '❌';
    console.log(`${icon} ${test.name}: ${test.status}`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });

  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your changes are working correctly.');
  } else {
    console.log(`\n⚠️ ${results.failed} tests failed. Please check the errors above.`);
  }

  return results;
}

// Auto-run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests };