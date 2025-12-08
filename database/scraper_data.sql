-- Credential Scraper Database Schema
CREATE TABLE IF NOT EXISTS scraped_credentials (
    id SERIAL PRIMARY KEY,
    search_query TEXT NOT NULL,
    credential_type VARCHAR(50) NOT NULL,
    source VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    username VARCHAR(255),
    password TEXT,
    api_key TEXT,
    token TEXT,
    domain VARCHAR(255),
    url TEXT,
    raw_data TEXT,
    metadata JSONB,
    severity VARCHAR(20) DEFAULT 'medium',
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scraper_searches (
    id SERIAL PRIMARY KEY,
    search_input TEXT NOT NULL,
    search_type VARCHAR(50) NOT NULL,
    results_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    admin_ip VARCHAR(50),
    metadata JSONB
);

CREATE INDEX IF NOT EXISTS idx_scraped_email ON scraped_credentials(email);
CREATE INDEX IF NOT EXISTS idx_scraped_domain ON scraped_credentials(domain);
CREATE INDEX IF NOT EXISTS idx_scraped_source ON scraped_credentials(source);
CREATE INDEX IF NOT EXISTS idx_scraped_created ON scraped_credentials(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scraper_searches_status ON scraper_searches(status);
