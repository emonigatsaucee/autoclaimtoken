import { useState } from 'react';
import { Activity, TrendingUp, Layers, Zap, DollarSign, Shield } from 'lucide-react';

export default function UniqueFeatures({ walletAddress }) {
  const [activeTab, setActiveTab] = useState('gas');
  const [loading, setLoading] = useState(false);
  const [gasAnalysis, setGasAnalysis] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [aggregatedAssets, setAggregatedAssets] = useState(null);

  const loadGasAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/analyze-gas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await response.json();
      if (data.success) {
        setGasAnalysis(data.gasAnalysis);
      }
    } catch (error) {
      console.error('Gas analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHealthScore = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/portfolio-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await response.json();
      if (data.success) {
        setHealthScore(data.healthReport);
      }
    } catch (error) {
      console.error('Health score error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAggregatedAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/aggregate-assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await response.json();
      if (data.success) {
        setAggregatedAssets(data);
      }
    } catch (error) {
      console.error('Asset aggregation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'gas' && !gasAnalysis) loadGasAnalysis();
    if (tab === 'health' && !healthScore) loadHealthScore();
    if (tab === 'assets' && !aggregatedAssets) loadAggregatedAssets();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Unique Portfolio Insights</h2>

      {/* Tabs - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-6 sm:border-b border-gray-200">
        <button
          onClick={() => handleTabChange('gas')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors rounded-lg sm:rounded-none ${
            activeTab === 'gas'
              ? 'bg-blue-600 text-white sm:bg-transparent sm:text-blue-600 sm:border-b-2 sm:border-blue-600'
              : 'bg-gray-100 text-gray-600 sm:bg-transparent hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm sm:text-base">Gas Tracker</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange('health')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors rounded-lg sm:rounded-none ${
            activeTab === 'health'
              ? 'bg-blue-600 text-white sm:bg-transparent sm:text-blue-600 sm:border-b-2 sm:border-blue-600'
              : 'bg-gray-100 text-gray-600 sm:bg-transparent hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm sm:text-base">Health Score</span>
          </div>
        </button>
        <button
          onClick={() => handleTabChange('assets')}
          className={`px-3 sm:px-4 py-2 font-medium transition-colors rounded-lg sm:rounded-none ${
            activeTab === 'assets'
              ? 'bg-blue-600 text-white sm:bg-transparent sm:text-blue-600 sm:border-b-2 sm:border-blue-600'
              : 'bg-gray-100 text-gray-600 sm:bg-transparent hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm sm:text-base">Cross-Chain</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Gas Analysis Tab */}
        {activeTab === 'gas' && gasAnalysis && !loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-orange-700 mb-1">Total Gas Spent</div>
                <div className="text-xl sm:text-2xl font-bold text-orange-900">
                  {gasAnalysis.totalGasSpent.toFixed(4)} ETH
                </div>
                <div className="text-xs sm:text-sm text-orange-600">
                  ${gasAnalysis.totalGasSpentUSD.toFixed(2)} USD
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4">
                <div className="text-xs sm:text-sm text-blue-700 mb-1">Transactions</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-900">
                  {gasAnalysis.transactionCount}
                </div>
                <div className="text-xs sm:text-sm text-blue-600">
                  Avg: {gasAnalysis.avgGasPrice.toFixed(6)} ETH
                </div>
              </div>
            </div>

            {gasAnalysis.optimizationSuggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h4 className="font-bold text-yellow-900 mb-2">💡 Optimization Tips</h4>
                {gasAnalysis.optimizationSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="text-sm text-yellow-800 mb-2">
                    <div className="font-medium">{suggestion.title}</div>
                    <div>{suggestion.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Health Score Tab */}
        {activeTab === 'health' && healthScore && !loading && (
          <div className="space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white mb-3 sm:mb-4">
                <div className="text-3xl sm:text-4xl font-black">{healthScore.overallScore}</div>
              </div>
              <div className="text-base sm:text-lg font-bold text-gray-900">Portfolio Health Score</div>
              <div className="text-xs sm:text-sm text-gray-600">Out of 100</div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                <div className="text-xs text-blue-700 mb-1">Diversification</div>
                <div className="text-lg sm:text-xl font-bold text-blue-900">
                  {healthScore.scoreBreakdown.diversification}/25
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                <div className="text-xs text-green-700 mb-1">Activity</div>
                <div className="text-lg sm:text-xl font-bold text-green-900">
                  {healthScore.scoreBreakdown.activity}/25
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
                <div className="text-xs text-purple-700 mb-1">Security</div>
                <div className="text-lg sm:text-xl font-bold text-purple-900">
                  {healthScore.scoreBreakdown.security}/25
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-2 sm:p-3">
                <div className="text-xs text-orange-700 mb-1">Efficiency</div>
                <div className="text-lg sm:text-xl font-bold text-orange-900">
                  {healthScore.scoreBreakdown.efficiency}/25
                </div>
              </div>
            </div>

            {healthScore.recommendations.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold text-blue-900 mb-3">📋 Recommendations</h4>
                {healthScore.recommendations.map((rec, idx) => (
                  <div key={idx} className="mb-3 last:mb-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {rec.priority}
                      </span>
                      <span className="font-medium text-blue-900">{rec.category}</span>
                    </div>
                    <div className="text-sm text-blue-800">{rec.suggestion}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cross-Chain Assets Tab */}
        {activeTab === 'assets' && aggregatedAssets && !loading && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 mb-4">
              <div className="text-xs sm:text-sm text-purple-700 mb-1">Total Portfolio Value</div>
              <div className="text-2xl sm:text-3xl font-black text-purple-900">
                ${aggregatedAssets.assets.totalValueUSD.toFixed(2)}
              </div>
              <div className="text-xs sm:text-sm text-purple-600 mt-1">
                Across {aggregatedAssets.assets.summary.totalChains} chains
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-900 text-sm sm:text-base">Chain Distribution</h4>
              {aggregatedAssets.assets.nativeBalances.map((balance, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{balance.chain}</div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{balance.balance.toFixed(4)} {balance.symbol}</div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-bold text-gray-900 text-sm sm:text-base">${balance.valueUSD.toFixed(2)}</div>
                    <div className="text-xs text-gray-600">
                      {((balance.valueUSD / aggregatedAssets.assets.totalValueUSD) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {aggregatedAssets.bridgeOpportunities.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h4 className="font-bold text-green-900 mb-2">🌉 Bridge Opportunities</h4>
                {aggregatedAssets.bridgeOpportunities.map((opp, idx) => (
                  <div key={idx} className="text-sm text-green-800 mb-2">
                    <div className="font-medium">{opp.from} → {opp.to}</div>
                    <div>{opp.reason}</div>
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


