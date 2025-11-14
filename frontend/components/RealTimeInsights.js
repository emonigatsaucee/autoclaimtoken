import { useState, useEffect } from 'react';
import { Activity, TrendingUp, Clock, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function RealTimeInsights({ walletAddress }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      loadInsights();
    }
  }, [walletAddress]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/real-time-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });
      const data = await response.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Insights error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100">
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Real-Time Insights</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
        >
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Key Metrics - Mobile Responsive */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm text-blue-700">Transactions</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-900">
            {insights.totalTransactions || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="text-xs sm:text-sm text-green-700">Portfolio</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-green-900">
            ${insights.portfolioValue?.toFixed(2) || '0.00'}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs sm:text-sm text-purple-700">Chains</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-900">
            {insights.activeChains || 0}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 sm:p-4">
          <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <span className="text-xs sm:text-sm text-orange-700">Activity</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-orange-900">
            {insights.lastActivity || 'N/A'}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Recent Transactions</h3>
        <div className="space-y-2">
          {insights.recentTransactions && insights.recentTransactions.length > 0 ? (
            insights.recentTransactions.slice(0, 5).map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {tx.type === 'in' ? (
                      <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {tx.type === 'in' ? 'Received' : 'Sent'} {tx.symbol || 'ETH'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 truncate">{tx.chain || 'Ethereum'}</div>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className={`font-bold text-sm sm:text-base ${tx.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'in' ? '+' : '-'}{tx.amount || '0.00'}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{tx.timestamp || 'Just now'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
              No recent transactions found
            </div>
          )}
        </div>
      </div>

      {/* Token Holdings */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Top Token Holdings</h3>
        <div className="space-y-2">
          {insights.topHoldings && insights.topHoldings.length > 0 ? (
            insights.topHoldings.slice(0, 5).map((holding, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm sm:text-base truncate">{holding.symbol || 'Unknown'}</div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">{holding.name || 'Token'}</div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <div className="font-bold text-gray-900 text-sm sm:text-base">{holding.balance || '0.00'}</div>
                  <div className="text-xs sm:text-sm text-gray-600">${holding.valueUSD?.toFixed(2) || '0.00'}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
              No token holdings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

