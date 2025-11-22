-- Worker payments tracking table
CREATE TABLE IF NOT EXISTS worker_payments (
  id SERIAL PRIMARY KEY,
  worker_code VARCHAR(50) NOT NULL,
  amount DECIMAL(18,8) NOT NULL,
  user_wallet VARCHAR(42) NOT NULL,
  recovery_amount DECIMAL(18,8) NOT NULL,
  tx_hash VARCHAR(66),
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_worker_code (worker_code),
  INDEX idx_payment_date (payment_date)
);

-- Add columns to workers table
ALTER TABLE workers 
ADD COLUMN IF NOT EXISTS wallet_address VARCHAR(42),
ADD COLUMN IF NOT EXISTS total_earned DECIMAL(18,8) DEFAULT 0,
ADD COLUMN IF NOT EXISTS successful_referrals INT DEFAULT 0;