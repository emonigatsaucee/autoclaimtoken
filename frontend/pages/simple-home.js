import { useState } from 'react';
import { Shield, Search, Wallet, TrendingUp, Lock, Zap } from 'lucide-react';
import Head from 'next/head';

export default function SimpleHome() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Connect, 2: Scan, 3: Results

  const handleScan = async () => {
    if (!walletAddress) {
      alert('Please enter a wallet address');
      return;
    }

    setIsScanning(true);
    setCurrentStep(2);

    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/scan-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      const data = await response.json();

      if (data.success) {
        setScanResults(data);
        setCurrentStep(3);
      } else {
        alert(data.error || 'Scan failed');
        setCurrentStep(1);
      }
    } catch (error) {
      alert('Failed to scan wallet: ' + error.message);
      setCurrentStep(1);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <>
      <Head>
        <title>CryptoRecover - Simple Blockchain Asset Scanner</title>
        <meta name="description" content="Scan your crypto wallet across 50+ blockchains to find claimable tokens and forgotten assets" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header - Mobile Responsive */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">CryptoRecover</h1>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>100% Non-Custodial</span>
              </div>
              <div className="sm:hidden">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - Mobile Responsive */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3 sm:mb-4 px-2">
              Find Your Hidden Crypto Assets
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Scan your wallet across 50+ blockchains to discover claimable tokens, staking rewards, and forgotten assets
            </p>
          </div>

          {/* Features - Mobile Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Real-Time Scanning</h3>
              <p className="text-sm sm:text-base text-gray-600">Live blockchain data across Ethereum, BSC, Polygon, and 47 more networks</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">100% Safe</h3>
              <p className="text-sm sm:text-base text-gray-600">Non-custodial - we never ask for private keys or seed phrases</p>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Simple & Fast</h3>
              <p className="text-sm sm:text-base text-gray-600">Just enter your wallet address and get results in seconds</p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="font-medium">Enter Address</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="font-medium">Scan Blockchain</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>3</div>
                <span className="font-medium">View Results</span>
              </div>
            </div>
          </div>

          {/* Scanner Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl mx-auto border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Wallet className="w-8 h-8 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Scan Your Wallet</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isScanning}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter any Ethereum-compatible wallet address (0x...)
                </p>
              </div>

              <button
                onClick={handleScan}
                disabled={isScanning || !walletAddress}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning Blockchains...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Start Scan</span>
                  </>
                )}
              </button>
            </div>

            {/* Results */}
            {scanResults && currentStep === 3 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Scan Results</h4>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-sm text-blue-700 mb-1">Tokens Found</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {scanResults.summary?.totalTokens || 0}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-sm text-green-700 mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-green-900">
                      ${scanResults.summary?.totalValue || '0.00'}
                    </div>
                  </div>
                </div>

                {scanResults.results && scanResults.results.length > 0 ? (
                  <div className="space-y-3">
                    {scanResults.results.slice(0, 5).map((token, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <div className="font-bold text-gray-900">{token.tokenSymbol || 'Unknown'}</div>
                          <div className="text-sm text-gray-600">{token.chainName || 'Ethereum'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{parseFloat(token.amount || 0).toFixed(4)}</div>
                          <div className="text-sm text-gray-600">${parseFloat(token.valueUSD || 0).toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tokens found in this wallet
                  </div>
                )}

                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setScanResults(null);
                    setWalletAddress('');
                  }}
                  className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
                >
                  Scan Another Wallet
                </button>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">Trusted by crypto users worldwide</p>
            <div className="flex justify-center items-center space-x-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">Non-Custodial</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Fast</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-500">
              <p>© 2024 CryptoRecover. All rights reserved.</p>
              <p className="mt-2">We never ask for private keys or seed phrases.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

