// Test the credential scraper functionality
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001';
const ADMIN_KEY = 'admin-scraper-2024';

async function testScraper() {
  console.log('🧪 Testing Credential Scraper...\n');

  try {
    // Test 1: Get Stats
    console.log('1️⃣ Testing stats endpoint...');
    const statsResponse = await axios.get(`${API_URL}/api/scraper/stats`, {
      headers: { 'x-admin-key': ADMIN_KEY }
    });
    console.log('✅ Stats:', statsResponse.data);
    console.log('');

    // Test 2: Start a scan
    console.log('2️⃣ Testing scan endpoint...');
    const scanResponse = await axios.post(
      `${API_URL}/api/scraper/scan`,
      {
        searchInput: 'test@example.com',
        searchType: 'email',
        adminKey: ADMIN_KEY
      }
    );
    console.log('✅ Scan result:', {
      success: scanResponse.data.success,
      totalFound: scanResponse.data.totalFound,
      searchId: scanResponse.data.searchId
    });
    console.log('');

    // Test 3: Get recent scans
    console.log('3️⃣ Testing scan history...');
    const historyResponse = await axios.get(`${API_URL}/api/scraper/scans?limit=5`, {
      headers: { 'x-admin-key': ADMIN_KEY }
    });
    console.log('✅ Recent scans:', historyResponse.data.scans?.length || 0);
    console.log('');

    // Test 4: Get all credentials
    console.log('4️⃣ Testing credentials database...');
    const credsResponse = await axios.get(`${API_URL}/api/scraper/all-credentials?limit=10`, {
      headers: { 'x-admin-key': ADMIN_KEY }
    });
    console.log('✅ Total credentials:', credsResponse.data.total);
    console.log('');

    console.log('🎉 All tests passed!\n');
    console.log('📊 Summary:');
    console.log(`   - Stats endpoint: Working`);
    console.log(`   - Scan endpoint: Working`);
    console.log(`   - History endpoint: Working`);
    console.log(`   - Database endpoint: Working`);
    console.log('');
    console.log('🌐 Access the panel at:');
    console.log(`   Local: http://localhost:3000/scraper`);
    console.log(`   Admin Key: ${ADMIN_KEY}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Run tests
testScraper();
