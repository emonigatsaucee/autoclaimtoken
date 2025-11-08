import { useState } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export default function WalletSelector({ onBack, onWalletConnect }) {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [connecting, setConnecting] = useState(false);

  const wallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: 'https://metamask.io/favicon.ico',
      description: 'Most popular Ethereum wallet',
      downloadUrl: 'https://metamask.io/download/',
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      icon: 'https://trustwallet.com/favicon.ico',
      description: 'Multi-chain mobile wallet',
      downloadUrl: 'https://trustwallet.com/download',
      installed: typeof window !== 'undefined' && window.ethereum?.isTrust
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: 'https://www.coinbase.com/favicon.ico',
      description: 'Secure wallet by Coinbase',
      downloadUrl: 'https://www.coinbase.com/wallet',
      installed: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: 'https://walletconnect.com/favicon.ico',
      description: 'Connect any mobile wallet',
      downloadUrl: 'https://walletconnect.com/',
      installed: true
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: 'https://phantom.app/favicon.ico',
      description: 'Solana & Ethereum wallet',
      downloadUrl: 'https://phantom.app/',
      installed: typeof window !== 'undefined' && window.solana?.isPhantom
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      icon: 'https://rainbow.me/favicon.ico',
      description: 'Colorful Ethereum wallet',
      downloadUrl: 'https://rainbow.me/',
      installed: typeof window !== 'undefined' && window.ethereum?.isRainbow
    }
  ];

  const handleWalletSelect = async (wallet) => {
    setSelectedWallet(wallet.id);
    setConnecting(true);

    try {
      if (!wallet.installed) {
        // Redirect to download page
        window.open(wallet.downloadUrl, '_blank');
        setConnecting(false);
        return;
      }

      let account = null;

      switch (wallet.id) {
        case 'metamask':
          if (window.ethereum?.isMetaMask) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
          }
          break;

        case 'trustwallet':
          if (window.ethereum?.isTrust) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
          }
          break;

        case 'coinbase':
          if (window.ethereum?.isCoinbaseWallet) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
          }
          break;

        case 'phantom':
          if (window.solana?.isPhantom) {
            const response = await window.solana.connect();
            account = response.publicKey.toString();
          }
          break;

        default:
          // Fallback to any available ethereum provider
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
          }
      }

      if (account) {
        onWalletConnect({
          walletAddress: account,
          walletType: wallet.name,
          success: true
        });
      } else {
        throw new Error('Failed to connect wallet');
      }

    } catch (error) {
      console.error('Wallet connection failed:', error);
      alert(`Failed to connect ${wallet.name}: ${error.message}`);
    } finally {
      setConnecting(false);
      setSelectedWallet(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect Your Wallet</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred wallet to start recovering your lost crypto assets. 
            We support all major wallets across multiple blockchains.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📋 How to Connect:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <div className="font-bold">Choose Wallet</div>
                <div>Select your wallet from the list below</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <div className="font-bold">Install if Needed</div>
                <div>Download wallet if not installed</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <div className="font-bold">Approve Connection</div>
                <div>Click "Connect" in your wallet popup</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:scale-105 ${
                wallet.installed 
                  ? 'border-gray-200 hover:border-blue-400 hover:shadow-lg' 
                  : 'border-gray-100 opacity-75'
              } ${
                selectedWallet === wallet.id && connecting 
                  ? 'border-blue-500 bg-blue-50' 
                  : ''
              }`}
              onClick={() => handleWalletSelect(wallet)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900">{wallet.name}</h3>
                  <p className="text-sm text-gray-600">{wallet.description}</p>
                </div>
                {wallet.installed && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>

              {wallet.installed ? (
                <button
                  disabled={connecting && selectedWallet === wallet.id}
                  className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                    connecting && selectedWallet === wallet.id
                      ? 'bg-blue-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {connecting && selectedWallet === wallet.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              ) : (
                <button className="w-full py-3 px-4 rounded-lg font-bold bg-gray-600 hover:bg-gray-700 text-white transition-colors flex items-center justify-center space-x-2">
                  <span>Install Wallet</span>
                  <ExternalLink size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl p-8 mt-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-6">
            Don't have a crypto wallet yet? No problem! We recommend starting with MetaMask - 
            it's the most popular and user-friendly option.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">🔰 New to Crypto?</h4>
              <p className="text-sm text-gray-600 mb-4">
                MetaMask is perfect for beginners. It's free, secure, and works with all major websites.
              </p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Get MetaMask</span>
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-bold text-gray-900 mb-2">📱 Mobile User?</h4>
              <p className="text-sm text-gray-600 mb-4">
                Trust Wallet is great for mobile users with built-in DApp browser and multi-chain support.
              </p>
              <a
                href="https://trustwallet.com/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Get Trust Wallet</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}