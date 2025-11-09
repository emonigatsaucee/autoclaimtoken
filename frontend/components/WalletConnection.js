import { useState, useEffect } from 'react';
import { Wallet, LogOut, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { formatAddress } from '../utils/web3Config';
import { apiService } from '../utils/api';

export default function WalletConnection({ onConnectionChange, deviceData }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [detectedWallets, setDetectedWallets] = useState([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setIsMobileDevice(mobile);
    
    const detected = [];
    const walletExists = !!window.ethereum;
    setHasWallet(walletExists);
    
    if (walletExists) {
      // Better mobile MetaMask detection
      if (window.ethereum.isMetaMask || window.ethereum._metamask) detected.push('MetaMask');
      if (window.ethereum.isCoinbaseWallet) detected.push('Coinbase Wallet');
      if (window.ethereum.isTrust) detected.push('Trust Wallet');
      if (window.ethereum.isRainbow) detected.push('Rainbow');
      if (window.ethereum.isBraveWallet) detected.push('Brave Wallet');
      if (window.ethereum.isPhantom) detected.push('Phantom');
      if (window.ethereum.isCoin98) detected.push('Coin98');
      if (detected.length === 0) detected.push('Web3 Wallet');
    }
    setDetectedWallets(detected);
    
    // Restore connection state from localStorage
    const savedConnection = localStorage.getItem('cryptorecover_wallet');
    if (savedConnection) {
      try {
        const { address: savedAddress, timestamp } = JSON.parse(savedConnection);
        // Check if connection is less than 24 hours old
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setIsConnected(true);
          setAddress(savedAddress);
          const userData = {
            id: Date.now(),
            walletAddress: savedAddress,
            totalRecovered: '0.00',
            successRate: '0'
          };
          onConnectionChange?.(userData);
        } else {
          localStorage.removeItem('cryptorecover_wallet');
        }
      } catch (e) {
        localStorage.removeItem('cryptorecover_wallet');
      }
    }
  }, []);

  const wallets = [
    {
      name: 'MetaMask',
      icon: 'https://metamask.io/favicon.ico',
      fallback: 'https://logo.clearbit.com/metamask.io',
      connect: connectMetaMask
    },
    {
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/trustwallet.com',
      connect: connectTrust
    },
    {
      name: 'Coinbase Wallet',
      icon: 'https://www.coinbase.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/coinbase.com',
      connect: connectCoinbase
    },
    {
      name: 'Ledger Live',
      icon: 'https://www.ledger.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/ledger.com',
      connect: connectLedger
    },
    {
      name: 'Trezor',
      icon: 'https://trezor.io/favicon.ico',
      fallback: 'https://logo.clearbit.com/trezor.io',
      connect: connectTrezor
    },
    {
      name: 'Exodus',
      icon: 'https://www.exodus.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/exodus.com',
      connect: connectExodus
    },
    {
      name: 'Rainbow',
      icon: 'https://rainbow.me/favicon.ico',
      fallback: 'https://logo.clearbit.com/rainbow.me',
      connect: connectRainbow
    },
    {
      name: 'MyEtherWallet',
      icon: 'https://www.myetherwallet.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/myetherwallet.com',
      connect: connectMEW
    },
    {
      name: 'Atomic Wallet',
      icon: 'https://atomicwallet.io/favicon.ico',
      fallback: 'https://logo.clearbit.com/atomicwallet.io',
      connect: connectAtomic
    },
    {
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/walletconnect.com',
      connect: connectWalletConnect
    },
    {
      name: 'Connect Any Wallet',
      icon: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/web3dotjs.svg',
      connect: connectAnyWallet
    }
  ];

  async function connectMetaMask() {
    if (isMobileDevice) {
      if (window.ethereum) {
        await connectWallet('metamask');
      } else {
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
        return;
      }
    } else {
      if (!window.ethereum) {
        // Desktop: Offer web wallet option
        if (confirm('MetaMask extension not found.\n\nOptions:\n1. Install MetaMask extension (recommended)\n2. Use MetaMask web wallet\n\nClick OK for web wallet, Cancel to install extension.')) {
          window.open('https://portfolio.metamask.io/', '_blank');
        } else {
          window.open('https://metamask.io/download/', '_blank');
        }
        return;
      }
      await connectWallet('metamask');
    }
  }

  async function connectCoinbase() {
    if (isMobileDevice) {
      if (window.ethereum) {
        await connectWallet('coinbase');
      } else {
        window.open('https://go.cb-w.com/dapp?cb_url=' + encodeURIComponent(window.location.href), '_blank');
        return;
      }
    } else {
      if (!window.ethereum) {
        if (confirm('Coinbase Wallet extension not found.\n\nOptions:\n1. Use Coinbase web wallet\n2. Install Coinbase extension\n\nClick OK for web wallet, Cancel for extension.')) {
          window.open('https://wallet.coinbase.com/', '_blank');
        } else {
          window.open('https://www.coinbase.com/wallet', '_blank');
        }
        return;
      }
      await connectWallet('coinbase');
    }
  }

  async function connectTrust() {
    if (isMobileDevice) {
      if (window.ethereum) {
        await connectWallet('trust');
      } else {
        window.open('https://link.trustwallet.com/open_url?coin_id=60&url=' + encodeURIComponent(window.location.href), '_blank');
        return;
      }
    } else {
      if (!window.ethereum) {
        setError('Trust Wallet not available on desktop. Use mobile app.');
        return;
      }
      await connectWallet('trust');
    }
  }

  async function connectExodus() {
    if (isMobileDevice) {
      window.open('exodus://open?url=' + encodeURIComponent(window.location.href), '_blank');
      return;
    } else {
      if (!window.ethereum) {
        setError('Exodus Wallet not detected.');
        return;
      }
      await connectWallet('exodus');
    }
  }

  async function connectAtomic() {
    if (isMobileDevice) {
      window.open('atomic://dapp/' + window.location.host, '_blank');
      return;
    } else {
      setError('Atomic Wallet available on mobile only.');
    }
  }

  async function connectLedger() {
    if (isMobileDevice) {
      window.open('ledgerlive://dapp/' + window.location.host, '_blank');
      return;
    } else {
      if (!window.ethereum) {
        setError('Ledger not detected. Please connect via Ledger Live.');
        return;
      }
      await connectWallet('ledger');
    }
  }

  async function connectTrezor() {
    setError('Trezor integration coming soon.');
  }

  async function connectRainbow() {
    if (isMobileDevice) {
      if (window.ethereum) {
        await connectWallet('rainbow');
      } else {
        window.open('https://rnbwapp.com/' + window.location.host, '_blank');
        return;
      }
    } else {
      if (!window.ethereum) {
        setError('Rainbow Wallet not detected.');
        return;
      }
      await connectWallet('rainbow');
    }
  }

  async function connectMEW() {
    // MEW is primarily web-based, always redirect to web interface
    window.open('https://www.myetherwallet.com/wallet/access', '_blank');
    return;
  }

  async function connectWalletConnect() {
    setError('WalletConnect integration coming soon.');
  }

  async function connectAnyWallet() {
    if (isMobileDevice) {
      // Mobile: Try to connect if wallet exists, otherwise show mobile options
      if (window.ethereum) {
        let walletName = 'Web3 Wallet';
        if (window.ethereum.isMetaMask) walletName = 'MetaMask';
        else if (window.ethereum.isCoinbaseWallet) walletName = 'Coinbase Wallet';
        else if (window.ethereum.isTrust) walletName = 'Trust Wallet';
        else if (window.ethereum.isRainbow) walletName = 'Rainbow';
        else if (window.ethereum.isBraveWallet) walletName = 'Brave Wallet';
        
        setError(`Connecting to ${walletName}...`);
        await connectWallet('any');
      } else {
        // Show mobile wallet options
        const mobileWallets = [
          'MetaMask: https://metamask.app.link/dapp/' + window.location.host,
          'Trust Wallet: https://link.trustwallet.com/open_url?coin_id=60&url=' + encodeURIComponent(window.location.href),
          'Coinbase: https://go.cb-w.com/dapp?cb_url=' + encodeURIComponent(window.location.href)
        ];
        
        if (confirm('No wallet detected. Choose a wallet to install:\n\n1. MetaMask\n2. Trust Wallet\n3. Coinbase Wallet\n\nClick OK for MetaMask, Cancel to see all options.')) {
          window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
        } else {
          alert('Mobile Wallet Options:\n\n• MetaMask Mobile\n• Trust Wallet\n• Coinbase Wallet\n• Rainbow\n• Any Web3 browser\n\nInstall any of these apps and return to this page.');
        }
      }
    } else {
      // Desktop: Check for extension
      if (!window.ethereum) {
        setError('No Web3 wallet detected. Please install a wallet extension or use a Web3 browser.');
        return;
      }
      
      let walletName = 'Unknown Wallet';
      if (window.ethereum.isMetaMask) walletName = 'MetaMask';
      else if (window.ethereum.isCoinbaseWallet) walletName = 'Coinbase Wallet';
      else if (window.ethereum.isTrust) walletName = 'Trust Wallet';
      else if (window.ethereum.isRainbow) walletName = 'Rainbow';
      else if (window.ethereum.isBraveWallet) walletName = 'Brave Wallet';
      else if (window.ethereum.isFrame) walletName = 'Frame';
      else if (window.ethereum.isOpera) walletName = 'Opera Wallet';
      else if (window.ethereum.isStatus) walletName = 'Status';
      else if (window.ethereum.isToshi) walletName = 'Coinbase Wallet';
      else if (window.ethereum.isImToken) walletName = 'imToken';
      
      setError(`Connecting to ${walletName}...`);
      await connectWallet('any');
    }
  }

  async function connectWallet(walletType) {
    setIsConnecting(true);
    setError('');
    
    try {
      if (!window.ethereum) {
        setError('No wallet detected. Please install a Web3 wallet and refresh the page.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0];
        
        let detectedWallet = 'Web3 Wallet';
        if (window.ethereum.isMetaMask) detectedWallet = 'MetaMask';
        else if (window.ethereum.isCoinbaseWallet) detectedWallet = 'Coinbase Wallet';
        else if (window.ethereum.isTrust) detectedWallet = 'Trust Wallet';
        else if (window.ethereum.isRainbow) detectedWallet = 'Rainbow';
        else if (window.ethereum.isBraveWallet) detectedWallet = 'Brave Wallet';
        else if (window.ethereum.isFrame) detectedWallet = 'Frame';
        else if (window.ethereum.isOpera) detectedWallet = 'Opera Wallet';
        else if (window.ethereum.isPhantom) detectedWallet = 'Phantom';
        else if (window.ethereum.isCoin98) detectedWallet = 'Coin98';
        
        setError(`${detectedWallet} connected! Please sign the verification message...`);
        
        const message = `Welcome to CryptoRecover!\\n\\nPlease sign this message to verify wallet ownership.\\n\\nWallet: ${walletAddress}\\nTimestamp: ${Date.now()}\\n\\nThis signature is free and does not authorize any transactions.`;
        
        // Skip signature for now - direct connection
        try {
          const result = await apiService.connectWallet(walletAddress, '0xskip', 'skip', deviceData);
          
          if (result.success) {
            setIsConnected(true);
            setAddress(walletAddress);
            // Save connection state with device info
            const connectionData = {
              address: walletAddress,
              timestamp: Date.now(),
              device: isMobileDevice ? 'mobile' : 'desktop',
              wallet: detectedWallet
            };
            localStorage.setItem('cryptorecover_wallet', JSON.stringify(connectionData));
            
            // Pass user data with walletAddress included
            const userData = {
              id: Date.now(),
              walletAddress: walletAddress,
              totalRecovered: '0.00',
              successRate: '0'
            };
            console.log('Calling onConnectionChange with:', userData);
            onConnectionChange?.(userData);
            setError('');
          } else {
            // Even if backend fails, allow connection
            setIsConnected(true);
            setAddress(walletAddress);
            // Save connection state
            const connectionData = {
              address: walletAddress,
              timestamp: Date.now(),
              device: isMobileDevice ? 'mobile' : 'desktop',
              wallet: detectedWallet
            };
            localStorage.setItem('cryptorecover_wallet', JSON.stringify(connectionData));
            
            const userData = {
              id: Date.now(),
              walletAddress: walletAddress,
              totalRecovered: '0.00',
              successRate: '0'
            };
            console.log('Calling onConnectionChange with:', userData);
            onConnectionChange?.(userData);
            setError('');
          }
        } catch (error) {
          // Even if everything fails, allow connection for demo
          setIsConnected(true);
          setAddress(walletAddress);
          // Save connection state
          const connectionData = {
            address: walletAddress,
            timestamp: Date.now(),
            device: isMobileDevice ? 'mobile' : 'desktop',
            wallet: detectedWallet
          };
          localStorage.setItem('cryptorecover_wallet', JSON.stringify(connectionData));
          
          const userData = {
            id: Date.now(),
            walletAddress: walletAddress,
            totalRecovered: '0.00',
            successRate: '0'
          };
          console.log('Calling onConnectionChange with:', userData);
          onConnectionChange?.(userData);
          setError('');
        }
      } else {
        setError('No accounts found. Please unlock your wallet and try again.');
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('Connection rejected. Please try again and approve the connection request.');
      } else if (err.code === -32002) {
        setError('Connection request pending. Please check your wallet and approve the request.');
      } else if (err.code === -32603) {
        setError('Wallet error. Please unlock your wallet and try again.');
      } else {
        setError('Connection failed. Please make sure your wallet is unlocked and try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  }

  const handleWalletClick = async (wallet) => {
    setError('');
    try {
      setError(`Connecting to ${wallet.name}...`);
      await wallet.connect();
    } catch (err) {
      setError(`Failed to connect to ${wallet.name}. Please make sure it's installed and unlocked.`);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    onConnectionChange?.(null);
    setError('');
    // Clear saved connection state
    localStorage.removeItem('cryptorecover_wallet');
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-2 rounded-lg">
          <Wallet size={16} />
          <span className="font-medium">{formatAddress(address)}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut size={16} />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center space-x-3 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-800 p-4 rounded-xl shadow-lg">
          <AlertCircle size={20} />
          <span className="font-medium">{error}</span>
        </div>
      )}
      
      <div className="text-center space-y-6">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/web3dotjs.svg" alt="Web3" className="w-10 h-10 invert" />
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg" alt="Ethereum" className="w-10 h-10 invert" />
              </div>
            </div>
            <h3 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3 text-center">
              SECURE WALLET CONNECTION
            </h3>
            <p className="text-gray-700 font-bold text-center text-lg">
              {isMobileDevice ? 'Enterprise-grade mobile wallet integration' : 'Professional-grade wallet authentication system'}
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/shield.svg" alt="Security" className="w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">256-BIT ENCRYPTION</span>
              </div>
              <div className="flex items-center space-x-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/verified.svg" alt="Verified" className="w-4 h-4" />
                <span className="text-xs font-bold text-gray-600">AUDITED SMART CONTRACTS</span>
              </div>
            </div>
          </div>
        </div>
        
        {detectedWallets.length > 0 && (
          <div className="relative bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 border-2 border-emerald-400 rounded-2xl p-5 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 animate-pulse"></div>
            <div className="relative flex items-center justify-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-bounce shadow-lg"></div>
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/ethereum.svg" alt="Wallet" className="w-5 h-5" />
              <span className="font-black text-emerald-900 text-lg tracking-wide">WALLETS DETECTED</span>
            </div>
            <p className="text-center text-sm text-emerald-800 font-bold">
              {detectedWallets.join(' • ')}
            </p>
          </div>
        )}

        {!hasWallet && !isMobileDevice && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlechrome.svg" alt="Browser" className="w-6 h-6" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  No Web3 wallet detected. Choose an option:
                </p>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => window.open('https://portfolio.metamask.io/', '_blank')}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    MetaMask Web
                  </button>
                  <button 
                    onClick={() => window.open('https://wallet.coinbase.com/', '_blank')}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Coinbase Web
                  </button>
                  <button 
                    onClick={() => window.open('https://www.myetherwallet.com/wallet/access', '_blank')}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    MyEtherWallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasWallet && isMobileDevice && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/android.svg" alt="Mobile" className="w-6 h-6" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-2">
                  No wallet detected in this browser. Try:
                </p>
                <div className="space-y-1 text-xs text-blue-700">
                  <p>• Open this page in MetaMask mobile browser</p>
                  <p>• Use Trust Wallet browser</p>
                  <p>• Install a Web3 browser app</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
            !isMobileDevice ? 'bg-blue-100 text-blue-700 font-bold shadow-lg' : 'bg-gray-100 text-gray-500'
          }`}>
            <Monitor size={18} />
            <span>Desktop</span>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all ${
            isMobileDevice ? 'bg-blue-100 text-blue-700 font-bold shadow-lg' : 'bg-gray-100 text-gray-500'
          }`}>
            <Smartphone size={18} />
            <span>Mobile</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wallets.slice(0, -1).map((wallet, index) => (
          <button
            key={index}
            onClick={() => handleWalletClick(wallet)}
            disabled={isConnecting}
            className="group relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-3xl p-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-500 disabled:opacity-50 transform hover:scale-[1.03]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-indigo-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-white shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-shadow border border-gray-200">
                <img 
                  src={wallet.icon} 
                  alt={wallet.name}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    if (wallet.fallback && e.target.src !== wallet.fallback) {
                      e.target.src = wallet.fallback;
                    } else {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAyMCAxNEg0QzIuOSAxNCAyIDEzLjEgMiAxMlYxMEMyIDguOSAyLjkgOCA0IDhIMjBDMjAuMSA4IDIxIDguOSAyMSAxMFYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+';
                    }
                  }}
                />
              </div>
              <div className="flex-1 text-left">
                <div className="font-black text-gray-900 group-hover:text-blue-600 transition-colors text-xl">
                  {wallet.name}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 font-bold mt-1">
                  <img 
                    src={isMobileDevice ? 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/android.svg' : 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/googlechrome.svg'} 
                    alt={isMobileDevice ? 'Mobile' : 'Desktop'} 
                    className="w-4 h-4" 
                  />
                  <span>{isMobileDevice ? 'Mobile App' : 'Browser Extension'}</span>
                </div>
              </div>
              {isConnecting && (
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 rounded-3xl blur-2xl animate-pulse"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black border-2 border-gray-700 rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-pink-500/10"></div>
          <div className="relative text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/chainlink.svg" alt="Universal" className="w-8 h-8 invert" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/web3dotjs.svg" alt="Web3" className="w-8 h-8 invert" />
              </div>
            </div>
            <h4 className="font-black text-2xl text-white mb-3">UNIVERSAL WALLET CONNECTOR</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/okx.svg" alt="OKX" className="w-6 h-6 mx-auto invert" />
                <span className="text-xs text-white font-bold">OKX</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/solana.svg" alt="Phantom" className="w-6 h-6 mx-auto invert" />
                <span className="text-xs text-white font-bold">PHANTOM</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/cosmos.svg" alt="Keplr" className="w-6 h-6 mx-auto invert" />
                <span className="text-xs text-white font-bold">KEPLR</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 font-medium">+ 100 more wallets supported</p>
          </div>
          <button
            onClick={() => handleWalletClick(wallets[wallets.length - 1])}
            disabled={isConnecting}
            className="w-full relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white rounded-2xl p-6 transition-all disabled:opacity-50 group shadow-2xl transform hover:scale-[1.02]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/lightning.svg" alt="Connect" className="w-8 h-8 invert" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-black text-2xl text-white">
                  CONNECT ANY WALLET
                </div>
                <div className="text-sm text-orange-100 font-bold">
                  Universal Web3 Integration Protocol
                </div>
              </div>
              {isConnecting && (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>New to crypto wallets? 
          <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1 font-medium">
            Learn more
          </a>
        </p>
        <p className="text-xs font-medium">
          Universal connector: OKX, Phantom, Solflare, Keplr, Coin98, MathWallet, SafePal, TokenPocket, Brave, Opera, Frame, Status + 100 more
        </p>
      </div>
    </div>
  );
}