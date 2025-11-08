const { ethers } = require('ethers');

class PaymentProcessor {
  constructor() {
    // Your OKX wallet addresses for different currencies
    this.paymentWallets = {
      ETH: process.env.PAYMENT_WALLET_ETH || '0x23911afca321de7bdd404af809e29a9621dc4bd1',
      USDT_TRC20: process.env.PAYMENT_WALLET_USDT_TRC20 || 'TUjuxkyc12zUbVgWiEQn17VYKf4yB5YYm1',
      BTC: process.env.PAYMENT_WALLET_BTC || '35yWsg6WJRfQg7h3sKXnt93r1Dz3WpCSoX'
    };
  }

  async processPayment(walletAddress, recoveredAmount, currency = 'ETH', userSigner) {
    const feeAmount = (parseFloat(recoveredAmount) * 0.15).toString(); // 15% fee
    const paymentWallet = this.paymentWallets[currency] || this.paymentWallets.ETH;
    
    try {
      // Create payment transaction
      const paymentTx = {
        to: paymentWallet,
        value: ethers.parseEther(feeAmount),
        gasLimit: 21000
      };
      
      // User signs and sends payment
      const tx = await userSigner.sendTransaction(paymentTx);
      await tx.wait();
      
      return {
        success: true,
        txHash: tx.hash,
        amount: feeAmount,
        recipient: paymentWallet,
        currency: currency
      };
    } catch (error) {
      throw new Error('Payment failed: ' + error.message);
    }
  }

  async generatePaymentRequest(recoveredAmount) {
    const feeUSD = parseFloat(recoveredAmount) * 0.15 * 3000; // Assume ETH = $3000 for base calculation
    
    // Fetch real-time rates
    let rates = { ETH: 3000, BTC: 45000, USDT: 1 }; // Fallback rates
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,tether&vs_currencies=usd');
      const data = await response.json();
      rates = {
        ETH: data.ethereum.usd,
        BTC: data.bitcoin.usd,
        USDT: data.tether.usd
      };
    } catch (error) {
      console.error('Failed to fetch rates, using fallback');
    }
    
    // Network fees to ensure we receive exact 15%
    const networkFees = {
      ETH: 0.002,  // ETH gas fee
      USDT: 1,     // USDT TRC-20 fee
      BTC: 0.0001  // BTC transaction fee
    };
    
    return {
      feeUSD: feeUSD.toFixed(2),
      paymentOptions: [
        {
          currency: 'ETH',
          address: this.paymentWallets.ETH,
          amount: ((feeUSD / rates.ETH) + networkFees.ETH).toFixed(6),
          network: 'Ethereum (ERC-20)',
          rate: rates.ETH,
          networkFee: networkFees.ETH
        },
        {
          currency: 'USDT',
          address: this.paymentWallets.USDT_TRC20,
          amount: ((feeUSD / rates.USDT) + networkFees.USDT).toFixed(2),
          network: 'Tron (TRC-20)',
          rate: rates.USDT,
          networkFee: networkFees.USDT
        },
        {
          currency: 'BTC',
          address: this.paymentWallets.BTC,
          amount: ((feeUSD / rates.BTC) + networkFees.BTC).toFixed(6),
          network: 'Bitcoin',
          rate: rates.BTC,
          networkFee: networkFees.BTC
        }
      ],
      message: `15% recovery fee - ${feeUSD.toFixed(2)} USD`
    };
  }
}

module.exports = PaymentProcessor;