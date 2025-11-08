import { useState } from 'react';
import { Wallet, LogOut, AlertCircle, Smartphone, Monitor } from 'lucide-react';
import { formatAddress } from '../utils/web3Config';
import { apiService } from '../utils/api';

export default function WalletConnection({ onConnectionChange }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');

  const wallets = [
    {
      name: 'MetaMask',
      icon: 'https://docs.metamask.io/img/metamask-fox.svg',
      mobile: 'https://metamask.app.link/dapp/localhost:3000',
      desktop: () => window.ethereum?.isMetaMask,
      connect: connectMetaMask
    },
    {
      name: 'Binance Wallet',
      icon: 'https://public.bnbstatic.com/static/images/common/logo.png',
      mobile: 'https://app.binance.com/en/web3wallet',
      desktop: () => window.BinanceChain,
      connect: connectBinance
    },
    {
      name: 'Coinbase Wallet',
      icon: 'https://avatars.githubusercontent.com/u/18060234?s=200&v=4',
      mobile: 'https://go.cb-w.com/dapp?cb_url=http://localhost:3000',
      desktop: () => window.ethereum?.isCoinbaseWallet,
      connect: connectCoinbase
    },
    {
      name: 'OKX Wallet',
      icon: 'https://static.okx.com/cdn/assets/imgs/MjAyMTA0/6EABC5C8E2E5C6A5B5E5C6A5B5E5C6A5.png',
      mobile: 'okx://wallet/dapp/url?dappUrl=http://localhost:3000',
      desktop: () => window.okxwallet,
      connect: connectOKX
    },
    {
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg',
      mobile: 'https://link.trustwallet.com/open_url?coin_id=60&url=http://localhost:3000',
      desktop: () => window.ethereum?.isTrust,
      connect: connectTrust
    },
    {
      name: 'Phantom',
      icon: 'https://phantom.app/img/logomark.svg',
      mobile: 'https://phantom.app/ul/browse/localhost:3000',
      desktop: () => window.solana?.isPhantom,
      connect: connectPhantom
    },
    {
      name: 'Exodus',
      icon: 'https://www.exodus.com/img/logo/exodus-logo.svg',
      mobile: 'exodus://open?url=localhost:3000',
      desktop: () => window.exodus,
      connect: connectExodus
    },
    {
      name: 'Atomic Wallet',
      icon: 'https://atomicwallet.io/images/press-kit/atomic_logo_rounded.svg',
      mobile: 'atomic://dapp/localhost:3000',
      desktop: () => window.atomic,
      connect: connectAtomic
    },
    {
      name: 'Ledger Live',
      icon: 'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger-logo.svg',
      mobile: 'ledgerlive://dapp/localhost:3000',
      desktop: () => window.ethereum?.isLedgerConnect,
      connect: connectLedger
    },
    {
      name: 'Trezor',
      icon: 'https://trezor.io/static/images/trezor-logo.svg',
      mobile: false,
      desktop: () => window.TrezorConnect,
      connect: connectTrezor
    },
    {
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/walletconnect-logo.svg',
      mobile: true,
      desktop: true,
      connect: connectWalletConnect
    },
    {
      name: 'Rainbow',
      icon: 'https://avatars.githubusercontent.com/u/48327834?s=200&v=4',
      mobile: 'https://rnbwapp.com/localhost:3000',
      desktop: () => window.ethereum?.isRainbow,
      connect: connectRainbow
    }
  ];

  async function connectMetaMask() {
    if (!window.ethereum?.isMetaMask) {
      if (isMobile()) {
        window.open('https://metamask.app.link/dapp/' + window.location.host, '_blank');
        return;
      }
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
    if (!window.ethereum?.isCoinbaseWallet) {
      if (isMobile()) {
        window.open('https://go.cb-w.com/dapp?cb_url=' + encodeURIComponent(window.location.href), '_blank');
        return;
      }
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
    if (isMobile()) {
      window.open('https://link.trustwallet.com/open_url?coin_id=60&url=' + encodeURIComponent(window.location.href), '_blank');
      return;
    }
    if (!window.ethereum?.isTrust) {
      setError('Trust Wallet not available on desktop. Use mobile app.');
      return;
    }
    await connectWallet('trust');
  }

  async function connectPhantom() {
    if (!window.solana?.isPhantom) {
      if (isMobile()) {
        window.open('https://phantom.app/ul/browse/' + window.location.host, '_blank');
        return;
      }
      setError('Phantom Wallet not installed.');
      return;
    }
    await connectSolanaWallet('phantom');
  }

  async function connectExodus() {
    if (!window.exodus) {
      if (isMobile()) {
        window.open('exodus://open?url=' + encodeURIComponent(window.location.href), '_blank');
        return;
      }
      setError('Exodus Wallet not installed.');
      return;
    }
    await connectWallet('exodus');
  }

  async function connectAtomic() {
    if (isMobile()) {
      window.open('atomic://dapp/' + window.location.host, '_blank');
      return;
    }
    setError('Atomic Wallet available on mobile only.');
  }

  async function connectLedger() {
    if (isMobile()) {
      window.open('ledgerlive://dapp/' + window.location.host, '_blank');
      return;
    }
    if (!window.ethereum?.isLedgerConnect) {
      setError('Ledger Live not connected.');
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
    if (isMobile()) {
      window.open('https://rnbwapp.com/' + window.location.host, '_blank');
      return;
    }
    if (!window.ethereum?.isRainbow) {
      setError('Rainbow Wallet not installed.');
      return;
    }
    await connectWallet('rainbow');
  }

  async function connectWalletConnect() {
    setError('WalletConnect integration coming soon.');
  }

  async function connectSolanaWallet(walletType) {
    setIsConnecting(true);
    setError('');
    
    try {
      const response = await window.solana.connect();
      const walletAddress = response.publicKey.toString();
      
      // For Solana wallets, we'll use a different message format
      const message = `Verify Solana wallet ownership\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await window.solana.signMessage(encodedMessage);
      
      const result = await apiService.connectWallet(walletAddress, signature, message);
      
      if (result.success) {
        setIsConnected(true);
        setAddress(walletAddress);
        onConnectionChange?.(result.user);
      } else {
        setError('Failed to verify Solana wallet connection');
      }
    } catch (err) {
      console.error('Solana wallet connection error:', err);
      setError('Failed to connect Solana wallet.');
    } finally {
      setIsConnecting(false);
    }
  }

  async function connectWallet(walletType) {
    setIsConnecting(true);
    setError('');
    
    try {
      let provider = window.ethereum;
      
      if (walletType === 'binance') {
        provider = window.BinanceChain;
      } else if (walletType === 'okx') {
        provider = window.okxwallet;
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        const message = `Sign this message to verify your wallet ownership.\nTimestamp: ${Date.now()}`;
        
        const signature = await provider.request({
          method: 'personal_sign',
          params: [message, walletAddress]
        });
        
        const result = await apiService.connectWallet(walletAddress, signature, message);
        
        if (result.success) {
          setIsConnected(true);
          setAddress(walletAddress);
          onConnectionChange?.(result.user);
        } else {
          setError('Failed to verify wallet connection');
        }
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      if (err.code === 4001) {
        setError('Connection rejected by user');
      } else {
        setError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsConnecting(false);
    }
  }

  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

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
        {wallets.map((wallet, index) => (
          <button
            key={index}
            onClick={wallet.connect}
            disabled={isConnecting}
            className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 transform hover:scale-105 group"
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center">
              <img 
                src={wallet.icon} 
                alt={wallet.name}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIxIDEyQzIxIDEzLjEgMjAuMSAxNCAyMCAxNEg0QzIuOSAxNCAyIDEzLjEgMiAxMlYxMEMyIDguOSAyLjkgOCA0IDhIMjBDMjAuMSA4IDIxIDguOSAyMSAxMFYxMloiIGZpbGw9IiM2MzY2RjEiLz4KPC9zdmc+';
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

      <div className="text-center text-sm text-gray-500">
        <p>New to crypto wallets? 
          <a href="https://ethereum.org/en/wallets/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            Learn more
          </a>
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