import { useState } from 'react';
import { Search, Coins, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { apiService } from '../utils/api';
import { formatAmount, SUPPORTED_CHAINS } from '../utils/web3Config';

export default function TokenScanner({ walletAddress, onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setError('');
    setScanResults(null);
    
    try {
      const result = await apiService.scanWallet(walletAddress);
      
      if (result.success) {
        setScanResults(result);
        onScanComplete?.(result);
      } else {
        setError('Failed to scan wallet');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError('Scanning failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const getChainName = (chainId) => {
    return SUPPORTED_CHAINS[chainId]?.name || `Chain ${chainId}`;
  };

  const getExplorerUrl = (chainId, address) => {
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) return '#';
    return `${chain.explorer}/address/${address}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Token Scanner</h2>
          <p className="text-gray-600 text-sm">
            Scan your wallet across multiple blockchains for claimable tokens
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={!walletAddress || isScanning}
          className="btn-primary flex items-center space-x-2"
        >
          <Search size={16} />
          <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isScanning && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">
              <span className="loading-dots">Scanning blockchains</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This may take 30-60 seconds...
          </p>
        </div>
      )}

      {scanResults && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {scanResults.summary.totalTokens}
              </div>
              <div className="text-sm text-blue-700">Total Tokens</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {scanResults.summary.claimableTokens}
              </div>
              <div className="text-sm text-green-700">Claimable</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scanResults.summary.chains}
              </div>
              <div className="text-sm text-purple-700">Chains</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                ${scanResults.summary.totalValue}
              </div>
              <div className="text-sm text-yellow-700">Est. Value</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Discovered Tokens</h3>
            <div className="space-y-3">
              {scanResults.results.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Coins size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{token.tokenSymbol}</div>
                      <div className="text-sm text-gray-600">
                        {getChainName(token.chainId)} • {token.protocol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatAmount(token.amount)} {token.tokenSymbol}
                      </div>
                      <div className="text-sm text-gray-600">
                        ~${formatAmount(parseFloat(token.amount) * 1, 2)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {token.claimable ? (
                        <span className="status-pending flex items-center space-x-1">
                          <Clock size={12} />
                          <span>Claimable</span>
                        </span>
                      ) : (
                        <span className="status-completed flex items-center space-x-1">
                          <CheckCircle size={12} />
                          <span>In Wallet</span>
                        </span>
                      )}
                      
                      {token.contractAddress && (
                        <a
                          href={getExplorerUrl(token.chainId, token.contractAddress)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {scanResults.results.filter(t => t.claimable).length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Ready to Claim</h4>
              <p className="text-sm text-green-700 mb-3">
                You have {scanResults.results.filter(t => t.claimable).length} tokens ready to claim.
                Proceed to recovery analysis to optimize your claiming strategy.
              </p>
              <button className="btn-primary text-sm">
                Analyze Recovery Options
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}