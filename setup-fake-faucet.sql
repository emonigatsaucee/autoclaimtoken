-- Create fake balance table
CREATE TABLE IF NOT EXISTS user_fake_balances (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    token_symbol VARCHAR(10) NOT NULL DEFAULT 'CRT',
    balance DECIMAL(20,8) NOT NULL DEFAULT 0,
    tx_hash VARCHAR(66),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_address, token_symbol)
);