import { useState } from 'react';
import { Search, AlertTriangle, CheckCircle, Mail, Phone, User, Database, Download } from 'lucide-react';
import Head from 'next/head';

export default function BreachChecker() {
  const [input, setInput] = useState('');
  const [type, setType] = useState('email');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoclaimtoken.onrender.com';

  const checkBreach = async () => {
    if (!input.trim()) return alert('Enter email/phone/username');
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/breach/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: input.trim(), type })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      alert('Check failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Head>
      <title>Breach Checker - Check Email/Phone Leaks</title>
      <link rel="icon" href="https://cdn-icons-png.flaticon.com/512/6195/6195699.png" />
    </Head>
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Breach Checker</h1>
              <p className="text-gray-400">Check if email/phone/username was leaked in data breaches</p>
            </div>
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-red-500/30 mb-6">
          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            >
              <option value="email">Email Address</option>
              <option value="phone">Phone Number</option>
              <option value="username">Username</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-400 mb-2">Input</label>
            <input
              type="text"
              placeholder={type === 'email' ? 'user@example.com' : type === 'phone' ? '+1234567890' : 'username'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkBreach()}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={checkBreach}
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? 'Checking...' : <><Search className="w-5 h-5" />Check Breaches</>}
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-red-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Results</h2>
            
            {results.breached ? (
              <div className="space-y-4">
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    <div className="text-red-400 font-bold text-xl">BREACHED!</div>
                  </div>
                  <div className="text-white">Found in {results.breaches?.length || 0} data breaches</div>
                </div>

                {results.breaches?.map((breach, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg p-4">
                    <div className="text-white font-bold mb-2">{breach.name}</div>
                    <div className="text-gray-400 text-sm mb-2">{breach.description}</div>
                    <div className="flex flex-wrap gap-2">
                      {breach.data?.map((d, j) => (
                        <span key={j} className="px-2 py-1 bg-red-600 text-white text-xs rounded">{d}</span>
                      ))}
                    </div>
                    {breach.date && <div className="text-gray-500 text-xs mt-2">Breach Date: {breach.date}</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 text-center">
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                <div className="text-green-400 font-bold">No breaches found!</div>
                <div className="text-gray-400 text-sm mt-1">This {type} is not in our breach database</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
