const fs = require('fs').promises;
const path = require('path');

class AdminStats {
  constructor() {
    this.statsFile = path.join(__dirname, '../data/admin_stats.json');
    this.initializeStats();
  }

  async initializeStats() {
    try {
      await fs.access(this.statsFile);
    } catch (error) {
      // File doesn't exist, create it
      const initialStats = {
        totalWalletsScanned: 0,
        walletsWithFunds: 0,
        totalValueFound: 0,
        lastScanDate: null,
        scanHistory: []
      };
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(this.statsFile), { recursive: true });
      await fs.writeFile(this.statsFile, JSON.stringify(initialStats, null, 2));
    }
  }

  async updateStats(scannedCount, fundedCount, totalValue) {
    try {
      const stats = await this.getStats();
      
      stats.totalWalletsScanned += scannedCount;
      stats.walletsWithFunds += fundedCount;
      stats.totalValueFound += totalValue;
      stats.lastScanDate = new Date().toISOString();
      
      // Add to scan history (keep last 10 scans)
      stats.scanHistory.unshift({
        date: new Date().toISOString(),
        scanned: scannedCount,
        funded: fundedCount,
        value: totalValue
      });
      
      if (stats.scanHistory.length > 10) {
        stats.scanHistory = stats.scanHistory.slice(0, 10);
      }
      
      await fs.writeFile(this.statsFile, JSON.stringify(stats, null, 2));
      return stats;
    } catch (error) {
      console.log('Failed to update admin stats:', error.message);
      return null;
    }
  }

  async getStats() {
    try {
      const data = await fs.readFile(this.statsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return {
        totalWalletsScanned: 0,
        walletsWithFunds: 0,
        totalValueFound: 0,
        lastScanDate: null,
        scanHistory: []
      };
    }
  }

  async getStatsMessage() {
    const stats = await this.getStats();
    const successRate = stats.totalWalletsScanned > 0 ? 
      ((stats.walletsWithFunds / stats.totalWalletsScanned) * 100).toFixed(2) : 0;
    
    return `📊 ADMIN RECOVERY STATS:
🔍 Total Wallets Scanned: ${stats.totalWalletsScanned.toLocaleString()}
💰 Wallets with Funds: ${stats.walletsWithFunds.toLocaleString()}
💵 Total Value Found: $${stats.totalValueFound.toFixed(2)}
📈 Success Rate: ${successRate}%
📅 Last Scan: ${stats.lastScanDate ? new Date(stats.lastScanDate).toLocaleDateString() : 'Never'}

🏆 RECENT ACTIVITY:
${stats.scanHistory.slice(0, 3).map((scan, i) => 
  `${i + 1}. ${new Date(scan.date).toLocaleDateString()}: ${scan.scanned} scanned, ${scan.funded} funded ($${scan.value.toFixed(2)})`
).join('\n') || 'No recent scans'}`;
  }
}

module.exports = new AdminStats();