# Credential Scraper Setup Guide

## ✅ Installation Complete

The credential scraper has been successfully added to your system as a separate module.

## 🗄️ Database Setup

Run this SQL to create the required tables:

```bash
# Connect to your PostgreSQL database
psql -U your_username -d autoclaimtoken

# Run the setup file
\i database/scraper_data.sql
```

Or manually execute:
```sql
-- Copy and paste the contents of database/scraper_data.sql
```

## 🔑 Admin Access

**Admin Key:** `admin-scraper-2024`

You can change this in:
- Backend: `routes/scraperAPI.js` (line 7)
- Frontend: `pages/scraper.js` (line 23)

## 🌐 Access the Panel

**Local Development:**
```
http://localhost:3000/scraper
```

**Production (Vercel):**
```
https://your-domain.vercel.app/scraper
```

## 🚀 Features

### 1. Real-Time Scanning
- GitHub repositories (API keys, secrets, passwords)
- Pastebin dumps (leaked credentials)
- HaveIBeenPwned (data breach checks)
- Google dorks (exposed files)
- Social media leaks

### 2. Search Types
- Email addresses
- Usernames
- Domains
- Company names
- GitHub usernames
- Keywords

### 3. Credential Types Detected
- Emails
- Passwords
- API keys (AWS, Stripe, etc.)
- Tokens (GitHub, Slack, etc.)
- Private keys
- Database credentials
- OAuth tokens

### 4. Data Management
- View all scraped credentials
- Search and filter results
- Export to JSON
- Delete individual records
- Real-time statistics

## 📊 API Endpoints

All endpoints require `x-admin-key` header or `adminKey` in body.

### Start Scan
```bash
POST /api/scraper/scan
{
  "searchInput": "example@email.com",
  "searchType": "email",
  "adminKey": "admin-scraper-2024"
}
```

### Get Recent Scans
```bash
GET /api/scraper/scans?limit=20
Headers: x-admin-key: admin-scraper-2024
```

### Get Scan Results
```bash
GET /api/scraper/results/:searchId
Headers: x-admin-key: admin-scraper-2024
```

### Get All Credentials
```bash
GET /api/scraper/all-credentials?page=1&limit=100
Headers: x-admin-key: admin-scraper-2024
```

### Search Credentials
```bash
POST /api/scraper/search
{
  "query": "example.com",
  "type": "domain",
  "adminKey": "admin-scraper-2024"
}
```

### Get Statistics
```bash
GET /api/scraper/stats
Headers: x-admin-key: admin-scraper-2024
```

### Delete Credential
```bash
DELETE /api/scraper/credential/:id
Headers: x-admin-key: admin-scraper-2024
```

## 🔒 Security

- Admin-only access with secret key
- Private panel (not linked from main site)
- All data stored in secure database
- No public exposure of scraped data

## 🎯 Usage Tips

1. **Email Scanning**: Best for finding breached accounts
2. **Domain Scanning**: Find all credentials related to a company
3. **GitHub Scanning**: Discover exposed API keys in repos
4. **Keyword Scanning**: Broad search for specific terms

## 📝 Database Tables

### scraped_credentials
Stores all found credentials with:
- Credential type (email, password, api_key, etc.)
- Source (GitHub, Pastebin, etc.)
- Severity level (critical, high, medium)
- Full metadata and raw data

### scraper_searches
Tracks all scan operations with:
- Search input and type
- Results count
- Status (pending, running, completed, failed)
- Timestamps

## 🔧 Customization

### Add More Sources
Edit `services/credentialScraper.js` and add new scraping methods.

### Change Admin Key
Update in both:
- `routes/scraperAPI.js`
- `frontend/pages/scraper.js`

### Adjust Rate Limits
Modify timeout values in `credentialScraper.js` for faster/slower scanning.

## ⚠️ Important Notes

- This is a REAL scraper - it makes actual API calls
- GitHub API has rate limits (60 requests/hour without auth)
- Some sources may require API keys for full access
- Always comply with terms of service and legal requirements
- Use responsibly and ethically

## 🚀 Deployment

The scraper is already integrated into your existing deployment:

1. **Backend**: Already added to `server.js`
2. **Frontend**: New page at `/scraper`
3. **Database**: Run the SQL setup file

No changes needed to your existing code!

## 📞 Support

Access the scraper panel and start scanning immediately. All results are saved to your database for future reference.

---

**Status**: ✅ Ready to use
**Impact**: Zero changes to existing functionality
**Access**: Admin-only with secret key
