import { useState, useEffect } from 'react';
import { Wallet, CheckCircle, AlertCircle, Smartphone, Monitor, RefreshCw, Edit3 } from 'lucide-react';

export default function ImprovedWalletConnection({ onConnectionChange }) {
  const [step, setStep] = useState('detect'); // detect, connect, connected
  const [detectedWallets, setDetectedWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [error, setError] = useState('');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    detectWallets();
    setIsMobile(/Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const detectWallets = () => {
    const detected = [];
    
    if (typeof window !== 'undefined' && window.ethereum) {
      if (window.ethereum.isMetaMask) detected.push({ name: 'MetaMask', icon: '🦊', provider: window.ethereum });
      if (window.ethereum.isTrust) detected.push({ name: 'Trust Wallet', icon: '🛡️', provider: window.ethereum });
      if (window.ethereum.isCoinbaseWallet) detected.push({ name: 'Coinbase', icon: '💼', provider: window.ethereum });
      if (window.ethereum.isRainbow) detected.push({ name: 'Rainbow', icon: '🌈', provider: window.ethereum });
      if (window.ethereum.isBraveWallet) detected.push({ name: 'Brave', icon: '🦁', provider: window.ethereum });
      
      if (detected.length === 0) {
        detected.push({ name: 'Web3 Wallet', icon: '🔐', provider: window.ethereum });
      }
    }
    
    setDetectedWallets(detected);
  };

  const connectWallet = async (wallet) => {
    setIsConnecting(true);
    setError('');
    setSelectedWallet(wallet);

    try {
      const accounts = await wallet.provider.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      setConnectedAddress(address);
      setStep('connected');
      
      // Save connection
      localStorage.setItem('cryptorecover_wallet', JSON.stringify({
        address,
        wallet: wallet.name,
        timestamp: Date.now()
      }));

      onConnectionChange?.({
        walletAddress: address,
        walletType: wallet.name,
        id: Date.now()
      });
    } catch (err) {
      setError(err.message || 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualEntry = () => {
    if (!manualAddress || manualAddress.length < 26) {
      setError('Please enter a valid wallet address');
      return;
    }

    setConnectedAddress(manualAddress);
    setStep('connected');
    
    onConnectionChange?.({
      walletAddress: manualAddress,
      walletType: 'Manual Entry',
      id: Date.now()
    });
  };

  const switchWallet = () => {
    setStep('detect');
    setConnectedAddress('');
    setError('');
    localStorage.removeItem('cryptorecover_wallet');
    onConnectionChange?.(null);
  };

  // Step 1: Detection
  if (step === 'detect') {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600">We'll scan for lost assets across 50+ blockchains</p>
        </div>

        {detectedWallets.length > 0 ? (
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">We detected {detectedWallets.length} wallet(s) on your device</span>
            </div>

            {detectedWallets.map((wallet, idx) => (
              <button
                key={idx}
                onClick={() => connectWallet(wallet)}
                disabled={isConnecting}
                className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{wallet.name}</div>
                    <div className="text-sm text-gray-500">Click to connect</div>
                  </div>
                </div>
                {isConnecting && selectedWallet?.name === wallet.name ? (
                  <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                ) : (
                  <div className="text-blue-500">→</div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900">No wallet detected</p>
                <p className="text-sm text-yellow-700 mt-1">
                  {isMobile 
                    ? 'Please open this page in your wallet browser (MetaMask, Trust Wallet, etc.)'
                    : 'Please install MetaMask or another Web3 wallet extension'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">Or</span>
          </div>
        </div>

        {!showManualEntry ? (
          <button
            onClick={() => setShowManualEntry(true)}
            className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            <Edit3 className="w-5 h-5 inline mr-2" />
            Enter wallet address manually
          </button>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder="0x... or bc1... or T..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleManualEntry}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Continue with Address
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  // Step 2: Connected
  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Wallet Connected</div>
            <div className="text-sm text-gray-600 font-mono">{connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</div>
          </div>
        </div>
        <button
          onClick={switchWallet}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium"
        >
          Switch Wallet
        </button>
      </div>
    </div>
  );
}

