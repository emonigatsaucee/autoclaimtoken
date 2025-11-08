import { useState } from 'react';
import { Zap, ExternalLink, AlertTriangle } from 'lucide-react';
import { apiService } from '../utils/api';

export default function BridgeScanner({ walletAddress }) {
  const [isScanning, setIsScanning] = useState(false);
  const [stuckTransactions, setStuckTransactions] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const result = await apiService.scanBridge(walletAddress);
      setStuckTransactions(result);
    } catch (err) {
      setError('Failed to scan bridge transactions: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Bridge Recovery Scanner</h2>
          <p className="text-gray-600 text-sm">
            Scan for stuck cross-chain bridge transactions
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={!walletAddress || isScanning}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          <Zap size={16} className="inline mr-2" />
          {isScanning ? 'Scanning...' : 'Scan Bridges'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isScanning && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Scanning bridge contracts...</p>
        </div>
      )}

      {stuckTransactions && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {stuckTransactions.summary.totalStuck}
              </div>
              <div className="text-sm text-red-700">Stuck Transactions</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                ${stuckTransactions.summary.totalValue}
              </div>
              <div className="text-sm text-yellow-700">Total Value</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stuckTransactions.summary.recoverableCount}
              </div>
              <div className="text-sm text-green-700">Recoverable</div>
            </div>
          </div>

          {stuckTransactions.stuckTransactions.map((tx, index) => (
            <div key={index} className="border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-red-800">{tx.bridge}</h4>
                  <p className="text-sm text-gray-600">{tx.type}</p>
                  <p className="text-xs text-gray-500">Amount: {tx.amount} {tx.token}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-red-600">{tx.status}</div>
                  <div className="text-xs text-gray-500">{tx.estimatedRecoveryTime}</div>
                  {tx.recoverable && (
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs mt-2">
                      Recover ($299)
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}