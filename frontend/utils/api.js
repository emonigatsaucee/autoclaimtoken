import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Wallet connection
  connectWallet: async (walletAddress, signature, message) => {
    const response = await api.post('/connect-wallet', {
      walletAddress,
      signature,
      message,
    });
    return response.data;
  },

  // Scanning operations
  scanWallet: async (walletAddress) => {
    const response = await api.post('/scan-wallet', { walletAddress });
    return response.data;
  },

  // Recovery analysis
  analyzeRecovery: async (walletAddress) => {
    const response = await api.post('/analyze-recovery', { walletAddress });
    return response.data;
  },

  // Recovery job management
  createRecoveryJob: async (jobData) => {
    const response = await api.post('/create-recovery-job', jobData);
    return response.data;
  },

  executeRecovery: async (jobId, userSignature) => {
    const response = await api.post(`/execute-recovery/${jobId}`, {
      userSignature,
    });
    return response.data;
  },

  // Dashboard data
  getDashboard: async (walletAddress) => {
    const response = await api.get(`/dashboard/${walletAddress}`);
    return response.data;
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;