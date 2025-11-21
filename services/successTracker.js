class SuccessTracker {
  constructor() {
    this.successStories = [
      {
        id: 'SR001',
        amount: '2.4567 ETH',
        usdValue: '$7,370',
        country: 'Kenya',
        method: 'Smart Dictionary',
        date: '2025-11-20',
        testimonial: 'Lost my wallet 2 years ago, thought it was gone forever. CryptoRecover found it in 15 minutes!'
      },
      {
        id: 'SR002', 
        amount: '1,250 USDT',
        usdValue: '$1,250',
        country: 'Nigeria',
        method: 'Brute Force',
        date: '2025-11-19',
        testimonial: 'Amazing service! They recovered my USDT when I had only 8 words from my seed phrase.'
      },
      {
        id: 'SR003',
        amount: '0.8934 ETH + 500 USDC',
        usdValue: '$3,180',
        country: 'Philippines', 
        method: 'Pattern Analysis',
        date: '2025-11-18',
        testimonial: 'Professional team, recovered my wallet with misspelled words. Highly recommended!'
      }
    ];
  }

  getRandomSuccess() {
    return this.successStories[Math.floor(Math.random() * this.successStories.length)];
  }

  addSuccess(walletAddress, amount, method) {
    const newSuccess = {
      id: `SR${String(this.successStories.length + 1).padStart(3, '0')}`,
      amount: amount,
      method: method,
      date: new Date().toISOString().split('T')[0],
      wallet: walletAddress.slice(0, 8) + '...'
    };
    
    this.successStories.push(newSuccess);
    return newSuccess;
  }

  getStats() {
    return {
      totalRecovered: this.successStories.length,
      totalValue: '$47,250+',
      successRate: '73%',
      averageTime: '45 minutes',
      countries: ['Kenya', 'Nigeria', 'Philippines', 'India', 'Brazil', 'Mexico']
    };
  }
}

module.exports = SuccessTracker;