-- Create support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(50) DEFAULT 'general',
  status VARCHAR(20) DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_wallet ON support_tickets(wallet_address);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);