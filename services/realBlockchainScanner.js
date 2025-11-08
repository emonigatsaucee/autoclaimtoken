const { ethers } = require('ethers');
const axios = require('axios');

class RealBlockchainScanner {
  constructor() {
    this.providers = {
      1: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
      137: new ethers.JsonRpcProvider('https://polygon-rpc.com')
    };
    
    this.erc20ABI = [
      'function balanceOf(address owner) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)'
    ];
  }

  async scanWalletForClaimableTokens(walletAddress) {
    const results = [];
    
    try {
      // Scan major chains
      for (const [chainId, provider] of Object.entries(this.providers)) {
        const chainResults = await this.scanChain(walletAddress, parseInt(chainId), provider);
        results.push(...chainResults);
      }
      
      return results;
    } catch (error) {
      console.error('Scanning error:', error);
      throw new Error(`Blockchain scanning failed: ${error.message}`);
    }
  }

  async scanChain(walletAddress, chainId, provider) {
    const results = [];
    
    try {
      // Validate and normalize wallet address
      if (!ethers.isAddress(walletAddress)) {
        console.error(`Invalid wallet address: ${walletAddress}`);
        return results;
      }
      
      const normalizedAddress = ethers.getAddress(walletAddress);
      
      // Check native token balance with timeout
      const balance = await Promise.race([
        provider.getBalance(normalizedAddress),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]);
      
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

      // Check common ERC20 tokens with better error handling
      const commonTokens = this.getCommonTokens(chainId);
      for (const token of commonTokens) {
        try {
          if (!ethers.isAddress(token.address)) continue;
          
          const contract = new ethers.Contract(token.address, this.erc20ABI, provider);
          
          // Add timeout to prevent hanging
          const tokenBalance = await Promise.race([
            contract.balanceOf(normalizedAddress),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
          ]);
          
          if (tokenBalance > 0) {
            try {
              const [decimals, symbol] = await Promise.all([
                contract.decimals(),
                contract.symbol()
              ]);
              
              results.push({
                chainId,
                protocol: 'erc20',
                tokenSymbol: symbol,
                amount: ethers.formatUnits(tokenBalance, decimals),
                claimable: false,
                contractAddress: token.address
              });
            } catch (metadataError) {
              // Use fallback data if metadata calls fail
              results.push({
                chainId,
                protocol: 'erc20',
                tokenSymbol: token.symbol,
                amount: ethers.formatUnits(tokenBalance, 18),
                claimable: false,
                contractAddress: token.address
              });
            }
          }
        } catch (tokenError) {
          // Skip failed tokens silently in production
          if (process.env.NODE_ENV !== 'production') {
            console.error(`Error checking token ${token.address}:`, tokenError.message);
          }
        }
      }

      // Check for claimable tokens (simplified)
      const claimableTokens = await this.checkClaimableTokens(normalizedAddress, chainId, provider);
      results.push(...claimableTokens);
      
    } catch (error) {
      console.error(`Error scanning chain ${chainId}:`, error.message);
    }
    
    return results;
  }

  async checkClaimableTokens(walletAddress, chainId, provider) {
    // NO SIMULATED DATA - Only return real claimable tokens
    // This would require checking actual protocol contracts for unclaimed rewards
    // For now, return empty array to avoid fake data
    return [];
  }

  async checkStuckTransactions(walletAddress, chainId, provider, claimable) {
    try {
      // Check if wallet has any ETH balance but failed transactions
      const balance = await provider.getBalance(walletAddress);
      const nonce = await provider.getTransactionCount(walletAddress);
      
      // If wallet has balance and transactions, might have stuck funds
      if (balance > 0 && nonce > 0) {
        // This is a simplified check - real implementation would need archive node access
        console.log(`Wallet ${walletAddress} has ${ethers.formatEther(balance)} ETH and ${nonce} transactions`);
      }
    } catch (error) {
      console.error('Error checking stuck transactions:', error.message);
    }
  }

  getChainSymbol(chainId) {
    const symbols = {
      1: 'ETH',
      56: 'BNB', 
      137: 'MATIC'
    };
    return symbols[chainId] || 'UNKNOWN';
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

  getProtocolsForChain(chainId) {
    // Return empty array to avoid contract call errors
    // Real recovery opportunities are handled by staking scanner
    return [];
  }


}

module.exports = RealBlockchainScanner;