const axios = require('axios');

class ExternalBalanceAPI {
  constructor() {
    this.etherscanKey = 'YourApiKeyToken'; // Free tier
    this.bscscanKey = 'YourApiKeyToken';   // Free tier
  }

  async checkBalanceViaAPI(address) {
    const results = {
      totalValueUSD: 0,
      chains: {},
      tokens: [],
      hasBalance: false
    };

    try {
      // Etherscan API for ETH balance
      const ethResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.etherscanKey}`, {
        timeout: 10000
      });

      if (ethResponse.data.status === '1') {
        const ethBalance = parseFloat(ethResponse.data.result) / 1e18;
        if (ethBalance > 0) {
          results.totalValueUSD += ethBalance * 3000;
          results.chains.ethereum = {
            name: 'Ethereum',
            symbol: 'ETH',
            balance: ethBalance,
            usdValue: ethBalance * 3000
          };
          results.hasBalance = true;
        }
      }

      // BSC API for BNB balance
      const bscResponse = await axios.get(`https://api.bscscan.com/api?module=account&action=balance&address=${address}&tag=latest&apikey=${this.bscscanKey}`, {
        timeout: 10000
      });

      if (bscResponse.data.status === '1') {
        const bnbBalance = parseFloat(bscResponse.data.result) / 1e18;
        if (bnbBalance > 0) {
          results.totalValueUSD += bnbBalance * 600;
          results.chains.bsc = {
            name: 'BSC',
            symbol: 'BNB',
            balance: bnbBalance,
            usdValue: bnbBalance * 600
          };
          results.hasBalance = true;
        }
      }

      // USDT balance via Etherscan
      const usdtResponse = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&address=${address}&tag=latest&apikey=${this.etherscanKey}`, {
        timeout: 10000
      });

      if (usdtResponse.data.status === '1') {
        const usdtBalance = parseFloat(usdtResponse.data.result) / 1e6;
        if (usdtBalance > 0) {
          results.totalValueUSD += usdtBalance;
          results.tokens.push({
            symbol: 'USDT',
            balance: usdtBalance,
            usdValue: usdtBalance
          });
          results.hasBalance = true;
        }
      }

    } catch (error) {
      console.log('External API check failed:', error.message);
    }

    return results;
  }
}

module.exports = ExternalBalanceAPI;