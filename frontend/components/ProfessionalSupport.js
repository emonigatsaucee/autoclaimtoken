import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, FileText, Shield, Clock, Star, User, Headphones, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function ProfessionalSupport({ isConnected, userPortfolio, selectedNetwork }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState(null);
  const messagesEndRef = useRef(null);

  // Knowledge base for intelligent responses
  const knowledgeBase = {
    'wallet connection': {
      response: 'To connect your wallet:\n1. Click "Connect Wallet" button\n2. Select your wallet type (MetaMask, Trust Wallet, etc.)\n3. Approve the connection in your wallet\n4. Sign the verification message\n\nSupported wallets: MetaMask, Trust Wallet, Coinbase Wallet, WalletConnect, Phantom, Rainbow, Exodus, Ledger, Trezor',
      category: 'connection'
    },
    'token scan': {
      response: 'Our token scanner checks 50+ blockchains for:\n• Unclaimed airdrops\n• Forgotten tokens\n• Staking rewards\n• Bridge deposits\n• DeFi positions\n\nThe scan is free and takes 30-60 seconds. You only pay our 15% fee if we successfully recover funds.',
      category: 'scanning'
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
      setTimeout(() => {
        setSupportAgent({
          name: 'Sarah Chen',
          role: 'Senior Recovery Specialist',
          rating: 4.9,
          recoveries: 1247,
          specialties: ['DeFi Recovery', 'Bridge Issues', 'MEV Protection'],
          status: 'online',
          responseTime: '< 30 seconds',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        });
      }, 2000);
    }
  }, [isOpen]);

  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Check for exact matches first
    for (const [key, data] of Object.entries(knowledgeBase)) {
      if (input.includes(key)) {
        return data.response;
      }
    }
    
    // Check for related keywords
    if (input.includes('connect') || input.includes('wallet')) {
      return knowledgeBase['wallet connection'].response;
    }
    if (input.includes('scan') || input.includes('token')) {
      return knowledgeBase['token scan'].response;
    }
    if (input.includes('bridge') || input.includes('stuck')) {
      return knowledgeBase['bridge recovery'].response;
    }
    if (input.includes('staking') || input.includes('reward')) {
      return knowledgeBase['staking rewards'].response;
    }
    if (input.includes('fee') || input.includes('cost') || input.includes('price')) {
      return knowledgeBase['fees'].response;
    }
    if (input.includes('security') || input.includes('safe')) {
      return knowledgeBase['security'].response;
    }
    if (input.includes('lost') || input.includes('phrase') || input.includes('seed')) {
      return knowledgeBase['lost wallet'].response;
    }
    if (input.includes('stolen') || input.includes('hack')) {
      return knowledgeBase['stolen funds'].response;
    }
    if (input.includes('mev') || input.includes('sandwich')) {
      return knowledgeBase['mev attack'].response;
    }
    
    // Default response
    return `I understand you need help with "${userInput}". Let me connect you with our recovery specialist for personalized assistance.\n\nFor immediate help, try asking about:\n• Wallet connection\n• Token scanning\n• Bridge recovery\n• Staking rewards\n• Security questions\n• Fee information\n\nOr type "help" for a full list of topics I can assist with.`;
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
    { id: 'chat', name: 'Live Chat', icon: MessageCircle, available: true, waitTime: '< 30s' },
    { id: 'video', name: 'Video Call', icon: Video, available: true, waitTime: '< 2min' },
    { id: 'phone', name: 'Phone', icon: Phone, available: true, waitTime: '< 1min' },
    { id: 'expert', name: 'Expert', icon: Shield, available: true, waitTime: '< 5min' }
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
                src={supportAgent.avatar} 
                alt={supportAgent.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm">{supportAgent.name}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs">{supportAgent.rating}</span>
                  </div>
                </div>
                <p className="text-white/80 text-xs">{supportAgent.role}</p>
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
        <div className="grid grid-cols-4 gap-2">
          {supportChannels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveTab(channel.id)}
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === channel.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <channel.icon className="w-4 h-4 mx-auto mb-1" />
              <div>{channel.name}</div>
              <div className="text-xs text-gray-500">{channel.waitTime}</div>
            </button>
          ))}
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
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold">{msg.agent}</span>
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
            placeholder="Ask about wallet connection, scanning, recovery..."
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