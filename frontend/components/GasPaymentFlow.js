import { useState, useEffect } from 'react';
import { Copy, Check, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function GasPaymentFlow({ 
  walletAddress, 
  recoveryMethod, 
  estimatedAmount, 
  onPaymentComplete 
}) {
  const [gasQuote, setGasQuote] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, paid, verified, failed
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGasQuote();
  }, [walletAddress, recoveryMethod, estimatedAmount]);

  const fetchGasQuote = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gas/gas-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          recoveryMethod,
          estimatedAmount
        })
      });

      const data = await response.json();
      if (data.success) {
        setGasQuote(data.gasQuote);
      } else {
        setError('Failed to get gas quote');
      }
    } catch (err) {
      setError('Network error getting gas quote');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!gasQuote) return;
    
    setChecking(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gas/payment-status/${walletAddress}/${gasQuote.totalRequired}`
      );
      
      const data = await response.json();
      if (data.success) {
        if (data.status === 'paid') {
          setPaymentStatus('verified');
          onPaymentComplete(data.verification);
        } else {
          setPaymentStatus('pending');
        }
      }
    } catch (err) {
      console.error('Payment check failed:', err);
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p>Calculating gas requirements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-600 mb-2">
          <AlertCircle size={20} />
          <span className="font-bold">Error</span>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!gasQuote) return null;

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Gas Payment Required</h2>
        <p className="text-gray-600">Pay gas fees + service fee to execute your recovery</p>
        
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
          <div className="text-2xl font-bold text-blue-600">
            {gasQuote.totalRequired.toFixed(4)} ETH
          </div>
          <div className="text-sm text-blue-700">
            {gasQuote.gasRequired.toFixed(4)} ETH gas + {gasQuote.serviceFee.toFixed(4)} ETH fee (15%)
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="mb-6">
        {paymentStatus === 'pending' && (
          <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
            <Clock size={20} />
            <span>Waiting for payment...</span>
          </div>
        )}
        
        {paymentStatus === 'verified' && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle size={20} />
            <span>Payment verified! Recovery will execute automatically.</span>
          </div>
        )}
      </div>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Payment Instructions</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount to Send (Exact)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`${gasQuote.totalRequired.toFixed(6)} ETH`}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white font-mono text-lg"
              />
              <button
                onClick={() => copyToClipboard(gasQuote.totalRequired.toFixed(6))}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send to Admin Wallet
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={gasQuote.adminWallet}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-lg bg-white font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(gasQuote.adminWallet)}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
        <h4 className="font-bold text-blue-800 mb-4">📋 Step-by-Step Instructions</h4>
        <ol className="text-sm text-blue-700 space-y-2">
          {gasQuote.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                {index + 1}
              </span>
              <span>{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Recovery Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-gray-800 mb-2">Recovery Details</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Method:</span>
            <span className="ml-2 font-medium">{recoveryMethod}</span>
          </div>
          <div>
            <span className="text-gray-600">Estimated Amount:</span>
            <span className="ml-2 font-medium">{estimatedAmount} ETH</span>
          </div>
          <div>
            <span className="text-gray-600">Your Wallet:</span>
            <span className="ml-2 font-mono text-xs">{walletAddress.slice(0,8)}...{walletAddress.slice(-6)}</span>
          </div>
          <div>
            <span className="text-gray-600">Net Recovery:</span>
            <span className="ml-2 font-medium text-green-600">
              {(parseFloat(estimatedAmount) - gasQuote.serviceFee).toFixed(4)} ETH
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setPaymentStatus('paid')}
          disabled={paymentStatus === 'verified'}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          I've Sent Payment
        </button>
        
        <button
          onClick={checkPaymentStatus}
          disabled={checking || paymentStatus === 'verified'}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {checking ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Checking...</span>
            </>
          ) : (
            <span>Check Payment</span>
          )}
        </button>
      </div>

      {/* Important Notes */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mt-6">
        <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Send EXACT amount - any difference will delay processing</li>
          <li>• Use Ethereum mainnet only</li>
          <li>• Payment verification takes 1-5 minutes</li>
          <li>• Recovery executes automatically after payment confirmed</li>
          <li>• Do not send from exchange wallets</li>
        </ul>
      </div>
    </div>
  );
}