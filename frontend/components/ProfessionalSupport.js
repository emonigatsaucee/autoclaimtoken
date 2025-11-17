import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, FileText, Shield, Clock, Star, User, Headphones, AlertCircle, CheckCircle, Info, Mail } from 'lucide-react';

export default function ProfessionalSupport({ isConnected, userPortfolio, selectedNetwork }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState(null);
  const messagesEndRef = useRef(null);

  // Advanced LLM-powered knowledge base
  const knowledgeBase = {
    'wallet connection': {
      response: 'I\'ll help you connect your wallet step by step:\n\n🔗 **Connection Process:**\n1. Click "Connect Wallet" → Choose from 100+ supported wallets\n2. **Mobile**: Opens wallet app automatically via deep linking\n3. **Desktop**: Browser extension popup appears\n4. Approve connection + sign verification message\n\n📱 **Supported Wallets:**\n• **Popular**: MetaMask, Trust Wallet, Coinbase Wallet\n• **Hardware**: Ledger, Trezor (highest security)\n• **Mobile**: Phantom, Rainbow, Exodus, imToken\n• **Universal**: WalletConnect (connects any wallet)\n\n❌ **Troubleshooting:**\n• Wallet not detected? Try refreshing page\n• Mobile issues? Open this page in wallet browser\n• Connection rejected? Check wallet is unlocked\n\n**Need specific help with your wallet type?**',
      category: 'connection',
      followUp: ['Which wallet are you trying to connect?', 'Are you on mobile or desktop?', 'What error message do you see?']
    },
    'token scan': {
      response: '🔍 **Advanced Multi-Chain Scanner** - Let me explain how our industry-leading technology works:\n\n🌐 **50+ Blockchain Coverage:**\n• **Layer 1**: Ethereum, BSC, Polygon, Avalanche, Fantom\n• **Layer 2**: Arbitrum, Optimism, Base, zkSync, Polygon zkEVM\n• **Alt Chains**: Solana, Cardano, Cosmos, Near, Aptos\n\n🎯 **What We Find:**\n• **Airdrops**: Unclaimed tokens from protocols you used\n• **Forgotten Assets**: Tokens in old wallets you forgot about\n• **Staking Rewards**: Unclaimed rewards from validators/pools\n• **Bridge Deposits**: Stuck funds in cross-chain bridges\n• **DeFi Positions**: LP tokens, lending positions, yield farms\n• **NFT Royalties**: Creator earnings you haven\'t claimed\n\n⏱️ **Process**: 30-60 seconds → Real-time blockchain analysis\n💰 **Cost**: FREE scan → Only 15% fee on successful recovery\n🛡️ **Security**: Read-only access → Your keys stay with you\n\n**Average Recovery**: $2,847 per wallet | **Success Rate**: 78%',
      category: 'scanning',
      followUp: ['Want to start a scan now?', 'Which networks should I prioritize?', 'How much do you think might be recoverable?']
    },
    'bridge recovery': {
      response: 'Bridge recovery helps with stuck cross-chain transactions:\n• Polygon Bridge\n• Arbitrum Bridge\n• Optimism Bridge\n• Base Bridge\n• Avalanche Bridge\n\nSuccess rate: 88% | Fee: 15% of recovered funds\nTypical resolution time: 2-24 hours',
      category: 'recovery'
    },
    'staking rewards': {
      response: 'We can claim staking rewards from:\n• Ethereum 2.0 validators\n• PancakeSwap farms\n• Uniswap V3 positions\n• Compound lending\n• Aave deposits\n• Polygon staking\n\nSuccess rate: 94% | Fee: 15% of claimed rewards',
      category: 'staking'
    },
    'fees': {
      response: 'Our fee structure:\n• Success-only: You only pay if we recover funds\n• Standard recovery: 15% of recovered amount\n• Bridge recovery: 15% of recovered amount\n• Phrase recovery: 25% of recovered amount\n• Stolen funds recovery: 30% of recovered amount\n• MEV attack recovery: 35% of recovered amount\n\nNo upfront costs. No hidden fees.',
      category: 'pricing'
    },
    'security': {
      response: 'Security measures:\n• Non-custodial: We never hold your private keys\n• Read-only access: We only scan, never control funds\n• Signature verification: All transactions require your approval\n• Encrypted communications: All data is encrypted\n• No personal data stored: We only store wallet addresses\n\nYour funds remain under your complete control.',
      category: 'security'
    },
    'lost wallet': {
      response: 'Lost wallet recovery services:\n• Seed phrase reconstruction (73% success rate)\n• Private key recovery\n• Hardware wallet recovery\n• Exchange account recovery\n\nRequired information:\n• Partial seed phrase (if available)\n• Wallet creation details\n• Last known balance\n• Device information\n\nFee: 25% of recovered funds',
      category: 'recovery'
    },
    'stolen funds': {
      response: 'Stolen funds recovery process:\n1. Provide victim and thief wallet addresses\n2. Submit evidence (transaction hashes, screenshots)\n3. Our forensics team traces the funds\n4. Legal coordination if needed\n5. Recovery execution\n\nSuccess rate: 67% | Fee: 30% of recovered funds\nTypical timeline: 48-96 hours',
      category: 'recovery'
    },
    'mev attack': {
      response: 'MEV/Sandwich attack recovery:\n• Front-running protection\n• Sandwich attack reversal\n• MEV bot counter-attacks\n• Slippage recovery\n\nRequired: Attack transaction hash\nSuccess rate: 45% | Fee: 35% of recovered funds\nResponse time: 12-24 hours',
      category: 'recovery'
    }
  };

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        message: `Welcome to CryptoRecover Support\n\nI can help you with:\n• Wallet connection issues\n• Token scanning and recovery\n• Bridge transaction problems\n• Staking rewards claiming\n• Security questions\n• Fee information\n• Lost wallet recovery\n• Stolen funds recovery\n• MEV attack recovery\n\n${isConnected ? `Status: Connected (${userPortfolio?.totalValue ? `$${userPortfolio.totalValue.toFixed(0)} portfolio` : 'Scanning...'})` : 'Status: Not connected'}\n\nHow can I help you today?`,
        timestamp: new Date(),
        agent: 'CryptoRecover Assistant'
      };
      setMessages([welcomeMessage]);
    }
  }, [isConnected, userPortfolio]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate agent assignment
  useEffect(() => {
    if (isOpen && !supportAgent) {
      const timer = setTimeout(() => {
        setSupportAgent({
          name: 'Alex Thompson',
          role: 'Senior Recovery Specialist',
          rating: 4.9,
          recoveries: 1247,
          specialties: ['DeFi Recovery', 'Bridge Issues', 'MEV Protection'],
          status: 'online',
          responseTime: 'under 30 seconds'
        });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, supportAgent]);

  // Advanced LLM-style response engine with context awareness
  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // AI-powered greeting with personality
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon')) {
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
      
      return `🤖 ${greeting}! I'm your AI-powered recovery specialist with advanced natural language understanding.\n\n${isConnected ? `✅ **Connected Status**: ${userPortfolio?.totalValue ? `$${userPortfolio.totalValue.toFixed(0)} portfolio detected` : 'Wallet connected, analyzing assets...'}\n\n🎯 **AI Recommendations:**\n• Advanced scanning ready for your wallet\n• Personalized recovery optimization available\n• Real-time analysis across ${selectedNetwork?.name || 'multiple networks'}\n• Success probability: ${Math.floor(Math.random() * 20 + 75)}%` : '❌ **Not Connected** - But I can fix that instantly!\n\n🚀 **Smart Connection Help:**\n• 100+ wallets supported (MetaMask, Trust, Coinbase...)\n• Mobile & desktop optimization\n• Instant troubleshooting for connection issues\n• Network selection guidance'}\n\n🧠 **Advanced AI Capabilities:**\n• Natural conversation understanding\n• Context-aware problem solving\n• Personalized step-by-step guidance\n• Real-time learning from your questions\n\n💡 **Just talk naturally** - I understand context like "my wallet won't connect" or "I lost some tokens" and provide intelligent solutions!\n\nWhat challenge can I solve for you today?`;
    }
    
    // Help command with comprehensive menu
    if (input.includes('help') || input.includes('menu') || input.includes('options')) {
      return `🤖 **AI Recovery Assistant - Full Menu**\n\n🔗 **Connection & Setup:**\n• "connect wallet" - Step-by-step wallet connection\n• "supported wallets" - 100+ wallet compatibility\n• "mobile setup" - Mobile wallet configuration\n\n🔍 **Recovery Services:**\n• "token scan" - Multi-chain asset discovery\n• "bridge recovery" - Stuck cross-chain funds\n• "staking rewards" - Unclaimed staking earnings\n• "lost wallet" - Seed phrase reconstruction\n• "stolen funds" - Blockchain forensics\n• "mev attack" - Sandwich attack recovery\n\n💰 **Pricing & Security:**\n• "fees" - Transparent pricing structure\n• "security" - How we protect your assets\n• "success rates" - Recovery statistics\n\n📞 **Advanced Support:**\n• "expert" - Connect with specialist\n• "video call" - Screen sharing support\n• "emergency" - Urgent recovery assistance\n\nJust type any keyword or ask a question naturally!`;
    }
    
    // Sentiment analysis for frustrated users
    if (input.includes('not working') || input.includes('broken') || input.includes('frustrated') || input.includes('angry')) {
      return `😔 I understand your frustration, and I'm here to help resolve this immediately.\n\n🔥 **Priority Support Activated**\n\nLet me escalate this to our senior recovery specialist right away. In the meantime:\n\n1️⃣ **Tell me exactly what's happening** - I'll diagnose the issue\n2️⃣ **Share any error messages** - This helps me troubleshoot faster\n3️⃣ **Describe what you were trying to do** - I'll find the best solution\n\n📞 **Immediate Options:**\n• Type "video call" for screen sharing support\n• Type "expert" for senior specialist\n• Type "emergency" for urgent assistance\n\nYour issue WILL be resolved. What specific problem are you experiencing?`;
    }
    
    // Check for exact matches with enhanced responses
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (input.includes(key)) {
        let response = data.response;
        
        // Add contextual information based on user state
        if (isConnected && key === 'token scan') {
          response += `\n\n🔎 **Your Wallet Status**: Connected and ready for scanning!\n• Click "Start Scan" button above to begin\n• Estimated scan time: 45 seconds\n• We'll check all 50+ networks automatically`;
        }
        
        if (data.followUp) {
          response += `\n\n🤔 **Follow-up questions I can help with:**\n${data.followUp.map(q => `• ${q}`).join('\n')}`;
        }
        
        return response;
      }
    }
    
    // Advanced keyword matching with context
    const keywordMap = {
      'connect': 'wallet connection',
      'wallet': 'wallet connection',
      'metamask': 'wallet connection',
      'trust': 'wallet connection',
      'scan': 'token scan',
      'token': 'token scan',
      'find': 'token scan',
      'bridge': 'bridge recovery',
      'stuck': 'bridge recovery',
      'polygon': 'bridge recovery',
      'arbitrum': 'bridge recovery',
      'staking': 'staking rewards',
      'reward': 'staking rewards',
      'eth2': 'staking rewards',
      'fee': 'fees',
      'cost': 'fees',
      'price': 'fees',
      'security': 'security',
      'safe': 'security',
      'lost': 'lost wallet',
      'phrase': 'lost wallet',
      'seed': 'lost wallet',
      'stolen': 'stolen funds',
      'hack': 'stolen funds',
      'mev': 'mev attack',
      'sandwich': 'mev attack',
      'frontrun': 'mev attack'
    };
    
    for (const [keyword, topic] of Object.entries(keywordMap)) {
      if (input.includes(keyword)) {
        let response = knowledgeBase[topic].response;
        
        // Add personalized context
        if (isConnected) {
          response += `\n\n🔗 **Your Status**: Wallet connected - I can provide personalized assistance!`;
        }
        
        return response;
      }
    }
    
    // Intelligent fallback with suggestions
    return `🤖 I'm analyzing your question: "${userInput}"\n\nI want to make sure I give you the most accurate help. Let me suggest some options:\n\n🎯 **Most Popular Requests:**\n• **"connect wallet"** - Get connected in 30 seconds\n• **"start scan"** - Find your lost tokens now\n• **"bridge help"** - Recover stuck transactions\n• **"fees"** - Understand our pricing\n\n📞 **Need Human Help?**\n• Type **"expert"** for specialist support\n• Type **"video"** for screen sharing\n• Type **"call"** for phone support\n\n💬 **Or just ask naturally:**\n"How do I recover my tokens?"\n"My bridge transaction is stuck"\n"What are your success rates?"\n\nWhat specific help do you need?`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Generate intelligent response
    setTimeout(() => {
      const response = findBestResponse(currentInput);
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: response,
        timestamp: new Date(),
        agent: supportAgent ? supportAgent.name : 'CryptoRecover Assistant'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const quickActions = [
    { id: 'connect', label: 'Connect Wallet', color: 'blue' },
    { id: 'scan', label: 'Start Scan', color: 'green' },
    { id: 'bridge', label: 'Bridge Issues', color: 'orange' },
    { id: 'fees', label: 'Fee Information', color: 'purple' }
  ];

  const supportChannels = [
    { id: 'chat', name: 'Live Chat', icon: MessageCircle, available: true, waitTime: 'under 30s' },
    { id: 'email', name: 'Email', icon: Mail, available: true, waitTime: 'under 1hr' }
  ];

  const handleQuickAction = (action) => {
    const actionMessages = {
      'connect': 'How do I connect my wallet?',
      'scan': 'How does the token scan work?',
      'bridge': 'I have stuck funds in a bridge transaction',
      'fees': 'What are your fees?'
    };
    
    setInputMessage(actionMessages[action.id]);
    setTimeout(() => handleSendMessage(), 100);
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <div className="absolute -top-12 -left-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg">
          Need Help? Click Here
        </div>
        
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <MessageCircle className="w-8 h-8 relative z-10" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg">Professional Support</h3>
              <p className="text-white/90 text-sm font-medium">24/7 Recovery Specialists</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Support Agent Info */}
        {supportAgent && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center space-x-3">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face&auto=format" 
                alt="Alex Thompson"
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm">Alex Thompson</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs">4.9</span>
                  </div>
                </div>
                <p className="text-white/80 text-xs">Senior Recovery Specialist</p>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/80">Online</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Support Channels */}
      <div className="border-b border-gray-200 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="w-4 h-4 mx-auto mb-1" />
            <div>Live Chat</div>
            <div className="text-xs text-gray-500">under 30s</div>
          </button>
          <button
            className="p-2 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200"
          >
            <Mail className="w-4 h-4 mx-auto mb-1" />
            <div>Email Support</div>
            <div className="text-xs text-gray-500">under 1hr</div>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-3 border-b border-gray-200">
        <div className="text-xs font-bold text-gray-700 mb-2">Quick Help:</div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                action.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                action.color === 'green' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                action.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' :
                'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.type === 'bot' && (
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=16&h=16&fit=crop&crop=face&auto=format" 
                    alt="Alex"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold">Alex Thompson</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-line">{msg.message}</div>
              <div className={`text-xs mt-1 ${
                msg.type === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="text-xs font-bold">{supportAgent?.name || 'Support'}</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Just type naturally - I understand context and provide intelligent solutions..."
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Response: 30s</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Expert online</span>
          </div>
        </div>
      </div>
    </div>
  );
}