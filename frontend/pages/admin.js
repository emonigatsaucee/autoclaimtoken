import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function AdminScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [scanCount, setScanCount] = useState(100);
  const [minBalance, setMinBalance] = useState(0.001);
  const [adminStats, setAdminStats] = useState(null);

  const loadAdminStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`);
      const data = await response.json();
      setAdminStats(data);
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    }
  };

  const startScan = async () => {
    setScanning(true);
    setResults(null);
    
    // Load stats before scan
    await loadAdminStats();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/scan-real-wallets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scanCount, minBalance })
      });
      
      const data = await response.json();
      setResults(data);
      
    } catch (error) {
      console.error('Scan failed:', error);
      setResults({ error: error.message });
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    loadAdminStats();
  }, []);

  return (
    <>
      <Head>
        <title>Admin Wallet Scanner - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              🔍 Admin Wallet Scanner
            </h1>
            <p className="text-gray-300 text-lg">
              Discover real wallets with funds for marketing examples
            </p>
          </div>

          {/* Admin Stats */}
          {adminStats && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">📊 Admin Recovery Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-300">{adminStats.totalWalletsScanned?.toLocaleString() || 0}</div>
                  <div className="text-blue-200">Total Scanned</div>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-300">{adminStats.walletsWithFunds?.toLocaleString() || 0}</div>
                  <div className="text-green-200">With Funds</div>
                </div>
                <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-300">${adminStats.totalValueFound?.toFixed(2) || '0.00'}</div>
                  <div className="text-purple-200">Total Value</div>
                </div>
                <div className="bg-yellow-500/20 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-300">{adminStats.successRate || '0.00'}%</div>
                  <div className="text-yellow-200">Success Rate</div>
                </div>
              </div>
            </div>
          )}

          {/* Scanner Controls */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Scanner Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Wallets to Scan
                </label>
                <input
                  type="number"
                  value={scanCount}
                  onChange={(e) => setScanCount(parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300"
                  min="10"
                  max="1000"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Minimum Balance (USD)
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={minBalance}
                  onChange={(e) => setMinBalance(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={startScan}
                  disabled={scanning}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {scanning ? '🔍 Scanning...' : '🚀 Start Scan'}
                </button>
              </div>
            </div>
            
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-200 text-sm">
                <strong>⚠️ Admin Use Only:</strong> This scanner finds real wallets with actual cryptocurrency. 
                Use discovered wallets responsibly for marketing examples and social media promotion.
              </p>
            </div>
          </div>

          {/* Scanning Progress */}
          {scanning && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-white mb-2">Scanning Wallets...</h3>
                <p className="text-gray-300">
                  Checking {scanCount} random wallets for real funds across Ethereum, BSC, and more...
                </p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && !results.error && (
            <div className="space-y-6">
              
              {/* Summary */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">📊 Scan Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-300">{results.summary.totalScanned}</div>
                    <div className="text-blue-200">Wallets Scanned</div>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-300">{results.summary.walletsWithFunds}</div>
                    <div className="text-green-200">Wallets with Funds</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-300">${results.summary.totalValueFound.toFixed(2)}</div>
                    <div className="text-purple-200">Total Value Found</div>
                  </div>
                </div>
              </div>

              {/* Found Wallets */}
              {results.foundWallets.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">💰 Wallets with Funds</h2>
                  <div className="space-y-4">
                    {results.foundWallets.map((wallet, index) => (
                      <div key={index} className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-bold text-green-300 mb-2">Wallet #{index + 1}</h3>
                            <p className="text-sm text-gray-300 mb-1">
                              <strong>Address:</strong> {wallet.address}
                            </p>
                            <p className="text-sm text-gray-300 mb-1">
                              <strong>Phrase:</strong> {wallet.phrase}
                            </p>
                            <p className="text-sm text-green-300">
                              <strong>Total Value:</strong> ${wallet.totalValueUSD.toFixed(2)} USD
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-2">Balance Breakdown:</h4>
                            {wallet.ethBalance > 0 && (
                              <p className="text-sm text-gray-300">ETH: {wallet.ethBalance} (${(wallet.ethBalance * 3000).toFixed(2)})</p>
                            )}
                            {wallet.tokens.map((token, i) => (
                              <p key={i} className="text-sm text-gray-300">
                                {token.symbol}: {token.balance} (${token.usdValue.toFixed(2)})
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marketing Tips */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">📱 Marketing Usage</h2>
                <div className="space-y-3 text-gray-300">
                  <p>• Use found wallets as <strong>real recovery examples</strong> on social media</p>
                  <p>• Show <strong>actual balance screenshots</strong> to prove legitimacy</p>
                  <p>• Create <strong>before/after posts</strong> demonstrating successful recoveries</p>
                  <p>• Share <strong>wallet addresses</strong> for users to verify on blockchain explorers</p>
                  <p>• Use for <strong>testimonials</strong> and success stories</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {results?.error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-300">
                <strong>Error:</strong> {results.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}