-- Add trial balances table
CREATE TABLE IF NOT EXISTS trial_balances (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    token_symbol VARCHAR(10) NOT NULL,
    balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_address, token_symbol)
);