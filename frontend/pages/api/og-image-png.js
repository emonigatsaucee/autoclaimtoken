export default function handler(req, res) {
  // Generate a data URL for a PNG image
  const canvas = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea"/>
      <stop offset="100%" style="stop-color:#764ba2"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="100" y="65" width="1000" height="500" rx="20" fill="rgba(255,255,255,0.95)"/>
  <rect x="180" y="120" width="60" height="60" rx="15" fill="#4f46e5"/>
  <text x="210" y="155" font-family="Arial" font-size="24" font-weight="900" fill="white" text-anchor="middle">CR</text>
  <text x="260" y="155" font-family="Arial" font-size="48" font-weight="900" fill="#1f2937">CryptoRecover</text>
  <text x="260" y="180" font-family="Arial" font-size="20" fill="#6b7280">Professional Asset Recovery</text>
  
  <rect x="180" y="220" width="200" height="100" rx="15" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
  <text x="280" y="260" font-family="Arial" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">85K+</text>
  <text x="280" y="280" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Users</text>
  
  <rect x="400" y="220" width="200" height="100" rx="15" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
  <text x="500" y="260" font-family="Arial" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">$2.8M</text>
  <text x="500" y="280" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Avg Recovery</text>
  
  <rect x="620" y="220" width="200" height="100" rx="15" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
  <text x="720" y="260" font-family="Arial" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">50+</text>
  <text x="720" y="280" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Blockchains</text>
  
  <rect x="840" y="220" width="200" height="100" rx="15" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
  <text x="940" y="260" font-family="Arial" font-size="32" font-weight="900" fill="#059669" text-anchor="middle">73%</text>
  <text x="940" y="280" font-family="Arial" font-size="12" fill="#6b7280" text-anchor="middle">Success</text>
  
  <rect x="950" y="85" width="120" height="40" rx="20" fill="#ef4444"/>
  <text x="1010" y="108" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">🔥 LIVE</text>
</svg>`;

  // Convert SVG to base64 data URL
  const base64 = Buffer.from(canvas).toString('base64');
  const dataUrl = `data:image/svg+xml;base64,${base64}`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  res.status(200).send(canvas);
}