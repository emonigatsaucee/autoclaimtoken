import { useState } from 'react';
import { TrendingUp, ExternalLink, Coins } from 'lucide-react';
import { apiService } from '../utils/api';

export default function StakingScanner({ walletAddress }) {
  const [isScanning, setIsScanning] = useState(false);
  const [stakingRewards, setStakingRewards] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!walletAddress) return;
    
    setIsScanning(true);
    setError('');
    
    try {
      const result = await apiService.scanStaking(walletAddress);
      setStakingRewards(result);
    } catch (err) {
      setError('Failed to scan staking rewards: ' + err.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">Staking Rewards Scanner</h2>
          <p className="text-gray-600 text-sm">
            Scan for unclaimed staking rewards across protocols
          </p>
        </div>
        <button
          onClick={handleScan}
          disabled={!walletAddress || isScanning}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
        >
          <TrendingUp size={16} className="inline mr-2" />
          {isScanning ? 'Scanning...' : 'Scan Staking'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {isScanning && (
        <div className="text-center py-8">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Scanning staking protocols...</p>
        </div>
      )}

      {stakingRewards && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stakingRewards.summary.totalProtocols}
              </div>
              <div className="text-sm text-purple-700">Protocols</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stakingRewards.summary.totalStaked}
              </div>
              <div className="text-sm text-blue-700">Total Staked</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stakingRewards.summary.totalRewards}
              </div>
              <div className="text-sm text-green-700">Rewards Available</div>
            </div>
          </div>

          {stakingRewards.stakingRewards.map((reward, index) => (
            <div key={index} className="border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-purple-800">{reward.protocol}</h4>
                  <p className="text-sm text-gray-600">{reward.type}</p>
                  <p className="text-xs text-gray-500">Staked: {reward.stakedAmount}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-purple-600">{reward.amount} Rewards</div>
                  {reward.claimable && (
                    <button className="bg-purple-600 text-white px-3 py-1 rounded text-xs mt-2">
                      Recover (15% fee: ${(parseFloat(reward.amount) * 0.15 * 3000).toFixed(0)})
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