import { useState, useEffect } from 'react';
import { Search, Database, AlertTriangle, CheckCircle, XCircle, Loader, Eye, Trash2, Download } from 'lucide-react';

export default function ScraperPanel() {
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

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoclaimtoken.onrender.com';

  const authenticate = () => {
    if (adminKey === 'admin-scraper-2024' || adminKey === process.env.NEXT_PUBLIC_ADMIN_KEY) {
      setAuthenticated(true);
      loadStats();
      loadRecentScans();
    } else {
      alert('Invalid admin key');
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scraper/stats`, {
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
      const response = await fetch(`${API_URL}/api/scraper/scans?limit=20`, {
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
      const response = await fetch(`${API_URL}/api/scraper/all-credentials?limit=200`, {
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

    try {
      const response = await fetch(`${API_URL}/api/scraper/scan`, {
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
        loadStats();
        loadRecentScans();
        alert(`Scan completed! Found ${data.totalFound} credentials`);
      } else {
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
    try {
      const response = await fetch(`${API_URL}/api/scraper/results/${searchId}`, {
        headers: { 'x-admin-key': adminKey }
      });
      const data = await response.json();
      if (data.success) {
        setResults(data.credentials);
        setActiveTab('results');
      }
    } catch (error) {
      console.error('Failed to load results:', error);
    }
  };

  const deleteCredential = async (id) => {
    if (!confirm('Delete this credential?')) return;

    try {
      const response = await fetch(`${API_URL}/api/scraper/credential/${id}`, {
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

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scraper-results-${Date.now()}.json`;
    link.click();
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
            <h1 className="text-3xl font-bold text-white mb-2">Credential Scraper</h1>
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
              <h1 className="text-3xl font-bold text-white mb-2">Credential Scraper Panel</h1>
              <p className="text-gray-400">Real-time credential discovery across multiple sources</p>
            </div>
            <Database className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['scan', 'results', 'history', 'database'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Scan Tab */}
        {activeTab === 'scan' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Start New Scan</h2>
            
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

            <div className="mt-4 text-sm text-gray-400">
              <p className="mb-2">Sources scanned:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>GitHub repositories (API keys, secrets, passwords)</li>
                <li>Pastebin dumps (leaked credentials)</li>
                <li>HaveIBeenPwned (data breaches)</li>
                <li>Google dorks (exposed files)</li>
                <li>Social media leaks</li>
              </ul>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Scan Results ({results.length})</h2>
              {results.length > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
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
                      <div className="flex items-center gap-2">
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
                      </div>
                      <button
                        onClick={() => setSelectedResult(selectedResult === index ? null : index)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>

                    {selectedResult === index && (
                      <div className="mt-3 p-3 bg-gray-900 rounded text-sm">
                        {result.email && <div className="mb-1"><span className="text-gray-400">Email:</span> <span className="text-white">{result.email}</span></div>}
                        {result.username && <div className="mb-1"><span className="text-gray-400">Username:</span> <span className="text-white">{result.username}</span></div>}
                        {result.password && <div className="mb-1"><span className="text-gray-400">Password:</span> <span className="text-white">{result.password}</span></div>}
                        {result.api_key && <div className="mb-1"><span className="text-gray-400">API Key:</span> <span className="text-white font-mono text-xs">{result.api_key}</span></div>}
                        {result.token && <div className="mb-1"><span className="text-gray-400">Token:</span> <span className="text-white font-mono text-xs">{result.token}</span></div>}
                        {result.url && <div className="mb-1"><span className="text-gray-400">URL:</span> <a href={result.url} target="_blank" className="text-purple-400 hover:underline break-all">{result.url}</a></div>}
                        {result.raw_data && <div className="mt-2"><span className="text-gray-400">Raw:</span> <pre className="text-white text-xs mt-1 overflow-x-auto">{result.raw_data}</pre></div>}
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
            <h2 className="text-2xl font-bold text-white mb-4">All Credentials ({allCredentials.length})</h2>
            
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
