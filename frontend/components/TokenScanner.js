import { useState } from 'react';
import { Search, Coins, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { apiService } from '../utils/api';
import { formatAmount, SUPPORTED_CHAINS } from '../utils/web3Config';

export default function TokenScanner({ walletAddress, onScanComplete }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setError('');
    setScanResults(null);
    
    try {
      // Show progressive scanning messages
      const messages = [
        'Connecting to blockchain networks...',
        'Scanning Ethereum mainnet...',
        'Checking BSC and Polygon...',
        'Analyzing token balances...',
        'Detecting claimable rewards...',
        'Calculating total value...'
      ];
      
      let messageIndex = 0;
      const messageInterval = setInterval(() => {
        if (messageIndex < messages.length - 1) {
          messageIndex++;
        }
      }, 2000);
      
      const result = await apiService.scanWallet(walletAddress);
      clearInterval(messageInterval);
      
      if (result.success) {
        setScanResults(result);
        onScanComplete?.(result);
        
        // Show success notification
        if (result.summary.claimableTokens > 0) {
          setError('');
        }
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

  const handleStartRecovery = async () => {
    if (!scanResults || !walletAddress) return;
    
    setIsProcessing(true);
    try {
      // Get claimable tokens
      const claimableTokens = scanResults.results.filter(t => t.claimable);
      
      if (claimableTokens.length === 0) {
        setError('No claimable tokens found');
        return;
      }

      // Create recovery jobs for each claimable token
      const recoveryPromises = claimableTokens.map(async (token) => {
        return await apiService.createRecoveryJob({
          walletAddress,
          tokenAddress: token.contractAddress,
          tokenSymbol: token.tokenSymbol,
          estimatedAmount: token.amount,
          recoveryMethod: 'direct_claim'
        });
      });

      const results = await Promise.all(recoveryPromises);
      
      // Show success message
      alert(`Recovery process started! Created ${results.length} recovery jobs. Total estimated recovery: $${scanResults.summary.totalValue}`);
      
      // Scroll to recovery analyzer
      document.getElementById('recovery-analyzer')?.scrollIntoView({ behavior: 'smooth' });
      
    } catch (err) {
      console.error('Recovery start error:', err);
      setError('Failed to start recovery process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = () => {
    if (!scanResults) return;
    
    const claimableTokens = scanResults.results.filter(t => t.claimable);
    const details = claimableTokens.map(token => 
      `${token.tokenSymbol}: ${token.amount} (${getChainName(token.chainId)})`
    ).join('\n');
    
    alert(`Claimable Tokens Details:\n\n${details}\n\nTotal Value: $${scanResults.summary.totalValue}`);
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
        <div className="text-center py-12">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-lg font-semibold text-gray-700 mb-2">
              <span className="loading-dots">Scanning blockchain networks</span>
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-blue-700 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Checking Ethereum mainnet...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Scanning BSC and Polygon...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Analyzing token balances...</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              This process checks multiple blockchains and may take 30-60 seconds
            </p>
          </div>
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
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">!</span>
                </div>
                <div>
                  <h4 className="font-bold text-green-800 text-lg">Claimable Assets Found!</h4>
                  <p className="text-green-700 text-sm">Estimated value: ${scanResults.summary.totalValue}</p>
                </div>
              </div>
              <p className="text-green-700 mb-4">
                We found <span className="font-bold">{scanResults.results.filter(t => t.claimable).length} claimable tokens</span> worth approximately <span className="font-bold">${scanResults.summary.totalValue}</span>.
                Start the recovery process to claim these assets.
              </p>
              <div className="flex space-x-3">
                <button 
                  onClick={handleStartRecovery}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Start Recovery Process</span>
                      <span className="text-lg">→</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={handleViewDetails}
                  className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}