import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Copy, Users, TrendingUp, DollarSign, Eye, CheckCircle, Link as LinkIcon } from 'lucide-react';

export default function WorkerManagement() {
  const [workerCode, setWorkerCode] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerEmail, setWorkerEmail] = useState('');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://autoclaimtoken.onrender.com';

  // Load workers on mount
  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    try {
      const response = await fetch(`${API_URL}/api/workers/list`);
      const data = await response.json();
      if (data.success) {
        setWorkers(data.workers);
      }
    } catch (error) {
      console.error('Failed to load workers:', error);
    }
  };

  const createWorker = async (e) => {
    e.preventDefault();
    
    if (!workerCode.trim()) {
      setMessage('❌ Please enter a worker code');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/workers/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerCode: workerCode.trim(),
          workerName: workerName.trim() || workerCode.trim(),
          email: workerEmail.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Worker created! Link: ${data.referralLink}`);
        setWorkerCode('');
        setWorkerName('');
        setWorkerEmail('');
        loadWorkers();
        
        // Auto-copy link
        copyToClipboard(data.referralLink);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }

    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(text);
    setTimeout(() => setCopiedLink(''), 2000);
  };

  const getReferralLink = (code) => {
    const baseUrl = 'https://bit.ly/token-recovery';
    return `${baseUrl}?ref=${code}`;
  };

  const deleteWorker = async (workerCode) => {
    if (!confirm(`Delete worker ${workerCode}? This cannot be undone.`)) return;
    
    try {
      const response = await fetch(`${API_URL}/api/workers/delete/${workerCode}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ Worker ${workerCode} deleted successfully`);
        loadWorkers();
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Worker Management - CryptoRecover</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">👥 Worker Management</h1>
            <p className="text-gray-300">Create and manage referral links for your workers</p>
          </div>

          {/* Create Worker Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">🔗 Create New Worker Link</h2>
            
            <form onSubmit={createWorker} className="space-y-4">
              <div>
                <label className="block text-white mb-2 font-semibold">Worker Code (Required) *</label>
                <input
                  type="text"
                  value={workerCode}
                  onChange={(e) => setWorkerCode(e.target.value)}
                  placeholder="e.g., CryptoKing, JohnDoe, Agent007"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-gray-300 text-sm mt-1">This will be in the URL: yoursite.com/?ref=<strong>{workerCode || 'CODE'}</strong></p>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Worker Name (Optional)</label>
                <input
                  type="text"
                  value={workerName}
                  onChange={(e) => setWorkerName(e.target.value)}
                  placeholder="e.g., John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Email (Optional)</label>
                <input
                  type="email"
                  value={workerEmail}
                  onChange={(e) => setWorkerEmail(e.target.value)}
                  placeholder="worker@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
              >
                {loading ? '⏳ Creating...' : '✨ Generate Worker Link'}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'}`}>
                <p className="text-white font-semibold">{message}</p>
              </div>
            )}
          </div>

          {/* Workers List */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">📊 All Workers ({workers.length})</h2>

            {workers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300 text-lg">No workers yet. Create your first worker link above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white font-semibold p-3">Worker Code</th>
                      <th className="text-left text-white font-semibold p-3">Name</th>
                      <th className="text-center text-white font-semibold p-3">
                        <Eye className="w-4 h-4 inline mr-1" />
                        Visits
                      </th>
                      <th className="text-center text-white font-semibold p-3">
                        <Users className="w-4 h-4 inline mr-1" />
                        Wallets
                      </th>
                      <th className="text-center text-white font-semibold p-3">
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Claims
                      </th>
                      <th className="text-center text-white font-semibold p-3">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        Total
                      </th>
                      <th className="text-center text-white font-semibold p-3">Referral Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map((worker) => {
                      const link = getReferralLink(worker.worker_code);
                      return (
                        <tr key={worker.id} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-3">
                            <span className="text-blue-300 font-bold">{worker.worker_code}</span>
                          </td>
                          <td className="p-3 text-gray-300">{worker.worker_name || '-'}</td>
                          <td className="p-3 text-center text-gray-300">{worker.total_visits || 0}</td>
                          <td className="p-3 text-center text-gray-300">{worker.total_wallets || 0}</td>
                          <td className="p-3 text-center">
                            <span className="text-green-400 font-bold">{worker.total_claims || 0}</span>
                          </td>
                          <td className="p-3 text-center">
                            <span className="text-yellow-400 font-bold">
                              {parseFloat(worker.total_amount || 0).toFixed(4)} ETH
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => copyToClipboard(link)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1 transition"
                              >
                                <Copy className="w-3 h-3" />
                                {copiedLink === link ? 'Copied!' : 'Copy'}
                              </button>
                              <button
                                onClick={() => deleteWorker(worker.worker_code)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">📖 How It Works</h3>
            <div className="space-y-3 text-gray-200">
              <p><strong>1. Create Worker Link:</strong> Enter a unique code (e.g., "JohnDoe") and click Generate</p>
              <p><strong>2. Share Link:</strong> Copy the link and send it to your worker via WhatsApp/Email/Telegram</p>
              <p><strong>3. Worker Promotes:</strong> Worker shares their link on social media, groups, etc.</p>
              <p><strong>4. Track Performance:</strong> See real-time stats: visits, wallet connections, successful claims</p>
              <p><strong>5. Get Notifications:</strong> You'll receive email alerts when workers' clients take important actions</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


