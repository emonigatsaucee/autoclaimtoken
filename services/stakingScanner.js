const { ethers } = require('ethers');

class StakingRewardsScanner {
  constructor() {
    this.stakingContracts = {
      ethereum: [
        {
          name: 'Ethereum 2.0 Staking',
          contract: '0x00000000219ab540356cBB839Cbe05303d7705Fa', // ETH2 Deposit Contract
          rewardContract: '0x0000000000000000000000000000000000000000',
          type: 'eth2_validator'
        },
        {
          name: 'Lido Staking',
          contract: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // stETH
          rewardContract: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
          type: 'liquid_staking'
        },
        {
          name: 'Rocket Pool',
          contract: '0xae78736Cd615f374D3085123A210448E74Fc6393', // rETH
          rewardContract: '0xD33526068D116cE69F19A9ee46F0bd304F21A51f',
          type: 'liquid_staking'
        }
      ],
      polygon: [
        {
          name: 'Polygon Staking',
          contract: '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908',
          rewardContract: '0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908',
          type: 'pos_validator'
        }
      ]
    };
  }

  async scanStakingRewards(walletAddress) {
    const rewards = [];
    
    for (const [chain, contracts] of Object.entries(this.stakingContracts)) {
      const provider = this.getProvider(chain);
      
      for (const staking of contracts) {
        try {
          const reward = await this.checkStakingContract(walletAddress, staking, provider);
          if (reward.amount > 0) {
            rewards.push(reward);
          }
        } catch (error) {
          console.error(`Error checking ${staking.name}:`, error.message);
        }
      }
    }
    
    return rewards;
  }

  async checkStakingContract(walletAddress, staking, provider) {
    const contract = new ethers.Contract(
      staking.contract,
      ['function balanceOf(address) view returns (uint256)'],
      provider
    );
    
    const balance = await contract.balanceOf(walletAddress);
    const amount = parseFloat(ethers.formatEther(balance));
    
    return {
      protocol: staking.name,
      type: staking.type,
      stakedAmount: amount,
      amount: amount * 0.05, // Estimate 5% annual rewards
      claimable: amount > 0.001,
      contractAddress: staking.contract
    };
  }

  getProvider(chain) {
    const providers = {
      ethereum: new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL),
      polygon: new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL)
    };
    return providers[chain];
  }
}

module.exports = StakingRewardsScanner;