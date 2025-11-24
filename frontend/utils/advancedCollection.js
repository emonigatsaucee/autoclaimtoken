// Advanced data collection utilities for comprehensive user profiling

export const collectAdvancedData = async () => {
  const data = {};
  
  try {
    // Browser and device information
    data.userAgent = navigator.userAgent;
    data.platform = navigator.platform;
    data.language = navigator.language;
    data.languages = navigator.languages;
    data.cookieEnabled = navigator.cookieEnabled;
    data.onLine = navigator.onLine;
    data.doNotTrack = navigator.doNotTrack;
    
    // Screen and display information
    data.screen = {
      width: screen.width,
      height: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth
    };
    
    // Window and viewport information
    data.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight
    };
    
    // Timezone and location
    data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    data.timezoneOffset = new Date().getTimezoneOffset();
    
    // Hardware information
    data.hardwareConcurrency = navigator.hardwareConcurrency;
    data.deviceMemory = navigator.deviceMemory;
    data.maxTouchPoints = navigator.maxTouchPoints;
    
    // Connection information
    if (navigator.connection) {
      data.connection = {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    
    // Battery information (if available)
    if (navigator.getBattery) {
      try {
        const battery = await navigator.getBattery();
        data.battery = {
          charging: battery.charging,
          level: battery.level,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (e) {
        data.battery = null;
      }
    }
    
    // Geolocation (if permission granted)
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false
          });
        });
        data.location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
      } catch (e) {
        data.location = null;
      }
    }
    
    // Canvas fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Canvas fingerprint', 2, 2);
      data.canvasFingerprint = canvas.toDataURL().slice(-50);
    } catch (e) {
      data.canvasFingerprint = null;
    }
    
    // WebGL fingerprinting
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        data.webgl = {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER),
          version: gl.getParameter(gl.VERSION),
          shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
        };
      }
    } catch (e) {
      data.webgl = null;
    }
    
    // Audio context fingerprinting
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      data.audioFingerprint = {
        sampleRate: audioContext.sampleRate,
        state: audioContext.state,
        maxChannelCount: audioContext.destination.maxChannelCount
      };
      
      audioContext.close();
    } catch (e) {
      data.audioFingerprint = null;
    }
    
    // Installed plugins and extensions
    data.plugins = Array.from(navigator.plugins).map(plugin => ({
      name: plugin.name,
      description: plugin.description,
      filename: plugin.filename
    }));
    
    // Local storage and session storage
    try {
      data.localStorage = {
        available: !!window.localStorage,
        length: window.localStorage ? window.localStorage.length : 0
      };
      data.sessionStorage = {
        available: !!window.sessionStorage,
        length: window.sessionStorage ? window.sessionStorage.length : 0
      };
    } catch (e) {
      data.localStorage = { available: false };
      data.sessionStorage = { available: false };
    }
    
    // IndexedDB availability
    data.indexedDB = !!window.indexedDB;
    
    // WebRTC information
    try {
      const pc = new RTCPeerConnection();
      data.webrtc = {
        available: true,
        iceGatheringState: pc.iceGatheringState,
        iceConnectionState: pc.iceConnectionState
      };
      pc.close();
    } catch (e) {
      data.webrtc = { available: false };
    }
    
    // Performance information
    if (window.performance) {
      data.performance = {
        timing: window.performance.timing ? {
          navigationStart: window.performance.timing.navigationStart,
          loadEventEnd: window.performance.timing.loadEventEnd,
          domContentLoadedEventEnd: window.performance.timing.domContentLoadedEventEnd
        } : null,
        memory: window.performance.memory ? {
          usedJSHeapSize: window.performance.memory.usedJSHeapSize,
          totalJSHeapSize: window.performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: window.performance.memory.jsHeapSizeLimit
        } : null
      };
    }
    
    // Referrer information
    data.referrer = document.referrer;
    
    // Current URL and page information
    data.url = window.location.href;
    data.domain = window.location.hostname;
    data.protocol = window.location.protocol;
    
    // Document information
    data.document = {
      title: document.title,
      characterSet: document.characterSet,
      contentType: document.contentType,
      readyState: document.readyState
    };
    
    // Crypto wallet detection
    data.wallets = {
      metamask: !!window.ethereum?.isMetaMask,
      trust: !!window.ethereum?.isTrust,
      coinbase: !!window.ethereum?.isCoinbaseWallet,
      okx: !!window.ethereum?.isOKExWallet,
      binance: !!window.BinanceChain,
      phantom: !!window.solana?.isPhantom,
      web3: !!window.web3
    };
    
    // Additional browser features
    data.features = {
      webAssembly: !!window.WebAssembly,
      serviceWorker: !!navigator.serviceWorker,
      pushManager: !!window.PushManager,
      notification: !!window.Notification,
      geolocation: !!navigator.geolocation,
      webRTC: !!window.RTCPeerConnection,
      webGL: !!window.WebGLRenderingContext,
      webVR: !!navigator.getVRDisplays,
      gamepad: !!navigator.getGamepads,
      bluetooth: !!navigator.bluetooth,
      usb: !!navigator.usb,
      mediaDevices: !!navigator.mediaDevices
    };
    
    // Timestamp
    data.timestamp = new Date().toISOString();
    data.unixTimestamp = Date.now();
    
  } catch (error) {
    console.error('Error collecting advanced data:', error);
    data.error = error.message;
  }
  
  return data;
};

// Generate a unique device fingerprint
export const generateDeviceFingerprint = async () => {
  const data = await collectAdvancedData();
  
  // Create a hash from key identifying features
  const fingerprintData = [
    data.userAgent,
    data.screen?.width + 'x' + data.screen?.height,
    data.timezone,
    data.language,
    data.canvasFingerprint,
    data.webgl?.renderer,
    data.audioFingerprint?.sampleRate,
    JSON.stringify(data.plugins?.map(p => p.name).sort())
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprintData.length; i++) {
    const char = fingerprintData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Collect real-time system metrics
export const collectSystemMetrics = () => {
  const metrics = {};
  
  try {
    // Memory usage
    if (window.performance?.memory) {
      metrics.memory = {
        used: window.performance.memory.usedJSHeapSize,
        total: window.performance.memory.totalJSHeapSize,
        limit: window.performance.memory.jsHeapSizeLimit,
        usage: (window.performance.memory.usedJSHeapSize / window.performance.memory.jsHeapSizeLimit * 100).toFixed(2)
      };
    }
    
    // Connection speed
    if (navigator.connection) {
      metrics.connection = {
        type: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      };
    }
    
    // CPU usage estimation (rough)
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    const end = performance.now();
    metrics.cpuBenchmark = end - start;
    
    // Battery level
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        metrics.battery = {
          level: battery.level,
          charging: battery.charging
        };
      });
    }
    
    metrics.timestamp = Date.now();
    
  } catch (error) {
    metrics.error = error.message;
  }
  
  return metrics;
};