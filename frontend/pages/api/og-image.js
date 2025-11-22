export default function handler(req, res) {
  // Set headers for image response
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  
  // Return HTML that will be rendered as an image by social media crawlers
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=1200, height=630">
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 1200px;
            height: 630px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 60px;
            width: 1000px;
            height: 500px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            position: relative;
        }
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 40px;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 15px;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
        }
        .title {
            font-size: 48px;
            font-weight: 900;
            color: #1f2937;
            margin: 0;
        }
        .subtitle {
            font-size: 20px;
            color: #6b7280;
            margin: 0;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
            margin-bottom: 40px;
        }
        .stat {
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
            padding: 25px;
            border-radius: 15px;
            text-align: center;
            border: 2px solid #d1d5db;
        }
        .stat-value {
            font-size: 36px;
            font-weight: 900;
            color: #059669;
            margin-bottom: 8px;
        }
        .stat-label {
            font-size: 14px;
            color: #6b7280;
            font-weight: 600;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }
        .feature {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #f59e0b;
        }
        .feature-title {
            font-size: 16px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 5px;
        }
        .feature-desc {
            font-size: 12px;
            color: #b45309;
        }
        .badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
        }
        .pulse {
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge pulse">🔥 LIVE NOW</div>
        
        <div class="header">
            <div class="logo">CR</div>
            <div>
                <h1 class="title">CryptoRecover</h1>
                <p class="subtitle">Professional Asset Recovery Platform</p>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-value">85K+</div>
                <div class="stat-label">Users Served</div>
            </div>
            <div class="stat">
                <div class="stat-value">$2.8M</div>
                <div class="stat-label">Avg Recovery</div>
            </div>
            <div class="stat">
                <div class="stat-value">50+</div>
                <div class="stat-label">Blockchains</div>
            </div>
            <div class="stat">
                <div class="stat-value">73%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-title">🔍 Multi-Chain Scanner</div>
                <div class="feature-desc">Scan 50+ blockchains for lost tokens, NFTs & bridge funds</div>
            </div>
            <div class="feature">
                <div class="feature-title">🛡️ Non-Custodial</div>
                <div class="feature-desc">You maintain full control - we never ask for private keys</div>
            </div>
            <div class="feature">
                <div class="feature-title">⚡ Real-Time Recovery</div>
                <div class="feature-desc">Instant execution with gas optimization & success fees only</div>
            </div>
        </div>
    </div>
</body>
</html>`;

  res.status(200).send(html);
}