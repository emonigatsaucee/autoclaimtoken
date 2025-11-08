// Mock database for testing without PostgreSQL
let mockData = {
  users: [],
  wallets: [],
  recovery_jobs: [],
  blockchain_scans: [],
  recovery_patterns: []
};

const mockPool = {
  connect: async () => ({
    query: async (sql, params) => {
      console.log('Mock Query:', sql.substring(0, 50) + '...');
      
      // Mock responses for different queries
      if (sql.includes('SELECT * FROM users WHERE wallet_address')) {
        const address = params[0];
        let user = mockData.users.find(u => u.wallet_address === address);
        if (!user && sql.includes('INSERT INTO users')) {
          user = {
            id: mockData.users.length + 1,
            wallet_address: address,
            created_at: new Date(),
            total_recovered: 0,
            success_rate: 0
          };
          mockData.users.push(user);
        }
        return { rows: user ? [user] : [] };
      }
      
      if (sql.includes('INSERT INTO users')) {
        const user = {
          id: mockData.users.length + 1,
          wallet_address: params[0],
          created_at: new Date(),
          total_recovered: 0,
          success_rate: 0
        };
        mockData.users.push(user);
        return { rows: [user] };
      }
      
      if (sql.includes('UPDATE users SET last_scan')) {
        return { rows: [] };
      }
      
      if (sql.includes('DELETE FROM blockchain_scans')) {
        return { rows: [] };
      }
      
      if (sql.includes('INSERT INTO blockchain_scans')) {
        return { rows: [] };
      }
      
      if (sql.includes('INSERT INTO recovery_jobs')) {
        const job = {
          id: mockData.recovery_jobs.length + 1,
          user_id: params[0],
          wallet_address: params[1],
          token_address: params[2],
          token_symbol: params[3],
          estimated_amount: params[4],
          recovery_method: params[5],
          success_probability: params[6],
          status: 'pending',
          created_at: new Date()
        };
        mockData.recovery_jobs.push(job);
        return { rows: [job] };
      }
      
      if (sql.includes('SELECT * FROM recovery_jobs WHERE id')) {
        const jobId = params[0];
        const job = mockData.recovery_jobs.find(j => j.id == jobId);
        return { rows: job ? [job] : [] };
      }
      
      if (sql.includes('UPDATE recovery_jobs SET status')) {
        return { rows: [] };
      }
      
      return { rows: [] };
    },
    release: () => {}
  })
};

const initializeDatabase = async () => {
  console.log('Using mock database for testing');
  return Promise.resolve();
};

module.exports = { pool: mockPool, initializeDatabase };