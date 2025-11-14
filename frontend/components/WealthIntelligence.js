import { useState } from 'react';
import { Brain, TrendingUp, PieChart } from 'lucide-react';

export default function WealthIntelligence({ walletAddress }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!walletAddress) return;

    setIsAnalyzing(true);
    setError('');

    try {
      // Call real API for portfolio analysis
      const response = await fetch('https://autoclaimtoken.onrender.com/api/analyze-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to analyze portfolio');
      }
    } catch (err) {
      setError('Failed to analyze portfolio: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Wealth Intelligence</h2>
          <p className="text-gray-600 text-sm">
            AI-powered portfolio analysis and optimization
          </p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={!walletAddress || isAnalyzing}
          className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          <Brain size={16} className="inline mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Portfolio'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing portfolio across all chains...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${analysis.portfolioValue}
              </div>
              <div className="text-sm text-blue-700">Total Portfolio</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysis.riskScore}/100
              </div>
              <div className="text-sm text-green-700">Risk Score</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysis.optimizationSuggestions.length}
              </div>
              <div className="text-sm text-purple-700">Optimizations</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                3
              </div>
              <div className="text-sm text-yellow-700">Chains</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
            <div className="space-y-3">
              {analysis.optimizationSuggestions.map((suggestion, index) => (
                <div key={index} className="border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-orange-800">{suggestion.title}</h4>
                      <p className="text-sm text-gray-600">{suggestion.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-orange-600">{suggestion.potentialSavings || suggestion.potentialGains}</div>
                      <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs mt-2">
                        Optimize (15% of savings)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Chain Distribution</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-900">${analysis.chainBreakdown.ethereum.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Ethereum</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-900">${analysis.chainBreakdown.polygon.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Polygon</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-gray-900">${analysis.chainBreakdown.arbitrum.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Arbitrum</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}