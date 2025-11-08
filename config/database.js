const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/autoclaimtoken',
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased for Render
});

const initializeDatabase = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Connecting to database... (attempt ${i + 1}/${retries})`);
      console.log('Database URL:', process.env.DATABASE_URL ? 'Set (Render PostgreSQL)' : 'Not set (Local)');
      
      const client = await pool.connect();
      console.log('Database connection established');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        email VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        country VARCHAR(2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_scan TIMESTAMP,
        total_recovered DECIMAL(20,8) DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0,
        payment_status VARCHAR(20) DEFAULT 'pending',
        service_agreement_accepted BOOLEAN DEFAULT false,
        kyc_verified BOOLEAN DEFAULT false
      );

      CREATE TABLE IF NOT EXISTS wallets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        address VARCHAR(42) NOT NULL,
        chain_id INTEGER NOT NULL,
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recovery_jobs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        wallet_address VARCHAR(42) NOT NULL,
        token_address VARCHAR(42),
        token_symbol VARCHAR(20),
        estimated_amount DECIMAL(20,8),
        actual_amount DECIMAL(20,8),
        recovery_method VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        tx_hash VARCHAR(66),
        gas_used INTEGER,
        fee_paid DECIMAL(20,8),
        success_probability DECIMAL(5,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS blockchain_scans (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        chain_id INTEGER NOT NULL,
        protocol_name VARCHAR(50),
        contract_address VARCHAR(42),
        claimable_amount DECIMAL(20,8),
        token_symbol VARCHAR(20),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        claim_method TEXT,
        gas_estimate INTEGER
      );

      CREATE TABLE IF NOT EXISTS recovery_patterns (
        id SERIAL PRIMARY KEY,
        pattern_type VARCHAR(50),
        success_indicators JSONB,
        failure_indicators JSONB,
        success_rate DECIMAL(5,2),
        sample_size INTEGER,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS escrow_recoveries (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        recovered_tokens JSONB,
        status VARCHAR(20) DEFAULT 'pending_payment',
        payment_tx VARCHAR(66),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS payment_logs (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        status VARCHAR(20),
        amount DECIMAL(20,8),
        currency VARCHAR(10),
        tx_hash VARCHAR(66),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_status ON recovery_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_blockchain_scans_wallet ON blockchain_scans(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_user ON recovery_jobs(user_id);
      CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_recoveries(status);
      CREATE INDEX IF NOT EXISTS idx_escrow_expires ON escrow_recoveries(expires_at);
    `);
      console.log('Database tables created/verified successfully');
      console.log('Database initialized successfully');
      client.release();
      return; // Success
    } catch (error) {
      console.error(`Database attempt ${i + 1} failed:`, error.message);
      console.error('Full error:', error);
      if (i === retries - 1) throw error;
      console.log('Waiting 5 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = { pool, initializeDatabase };