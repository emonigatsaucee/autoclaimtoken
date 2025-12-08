# Credential Scraper - System Architecture

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                       │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         /scraper Page (Admin Panel)                 │    │
│  │  ┌──────────┬──────────┬──────────┬──────────┐    │    │
│  │  │   Scan   │ Results  │ History  │ Database │    │    │
│  │  └──────────┴──────────┴──────────┴──────────┘    │    │
│  │                                                     │    │
│  │  Features:                                          │    │
│  │  • Start new scans                                  │    │
│  │  • View real-time results                           │    │
│  │  • Browse scan history                              │    │
│  │  • Search credentials                               │    │
│  │  • Export to JSON                                   │    │
│  │  • Delete records                                   │    │
│  │  • Statistics dashboard                             │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓ API Calls                        │
└──────────────────────────┼──────────────────────────────────┘
                           ↓
┌──────────────────────────┼──────────────────────────────────┐
│                    BACKEND (Express.js)                      │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │         /api/scraper/* Routes                       │    │
│  │         (routes/scraperAPI.js)                      │    │
│  │                                                     │    │
│  │  Endpoints:                                         │    │
│  │  • POST   /api/scraper/scan                        │    │
│  │  • GET    /api/scraper/scans                       │    │
│  │  • GET    /api/scraper/results/:id                 │    │
│  │  • GET    /api/scraper/all-credentials             │    │
│  │  • POST   /api/scraper/search                      │    │
│  │  • GET    /api/scraper/stats                       │    │
│  │  • DELETE /api/scraper/credential/:id              │    │
│  │                                                     │    │
│  │  Security: Admin Key Authentication                 │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  ┌────────────────────────────────────────────────────┐    │
│  │      Credential Scraper Service                     │    │
│  │      (services/credentialScraper.js)                │    │
│  │                                                     │    │
│  │  Core Functions:                                    │    │
│  │  • scrapeAll()        - Main orchestrator          │    │
│  │  • scrapeGitHub()     - GitHub API integration     │    │
│  │  • scrapePastebin()   - Pastebin scraping          │    │
│  │  • scrapeBreaches()   - HaveIBeenPwned API         │    │
│  │  • googleDorks()      - Generate search queries    │    │
│  │  • extractCredentials() - Pattern matching         │    │
│  │  • saveResults()      - Database storage           │    │
│  └────────────────────────────────────────────────────┘    │
│                          ↓                                   │
└──────────────────────────┼──────────────────────────────────┘
                           ↓
┌──────────────────────────┼──────────────────────────────────┐
│                   EXTERNAL SOURCES                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   GitHub     │  │  Pastebin    │  │ HaveIBeenPwned│     │
│  │     API      │  │   Scraper    │  │     API       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Google Dorks │  │   Pattern    │  │   Social     │     │
│  │   Queries    │  │   Matching   │  │    Media     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
                           ↓
┌──────────────────────────┼──────────────────────────────────┐
│                   DATABASE (PostgreSQL)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         scraped_credentials Table                   │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │ • id (primary key)                        │     │    │
│  │  │ • search_query                            │     │    │
│  │  │ • credential_type (email/password/etc)    │     │    │
│  │  │ • source (GitHub/Pastebin/etc)            │     │    │
│  │  │ • email, username, password               │     │    │
│  │  │ • api_key, token, domain, url             │     │    │
│  │  │ • raw_data, metadata (JSON)               │     │    │
│  │  │ • severity (critical/high/medium)         │     │    │
│  │  │ • verified, created_at, last_seen         │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         scraper_searches Table                      │    │
│  │  ┌──────────────────────────────────────────┐     │    │
│  │  │ • id (primary key)                        │     │    │
│  │  │ • search_input                            │     │    │
│  │  │ • search_type                             │     │    │
│  │  │ • results_count                           │     │    │
│  │  │ • status (pending/running/completed)      │     │    │
│  │  │ • started_at, completed_at                │     │    │
│  │  │ • admin_ip, metadata (JSON)               │     │    │
│  │  └──────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Scan Initiation
```
User → /scraper page → Enter search input → Click "Start Scan"
  ↓
POST /api/scraper/scan
  ↓
credentialScraper.scrapeAll()
```

### 2. Multi-Source Scraping
```
scrapeAll() orchestrates:
  ├─→ scrapeGitHub()      → GitHub API
  ├─→ scrapePastebin()    → Pastebin dumps
  ├─→ scrapeBreaches()    → HaveIBeenPwned
  └─→ googleDorks()       → Search queries
       ↓
  extractCredentials() → Pattern matching
       ↓
  saveResults() → Database
```

### 3. Result Display
```
Database → API Response → Frontend
  ↓
Results Tab shows:
  • Credential type
  • Source
  • Severity
  • Full details
  • Export option
```

## 🎯 Credential Detection Patterns

### Email Addresses
```regex
/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
```

### Passwords
```regex
/(?:password|passwd|pwd)[\s:=]+["']?([^\s"']+)["']?/gi
```

### API Keys
```regex
/(?:api[_-]?key|apikey)[\s:=]+["']?([a-zA-Z0-9_-]{20,})["']?/gi
```

### AWS Keys
```regex
/(AKIA[0-9A-Z]{16})/g
```

### GitHub Tokens
```regex
/(ghp_[a-zA-Z0-9]{36})/g
```

### Slack Tokens
```regex
/(xox[pboa]-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24})/g
```

### Stripe Keys
```regex
/(sk_live_[a-zA-Z0-9]{24})/g
```

### Private Keys
```regex
/-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g
```

## 🔐 Security Layers

### 1. Authentication
```
Admin Key Required:
  • Header: x-admin-key
  • Body: adminKey
  • Default: admin-scraper-2024
```

### 2. Authorization
```
All endpoints check:
  if (adminKey === process.env.ADMIN_SECRET_KEY) {
    // Allow access
  } else {
    // 403 Forbidden
  }
```

### 3. Rate Limiting
```
Inherited from main server:
  • DDoS protection
  • Bot detection
  • Request throttling
```

## 📊 Statistics Tracking

### Real-Time Metrics
```sql
-- Total credentials
SELECT COUNT(*) FROM scraped_credentials;

-- By type
SELECT credential_type, COUNT(*) 
FROM scraped_credentials 
GROUP BY credential_type;

-- By source
SELECT source, COUNT(*) 
FROM scraped_credentials 
GROUP BY source;

-- By severity
SELECT severity, COUNT(*) 
FROM scraped_credentials 
GROUP BY severity;
```

## 🚀 Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_scraped_email ON scraped_credentials(email);
CREATE INDEX idx_scraped_domain ON scraped_credentials(domain);
CREATE INDEX idx_scraped_source ON scraped_credentials(source);
CREATE INDEX idx_scraped_created ON scraped_credentials(created_at DESC);
```

### Async Operations
```javascript
// Parallel scraping
const results = await Promise.all([
  scrapeGitHub(query),
  scrapePastebin(query),
  scrapeBreaches(query),
  googleDorks(query)
]);
```

### Pagination
```javascript
// Large result sets
GET /api/scraper/all-credentials?page=1&limit=100
```

## 🎨 UI Components

### Scan Tab
- Search type selector
- Input field
- Start scan button
- Source list

### Results Tab
- Credential cards
- Severity badges
- Expandable details
- Export button

### History Tab
- Scan list
- Status indicators
- View results button
- Timestamps

### Database Tab
- All credentials
- Delete buttons
- Pagination
- Search filter

## 🔧 Integration Points

### Existing System
```
✅ No conflicts with existing routes
✅ Uses same database connection
✅ Follows same security patterns
✅ Independent module
```

### New Routes Added
```javascript
// server.js (line 165)
app.use('/api', require('./routes/scraperAPI'));
```

## 📈 Scalability

### Horizontal Scaling
- Stateless API design
- Database-backed storage
- No in-memory dependencies

### Vertical Scaling
- Async operations
- Connection pooling
- Indexed queries

### Data Management
- Pagination for large datasets
- Export functionality
- Delete old records

## 🎯 Use Cases

1. **Security Audits**
   - Find exposed credentials
   - Identify breaches
   - Monitor leaks

2. **Penetration Testing**
   - Discover API keys
   - Find passwords
   - Locate secrets

3. **Compliance**
   - Check for data leaks
   - Verify security
   - Audit exposure

4. **Research**
   - Analyze patterns
   - Study breaches
   - Track trends

---

**Architecture Status**: ✅ Complete
**Integration**: ✅ Seamless
**Security**: ✅ Admin-only
**Performance**: ✅ Optimized
