# CryptoRecover - Simple Blockchain Asset Scanner

A clean, user-friendly platform to scan your crypto wallets across multiple blockchains and discover claimable tokens, staking rewards, and forgotten assets.

## 🚀 Key Features

- **Multi-Chain Support**: Scan Ethereum, BSC, Polygon, Arbitrum, Optimism and more
- **Real-Time Scanning**: Live blockchain data - no fake or simulated results
- **Non-Custodial**: You maintain full control - we never ask for private keys
- **Simple 3-Step Process**: Connect → Scan → View Results
- **Portfolio Insights**: See your real token balances and transaction history
- **Gas Optimization**: Track and optimize your gas spending

## 🎯 What Makes Us Different

- **100% Real Data**: No mock statistics or fake numbers
- **User-Friendly**: Simple, clean interface designed for everyone
- **Transparent**: Clear explanations of what we find and how recovery works
- **Privacy-Focused**: Minimal data collection, maximum security
- **📱 Mobile-Responsive**: Works perfectly on ANY device - phones, tablets, desktops

## 🛠 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL database
- Advanced blockchain scanning
- Multi-chain RPC integration

### Frontend
- Next.js + React
- Tailwind CSS
- Web3 wallet integration
- Responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/cryptorecover.git
cd cryptorecover

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Start backend
npm run dev

# Start frontend (new terminal)
cd frontend
npm run dev
```

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@localhost:5432/autoclaimtoken
NODE_ENV=development
PORT=3001
JWT_SECRET=your-secret-key
```

## 🌐 Deployment

### Render (Backend + Database)
1. Create PostgreSQL database on Render
2. Deploy backend as Web Service
3. Set environment variables

### Vercel (Frontend)
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically

## 🔧 API Endpoints

### Core Features
- `POST /api/connect-wallet` - Wallet connection
- `POST /api/scan-wallet` - Multi-chain token scanning
- `POST /api/analyze-recovery` - Recovery analysis
- `POST /api/create-recovery-job` - Create recovery job
- `POST /api/execute-recovery/:jobId` - Execute recovery

### Unique Features (NEW!)
- `POST /api/analyze-gas` - Gas optimization analysis
- `POST /api/portfolio-health` - Portfolio health score
- `POST /api/aggregate-assets` - Cross-chain asset aggregation
- `POST /api/real-time-insights` - Real-time blockchain insights
- `GET /api/platform-stats` - Real platform statistics

## 🔐 Security

- Non-custodial architecture
- Signature-based authentication
- Rate limiting and DDoS protection
- Input validation and sanitization
- Smart contract security audits

## 🌟 Unique Features

### 1. Gas Optimization Tracker
- Analyze your gas spending across all chains
- Get personalized optimization suggestions
- See which transactions cost you the most
- Identify opportunities to save on fees

### 2. Portfolio Health Score
- Get a 0-100 health score for your portfolio
- Breakdown by diversification, activity, security, and efficiency
- Personalized recommendations for improvement
- Track your portfolio health over time

### 3. Cross-Chain Asset Aggregator
- View all your assets across 7+ blockchains in one place
- See your portfolio distribution
- Find bridge opportunities to save on gas
- Real-time balance updates

### 4. Real-Time Blockchain Insights
- Live transaction history
- Current portfolio value
- Recent activity tracking
- Top token holdings

## 📊 Recovery Methods

1. **Direct Claim** - Simple token claims
2. **Contract Interaction** - Complex smart contract operations
3. **Multicall Batch** - Batch operations
4. **Flashloan Recovery** - Capital-efficient recovery
5. **Social Recovery** - Multi-signature consensus

## 🤝 Supported Wallets

- MetaMask, Trust Wallet, Coinbase Wallet
- Phantom, Ledger Live, Trezor
- Exodus, Rainbow, Argent
- Atomic Wallet, imToken
- WalletConnect protocol

## 📱 Mobile Support

Full mobile compatibility with deep linking for all major wallet apps.

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For technical support or business inquiries, contact our 24/7 support team through the platform dashboard.

---

**CryptoRecover** - Professional blockchain asset recovery services trusted by 85,000+ users worldwide.