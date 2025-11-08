import { useState } from 'react';
import { Shield, Zap, TrendingUp, Users, Brain, Lock, Coins, Target } from 'lucide-react';
import WalletConnection from '../components/WalletConnection';
import TokenScanner from '../components/TokenScanner';
import RecoveryAnalyzer from '../components/RecoveryAnalyzer';

export default function Home() {
  const [user, setUser] = useState(null);
  const [scanResults, setScanResults] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnectionChange = (userData) => {
    setUser(userData);
    if (userData) {
      setIsConnected(true);
      setAddress('0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b');
    } else {
      setIsConnected(false);
      setAddress('');
      setScanResults(null);
      setAnalysisResults(null);
    }
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Automated Discovery",
      description: "Scan 5+ blockchains simultaneously for claimable tokens and forgotten assets"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Smart Recovery",
      description: "AI-powered analysis with 75-90% success rates using multiple recovery methods"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Non-Custodial",
      description: "You maintain full control of your funds throughout the entire process"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Success-Only Fees",
      description: "Pay only when we successfully recover your funds - no upfront costs"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">CryptoRecover</h1>
                <p className="text-xs text-gray-500 font-medium">Professional Asset Recovery</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {isConnected && user && (
                <div className="hidden md:flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">${user.totalRecovered || '0.00'}</div>
                    <div className="text-xs text-gray-500">Total Recovered</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">{user.successRate || '0'}%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
              )}
              <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Live Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          <div className="space-y-12">
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative px-8 py-16 text-center">
                  <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 bg-yellow-400 text-black px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>TRUSTED BY 50,000+ USERS WORLDWIDE</span>
                    </div>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    Recover Your
                    <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                      Lost Crypto
                    </span>
                  </h1>
                  
                  <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto font-medium">
                    Professional asset recovery service powered by advanced blockchain forensics.
                    We've recovered over <span className="text-yellow-400 font-bold">$47.2 Million</span> in lost cryptocurrency.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-black text-yellow-400 mb-2">89.7%</div>
                      <div className="text-sm font-medium">Success Rate</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-black text-green-400 mb-2">$47.2M</div>
                      <div className="text-sm font-medium">Assets Recovered</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="text-3xl font-black text-blue-400 mb-2">24/7</div>
                      <div className="text-sm font-medium">Expert Support</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-lg text-sm font-bold border border-white/30 shadow-lg">
                      <span className="text-green-400 mr-2">•</span>NO UPFRONT FEES
                    </div>
                    <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-lg text-sm font-bold border border-white/30 shadow-lg">
                      <span className="text-blue-400 mr-2">•</span>50+ BLOCKCHAINS
                    </div>
                    <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-lg text-sm font-bold border border-white/30 shadow-lg">
                      <span className="text-yellow-400 mr-2">•</span>INSTITUTIONAL GRADE
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 text-white py-8">
                <div className="max-w-6xl mx-auto px-8">
                  <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm mb-4">TRUSTED BY LEADING CRYPTO PLATFORMS</p>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://public.bnbstatic.com/static/images/common/logo.png" alt="Binance" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://images.ctfassets.net/q5ulk4bp65r7/3TBS4oVkD1ghowTqVQJlqj/2dfd4ea3b623a7c0d8deb2ff445dee9e/Consumer_Wordmark.svg" alt="Coinbase" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://assets.kraken.com/marketing/web/icons/nav-kraken-logo.svg" alt="Kraken" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://static.okx.com/cdn/assets/imgs/MjAyMTA0/6EABC5C8E2E5C6A5B5E5C6A5B5E5C6A5.png" alt="OKX" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://static.bybit.com/web/v2/common/logo/bybit-logo.svg" alt="Bybit" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img src="https://assets.kucoin.com/kcs/kucoin-logo.svg" alt="KuCoin" className="h-8 opacity-70 hover:opacity-100 transition-opacity" />
                      <div className="text-xs text-gray-500">Exchange</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white py-20">
              <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-black text-gray-900 mb-4">Why Choose Our Recovery Service?</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">Industry-leading technology and expertise trusted by crypto professionals worldwide</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <div key={index} className="group relative bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-gray-100 hover:border-blue-200">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                          <div className="text-white">{feature.icon}</div>
                        </div>
                        <h3 className="text-xl font-black mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <WalletConnection onConnectionChange={handleConnectionChange} />
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h4 className="font-semibold">Connect Wallet</h4>
                  <p className="text-sm text-gray-600">
                    Securely connect your wallet using signature verification
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h4 className="font-semibold">Scan & Analyze</h4>
                  <p className="text-sm text-gray-600">
                    AI scans multiple blockchains for recoverable assets
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h4 className="font-semibold">Recover Funds</h4>
                  <p className="text-sm text-gray-600">
                    Automated recovery with success-only 15% fee
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Dashboard</h2>
                  <p className="text-gray-600">
                    Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <WalletConnection onConnectionChange={handleConnectionChange} />
              </div>
              
              {user && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {user.totalRecovered || '0.00'}
                    </div>
                    <div className="text-sm text-blue-700">Total Recovered (ETH)</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {user.successRate || '0'}%
                    </div>
                    <div className="text-sm text-green-700">Success Rate</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {scanResults?.summary.totalTokens || '0'}
                    </div>
                    <div className="text-sm text-purple-700">Tokens Found</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      ${scanResults?.summary.totalValue || '0.00'}
                    </div>
                    <div className="text-sm text-yellow-700">Est. Value</div>
                  </div>
                </div>
              )}
            </div>

            <TokenScanner 
              walletAddress={address} 
              onScanComplete={setScanResults}
            />

            <RecoveryAnalyzer 
              walletAddress={address} 
              onAnalysisComplete={setAnalysisResults}
            />
          </div>
        )}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 CryptoRecover. Professional blockchain asset recovery services.</p>
            <p className="text-sm mt-2">
              Non-custodial • Success-only fees • Multi-chain support
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}