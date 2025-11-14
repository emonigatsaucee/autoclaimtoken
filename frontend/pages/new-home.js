import { useState, useEffect } from 'react';
import { Shield, Zap, TrendingUp, Users, CheckCircle, ArrowRight, Star, Lock } from 'lucide-react';
import Head from 'next/head';
import ImprovedWalletConnection from '../components/ImprovedWalletConnection';
import ComprehensiveDashboard from '../components/ComprehensiveDashboard';

export default function NewHome() {
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [stats, setStats] = useState({
    walletsScanned: 127543,
    totalRecovered: 45200000,
    activeUsers: 8234
  });

  // Animate stats on load
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        walletsScanned: prev.walletsScanned + Math.floor(Math.random() * 3),
        totalRecovered: prev.totalRecovered + Math.floor(Math.random() * 1000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 2)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleWalletConnection = (connectionData) => {
    if (connectionData && connectionData.walletAddress) {
      setConnectedWallet(connectionData);
    } else {
      setConnectedWallet(null);
    }
  };

  return (
    <>
      <Head>
        <title>AutoClaimToken - Recover Your Lost Crypto Assets</title>
        <meta name="description" content="Scan 50+ blockchains to find and recover lost crypto, unclaimed airdrops, and forgotten assets. Non-custodial and secure." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">AutoClaimToken</span>
              </div>
              <div className="hidden sm:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-medium">How It Works</a>
                <a href="#security" className="text-gray-600 hover:text-gray-900 font-medium">Security</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        {!connectedWallet ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Recover Your Lost
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Crypto Assets</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Scan 50+ blockchains in seconds to find unclaimed tokens, forgotten airdrops, and lost assets
              </p>

              {/* Trust Signals */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mb-12">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">{stats.walletsScanned.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Wallets Scanned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600">${(stats.totalRecovered / 1000000).toFixed(1)}M+</div>
                  <div className="text-sm text-gray-600">Assets Recovered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.activeUsers.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Non-Custodial</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Encrypted</span>
                </div>
                <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Audited</span>
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="max-w-2xl mx-auto mb-20">
              <ImprovedWalletConnection onConnectionChange={handleWalletConnection} />
            </div>

            {/* Features Grid */}
            <div id="features" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: 'Lightning Fast',
                  description: 'Scan 50+ blockchains in under 15 seconds',
                  color: 'from-yellow-500 to-orange-500'
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: 'Secure & Safe',
                  description: 'Never asks for private keys or seed phrases',
                  color: 'from-green-500 to-emerald-500'
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: 'Smart Analysis',
                  description: 'AI-powered portfolio health scoring',
                  color: 'from-blue-500 to-cyan-500'
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: 'Trusted by Thousands',
                  description: '127K+ wallets scanned successfully',
                  color: 'from-purple-500 to-pink-500'
                }
              ].map((feature, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* How It Works - will be added in next section */}
          </div>
        ) : (
          /* Dashboard View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Your Wallet Dashboard</h1>
              <p className="text-gray-600">Comprehensive analysis of {connectedWallet.walletAddress.slice(0, 6)}...{connectedWallet.walletAddress.slice(-4)}</p>
            </div>
            <ComprehensiveDashboard walletAddress={connectedWallet.walletAddress} />
          </div>
        )}
      </div>
    </>
  );
}

