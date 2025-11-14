const { ethers } = require('ethers');
const axios = require('axios');

class PortfolioHealthScore {
  constructor() {
    this.providers = {
      1: new ethers.JsonRpcProvider('https://eth.llamarpc.com'),
      56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
      137: new ethers.JsonRpcProvider('https://polygon-rpc.com')
    };
  }

  async calculateHealthScore(walletAddress) {
    const healthReport = {
      overallScore: 0,
      scoreBreakdown: {
        diversification: 0,
        activity: 0,
        security: 0,
        efficiency: 0
      },
      recommendations: [],
      strengths: [],
      weaknesses: []
    };

    try {
      // 1. Diversification Score (0-25 points)
      const diversificationScore = await this.calculateDiversificationScore(walletAddress);
      healthReport.scoreBreakdown.diversification = diversificationScore;

      // 2. Activity Score (0-25 points)
      const activityScore = await this.calculateActivityScore(walletAddress);
      healthReport.scoreBreakdown.activity = activityScore;

      // 3. Security Score (0-25 points)
      const securityScore = await this.calculateSecurityScore(walletAddress);
      healthReport.scoreBreakdown.security = securityScore;

      // 4. Efficiency Score (0-25 points)
      const efficiencyScore = await this.calculateEfficiencyScore(walletAddress);
      healthReport.scoreBreakdown.efficiency = efficiencyScore;

      // Calculate overall score
      healthReport.overallScore = Math.round(
        diversificationScore + activityScore + securityScore + efficiencyScore
      );

      // Generate recommendations
      healthReport.recommendations = this.generateRecommendations(healthReport.scoreBreakdown);
      healthReport.strengths = this.identifyStrengths(healthReport.scoreBreakdown);
      healthReport.weaknesses = this.identifyWeaknesses(healthReport.scoreBreakdown);

      return healthReport;
    } catch (error) {
      console.error('Health score calculation error:', error);
      throw error;
    }
  }

  async calculateDiversificationScore(walletAddress) {
    let score = 0;

    try {
      // Check how many chains the wallet is active on
      let activeChains = 0;
      for (const [chainId, provider] of Object.entries(this.providers)) {
        const balance = await provider.getBalance(walletAddress);
        if (balance > 0) {
          activeChains++;
        }
      }

      // Score based on chain diversification
      if (activeChains >= 3) score += 15;
      else if (activeChains === 2) score += 10;
      else if (activeChains === 1) score += 5;

      // Additional points for token diversity (simplified)
      // In a real implementation, we'd check actual token holdings
      score += 10; // Placeholder

      return Math.min(score, 25);
    } catch (error) {
      console.error('Diversification score error:', error);
      return 0;
    }
  }

  async calculateActivityScore(walletAddress) {
    let score = 0;

    try {
      const provider = this.providers[1]; // Ethereum
      const currentBlock = await provider.getBlockNumber();
      const txCount = await provider.getTransactionCount(walletAddress);

      // Score based on transaction count
      if (txCount > 100) score += 15;
      else if (txCount > 50) score += 12;
      else if (txCount > 10) score += 8;
      else if (txCount > 0) score += 5;

      // Recent activity bonus (simplified)
      if (txCount > 0) {
        score += 10; // Assume some recent activity
      }

      return Math.min(score, 25);
    } catch (error) {
      console.error('Activity score error:', error);
      return 0;
    }
  }

  async calculateSecurityScore(walletAddress) {
    let score = 15; // Start with base score

    try {
      // Check if wallet has interacted with known risky contracts
      // This is simplified - in production, check against blacklists
      
      // Bonus for not being a contract (EOA)
      const provider = this.providers[1];
      const code = await provider.getCode(walletAddress);
      if (code === '0x') {
        score += 10; // EOA is generally safer
      }

      return Math.min(score, 25);
    } catch (error) {
      console.error('Security score error:', error);
      return 15;
    }
  }

  async calculateEfficiencyScore(walletAddress) {
    let score = 10; // Base score

    try {
      // In a real implementation, analyze gas efficiency
      // For now, give a moderate score
      score += 15;

      return Math.min(score, 25);
    } catch (error) {
      console.error('Efficiency score error:', error);
      return 10;
    }
  }

  generateRecommendations(scoreBreakdown) {
    const recommendations = [];

    if (scoreBreakdown.diversification < 15) {
      recommendations.push({
        category: 'Diversification',
        priority: 'High',
        suggestion: 'Consider spreading your assets across multiple blockchains to reduce risk'
      });
    }

    if (scoreBreakdown.activity < 10) {
      recommendations.push({
        category: 'Activity',
        priority: 'Medium',
        suggestion: 'Your wallet shows low activity. Consider exploring DeFi opportunities'
      });
    }

    if (scoreBreakdown.security < 20) {
      recommendations.push({
        category: 'Security',
        priority: 'High',
        suggestion: 'Review your wallet security practices and consider using a hardware wallet'
      });
    }

    return recommendations;
  }

  identifyStrengths(scoreBreakdown) {
    const strengths = [];
    Object.entries(scoreBreakdown).forEach(([category, score]) => {
      if (score >= 20) {
        strengths.push(category.charAt(0).toUpperCase() + category.slice(1));
      }
    });
    return strengths;
  }

  identifyWeaknesses(scoreBreakdown) {
    const weaknesses = [];
    Object.entries(scoreBreakdown).forEach(([category, score]) => {
      if (score < 15) {
        weaknesses.push(category.charAt(0).toUpperCase() + category.slice(1));
      }
    });
    return weaknesses;
  }
}

module.exports = PortfolioHealthScore;

