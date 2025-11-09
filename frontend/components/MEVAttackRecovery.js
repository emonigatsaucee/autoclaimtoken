import { useState } from 'react';
import { Zap, Shield, AlertTriangle, CheckCircle, ExternalLink, TrendingDown } from 'lucide-react';

export default function MEVAttackRecovery() {
  const [formData, setFormData] = useState({
    walletAddress: '',
    attackTxHash: '',
    lossAmount: '',
    attackType: 'MEV/Sandwich',
    targetToken: '',
    slippageTolerance: '',
    gasPrice: '',
    contactEmail: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [attackAnalysis, setAttackAnalysis] = useState(null);

  const attackTypes = [
    { id: 'MEV/Sandwich', name: 'MEV/Sandwich Attack', success: '45%', description: 'Front and back-running transactions' },
    { id: 'Front-running', name: 'Front-running', success: '52%', description: 'Transaction copied with higher gas' },
    { id: 'Back-running', name: 'Back-running', success: '48%', description: 'Arbitrage after your transaction' },
    { id: 'Liquidation', name: 'Liquidation Attack', success: '38%', description: 'Forced liquidation manipulation' },
    { id: 'Other', name: 'Other MEV Attack', success: '35%', description: 'Custom MEV exploitation' }
  ];

  const handleAnalyzeAttack = async () => {
    if (!formData.attackTxHash) return;
    
    setLoading(true);
    try {
      // Simulate MEV attack analysis
      setTimeout(() => {
        setAttackAnalysis({
          txHash: formData.attackTxHash,
          attackType: 'Sandwich Attack',
          frontRunTx: '0xabc123...',
          backRunTx: '0xdef456...',
          botAddress: '0x789abc...',
          extractedValue: '2.45 ETH',
          gasUsed: '180,000',
          blockNumber: '18,945,123',
          mevBot: 'FlashBot Alpha',
          recoverable: true,
          confidence: '87%'
        });
        setLoading(false);
      }, 2500);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/recover-mev-attack', {
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

  const isFormValid = formData.walletAddress && formData.attackTxHash && 
                     formData.contactEmail;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lightning.svg" alt="MEV" className="w-8 h-8 invert" />
              </div>
              <div>
                <h1 className="text-3xl font-black">MEV Attack Recovery</h1>
                <p className="text-purple-100 text-lg font-medium">Counter MEV bots and recover extracted value</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/target.svg" alt="Success" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-purple-600 mb-2">45%</div>
                <div className="text-purple-700 font-medium">Success Rate</div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/clock.svg" alt="Time" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-blue-600 mb-2">12-24h</div>
                <div className="text-blue-700 font-medium">Response Time</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dollar.svg" alt="Fee" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-green-600 mb-2">35%</div>
                <div className="text-green-700 font-medium">Success Fee</div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Protection" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-orange-600 mb-2">Real-time</div>
                <div className="text-orange-700 font-medium">Protection</div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/information.svg" alt="Info" className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-bold text-purple-800 mb-2">Advanced MEV Counter-Attack System</h3>
                  <ul className="text-purple-700 space-y-1 text-sm">
                    <li>• Real-time MEV bot detection and analysis</li>
                    <li>• Sandwich attack reversal techniques</li>
                    <li>• Front-running protection mechanisms</li>
                    <li>• Flashloan-based recovery strategies</li>
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
              <h2 className="text-2xl font-black text-gray-900 mb-6">MEV Recovery Request</h2>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Your Wallet Address *
                    </label>
                    <input
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                      placeholder="0x..."
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Attack Transaction Hash *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        value={formData.attackTxHash}
                        onChange={(e) => setFormData({...formData, attackTxHash: e.target.value})}
                        placeholder="0x..."
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono"
                      />
                      <button
                        onClick={handleAnalyzeAttack}
                        disabled={!formData.attackTxHash || loading}
                        className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attack Details */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Loss Amount (USD)
                    </label>
                    <input
                      type="number"
                      value={formData.lossAmount}
                      onChange={(e) => setFormData({...formData, lossAmount: e.target.value})}
                      placeholder="2500"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Target Token
                    </label>
                    <input
                      value={formData.targetToken}
                      onChange={(e) => setFormData({...formData, targetToken: e.target.value})}
                      placeholder="ETH, USDC, etc."
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
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
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Attack Type Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Attack Type
                  </label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {attackTypes.map(type => (
                      <div
                        key={type.id}
                        onClick={() => setFormData({...formData, attackType: type.id})}
                        className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          formData.attackType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-gray-900">{type.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                        <div className="text-xs text-purple-600 mt-2 font-medium">
                          Success Rate: {type.success}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Slippage Tolerance (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.slippageTolerance}
                      onChange={(e) => setFormData({...formData, slippageTolerance: e.target.value})}
                      placeholder="0.5"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Gas Price (Gwei)
                    </label>
                    <input
                      type="number"
                      value={formData.gasPrice}
                      onChange={(e) => setFormData({...formData, gasPrice: e.target.value})}
                      placeholder="20"
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Attack Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what happened during the attack..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="4"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isFormValid}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing Attack...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Start MEV Counter-Attack</span>
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

          {/* Attack Analysis Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Attack Analysis</h3>
              
              {!attackAnalysis && !loading && (
                <div className="text-center py-8">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/search.svg" alt="Search" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500">Enter attack transaction hash and click analyze to see MEV analysis</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing MEV attack pattern...</p>
                </div>
              )}

              {attackAnalysis && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Attack Type</div>
                    <div className="font-bold text-red-600">{attackAnalysis.attackType}</div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-xl">
                    <div className="text-sm font-bold text-red-800 mb-2">MEV Bot Details</div>
                    <div className="space-y-2 text-sm">
                      <div>Bot: <span className="font-mono">{attackAnalysis.mevBot}</span></div>
                      <div>Address: <span className="font-mono text-xs">{attackAnalysis.botAddress}</span></div>
                      <div>Extracted: <span className="font-bold text-red-600">{attackAnalysis.extractedValue}</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600">Block</div>
                      <div className="font-bold text-blue-800">{attackAnalysis.blockNumber}</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600">Gas Used</div>
                      <div className="font-bold text-green-800">{attackAnalysis.gasUsed}</div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="text-sm font-bold text-purple-800 mb-2">Recovery Assessment</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Recoverable:</span>
                        <span className={`font-bold ${attackAnalysis.recoverable ? 'text-green-600' : 'text-red-600'}`}>
                          {attackAnalysis.recoverable ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-bold text-purple-600">{attackAnalysis.confidence}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-gray-700 mb-2">Related Transactions</div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="font-mono text-xs">{attackAnalysis.frontRunTx}</span>
                        <span className="text-red-600">Front-run</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingDown className="w-4 h-4 text-orange-500" />
                        <span className="font-mono text-xs">{attackAnalysis.backRunTx}</span>
                        <span className="text-orange-600">Back-run</span>
                      </div>
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
                  {result.success ? 'Counter-Attack Initiated Successfully' : 'Request Failed'}
                </h4>
                <p className={`text-sm mb-4 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
                
                {result.success && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Response Time</div>
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