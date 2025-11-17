const https = require('https');

// Monitor deployment status
async function checkDeployments() {
  console.log('\n🔍 Checking deployment status...');
  
  // Check Render backend
  try {
    const response = await fetch('https://autoclaimtoken.onrender.com/health');
    const data = await response.json();
    console.log('✅ Render Backend:', data.status);
  } catch (error) {
    console.log('❌ Render Backend: OFFLINE -', error.message);
  }
  
  // Check Vercel frontend
  try {
    const response = await fetch('https://autoclaimtoken-10a1zx1oc-autoclaimtokens-projects.vercel.app/api/health');
    console.log('✅ Vercel Frontend: ONLINE');
  } catch (error) {
    console.log('❌ Vercel Frontend: OFFLINE -', error.message);
  }
}

// Run every 30 seconds
setInterval(checkDeployments, 30000);
checkDeployments();