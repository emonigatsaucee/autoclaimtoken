import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

export default function SupportChat({ isConnected, userPortfolio }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const agent = {
    name: 'Sarah Chen',
    title: 'Senior Crypto Recovery Specialist',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    experience: '5+ years',
    specialties: ['DeFi Recovery', 'Multi-Chain Assets', 'Staking Rewards'],
    recoveredAmount: '$2.4M+',
    successRate: '94.7%'
  };
  
  const getPersonalizedGreeting = () => {
    if (!isConnected) {
      return `Hi! I'm ${agent.name}, your dedicated crypto recovery specialist. I've helped recover over ${agent.recoveredAmount} in lost assets. Connect your wallet and I'll analyze your recovery opportunities!`;
    }
    
    if (userPortfolio?.recoveryOpportunities > 0) {
      return `Welcome back! I can see you have ${userPortfolio.recoveryOpportunities} recovery opportunities worth ~$${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)}. I'm here to guide you through claiming them step-by-step!`;
    }
    
    return `Hi! I'm ${agent.name}. I've analyzed your wallet and I'm ready to help you maximize your crypto recovery. What would you like to explore first?`;
  };
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: getPersonalizedGreeting(),
      sender: 'support', 
      time: new Date(),
      agent: agent
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const getSmartQuickHelp = () => {
    if (!isConnected) {
      return [
        "How do I connect my wallet?",
        "What wallets do you support?",
        "Is this service safe?",
        "What can I recover?"
      ];
    }
    
    if (userPortfolio?.recoveryOpportunities > 0) {
      return [
        `Claim my ${userPortfolio.estimatedRecoverable.toFixed(1)} ETH rewards`,
        "Show me my recovery breakdown",
        "Start recovery process now",
        "What's my success probability?"
      ];
    }
    
    return [
      "Scan for hidden opportunities",
      "Check staking rewards",
      "Find stuck bridge funds",
      "What are your fees?"
    ];
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMsg = { id: Date.now(), text: newMessage, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setNewMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Auto-reply based on message
    setTimeout(() => {
      setIsTyping(false);
      let reply = "I'll help you with that. Let me connect you with a specialist.";
      
      // Advanced AI responses based on context
      if (!isConnected) {
        if (newMessage.toLowerCase().includes('connect') || newMessage.toLowerCase().includes('wallet')) {
          reply = `I support 100+ wallets including MetaMask, Trust Wallet, Coinbase, and Ledger. Also Bitcoin and USDT addresses. Simply click any wallet above, approve the connection, and I'll analyze your recovery opportunities instantly.`;
        } else if (newMessage.toLowerCase().includes('safe')) {
          reply = `Absolutely! I've maintained a ${agent.successRate} success rate over ${agent.experience}. We're non-custodial (you keep full control), audited by security firms, and trusted by 85k+ users. Your private keys never leave your device.`;
        } else if (newMessage.toLowerCase().includes('recover')) {
          reply = `I specialize in recovering: Staking rewards, stuck bridge funds, forgotten airdrops, NFTs, and DeFi positions across 50+ blockchains. I've personally recovered ${agent.recoveredAmount} for clients. Connect your wallet to see what's available.`;
        }
      } else {
        const opportunities = userPortfolio?.recoveryOpportunities || 0;
        const estimatedValue = userPortfolio?.estimatedRecoverable || 0;
        
        if (newMessage.toLowerCase().includes('claim') || newMessage.toLowerCase().includes('reward')) {
          reply = `Perfect! I can see you have ${opportunities} recovery opportunities worth approximately $${(estimatedValue * 3000).toFixed(0)}. Here's your personalized recovery plan:\n\n1. Go to Step 4: Staking Scanner\n2. Click 'Scan Staking' (I'll guide you)\n3. Review your ${estimatedValue.toFixed(1)} ETH rewards\n4. Click 'Claim Rewards' - instant execution\n\nYour net amount: ${(estimatedValue * 0.85).toFixed(2)} ETH after 15% fee. Ready to start?`;
        } else if (newMessage.toLowerCase().includes('fee')) {
          reply = `My fee structure is simple and fair: 15% only on successfully recovered funds. For your ${estimatedValue.toFixed(1)} ETH rewards:\n\nRecovery: ${estimatedValue.toFixed(1)} ETH\nMy fee: ${(estimatedValue * 0.15).toFixed(2)} ETH\nYou get: ${(estimatedValue * 0.85).toFixed(2)} ETH\n\nNo upfront costs, no hidden fees. I only get paid when you get paid.`;
        } else if (newMessage.toLowerCase().includes('breakdown') || newMessage.toLowerCase().includes('analysis')) {
          const assets = userPortfolio?.assets || [];
          const assetList = assets.map(a => `${a.amount} ${a.symbol} (${a.chain})`).join('\n');
          reply = `Here's your complete portfolio analysis:\n\nYour Assets:\n${assetList}\n\nRecovery Opportunities: ${opportunities}\nEstimated Recoverable: $${(estimatedValue * 3000).toFixed(0)}\nSuccess Probability: 94.7%\n\nI recommend starting with staking rewards - highest success rate and fastest execution. Want me to guide you through it?`;
        }
      }
      
      const botMsg = { 
        id: Date.now() + 1, 
        text: reply, 
        sender: 'support', 
        time: new Date(),
        agent: agent
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
    
    setNewMessage('');
  };

  const handleQuickHelp = (question) => {
    setNewMessage(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-t-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full border-2 border-white" />
            <div>
              <h3 className="font-semibold text-sm">{agent.name}</h3>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs opacity-90">Online • {agent.title}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
            <X size={20} />
          </button>
        </div>
        <div className="text-xs opacity-90">
          {agent.successRate} Success Rate • {agent.recoveredAmount} Recovered
        </div>
      </div>
      
      {showProfile && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full" />
            <div>
              <h4 className="font-bold text-gray-900">{agent.name}</h4>
              <p className="text-sm text-gray-600">{agent.title}</p>
              <p className="text-xs text-blue-600">{agent.experience} Experience</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-green-50 p-2 rounded">
              <div className="font-semibold text-green-800">{agent.successRate}</div>
              <div className="text-green-600">Success Rate</div>
            </div>
            <div className="bg-blue-50 p-2 rounded">
              <div className="font-semibold text-blue-800">{agent.recoveredAmount}</div>
              <div className="text-blue-600">Total Recovered</div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-600 font-medium">Specialties:</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {agent.specialties.map((spec, i) => (
                <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{spec}</span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            {msg.sender === 'support' && (
              <img 
                src={msg.agent?.avatar} 
                alt={msg.agent?.name}
                className="w-8 h-8 rounded-full mr-2 cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              />
            )}
            <div className={`max-w-xs p-3 rounded-lg text-sm ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
            }`}>
              {msg.sender === 'support' && (
                <div className="text-xs text-blue-600 font-semibold mb-1">{msg.agent?.name}</div>
              )}
              <div className="whitespace-pre-line">{msg.text}</div>
              <div className="text-xs opacity-70 mt-1">
                {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-3">
            <img src={agent.avatar} alt={agent.name} className="w-8 h-8 rounded-full mr-2" />
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
              <div className="text-xs text-blue-600 font-semibold mb-1">{agent.name}</div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-2 border-t">
        <div className="grid grid-cols-1 gap-2 mb-3 max-h-20 overflow-y-auto">
          {getSmartQuickHelp().map((question, i) => (
            <button
              key={i}
              onClick={() => handleQuickHelp(question)}
              className="text-sm bg-blue-50 hover:bg-blue-100 p-2 rounded text-left border border-blue-200 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}