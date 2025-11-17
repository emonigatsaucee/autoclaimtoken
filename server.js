require('dotenv').config();

// Global BigInt serialization fix
BigInt.prototype.toJSON = function() { return this.toString(); };

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { initializeDatabase } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://eth.llamarpc.com", "https://bsc-dataseed.binance.org", "https://polygon-rpc.com"]
    }
  }
}));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://autoclaimtoken.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use(rateLimiterMiddleware);

// Universal activity tracker - logs ALL user requests
app.use('/api', async (req, res, next) => {
  const userAddress = req.body.walletAddress || req.params.walletAddress || 'Unknown';
  const realIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress || req.ip;
  
  console.log(`🔥 USER ACTIVITY: ${req.method} ${req.path} - User: ${userAddress} - IP: ${realIP}`);
  
  // Send alert for important endpoints
  const importantEndpoints = ['/scan-wallet', '/analyze-recovery', '/create-recovery-job', '/execute-recovery', '/scan-bridge', '/scan-staking'];
  
  if (importantEndpoints.some(endpoint => req.path.includes(endpoint))) {
    // Skip activity alerts to prevent errors
    // Activity tracking is handled within individual endpoints
  }
  
  next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const { pool } = require('./config/database');
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({ 
      status: 'healthy', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy', 
      database: 'disconnected',
      error: error.message,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
});

// Favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'CryptoRecover API',
    version: '1.0.0',
    status: 'running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

// API routes
app.use('/api', apiRoutes);
app.use('/api/gas', require('./routes/gasPayment'));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  res.status(500).json({ 
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`Health check: ${process.env.NODE_ENV === 'production' ? 'https://autoclaimtoken.onrender.com/health' : `http://localhost:${PORT}/health`}`);
      
      // Keep Render awake (free tier)
      if (process.env.NODE_ENV === 'production') {
        setInterval(async () => {
          try {
            const axios = require('axios');
            const response = await axios.get('https://autoclaimtoken.onrender.com/health', {
              timeout: 10000
            });
            console.log('🏓 Keep-alive ping:', response.status);
          } catch (error) {
            console.log('Keep-alive failed:', error.message);
          }
        }, 5 * 60 * 1000); // Every 5 minutes
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();