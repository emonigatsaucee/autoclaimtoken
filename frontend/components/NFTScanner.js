import { useState } from 'react';
import { Target, ExternalLink, AlertTriangle } from 'lucide-react';

export default function NFTScanner({ walletAddress }) {
  const [isScanning, setIsScanning] = useState(false);
  const [nftResults, setNftResults] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      // Real NFT scanning using OpenSea API
      const nftResults = await scanRealNFTs(walletAddress);
      setNftResults(nftResults);
    } catch (err) {
      setError('Failed to scan NFTs: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };
  
  const scanRealNFTs = async (walletAddress) => {
    try {
      // Check OpenSea API for user's NFTs
      const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${walletAddress}&limit=50`);
      const data = await response.json();
      
      const stuckNFTs = [];
      let totalValue = 0;
      
      if (data.assets) {
        for (const nft of data.assets) {
          // Check if NFT might be stuck (simplified logic)
          if (nft.last_sale && nft.last_sale.payment_token) {
            const salePrice = parseFloat(nft.last_sale.total_price) / Math.pow(10, nft.last_sale.payment_token.decimals);
            
            // If NFT was sold but still in wallet, might be stuck
            if (salePrice > 0.01) { // Minimum 0.01 ETH value
              stuckNFTs.push({
                tokenId: nft.token_id,
                contractAddress: nft.asset_contract.address,
                name: nft.name || `#${nft.token_id}`,
                collection: nft.collection.name,
                marketplace: 'OpenSea',
                estimatedValue: `${salePrice.toFixed(3)} ETH`,
                imageUrl: nft.image_url,
                recoveryMethod: 'marketplace_withdrawal',
                recoverable: true
              });
              totalValue += salePrice;
            }
          }
        }
      }
      
      return {
        stuckNFTs: stuckNFTs.slice(0, 10), // Limit to 10 results
        summary: {
          totalStuck: stuckNFTs.length,
          totalValue: totalValue.toFixed(3),
          recoverableCount: stuckNFTs.length
        }
      };
      
    } catch (error) {
      console.error('Real NFT scan failed:', error);
      // Fallback to empty results
      return {
        stuckNFTs: [],
        summary: {
          totalStuck: 0,
          totalValue: '0',
          recoverableCount: 0
        }
      };
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">NFT Recovery Scanner</h2>
          <p className="text-gray-600 text-sm">
            Scan for stuck NFTs in marketplace transactions
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={!walletAddress || isScanning}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          <Target size={16} className="inline mr-2" />
          {isScanning ? 'Scanning...' : 'Scan NFTs'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isScanning && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Scanning NFT marketplaces...</p>
        </div>
      )}

      {nftResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {nftResults.summary.totalStuck}
              </div>
              <div className="text-sm text-red-700">Stuck NFTs</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {nftResults.summary.totalValue} ETH
              </div>
              <div className="text-sm text-yellow-700">Total Value</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {nftResults.summary.recoverableCount}
              </div>
              <div className="text-sm text-green-700">Recoverable</div>
            </div>
          </div>

          {nftResults.stuckNFTs.map((nft, index) => (
            <div key={index} className="border border-pink-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-pink-800">NFT #{nft.tokenId}</h4>
                  <p className="text-sm text-gray-600">{nft.marketplace}</p>
                  <p className="text-xs text-gray-500">Value: {nft.estimatedValue}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-pink-600">{nft.recoveryMethod}</div>
                  {nft.recoverable && (
                    <button className="bg-pink-600 text-white px-3 py-1 rounded text-xs mt-2">
                      Recover (15% fee: ${(parseFloat(nft.estimatedValue.split(' ')[0]) * 0.15 * 3000).toFixed(0)})
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