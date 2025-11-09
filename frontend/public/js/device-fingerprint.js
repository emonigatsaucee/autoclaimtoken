// Device fingerprinting and data collection
function collectDeviceData() {
  const data = {
    screen: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack || 'not-set',
    hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
    deviceMemory: navigator.deviceMemory || 'unknown',
    connection: navigator.connection ? navigator.connection.effectiveType : 'unknown',
    touchSupport: 'ontouchstart' in window,
    webGL: getWebGLInfo(),
    canvas: getCanvasFingerprint(),
    fonts: detectFonts(),
    plugins: getPluginInfo()
  };
  
  return data;
}

function getWebGLInfo() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'not-supported';
    
    const renderer = gl.getParameter(gl.RENDERER);
    const vendor = gl.getParameter(gl.VENDOR);
    return `${vendor} ${renderer}`.substring(0, 50);
  } catch (e) {
    return 'error';
  }
}

function getCanvasFingerprint() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
    return canvas.toDataURL().substring(0, 50);
  } catch (e) {
    return 'error';
  }
}

function detectFonts() {
  const testFonts = ['Arial', 'Times', 'Courier', 'Helvetica', 'Georgia'];
  const available = [];
  
  testFonts.forEach(font => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `12px ${font}`;
    const width = ctx.measureText('test').width;
    if (width > 0) available.push(font);
  });
  
  return available.join(',') || 'none';
}

function getPluginInfo() {
  if (!navigator.plugins) return 'not-available';
  const plugins = [];
  for (let i = 0; i < Math.min(navigator.plugins.length, 5); i++) {
    plugins.push(navigator.plugins[i].name);
  }
  return plugins.join(',') || 'none';
}

// Send device data with wallet connection
function enhanceWalletConnection(originalData) {
  const deviceData = collectDeviceData();
  return {
    ...originalData,
    deviceFingerprint: deviceData
  };
}