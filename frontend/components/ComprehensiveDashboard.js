import { useState, useEffect } from 'react';
import { Shield, TrendingUp, AlertTriangle, Gift, Zap, Lock, Activity, Award } from 'lucide-react';
import { apiService } from '../utils/api';

export default function ComprehensiveDashboard({ walletAddress }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (walletAddress) {
      loadComprehensiveAnalysis();
    }
  }, [walletAddress]);

  const loadComprehensiveAnalysis = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.post('/comprehensive-analysis', { walletAddress });
      
      if (response.success) {
        setAnalysis(response);
      } else {
        setError('Failed to load analysis');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Failed to load wallet analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Analyzing your wallet across 50+ blockchains...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 10-15 seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-700 font-medium">{error}</p>
        <button
          onClick={loadComprehensiveAnalysis}
          className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysis) return null;

  const { portfolioHealth, airdrops, security, mevProtection } = analysis;

  return (
    <div className="space-y-6">
      {/* Portfolio Health Score */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Portfolio Health Score</h2>
            <p className="text-blue-100">Overall wallet performance and risk assessment</p>
          </div>
          <div className="text-center">
            <div className="text-5xl sm:text-6xl font-bold">{portfolioHealth?.overallScore || 0}</div>
            <div className="text-sm text-blue-100">out of 100</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100 mb-1">Diversification</div>
            <div className="text-2xl font-bold">{portfolioHealth?.metrics?.diversification?.score || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100 mb-1">Risk Level</div>
            <div className="text-2xl font-bold">{portfolioHealth?.metrics?.risk?.level || 'N/A'}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100 mb-1">Liquidity</div>
            <div className="text-2xl font-bold">{portfolioHealth?.metrics?.liquidity?.score || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-blue-100 mb-1">Security</div>
            <div className="text-2xl font-bold">{portfolioHealth?.metrics?.security?.score || 0}</div>
          </div>
        </div>

        {portfolioHealth?.recommendations && portfolioHealth.recommendations.length > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-bold mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Top Recommendations
            </h3>
            <div className="space-y-2">
              {portfolioHealth.recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-sm">
                  <span className="text-yellow-300">•</span>
                  <span>{rec.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Security Audit */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="w-7 h-7 mr-3 text-green-500" />
              Security Audit
            </h2>
            <p className="text-gray-600 mt-1">Wallet security and risk analysis</p>
          </div>
          <div className={`px-4 py-2 rounded-full font-bold ${
            security?.riskLevel === 'LOW' ? 'bg-green-100 text-green-700' :
            security?.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {security?.riskLevel || 'UNKNOWN'} RISK
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Security Score</div>
            <div className="text-3xl font-bold text-gray-900">{security?.securityScore || 0}/100</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Risks Found</div>
            <div className="text-3xl font-bold text-gray-900">{security?.totalRisks || 0}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Wallet Age</div>
            <div className="text-3xl font-bold text-gray-900">{security?.walletAge || 0}d</div>
          </div>
        </div>

        {security?.risks && security.risks.length > 0 && (
          <div className="space-y-3">
            {security.risks.map((risk, idx) => (
              <div key={idx} className={`border-l-4 p-4 rounded ${
                risk.severity === 'CRITICAL' ? 'border-red-500 bg-red-50' :
                risk.severity === 'HIGH' ? 'border-orange-500 bg-orange-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <div className="font-bold text-gray-900">{risk.type.replace(/_/g, ' ')}</div>
                <div className="text-sm text-gray-700 mt-1">{risk.description}</div>
                <div className="text-sm text-gray-600 mt-2">→ {risk.recommendation}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Airdrop Finder */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 sm:p-8 text-white">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <Gift className="w-7 h-7 mr-3" />
          Airdrop Opportunities
        </h2>
        <p className="text-purple-100 mb-6">Claimable tokens and eligibility checker</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-purple-100 mb-1">Checked</div>
            <div className="text-3xl font-bold">{airdrops?.totalChecked || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-purple-100 mb-1">Eligible</div>
            <div className="text-3xl font-bold">{airdrops?.eligible || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-sm text-purple-100 mb-1">Claimable</div>
            <div className="text-3xl font-bold text-yellow-300">{airdrops?.claimable || 0}</div>
          </div>
        </div>

        {airdrops?.airdrops && airdrops.airdrops.length > 0 && (
          <div className="space-y-3">
            {airdrops.airdrops.filter(a => a.claimable).map((airdrop, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{airdrop.name} ({airdrop.token})</div>
                    <div className="text-sm text-purple-100">{airdrop.chain}</div>
                  </div>
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    CLAIMABLE
                  </div>
                </div>
              </div>
            ))}
            {airdrops.airdrops.filter(a => !a.claimable && a.eligible).map((airdrop, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{airdrop.name} ({airdrop.token})</div>
                    <div className="text-sm text-purple-100">{airdrop.claimed ? 'Already Claimed' : 'Not Eligible'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MEV Protection */}
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Zap className="w-7 h-7 mr-3 text-orange-500" />
          MEV Attack Detection
        </h2>
        <p className="text-gray-600 mb-6">Sandwich attacks and frontrunning analysis</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Protection Score</div>
            <div className="text-3xl font-bold text-gray-900">{mevProtection?.protectionScore || 0}/100</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Attacks Detected</div>
            <div className="text-3xl font-bold text-red-600">{mevProtection?.totalAttacks || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Estimated Loss</div>
            <div className="text-3xl font-bold text-gray-900">{mevProtection?.analysis?.totalLoss || '0'} ETH</div>
          </div>
        </div>

        {mevProtection?.attacks && mevProtection.attacks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="font-bold text-red-900 mb-2">⚠️ MEV Attacks Detected</div>
            {mevProtection.attacks.map((attack, idx) => (
              <div key={idx} className="text-sm text-red-700 mb-2">
                • {attack.description}
              </div>
            ))}
          </div>
        )}

        {mevProtection?.recommendations && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-bold text-blue-900 mb-3">🛡️ Protection Recommendations</div>
            <div className="space-y-2">
              {mevProtection.recommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="text-sm text-blue-700 flex items-start">
                  <span className="mr-2">→</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Activity className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{analysis.transactionCount || 0}</div>
          <div className="text-sm text-blue-100">Total Transactions</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{parseFloat(analysis.ethBalance || 0).toFixed(4)}</div>
          <div className="text-sm text-green-100">ETH Balance</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Award className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{portfolioHealth?.healthLevel || 'N/A'}</div>
          <div className="text-sm text-purple-100">Health Level</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <Lock className="w-8 h-8 mb-3 opacity-80" />
          <div className="text-3xl font-bold mb-1">{security?.riskLevel || 'N/A'}</div>
          <div className="text-sm text-orange-100">Risk Level</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <button className="bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all">
            Claim Available Airdrops
          </button>
          <button className="bg-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-purple-700 transition-all">
            Revoke Risky Approvals
          </button>
          <button className="bg-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-green-700 transition-all">
            Enable MEV Protection
          </button>
          <button className="bg-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-orange-700 transition-all">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}

