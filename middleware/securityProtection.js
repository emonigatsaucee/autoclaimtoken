// ADVANCED SECURITY PROTECTION MIDDLEWARE
const rateLimit = require('express-rate-limit');

// IP-based rate limiting with progressive penalties
const createRateLimiter = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`🚨 RATE LIMIT HIT: ${req.ip} - ${req.path}`);
    res.status(429).json({ error: message });
  }
});

// Anti-brute force protection
const bruteForceLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests max
  'Too many requests. Please slow down.'
);

// API endpoint protection
const apiLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  30, // 30 requests max
  'API rate limit exceeded'
);

// Wallet connection protection
const walletLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // 10 wallet connections max
  'Too many wallet connection attempts'
);

// Advanced bot detection
const botDetection = (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const suspicious = req.headers['x-forwarded-for']?.split(',').length > 3;
  
  const botPatterns = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java/i,
    /headless|phantom|selenium/i
  ];
  
  const isBot = botPatterns.some(pattern => pattern.test(userAgent));
  
  if (isBot || suspicious) {
    console.log(`🤖 BOT DETECTED: ${req.ip} - ${userAgent}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// DDoS protection
const ddosProtection = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!global.requestTracker) {
    global.requestTracker = new Map();
  }
  
  const ipData = global.requestTracker.get(ip) || { count: 0, lastRequest: now };
  const timeDiff = now - ipData.lastRequest;
  
  if (timeDiff < 100 && ipData.count > 10) {
    console.log(`🛡️ DDOS PROTECTION: Blocking ${ip}`);
    return res.status(429).json({ error: 'Request frequency too high' });
  }
  
  global.requestTracker.set(ip, {
    count: timeDiff < 1000 ? ipData.count + 1 : 1,
    lastRequest: now
  });
  
  next();
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '');
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };
  
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
};

module.exports = {
  bruteForceLimiter,
  apiLimiter,
  walletLimiter,
  botDetection,
  ddosProtection,
  sanitizeInput
};