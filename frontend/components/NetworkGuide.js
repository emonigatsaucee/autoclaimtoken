import { useState } from 'react';
import { ChevronRight, Star, Zap, Shield, TrendingUp, DollarSign, Clock, Award } from 'lucide-react';

const NetworkGuide = ({ onNetworkSelect, userWalletType }) => {
  const [selectedCategory, setSelectedCategory] = useState('recommended');

  const networks = {
    ethereum: {
      name: 'Ethereum',
      symbol: 'ETH',
      chainId: 1,
      color: 'from-blue-500 to-purple-600',
      successRate: 96,
      avgRecovery: '4.2 ETH',
      avgTime: '2 min',
      opportunities: [
        'ETH 2.0 Validator Rewards',
        'Lido stETH Staking',
        'Rocket Pool rETH',
        'Compound COMP Rewards',
        'Aave Protocol Rewards'
      ],
      bestFor: ['Large Holdings (>1 ETH)', 'Validator Rewards', 'DeFi Positions'],
      realContracts: [
        '0x00000000219ab540356cBB839Cbe05303d7705Fa',
        '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
        '0xae78736Cd615f374D3085123A210448E74Fc6393'
      ]
    },
    bsc: {
      name: 'BSC',
      symbol: 'BNB',
      chainId: 56,
      color: 'from-yellow-500 to-orange-600',
      successRate: 94,
      avgRecovery: '12 BNB',
      avgTime: '1 min',
      opportunities: [
        'PancakeSwap CAKE Staking',
        'Venus Protocol Rewards',
        'BNB Validator Rewards',
        'Yield Farming Positions'
      ],
      bestFor: ['DeFi Yield Farming', 'Fast Recovery', 'High APY Positions'],
      realContracts: [
        '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
        '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
      ]
    },
    polygon: {
      name: 'Polygon',
      symbol: 'MATIC',
      chainId: 137,
      color: 'from-purple-500 to-pink-600',
      successRate: 92,
      avgRecovery: '800 MATIC',
      avgTime: '30 sec',
      opportunities: [
        'Polygon PoS Staking',
        'QuickSwap QUICK Rewards',
        'Aave Polygon Rewards'
      ],
      bestFor: ['Low Gas Fees', 'Staking Rewards', 'Quick Claims'],
      realContracts: [
        '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908'
      ]
    },
    arbitrum: {
      name: 'Arbitrum',
      symbol: 'ARB',
      chainId: 42161,
      color: 'from-blue-400 to-cyan-600',
      successRate: 88,
      avgRecovery: '1.8 ETH',
      avgTime: '3 min',
      opportunities: [
        'GMX Staking Rewards',
        'Arbitrum ARB Claims',
        'Camelot DEX Rewards'
      ],
      bestFor: ['L2 Native Rewards', 'ARB Token Claims', 'Low Gas Costs'],
      realContracts: [
        '0x908C4D94D34924765f1eDc22A1DD098397c59dD4'
      ]
    },
    optimism: {
      name: 'Optimism',
      symbol: 'OP',
      chainId: 10,
      color: 'from-red-500 to-pink-600',
      successRate: 90,
      avgRecovery: '2.1 ETH',
      avgTime: '4 min',
      opportunities: [
        'Optimism OP Claims',
        'Velodrome VELO Rewards',
        'Synthetix SNX Staking'
      ],
      bestFor: ['OP Governance Rewards', 'DeFi Protocols', 'L2 Ecosystem'],
      realContracts: []
    }
  };

  const getRecommendedNetworks = () => {
    switch (userWalletType) {
      case 'whale':
        return ['ethereum', 'arbitrum', 'optimism'];
      case 'defi':
        return ['bsc', 'polygon', 'ethereum'];
      case 'new':
        return ['ethereum', 'bsc', 'polygon'];
      default:
        return ['ethereum', 'bsc', 'polygon'];
    }
  };

  const categories = {
    recommended: {
      title: 'Recommended for You',
      networks: getRecommendedNetworks(),
      description: 'Best networks based on your wallet activity'
    },
    highest: {
      title: 'Highest Success Rate',
      networks: Object.keys(networks).sort((a, b) => networks[b].successRate - networks[a].successRate),
      description: 'Networks with the best recovery success rates'
    },
    fastest: {
      title: 'Fastest Recovery',
      networks: ['polygon', 'bsc', 'ethereum', 'arbitrum', 'optimism'],
      description: 'Networks with quickest claim processing'
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">🌐 Choose Your Network</h3>
        <p className="text-gray-600">Select the best network for maximum recovery potential</p>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-4 mb-6">
        {Object.entries(categories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === key
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{categories[selectedCategory].description}</p>

      {/* Network Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories[selectedCategory].networks.map((networkKey) => {
          const network = networks[networkKey];
          return (
            <div
              key={networkKey}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onNetworkSelect(network)}
            >
              <div className={`bg-gradient-to-r ${network.color} text-white p-3 rounded-lg mb-3`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-lg">{network.name}</h4>
                    <p className="text-sm opacity-90">{network.symbol}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="fill-yellow-300 text-yellow-300" />
                      <span className="text-sm font-bold">{network.successRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <DollarSign size={14} className="text-green-600" />
                    <span className="text-gray-600">Avg Recovery:</span>
                  </div>
                  <span className="font-semibold text-green-600">{network.avgRecovery}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-blue-600" />
                    <span className="text-gray-600">Avg Time:</span>
                  </div>
                  <span className="font-semibold text-blue-600">{network.avgTime}</span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Zap size={14} className="text-yellow-500 mr-1" />
                  Recovery Opportunities:
                </h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {network.opportunities.slice(0, 3).map((opportunity, i) => (
                    <li key={i} className="flex items-center">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                      {opportunity}
                    </li>
                  ))}
                  {network.opportunities.length > 3 && (
                    <li className="text-gray-400">+{network.opportunities.length - 3} more...</li>
                  )}
                </ul>
              </div>

              <div className="mb-4">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <Award size={14} className="text-purple-500 mr-1" />
                  Best For:
                </h5>
                <div className="flex flex-wrap gap-1">
                  {network.bestFor.map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all group-hover:scale-[1.02] flex items-center justify-center space-x-2">
                <span>Connect to {network.name}</span>
                <ChevronRight size={16} />
              </button>

              <div className="mt-2 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Shield size={12} className="text-green-500" />
                  <span>{network.realContracts.length} verified contracts</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2 mb-2">
          <TrendingUp size={16} className="text-green-600" />
          <span className="font-semibold text-green-800">Pro Tip</span>
        </div>
        <p className="text-sm text-green-700">
          Start with <strong>Ethereum</strong> for the highest recovery potential, then try <strong>BSC</strong> for fast DeFi rewards. 
          All networks use real smart contracts - no simulations!
        </p>
      </div>
    </div>
  );
};

export default NetworkGuide;