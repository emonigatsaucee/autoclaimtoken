const { ethers } = require('ethers');
const { pool } = require('../config/database');

class BlockchainScanner {
  constructor() {
    this.providers = {
      1: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
      137: new ethers.JsonRpcProvider('https://polygon-rpc.com'),
      42161: new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'),
      10: new ethers.JsonRpcProvider('https://mainnet.optimism.io')
    };
    
    this.protocolContracts = {
      uniswap: {
        address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        abi: ['function balanceOf(address) view returns (uint256)', 'function claimableTokens(address) view returns (uint256)']
      },
      compound: {
        address: '0xc00e94cb662c3520282e6f5717214004a7f26888',
        abi: ['function getCompAccrued(address) view returns (uint256)']
      },
      aave: {
        address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
        abi: ['function getUserRewards(address[],address,address) view returns (uint256)']
      }
    };
  }

  async scanWalletForClaimableTokens(walletAddress) {
    const results = [];
    
    for (const [chainId, provider] of Object.entries(this.providers)) {
      try {
        const chainResults = await this.scanChain(walletAddress, parseInt(chainId), provider);
        results.push(...chainResults);
      } catch (error) {
        console.error(`Error scanning chain ${chainId}:`, error.message);
      }
    }
    
    await this.saveScannedResults(walletAddress, results);
    return results;
  }

  async scanChain(walletAddress, chainId, provider) {
    const results = [];
    
    // Check ETH/native token balance
    const balance = await provider.getBalance(walletAddress);
    if (balance > 0) {
      results.push({
        chainId,
        protocol: 'native',
        tokenSymbol: this.getChainSymbol(chainId),
        amount: ethers.formatEther(balance),
        claimable: false,
        contractAddress: null
      });
    }

    // Scan major DeFi protocols
    for (const [protocolName, config] of Object.entries(this.protocolContracts)) {
      try {
        const contract = new ethers.Contract(config.address, config.abi, provider);
        const claimableAmount = await this.getClaimableAmount(contract, walletAddress, protocolName);
        
        if (claimableAmount > 0) {
          results.push({
            chainId,
            protocol: protocolName,
            tokenSymbol: this.getProtocolToken(protocolName),
            amount: ethers.formatUnits(claimableAmount, 18),
            claimable: true,
            contractAddress: config.address
          });
        }
      } catch (error) {
        console.error(`Error checking ${protocolName} on chain ${chainId}:`, error.message);
      }
    }

    // Scan for ERC20 tokens with significant balances
    const tokenResults = await this.scanERC20Tokens(walletAddress, chainId, provider);
    results.push(...tokenResults);

    return results;
  }

  async getClaimableAmount(contract, walletAddress, protocolName) {
    switch (protocolName) {
      case 'uniswap':
        try {
          return await contract.claimableTokens(walletAddress);
        } catch {
          return await contract.balanceOf(walletAddress);
        }
      case 'compound':
        return await contract.getCompAccrued(walletAddress);
      case 'aave':
        const assets = ['0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'];
        return await contract.getUserRewards(assets, walletAddress, walletAddress);
      default:
        return 0;
    }
  }

  async scanERC20Tokens(walletAddress, chainId, provider) {
    const results = [];
    const commonTokens = this.getCommonTokens(chainId);
    
    for (const token of commonTokens) {
      try {
        const contract = new ethers.Contract(
          token.address,
          ['function balanceOf(address) view returns (uint256)', 'function decimals() view returns (uint8)'],
          provider
        );
        
        const balance = await contract.balanceOf(walletAddress);
        const decimals = await contract.decimals();
        
        if (balance > 0) {
          results.push({
            chainId,
            protocol: 'erc20',
            tokenSymbol: token.symbol,
            amount: ethers.formatUnits(balance, decimals),
            claimable: false,
            contractAddress: token.address
          });
        }
      } catch (error) {
        console.error(`Error checking token ${token.symbol}:`, error.message);
      }
    }
    
    return results;
  }

  async saveScannedResults(walletAddress, results) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Clear old scan results
      await client.query(
        'DELETE FROM blockchain_scans WHERE wallet_address = $1',
        [walletAddress]
      );
      
      // Insert new results
      for (const result of results) {
        await client.query(`
          INSERT INTO blockchain_scans 
          (wallet_address, chain_id, protocol_name, contract_address, claimable_amount, token_symbol, gas_estimate)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          walletAddress,
          result.chainId,
          result.protocol,
          result.contractAddress,
          result.amount,
          result.tokenSymbol,
          result.claimable ? 150000 : 0
        ]);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  getChainSymbol(chainId) {
    const symbols = {
      1: 'ETH',
      56: 'BNB',
      137: 'MATIC',
      42161: 'ETH',
      10: 'ETH'
    };
    return symbols[chainId] || 'UNKNOWN';
  }

  getProtocolToken(protocol) {
    const tokens = {
      uniswap: 'UNI',
      compound: 'COMP',
      aave: 'AAVE'
    };
    return tokens[protocol] || 'UNKNOWN';
  }

  getCommonTokens(chainId) {
    const tokens = {
      1: [
        { address: '0xA0b86a33E6441b8435b662303c0f098C8c8c30c1', symbol: 'USDC' },
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT' },
        { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC' }
      ],
      56: [
        { address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', symbol: 'USDC' },
        { address: '0x55d398326f99059fF775485246999027B3197955', symbol: 'USDT' }
      ],
      137: [
        { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC' },
        { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT' }
      ]
    };
    return tokens[chainId] || [];
  }
}

module.exports = BlockchainScanner;