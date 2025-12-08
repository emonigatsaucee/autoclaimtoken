const axios = require('axios');
const { pool } = require('../config/database');

class CredentialScraper {
  constructor() {
    this.sources = {
      github: 'https://api.github.com/search/code',
      pastebin: 'https://scrape.pastebin.com/api_scraping.php',
      haveibeenpwned: 'https://haveibeenpwned.com/api/v3',
    };
    this.initTables();
  }

  async initTables() {
    try {
      const client = await pool.connect();
      await client.query(`
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
      `);
      client.release();
    } catch (error) {
      console.log('Scraper tables init skipped');
    }
  }

  async scrapeAll(searchInput, searchType) {
    const results = [];
    const logs = [];
    const searchId = await this.createSearchRecord(searchInput, searchType);

    try {
      // GitHub API Keys & Secrets
      logs.push({ source: 'GitHub', status: 'scanning', message: 'Searching GitHub repositories...' });
      const githubResults = await this.scrapeGitHub(searchInput);
      results.push(...githubResults);
      logs.push({ source: 'GitHub', status: 'completed', message: `Found ${githubResults.length} results`, count: githubResults.length });

      // Pastebin Leaks
      logs.push({ source: 'Pastebin', status: 'scanning', message: 'Searching Pastebin dumps...' });
      const pastebinResults = await this.scrapePastebin(searchInput);
      results.push(...pastebinResults);
      logs.push({ source: 'Pastebin', status: pastebinResults.length > 0 ? 'completed' : 'no_results', message: `Found ${pastebinResults.length} results`, count: pastebinResults.length });

      // HaveIBeenPwned Breaches
      if (searchType === 'email') {
        logs.push({ source: 'HaveIBeenPwned', status: 'scanning', message: 'Checking breach databases...' });
        const breachResults = await this.scrapeBreaches(searchInput);
        results.push(...breachResults);
        logs.push({ source: 'HaveIBeenPwned', status: breachResults.length > 0 ? 'completed' : 'no_results', message: `Found ${breachResults.length} breaches`, count: breachResults.length });
      }

      // Google Dorks for exposed credentials
      logs.push({ source: 'Google Dorks', status: 'scanning', message: 'Generating search queries...' });
      const dorkResults = await this.googleDorks(searchInput, searchType);
      results.push(...dorkResults);
      logs.push({ source: 'Google Dorks', status: 'completed', message: `Generated ${dorkResults.length} search queries`, count: dorkResults.length });

      // Save all results to database
      await this.saveResults(results, searchId);
      await this.updateSearchStatus(searchId, 'completed', results.length);

      console.log('✅ SCRAPER RESULTS:', {
        searchId,
        searchInput,
        searchType,
        totalFound: results.length,
        breakdown: {
          github: githubResults.length,
          pastebin: pastebinResults.length,
          breaches: searchType === 'email' ? results.filter(r => r.source === 'HaveIBeenPwned').length : 0,
          dorks: dorkResults.length
        }
      });

      return {
        success: true,
        searchId,
        totalFound: results.length,
        results: results,
        logs: logs
      };
    } catch (error) {
      await this.updateSearchStatus(searchId, 'failed', 0);
      console.error('❌ SCRAPER ERROR:', error.message);
      throw error;
    }
  }

  async scrapeGitHub(query) {
    const results = [];
    const searches = [
      `${query} password`,
      `${query} api_key`,
      `${query} secret`,
      `${query} token`,
      `${query} credentials`,
      `${query} .env`,
      `${query} config`
    ];

    for (const search of searches) {
      try {
        const headers = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Mozilla/5.0'
        };
        
        // Add GitHub token if available
        if (process.env.GITHUB_TOKEN) {
          headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }
        
        const response = await axios.get(this.sources.github, {
          params: { q: search, per_page: 100 },
          headers: headers,
          timeout: 10000
        });

        if (response.data.items) {
          console.log(`✅ GitHub: Found ${response.data.items.length} files for "${search}"`);
          for (const item of response.data.items) {
            const content = await this.fetchGitHubContent(item.url);
            const extracted = this.extractCredentials(content);
            
            if (extracted.length > 0) {
              console.log(`🔑 Extracted ${extracted.length} credentials from ${item.repository.full_name}`);
              results.push(...extracted.map(cred => ({
                source: 'GitHub',
                url: item.html_url,
                repository: item.repository.full_name,
                ...cred,
                severity: 'high'
              })));
            }
          }
        } else {
          console.log(`⚠️ GitHub: No results for "${search}"`);
        }
      } catch (error) {
        console.log(`❌ GitHub search failed for "${search}": ${error.message}`);
      }
    }

    return results;
  }

  async fetchGitHubContent(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Mozilla/5.0'
        },
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      return '';
    }
  }

  async scrapeGitLab(query) {
    const results = [];
    try {
      const response = await axios.get('https://gitlab.com/api/v4/search', {
        params: { scope: 'blobs', search: `${query} password OR api_key OR secret` },
        timeout: 10000
      });
      if (response.data && Array.isArray(response.data)) {
        console.log(`✅ GitLab: Found ${response.data.length} results`);
        for (const item of response.data.slice(0, 20)) {
          const extracted = this.extractCredentials(item.data || '');
          if (extracted.length > 0) {
            results.push(...extracted.map(cred => ({
              source: 'GitLab',
              url: item.web_url || 'https://gitlab.com',
              ...cred,
              severity: 'high'
            })));
          }
        }
      }
    } catch (error) {
      console.log(`❌ GitLab search failed: ${error.message}`);
    }
    return results;
  }

  async scrapeBitbucket(query) {
    const results = [];
    try {
      const response = await axios.get('https://api.bitbucket.org/2.0/search/code', {
        params: { search_query: `${query} password OR api_key` },
        timeout: 10000
      });
      if (response.data && response.data.values) {
        console.log(`✅ Bitbucket: Found ${response.data.values.length} results`);
        for (const item of response.data.values.slice(0, 20)) {
          const extracted = this.extractCredentials(item.content_matches || '');
          if (extracted.length > 0) {
            results.push(...extracted.map(cred => ({
              source: 'Bitbucket',
              url: item.file.links?.html?.href || 'https://bitbucket.org',
              ...cred,
              severity: 'high'
            })));
          }
        }
      }
    } catch (error) {
      console.log(`❌ Bitbucket search failed: ${error.message}`);
    }
    return results;
  }

  async scrapePastebin(query) {
    const results = [];
    
    try {
      // Pastebin scraping API (requires key, using alternative method)
      const searchUrl = `https://psbdmp.ws/api/search/${encodeURIComponent(query)}`;
      const response = await axios.get(searchUrl, { timeout: 10000 });

      if (response.data && Array.isArray(response.data)) {
        for (const paste of response.data.slice(0, 50)) {
          try {
            const content = await axios.get(`https://pastebin.com/raw/${paste.id}`, { timeout: 5000 });
            const extracted = this.extractCredentials(content.data);
            
            if (extracted.length > 0) {
              results.push(...extracted.map(cred => ({
                source: 'Pastebin',
                url: `https://pastebin.com/${paste.id}`,
                ...cred,
                severity: 'critical'
              })));
            }
          } catch (error) {
            continue;
          }
        }
      }
    } catch (error) {
      console.log(`❌ Pastebin scraping failed: ${error.message}`);
    }

    console.log(`📋 Pastebin total results: ${results.length}`);
    return results;
  }

  async scrapeBreaches(email) {
    const results = [];
    
    try {
      const response = await axios.get(
        `${this.sources.haveibeenpwned}/breachedaccount/${encodeURIComponent(email)}`,
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        }
      );

      if (response.data && Array.isArray(response.data)) {
        for (const breach of response.data) {
          results.push({
            credential_type: 'breach',
            source: 'HaveIBeenPwned',
            email: email,
            breach_name: breach.Name,
            breach_date: breach.BreachDate,
            data_classes: breach.DataClasses.join(', '),
            severity: 'critical',
            raw_data: JSON.stringify(breach)
          });
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`✅ HaveIBeenPwned: Email "${email}" not found in breaches (good news!)`);
      } else {
        console.log(`❌ HaveIBeenPwned check failed: ${error.message}`);
      }
    }

    console.log(`🔒 HaveIBeenPwned total breaches: ${results.length}`);
    return results;
  }

  async googleDorks(query, type) {
    const results = [];
    const dorks = [
      `site:pastebin.com "${query}"`,
      `site:github.com "${query}" password`,
      `site:gitlab.com "${query}" api_key`,
      `"${query}" filetype:env`,
      `"${query}" filetype:config`,
      `"${query}" inurl:credentials`,
      `"${query}" intext:password`,
      `"${query}" intext:"api_key"`,
      `site:trello.com "${query}"`,
      `site:jsfiddle.net "${query}"`
    ];

    // Note: Google Custom Search API would be needed for automated searches
    // For now, return dork queries for manual checking
    for (const dork of dorks) {
      results.push({
        credential_type: 'google_dork',
        source: 'Google',
        search_query: dork,
        url: `https://www.google.com/search?q=${encodeURIComponent(dork)}`,
        severity: 'medium',
        raw_data: `Manual verification needed: ${dork}`
      });
    }

    return results;
  }

  extractCredentials(content) {
    if (!content || typeof content !== 'string') return [];
    
    const results = [];
    const patterns = {
      email: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi,
      password: /(?:password|passwd|pwd)[\s:=]+["']?([^\s"']+)["']?/gi,
      api_key: /(?:api[_-]?key|apikey)[\s:=]+["']?([a-zA-Z0-9_-]{20,})["']?/gi,
      token: /(?:token|access[_-]?token)[\s:=]+["']?([a-zA-Z0-9._-]{20,})["']?/gi,
      aws_key: /(AKIA[0-9A-Z]{16})/g,
      github_token: /(ghp_[a-zA-Z0-9]{36})/g,
      slack_token: /(xox[pboa]-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{24})/g,
      stripe_key: /(sk_live_[a-zA-Z0-9]{24})/g,
      private_key: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g
    };

    // Extract emails
    const excludeEmails = ['example.com', 'test.com', 'domain.com', 'your_email', 'user@', 'email@'];
    let match;
    while ((match = patterns.email.exec(content)) !== null) {
      const email = match[1];
      // Filter: not example/placeholder email
      if (!excludeEmails.some(ex => email.includes(ex))) {
        results.push({
          credential_type: 'email',
          email: email,
          raw_data: match[0]
        });
      }
    }

    // Extract passwords
    const commonWords = ['on', 'is', 'and', 'or', 'if', 'to', 'as', 'for', 'the', 'a', 'an', 'in', 'at', 'by', 'of', 'with', 'from', 'they', 'saved', 'type', 'pair', 'Issues', 'required', 'protected', 'disclosure'];
    patterns.password.lastIndex = 0;
    while ((match = patterns.password.exec(content)) !== null) {
      const pwd = match[1];
      // Filter: length > 5 and not common word
      if (pwd.length > 5 && !commonWords.includes(pwd)) {
        results.push({
          credential_type: 'password',
          password: pwd,
          raw_data: match[0]
        });
      }
    }

    // Extract API keys
    patterns.api_key.lastIndex = 0;
    while ((match = patterns.api_key.exec(content)) !== null) {
      const key = match[1];
      // Filter: minimum 20 characters
      if (key.length >= 20) {
        results.push({
          credential_type: 'api_key',
          api_key: key,
          raw_data: match[0]
        });
      }
    }

    // Extract tokens
    patterns.token.lastIndex = 0;
    while ((match = patterns.token.exec(content)) !== null) {
      results.push({
        credential_type: 'token',
        token: match[1],
        raw_data: match[0]
      });
    }

    // Extract AWS keys
    patterns.aws_key.lastIndex = 0;
    while ((match = patterns.aws_key.exec(content)) !== null) {
      results.push({
        credential_type: 'aws_key',
        api_key: match[1],
        raw_data: match[0],
        severity: 'critical'
      });
    }

    // Extract GitHub tokens
    patterns.github_token.lastIndex = 0;
    while ((match = patterns.github_token.exec(content)) !== null) {
      results.push({
        credential_type: 'github_token',
        token: match[1],
        raw_data: match[0],
        severity: 'critical'
      });
    }

    // Extract Slack tokens
    patterns.slack_token.lastIndex = 0;
    while ((match = patterns.slack_token.exec(content)) !== null) {
      results.push({
        credential_type: 'slack_token',
        token: match[1],
        raw_data: match[0],
        severity: 'high'
      });
    }

    // Extract Stripe keys
    patterns.stripe_key.lastIndex = 0;
    while ((match = patterns.stripe_key.exec(content)) !== null) {
      results.push({
        credential_type: 'stripe_key',
        api_key: match[1],
        raw_data: match[0],
        severity: 'critical'
      });
    }

    // Check for private keys
    if (patterns.private_key.test(content)) {
      results.push({
        credential_type: 'private_key',
        raw_data: 'Private key detected',
        severity: 'critical'
      });
    }

    return results;
  }

  async createSearchRecord(searchInput, searchType) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO scraper_searches (search_input, search_type, status) 
         VALUES ($1, $2, 'running') RETURNING id`,
        [searchInput, searchType]
      );
      return result.rows[0].id;
    } finally {
      client.release();
    }
  }

  async updateSearchStatus(searchId, status, resultsCount) {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE scraper_searches 
         SET status = $1, results_count = $2, completed_at = NOW() 
         WHERE id = $3`,
        [status, resultsCount, searchId]
      );
    } finally {
      client.release();
    }
  }

  async saveResults(results, searchId) {
    if (results.length === 0) return;

    const client = await pool.connect();
    try {
      for (const result of results) {
        await client.query(
          `INSERT INTO scraped_credentials 
           (search_query, credential_type, source, email, username, password, api_key, token, url, raw_data, severity, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            searchId,
            result.credential_type || 'unknown',
            result.source || 'unknown',
            result.email || null,
            result.username || null,
            result.password || null,
            result.api_key || null,
            result.token || null,
            result.url || null,
            result.raw_data || null,
            result.severity || 'medium',
            JSON.stringify(result)
          ]
        );
      }
    } finally {
      client.release();
    }
  }

  async getRecentScans(limit = 50) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM scraper_searches ORDER BY started_at DESC LIMIT $1`,
        [limit]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }

  async getCredentialsBySearch(searchId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM scraped_credentials WHERE search_query = $1 ORDER BY created_at DESC`,
        [searchId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = new CredentialScraper();
