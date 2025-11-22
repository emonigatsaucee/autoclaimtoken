-- Advanced visitor data storage table
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
  collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes for fast queries
  INDEX idx_ip_address (ip_address),
  INDEX idx_collected_at (collected_at),
  INDEX idx_financial_wallets ((financial_data->>'wallets'))
);