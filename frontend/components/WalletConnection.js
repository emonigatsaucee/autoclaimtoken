import { useState, useEffect } from 'react';
import { Wallet, LogOut, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { formatAddress } from '../utils/web3Config';
import { apiService } from '../utils/api';

export default function WalletConnection({ onConnectionChange }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [detectedWallets, setDetectedWallets] = useState([]);

  useEffect(() => {
    // Detect available wallets on page load
    const detected = [];
    if (window.ethereum) {
      if (window.ethereum.isMetaMask) detected.push('MetaMask');
      if (window.ethereum.isCoinbaseWallet) detected.push('Coinbase Wallet');
      if (window.ethereum.isTrust) detected.push('Trust Wallet');
      if (window.ethereum.isRainbow) detected.push('Rainbow');
      if (window.ethereum.isBraveWallet) detected.push('Brave Wallet');
      if (window.ethereum.isPhantom) detected.push('Phantom');
      if (window.ethereum.isCoin98) detected.push('Coin98');
      if (detected.length === 0) detected.push('Web3 Wallet');
    }
    setDetectedWallets(detected);
  }, []);

  const wallets = [
    {
      name: 'MetaMask',
      icon: 'https://metamask.io/favicon.ico',
      fallback: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/metamask.svg',
      mobile: 'https://metamask.app.link/dapp/localhost:3000',
      desktop: () => window.ethereum?.isMetaMask,
      connect: connectMetaMask
    },
    {
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/favicon.ico',
      fallback: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/trustwallet.svg',
      mobile: 'https://link.trustwallet.com/open_url?coin_id=60&url=http://localhost:3000',
      desktop: () => window.ethereum?.isTrust,
      connect: connectTrust
    },
    {
      name: 'Coinbase Wallet',
      icon: 'https://www.coinbase.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/coinbase.com',
      mobile: 'https://go.cb-w.com/dapp?cb_url=http://localhost:3000',
      desktop: () => window.ethereum?.isCoinbaseWallet,
      connect: connectCoinbase
    },
    {
      name: 'Ledger Live',
      icon: 'https://www.ledger.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/ledger.com',
      mobile: 'ledgerlive://dapp/localhost:3000',
      desktop: () => window.ethereum?.isLedgerConnect,
      connect: connectLedger
    },
    {
      name: 'Trezor',
      icon: 'https://trezor.io/favicon.ico',
      fallback: 'https://logo.clearbit.com/trezor.io',
      mobile: false,
      desktop: () => window.TrezorConnect,
      connect: connectTrezor
    },
    {
      name: 'Exodus',
      icon: 'https://www.exodus.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/exodus.com',
      mobile: 'exodus://open?url=localhost:3000',
      desktop: () => window.exodus,
      connect: connectExodus
    },
    {
      name: 'Rainbow',
      icon: 'https://rainbow.me/favicon.ico',
      fallback: 'https://logo.clearbit.com/rainbow.me',
      mobile: 'https://rnbwapp.com/localhost:3000',
      desktop: () => window.ethereum?.isRainbow,
      connect: connectRainbow
    },
    {
      name: 'MyEtherWallet',
      icon: 'https://www.myetherwallet.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/myetherwallet.com',
      mobile: 'https://www.myetherwallet.com/wallet/access',
      desktop: () => window.ethereum?.isMEW,
      connect: connectMEW
    },
    {
      name: 'Atomic Wallet',
      icon: 'https://atomicwallet.io/favicon.ico',
      fallback: 'https://logo.clearbit.com/atomicwallet.io',
      mobile: 'atomic://dapp/localhost:3000',
      desktop: () => window.atomic,
      connect: connectAtomic
    },
    {
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/favicon.ico',
      fallback: 'https://logo.clearbit.com/walletconnect.com',
      mobile: true,
      desktop: true,
      connect: connectWalletConnect
    },
    {
      name: 'Connect Any Wallet',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAyMCAxNEg0QzIuOSAxNCAyIDEzLjEgMiAxMlYxMEMyIDguOSAyLjkgOCA0IDhIMjBDMjAuMSA4IDIxIDguOSAyMSAxMFYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+',
      fallback: null,
      mobile: true,
      desktop: true,
      connect: connectAnyWallet
    }
  ];

  async function connectMetaMask() {
    if (!window.ethereum) {
      setError('MetaMask not installed. Please install MetaMask extension.');
      return;
    }
    await connectWallet('metamask');
  }

  async function connectBinance() {
    if (!window.BinanceChain) {
      if (isMobile()) {
        window.open('https://app.binance.com/en/web3wallet', '_blank');
        return;
      }
      setError('Binance Wallet not installed.');
      return;
    }
    await connectWallet('binance');
  }

  async function connectCoinbase() {
    if (!window.ethereum) {
      setError('Coinbase Wallet not installed.');
      return;
    }
    await connectWallet('coinbase');
  }

  async function connectOKX() {
    if (!window.okxwallet) {
      if (isMobile()) {
        window.open('okx://wallet/dapp/url?dappUrl=' + encodeURIComponent(window.location.href), '_blank');
        return;
      }
      setError('OKX Wallet not installed.');
      return;
    }
    await connectWallet('okx');
  }

  async function connectTrust() {
    if (!window.ethereum) {
      setError('Trust Wallet not detected. Please make sure it\'s installed and unlocked.');
      return;
    }
    await connectWallet('trust');
  }



  async function connectExodus() {
    if (!window.ethereum) {
      setError('Exodus Wallet not detected.');
      return;
    }
    await connectWallet('exodus');
  }

  async function connectAtomic() {
    if (!window.ethereum) {
      setError('Atomic Wallet not detected.');
      return;
    }
    await connectWallet('atomic');
  }

  async function connectLedger() {
    if (!window.ethereum) {
      setError('Ledger not detected. Please connect via Ledger Live.');
      return;
    }
    await connectWallet('ledger');
  }

  async function connectTrezor() {
    if (isMobile()) {
      setError('Trezor not available on mobile.');
      return;
    }
    setError('Trezor integration coming soon.');
  }

  async function connectRainbow() {
    if (!window.ethereum) {
      setError('Rainbow Wallet not detected.');
      return;
    }
    await connectWallet('rainbow');
  }





  async function connectMEW() {
    if (!window.ethereum) {
      setError('MyEtherWallet not detected.');
      return;
    }
    await connectWallet('mew');
  }







  async function connectWalletConnect() {
    setError('WalletConnect integration coming soon.');
  }

  async function connectAnyWallet() {
    if (!window.ethereum) {
      setError('No Web3 wallet detected. Please install a wallet extension or use a Web3 browser.');
      return;
    }
    
    // Detect wallet type
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



  async function connectWallet(walletType) {
    setIsConnecting(true);
    setError('');
    
    try {
      if (!window.ethereum) {
        setError('No wallet detected. Please install a Web3 wallet and refresh the page.');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        const walletAddress = accounts[0];
        
        // Detect wallet name
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
        
        // Create verification message
        const message = `Welcome to CryptoRecover!\n\nPlease sign this message to verify wallet ownership.\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}\n\nThis signature is free and does not authorize any transactions.`;
        
        try {
          // Request signature
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, walletAddress]
          });
          
          // Verify with backend
          const result = await apiService.connectWallet(walletAddress, signature, message);
          
          if (result.success) {
            setIsConnected(true);
            setAddress(walletAddress);
            onConnectionChange?.(result.user);
            setError('');
          } else {
            setError('Backend verification failed. Please try again.');
          }
        } catch (signError) {
          console.log('Signature error:', signError);
          
          if (signError.code === 4001) {
            setError('Signature rejected. Please try again and approve the signature request.');
          } else {
            setError(`Signature failed: ${signError.message || 'Unknown error'}. Please try again.`);
          }
        }
      } else {
        setError('No accounts found. Please unlock your wallet and try again.');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      
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

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  const handleWalletClick = async (wallet) => {
    setError('');
    
    try {
      setError(`Connecting to ${wallet.name}...`);
      await wallet.connect();
    } catch (err) {
      console.error(`${wallet.name} connection error:`, err);
      setError(`Failed to connect to ${wallet.name}. Please make sure it's installed and unlocked.`);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setAddress('');
    onConnectionChange?.(null);
    setError('');
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
    <div className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 bg-red-50 text-red-700 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Connect Your Wallet</h3>
        <p className="text-gray-600">
          Choose your preferred wallet to start recovering your crypto assets
        </p>
        {detectedWallets.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-green-700">
              ✅ Detected: {detectedWallets.join(', ')}
            </p>
          </div>
        )}
        {!window.ethereum && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
            <p className="text-sm text-yellow-700">
              ⚠️ No Web3 wallet detected. Please install a wallet extension first.
            </p>
          </div>
        )}
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Monitor size={16} />
            <span>Desktop</span>
          </div>
          <div className="flex items-center space-x-1">
            <Smartphone size={16} />
            <span>Mobile</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.slice(0, -1).map((wallet, index) => (
          <button
            key={index}
            onClick={() => handleWalletClick(wallet)}
            disabled={isConnecting}
            className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <img 
                src={wallet.icon} 
                alt={wallet.name}
                className="w-8 h-8 object-contain"
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
              <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {wallet.name}
              </div>
              <div className="text-sm text-gray-500">
                {isMobile() ? 'Mobile App' : 'Browser Extension'}
              </div>
            </div>
            {isConnecting && (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl">
        <div className="text-center mb-3">
          <h4 className="font-bold text-gray-800 mb-1">🔗 Don't See Your Wallet?</h4>
          <p className="text-sm text-gray-600">OKX, Phantom, Coin98, MathWallet, SafePal & 100+ more supported</p>
        </div>
        <button
          onClick={() => handleWalletClick(wallets[wallets.length - 1])}
          disabled={isConnecting}
          className="w-full flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all disabled:opacity-50 group shadow-lg transform hover:scale-105"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M21 12C21 13.1 20.1 14 20 14H4C2.9 14 2 13.1 2 12V10C2 8.9 2.9 8 4 8H20C20.1 8 21 8.9 21 10V12Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-white">
              Connect Any Wallet
            </div>
            <div className="text-sm text-blue-100">
              Universal connector for all Web3 wallets
            </div>
          </div>
          {isConnecting && (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </button>
      </div>

      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>New to crypto wallets? 
          <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            Learn more
          </a>
        </p>
        <p className="text-xs">
          Universal connector: OKX, Phantom, Solflare, Keplr, Coin98, MathWallet, SafePal, TokenPocket, Brave, Opera, Frame, Status + 100 more
        </p>
      </div>

      {isConnecting && (
        <div className="text-center text-sm text-gray-600">
          <span className="loading-dots">Connecting wallet</span>
        </div>
      )}
    </div>
  );
}