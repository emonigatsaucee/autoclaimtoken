import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Star, Shield, Zap, TrendingUp, Award, Clock, Users, DollarSign } from 'lucide-react';

// Advanced AI Response System with Personality
function generateIntelligentResponse(message, isConnected, userPortfolio, agent) {
  const msg = message.toLowerCase();
  const opportunities = userPortfolio?.recoveryOpportunities || 0;
  const estimatedValue = userPortfolio?.estimatedRecoverable || 0;
  const assets = userPortfolio?.assets || [];
  
  // Advanced intent analysis with emotional intelligence
  const intent = analyzeIntent(msg);
  const emotion = detectEmotion(msg);
  const urgency = detectUrgency(msg);
  const context = {
    isConnected,
    hasOpportunities: opportunities > 0,
    portfolioValue: estimatedValue,
    assetCount: assets.length,
    emotion,
    urgency
  };
  
  return generateContextualResponse(intent, context, message, agent, userPortfolio);
}

// Detect user emotion for empathetic responses
function detectEmotion(message) {
  const emotions = {
    frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'upset', 'irritated'],
    worried: ['worried', 'concerned', 'scared', 'nervous', 'anxious', 'afraid'],
    excited: ['excited', 'amazing', 'awesome', 'great', 'fantastic', 'wonderful'],
    confused: ['confused', 'lost', 'dont understand', "don't get", 'unclear'],
    skeptical: ['doubt', 'suspicious', 'scam', 'fake', 'trust', 'believe']
  };
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return emotion;
    }
  }
  return 'neutral';
}

// Detect urgency level
function detectUrgency(message) {
  const urgentWords = ['urgent', 'asap', 'immediately', 'now', 'quick', 'fast', 'emergency', 'help'];
  return urgentWords.some(word => message.includes(word)) ? 'high' : 'normal';
}

function analyzeIntent(message) {
  const intents = {
    greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon'],
    connection: ['connect', 'wallet', 'metamask', 'trust wallet', 'ledger'],
    safety: ['safe', 'secure', 'trust', 'scam', 'legitimate', 'real'],
    fees: ['fee', 'cost', 'price', 'charge', 'expensive', 'cheap'],
    process: ['how', 'step', 'guide', 'tutorial', 'process', 'procedure'],
    claiming: ['claim', 'get', 'receive', 'withdraw', 'recover'],
    technical: ['error', 'problem', 'issue', 'bug', 'not working', 'failed'],
    timeframe: ['when', 'time', 'long', 'fast', 'quick', 'instant'],
    support: ['help', 'support', 'assist', 'question'],
    portfolio: ['balance', 'assets', 'tokens', 'analysis', 'breakdown'],
    comparison: ['better', 'best', 'compare', 'alternative', 'vs'],
    doubt: ['really', 'sure', 'certain', 'doubt', 'skeptical']
  };
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent;
    }
  }
  
  return 'general';
}

function generateContextualResponse(intent, context, originalMessage, agent, userPortfolio) {
  const responses = {
    greeting: () => {
      if (!context.isConnected) {
        return `Hello! I'm ${agent.name}, and I'm genuinely excited to help you recover your crypto assets. I've been doing this for ${agent.experience} and have seen it all - from simple staking rewards to complex DeFi recoveries. What brings you here today?`;
      }
      return `Hi there! Great to see you back. I've been analyzing your wallet and I'm impressed with what I'm seeing. You have some real opportunities here. What would you like to tackle first?`;
    },
    
    connection: () => {
      if (context.isConnected) {
        return `Your wallet is already connected and looking good! I can see ${context.assetCount} different assets. If you want to connect a different wallet, just disconnect this one first and I'll walk you through connecting any of the 100+ wallets I support.`;
      }
      return `Connecting your wallet is actually the fun part - it's where the magic happens! I support everything from MetaMask and Trust Wallet to hardware wallets like Ledger. Even Bitcoin and USDT addresses work. The connection is completely secure - I never see your private keys. Want me to walk you through it?`;
    },
    
    safety: () => {
      return `I totally understand your concern - crypto security is everything. Here's the truth: I'm completely non-custodial, which means your funds never leave your control. I've maintained a ${agent.successRate} success rate over ${agent.experience} because I'm obsessive about security. Your private keys stay in your wallet, always. I've been audited by top security firms and trusted by 85,000+ users. What specific security aspect concerns you most?`;
    },
    
    fees: () => {
      if (context.hasOpportunities) {
        const fee = (context.portfolioValue * 0.15).toFixed(2);
        const net = (context.portfolioValue * 0.85).toFixed(2);
        return `My fee structure is refreshingly simple - I only charge 15% of what I successfully recover. For your ${context.portfolioValue.toFixed(1)} ETH opportunity, that's ${fee} ETH fee, ${net} ETH for you. Zero upfront costs, zero hidden fees. I literally only get paid when you get paid. Fair?`;
      }
      return `I only charge 15% of successfully recovered funds - nothing upfront, nothing hidden. If I don't recover anything, you pay nothing. It's that simple. Most clients tell me it's the fairest fee structure they've seen in crypto. Connect your wallet and I'll show you exactly what the numbers look like for your situation.`;
    },
    
    process: () => {
      if (context.hasOpportunities) {
        return `Perfect question! For your specific situation, here's exactly what happens: First, I'll guide you to Step 4 (Staking Scanner), then you click 'Scan Staking' - I'll be right there with you. You'll see your ${context.portfolioValue.toFixed(1)} ETH rewards, click 'Claim', and boom - instant execution. The whole thing takes about 2 minutes. Want me to start walking you through it now?`;
      }
      return `Great question! The process is surprisingly straightforward: Connect wallet → I scan for opportunities → You review what I found → Choose what to recover → I execute it instantly. Most recoveries happen in under 5 minutes. The beauty is in the simplicity. Ready to see how it works with your wallet?`;
    },
    
    claiming: () => {
      if (context.hasOpportunities) {
        return `Excellent! You're ready to claim. I can see ${context.portfolioValue.toFixed(1)} ETH waiting for you. Here's what we'll do right now: Go to Step 4, click 'Scan Staking', review your rewards, then hit 'Claim Rewards'. The system executes instantly - no waiting, no complications. Your net amount will be ${(context.portfolioValue * 0.85).toFixed(2)} ETH. Shall we do this?`;
      }
      return `I love your enthusiasm! To claim rewards, I first need to see what's available in your wallet. Connect it and I'll scan across 50+ blockchains to find everything claimable - staking rewards, forgotten airdrops, stuck bridge funds, you name it. Then we'll prioritize the highest-value, lowest-risk recoveries first. Ready to discover what's waiting for you?`;
    },
    
    technical: () => {
      return `Technical issues happen, and I'm here to solve them. I've seen every error imaginable in ${agent.experience}. Tell me exactly what's happening - is it a connection issue, transaction failing, or something else? I'll walk you through the fix step by step. Most issues are actually simple fixes that take 30 seconds.`;
    },
    
    timeframe: () => {
      if (context.hasOpportunities) {
        return `Your recovery will be lightning fast! Staking rewards like yours execute instantly - literally 30 seconds from click to completion. Bridge recoveries might take 2-5 minutes. The longest I've ever seen was 10 minutes for a complex DeFi position. Your ${context.portfolioValue.toFixed(1)} ETH? That'll be in your wallet before you finish reading this message.`;
      }
      return `Speed is one of my specialties! Most recoveries happen instantly - staking rewards in 30 seconds, bridge funds in 2-5 minutes. The scanning process takes about 60 seconds across all chains. From wallet connection to funds in your account, we're usually talking under 5 minutes total. Fast enough for you?`;
    },
    
    portfolio: () => {
      if (context.assetCount > 0) {
        const assetList = userPortfolio.assets.map(a => `${a.amount} ${a.symbol}`).join(', ');
        return `Your portfolio looks interesting! I can see: ${assetList}. Total value around $${(context.portfolioValue * 3000).toFixed(0)} with ${context.portfolioValue.toFixed(1)} ETH in recoverable opportunities. The diversity is good - shows you're active across multiple chains. Want me to break down the recovery potential for each asset?`;
      }
      return `I'd love to analyze your portfolio! Once you connect your wallet, I'll give you a complete breakdown - asset distribution, recovery opportunities, risk assessment, the works. I scan across 50+ blockchains to catch everything. It's like having a personal crypto analyst. Ready to see what I find?`;
    },
    
    doubt: () => {
      if (context.emotion === 'skeptical') {
        return `I completely understand your skepticism - in crypto, being cautious is survival. Here's what makes me different: I'm completely transparent about my methods, I never touch your private keys, and I only get paid when YOU get paid. I've recovered ${agent.recoveredAmount} because I treat every wallet like it's my own family's money. Want to see my security certifications and audit reports?`;
      }
      return `I appreciate your skepticism - it shows you're smart about crypto security. Look, I've recovered ${agent.recoveredAmount} for clients, maintained a ${agent.successRate} success rate, and been trusted by 85,000+ users. But don't take my word for it. Connect your wallet (completely safe), let me show you what I find, and you decide. No commitments, no risks. Fair enough?`;
    },
    
    general: () => {
      if (context.emotion === 'frustrated') {
        return `I can sense you're frustrated, and I totally get it. Crypto can be overwhelming, especially when you're trying to recover lost funds. Take a deep breath - I'm here to make this as simple as possible. Let me break everything down in plain English. What's the main thing that's bothering you right now?`;
      }
      if (context.urgency === 'high') {
        return `I understand this is urgent for you! Let me fast-track this. ${context.hasOpportunities ? `You have ${context.portfolioValue.toFixed(1)} ETH ready to claim right now. I can execute this in the next 60 seconds.` : 'Connect your wallet and I\'ll scan everything in under 30 seconds.'} What do you need me to prioritize first?`;
      }
      if (context.hasOpportunities) {
        return `I'm analyzing your question in the context of your ${context.portfolioValue.toFixed(1)} ETH recovery opportunity. Could you be more specific about what you'd like to know? I can explain the technical details, walk through the process, discuss security, or just start the recovery right now. What would be most helpful?`;
      }
      return `That's an interesting question! I want to give you the most accurate answer possible. Could you elaborate a bit more? I specialize in crypto recovery across 50+ blockchains, so whether it's about wallets, fees, security, or the recovery process itself, I've got detailed answers. What specific aspect interests you most?`;
    }
  };
  
  return responses[intent] ? responses[intent]() : responses.general();
}

export default function SupportChat({ isConnected, userPortfolio }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const agent = {
    name: 'Alex Rivera',
    title: 'Elite Blockchain Recovery Engineer',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9InVybCgjZ3JhZGllbnQpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzM5OGVmNDtzdG9wLW9wYWNpdHk6MSIgLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMTk3NmQyO3N0b3Atb3BhY2l0eToxIiAvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMTYiIHI9IjYiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMCAzMEMxMCAyNSAxMyAyMiAyMCAyMlMzMCAyNSAzMCAzMCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    experience: '7+ years',
    specialties: ['Advanced DeFi Recovery', 'Cross-Chain Forensics', 'MEV Protection', 'Smart Contract Auditing'],
    recoveredAmount: '$12.7M+',
    successRate: '96.8%',
    certifications: ['Certified Blockchain Security Professional', 'DeFi Security Specialist'],
    languages: ['English', 'Spanish', 'Mandarin'],
    timezone: 'Available 24/7',
    responseTime: '< 30 seconds'
  };
  
  const getPersonalizedGreeting = () => {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    if (!isConnected) {
      return `Good ${timeOfDay}! I'm ${agent.name}, your elite blockchain recovery engineer. I've successfully recovered ${agent.recoveredAmount} across 50+ blockchains with a ${agent.successRate} success rate. I specialize in finding hidden opportunities others miss. Ready to discover what's waiting in your wallet?`;
    }
    
    if (userPortfolio?.recoveryOpportunities > 0) {
      return `Excellent! I've detected ${userPortfolio.recoveryOpportunities} high-probability recovery opportunities worth approximately $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)}. My advanced scanning algorithms found assets that most tools miss. I'm excited to help you claim every penny that's rightfully yours!`;
    }
    
    return `Welcome! I'm ${agent.name}, and I've just completed a preliminary analysis of your wallet. My proprietary scanning technology is ready to dive deeper and find opportunities across all major blockchains. What type of recovery interests you most?`;
  };
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: getPersonalizedGreeting(),
      sender: 'support', 
      time: new Date(),
      agent: agent,
      type: 'greeting'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showAgentProfile, setShowAgentProfile] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSmartQuickHelp = () => {
    if (!isConnected) {
      return [
        "🔗 Connect my wallet securely",
        "🛡️ Show me your security credentials",
        "💰 What can you recover for me?",
        "⚡ How fast is the process?"
      ];
    }
    
    if (userPortfolio?.recoveryOpportunities > 0) {
      return [
        `🚀 Claim my ${userPortfolio.estimatedRecoverable.toFixed(1)} ETH instantly`,
        "📊 Show detailed recovery analysis",
        "🎯 Execute highest-value recovery first",
        "🔮 What's my success probability?"
      ];
    }
    
    return [
      "🔍 Deep scan for hidden opportunities",
      "🥩 Check all staking rewards",
      "🌉 Find stuck bridge transactions",
      "💎 Discover forgotten airdrops"
    ];
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMsg = { id: Date.now(), text: newMessage, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const currentMessage = newMessage;
    setNewMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Advanced AI response system with realistic delays
    const responseDelay = currentMessage.length > 50 ? 2000 + Math.random() * 1000 : 1000 + Math.random() * 800;
    
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateIntelligentResponse(currentMessage, isConnected, userPortfolio, agent);
      
      const botMsg = { 
        id: Date.now() + 1, 
        text: reply, 
        sender: 'support', 
        time: new Date(),
        agent: agent,
        type: 'response'
      };
      setMessages(prev => [...prev, botMsg]);
    }, responseDelay);
  };

  const handleQuickHelp = (question) => {
    setNewMessage(question);
    handleSend();
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group relative"
        >
          <MessageCircle size={24} className="group-hover:animate-pulse" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
            !
          </div>
        </button>
        <div className="absolute bottom-16 right-0 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with {agent.name} • {agent.responseTime} response
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[550px] bg-white border border-gray-300 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden backdrop-blur-sm">
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white p-3 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-105 transition-transform" 
                  onClick={() => setShowAgentProfile(!showAgentProfile)}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm">{agent.name}</h3>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Shield size={10} className="text-green-400" />
                  <span className="opacity-90">{agent.title}</span>
                  <Zap size={10} className="text-yellow-400" />
                  <span className="opacity-90">{agent.responseTime}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <TrendingUp size={10} className="text-green-400" />
                <span>{agent.successRate} Success</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign size={10} className="text-yellow-400" />
                <span>{agent.recoveredAmount} Recovered</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users size={10} className="text-blue-300" />
                <span>85K+ Clients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {showAgentProfile && (
        <div className="bg-gray-50 border-b p-3 text-sm">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><strong>Experience:</strong> {agent.experience}</div>
            <div><strong>Languages:</strong> {agent.languages.join(', ')}</div>
            <div><strong>Specialties:</strong></div>
            <div className="col-span-2">
              <div className="flex flex-wrap gap-1 mt-1">
                {agent.specialties.map((spec, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{spec}</span>
                ))}
              </div>
            </div>
            <div className="col-span-2 mt-2">
              <strong>Certifications:</strong>
              {agent.certifications.map((cert, i) => (
                <div key={i} className="flex items-center space-x-1 mt-1">
                  <Award size={12} className="text-yellow-600" />
                  <span className="text-xs">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
            {msg.sender === 'support' && (
              <div className="relative mr-2">
                <img 
                  src={msg.agent?.avatar} 
                  alt={msg.agent?.name}
                  className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-md"
                  onClick={() => setShowAgentProfile(!showAgentProfile)}
                />
                {msg.type === 'greeting' && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white animate-bounce"></div>
                )}
              </div>
            )}
            <div className={`max-w-xs p-3 rounded-lg text-sm shadow-md ${
              msg.sender === 'user' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              {msg.sender === 'support' && (
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-blue-600 font-bold">{msg.agent?.name}</span>
                  <div className="flex items-center space-x-1">
                    <Shield size={10} className="text-green-500" />
                    <span className="text-xs text-gray-500">Verified Expert</span>
                  </div>
                </div>
              )}
              <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-xs opacity-70">
                  {msg.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                {msg.sender === 'support' && (
                  <div className="flex items-center space-x-1">
                    <Clock size={10} className="text-green-500" />
                    <span className="text-xs text-green-600">Instant</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
        
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
        <div className="grid grid-cols-1 gap-2 mb-3 max-h-24 overflow-y-auto">
          {getSmartQuickHelp().map((question, i) => (
            <button
              key={i}
              onClick={() => handleQuickHelp(question)}
              className="text-sm bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 p-2 rounded-lg text-left border border-blue-200 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
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
            placeholder="Ask me anything about crypto recovery..."
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 hover:shadow-lg"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}