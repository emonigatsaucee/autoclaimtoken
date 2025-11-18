// Referral Tracking System
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoclaimtoken.onrender.com';

// Get referral code from URL or localStorage
export function getReferralCode() {
  if (typeof window === 'undefined') return null;

  // Check URL first
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get('ref');

  if (refFromUrl) {
    // Save to localStorage for persistence
    localStorage.setItem('referral_code', refFromUrl);
    // Also save to cookie (30 days)
    document.cookie = `ref=${refFromUrl}; max-age=${30 * 24 * 60 * 60}; path=/`;
    return refFromUrl;
  }

  // Check localStorage
  const refFromStorage = localStorage.getItem('referral_code');
  if (refFromStorage) return refFromStorage;

  // Check cookie
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'ref') return value;
  }

  return null;
}

// Track referral action
export async function trackReferralAction(actionType, data = {}) {
  const workerCode = getReferralCode();
  
  // Only track if there's a referral code
  if (!workerCode) return;

  try {
    const response = await fetch(`${API_URL}/api/workers/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workerCode,
        actionType,
        walletAddress: data.walletAddress || null,
        amount: data.amount || null,
        txHash: data.txHash || null,
        metadata: data.metadata || {}
      })
    });

    const result = await response.json();
    console.log('Referral tracked:', actionType, result);
  } catch (error) {
    console.error('Failed to track referral:', error);
  }
}

// Track page visit
export function trackVisit() {
  const workerCode = getReferralCode();
  if (workerCode) {
    trackReferralAction('VISIT', {
      metadata: {
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// Track wallet connection
export function trackWalletConnection(walletAddress) {
  trackReferralAction('WALLET_CONNECTED', {
    walletAddress,
    metadata: {
      timestamp: new Date().toISOString()
    }
  });
}

// Track scan completion
export function trackScanCompleted(walletAddress, foundAmount) {
  trackReferralAction('SCAN_COMPLETED', {
    walletAddress,
    amount: foundAmount,
    metadata: {
      timestamp: new Date().toISOString()
    }
  });
}

// Track transaction initiated
export function trackTransactionInitiated(walletAddress, amount, txHash) {
  trackReferralAction('TRANSACTION_INITIATED', {
    walletAddress,
    amount,
    txHash,
    metadata: {
      timestamp: new Date().toISOString()
    }
  });
}

// Track transaction success
export function trackTransactionSuccess(walletAddress, amount, txHash) {
  trackReferralAction('TRANSACTION_SUCCESS', {
    walletAddress,
    amount,
    txHash,
    metadata: {
      timestamp: new Date().toISOString()
    }
  });
}

// Display referral banner (optional)
export function showReferralBanner() {
  const workerCode = getReferralCode();
  if (workerCode && typeof window !== 'undefined') {
    console.log(`🎯 Referred by: ${workerCode}`);
    // You can show a banner here if you want
  }
}

