const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/autoclaimtoken',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_scan TIMESTAMP,
        total_recovered DECIMAL(20,8) DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0
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

      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_status ON recovery_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_blockchain_scans_wallet ON blockchain_scans(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_user ON recovery_jobs(user_id);
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { pool, initializeDatabase };