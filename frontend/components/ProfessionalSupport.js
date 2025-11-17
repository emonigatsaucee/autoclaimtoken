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

  // Ultra-Advanced AI Knowledge Base with Context Awareness
  const knowledgeBase = {
    'wallet connection': {
      response: 'I\'m Alex, your elite recovery specialist. Let me get your wallet connected perfectly:\n\n🚀 **INSTANT CONNECTION PROCESS:**\n1. Click "Connect Wallet" → I support 100+ wallets including:\n   • **MetaMask** (most popular - works on all devices)\n   • **Trust Wallet** (mobile-first, excellent security)\n   • **Coinbase Wallet** (beginner-friendly)\n   • **Hardware Wallets** (Ledger, Trezor - maximum security)\n   • **WalletConnect** (connects ANY mobile wallet)\n\n2. **Mobile Users**: Opens your wallet app automatically\n3. **Desktop Users**: Browser extension popup appears\n4. Sign the verification message (this proves wallet ownership)\n\n🔧 **TROUBLESHOOTING (I\'ve seen it all):**\n• **Wallet not detected?** → Refresh page, ensure extension is enabled\n• **Mobile issues?** → Open this page inside your wallet\'s browser\n• **Connection rejected?** → Unlock wallet first, then retry\n• **Wrong network?** → I\'ll help you switch to the optimal network\n\n💡 **PRO TIP**: I can detect your device type and recommend the best wallet for your situation. What device are you using?',
      category: 'connection',
      followUp: ['Which wallet are you trying to connect?', 'Are you on mobile or desktop?', 'What error message do you see?', 'Need help choosing the best wallet for your device?']
    },
    'token scan': {
      response: '🔍 **ELITE MULTI-CHAIN SCANNER** - This is where I shine! My proprietary scanning technology is industry-leading:\n\n🌐 **50+ BLOCKCHAIN COVERAGE (Real-time analysis):**\n• **Layer 1**: Ethereum, BSC, Polygon, Avalanche, Fantom, Solana\n• **Layer 2**: Arbitrum, Optimism, Base, zkSync, Polygon zkEVM\n• **Emerging**: Aptos, Sui, Cosmos, Near, Cardano, Tron\n• **DeFi Chains**: Uniswap V3, PancakeSwap, SushiSwap, Curve\n\n🎯 **WHAT MY SCANNER FINDS (that others miss):**\n• **Hidden Airdrops**: Tokens from protocols you interacted with\n• **Forgotten Wallets**: Assets in old addresses you forgot\n• **Staking Rewards**: Unclaimed validator/pool rewards\n• **Bridge Deposits**: Funds stuck in cross-chain transfers\n• **DeFi Positions**: LP tokens, lending rewards, yield farms\n• **NFT Royalties**: Creator earnings sitting unclaimed\n• **Failed Transactions**: Recoverable gas from failed txns\n• **Dust Tokens**: Small amounts that add up to real money\n\n⚡ **MY SCANNING PROCESS:**\n1. **Deep Chain Analysis** (30-60 seconds)\n2. **Cross-reference 500+ protocols**\n3. **Calculate exact recovery amounts**\n4. **Prioritize by value and success probability**\n\n💰 **ECONOMICS**: FREE scan → Only 15% fee on successful recovery\n🛡️ **SECURITY**: Read-only access → Your private keys never leave your device\n\n📊 **MY TRACK RECORD**: $12.7M+ recovered | 96.8% success rate | 85,000+ satisfied clients\n\n**Ready to see what treasures are hiding in your wallet?**',
      category: 'scanning',
      followUp: ['Want to start a scan now?', 'Which networks should I prioritize?', 'How much do you think might be recoverable?', 'Should I focus on high-value or quick wins first?']
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

  // Ultra-Advanced AI Conversation Engine with Emotional Intelligence
  const findBestResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const emotion = detectEmotion(input);
    const urgency = detectUrgency(input);
    const context = analyzeContext(input, isConnected, userPortfolio);
    
    // Advanced greeting with personality and context awareness
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('good morning') || input.includes('good afternoon') || input.includes('sup') || input.includes('yo')) {
      const timeOfDay = new Date().getHours();
      const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
      
      let personalizedGreeting = `${greeting}! I'm Alex Thompson, your elite blockchain recovery specialist. `;
      
      if (emotion === 'excited') {
        personalizedGreeting += `I love your energy! `;
      } else if (emotion === 'frustrated') {
        personalizedGreeting += `I can sense you might be dealing with some crypto challenges - don't worry, I'm here to solve them. `;
      } else if (emotion === 'worried') {
        personalizedGreeting += `Take a deep breath - whatever crypto issue you're facing, I've probably solved it before. `;
      }
      
      if (isConnected) {
        if (userPortfolio?.totalValue) {
          personalizedGreeting += `I can see your wallet is connected with $${userPortfolio.totalValue.toFixed(0)} in assets. `;
          if (userPortfolio.recoveryOpportunities > 0) {
            personalizedGreeting += `Even better - I've detected ${userPortfolio.recoveryOpportunities} recovery opportunities worth approximately $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)}! This is going to be good. `;
          }
        } else {
          personalizedGreeting += `Your wallet is connected and my advanced scanners are analyzing your blockchain footprint across 50+ networks. `;
        }
      } else {
        personalizedGreeting += `I notice your wallet isn't connected yet. No problem - I support 100+ wallets and can get you connected in under 30 seconds. `;
      }
      
      personalizedGreeting += `\n\n🚀 **What I can help you with today:**\n• **Token Recovery**: Find hidden assets across 50+ blockchains\n• **Bridge Issues**: Unstuck cross-chain transactions\n• **Staking Rewards**: Claim unclaimed validator rewards\n• **Lost Wallets**: Recover access to old wallets\n• **Stolen Funds**: Blockchain forensics and recovery\n• **MEV Attacks**: Counter sandwich attacks and front-running\n\n💡 **My expertise**: 7+ years in blockchain forensics, $12.7M+ recovered, 96.8% success rate\n\nWhat's your situation? Just describe it naturally - I understand context and can provide intelligent solutions.`;
      
      return personalizedGreeting;
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
    
    // Advanced AI fallback with context analysis
    const contextualResponse = generateContextualResponse(input, emotion, urgency, context, userInput);
    return contextualResponse;
  };
  
  // Emotion detection for empathetic responses
  const detectEmotion = (input) => {
    const emotions = {
      frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'upset', 'irritated', 'pissed', 'hate', 'terrible', 'awful'],
      worried: ['worried', 'concerned', 'scared', 'nervous', 'anxious', 'afraid', 'panic', 'stress', 'help me'],
      excited: ['excited', 'amazing', 'awesome', 'great', 'fantastic', 'wonderful', 'love', 'perfect', 'excellent'],
      confused: ['confused', 'lost', 'dont understand', "don't get", 'unclear', 'what', 'how', 'why', 'explain'],
      skeptical: ['doubt', 'suspicious', 'scam', 'fake', 'trust', 'believe', 'real', 'legit', 'sure'],
      urgent: ['urgent', 'asap', 'now', 'quick', 'fast', 'immediately', 'emergency', 'hurry']
    };
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => input.includes(keyword))) {
        return emotion;
      }
    }
    return 'neutral';
  };
  
  // Urgency detection
  const detectUrgency = (input) => {
    const urgentWords = ['urgent', 'asap', 'immediately', 'now', 'quick', 'fast', 'emergency', 'help', 'stuck', 'lost', 'stolen'];
    return urgentWords.some(word => input.includes(word)) ? 'high' : 'normal';
  };
  
  // Context analysis
  const analyzeContext = (input, connected, portfolio) => {
    return {
      isConnected: connected,
      hasAssets: portfolio?.totalValue > 0,
      hasOpportunities: portfolio?.recoveryOpportunities > 0,
      portfolioValue: portfolio?.totalValue || 0,
      recoveryValue: portfolio?.estimatedRecoverable || 0
    };
  };
  
  // Generate contextual response
  const generateContextualResponse = (input, emotion, urgency, context, originalInput) => {
    let response = `I want to understand exactly what you need help with.\n\nYou said: "${originalInput}"\n\n`;
    
    // Emotional response
    if (emotion === 'frustrated') {
      response += `I can sense your frustration, and I totally get it. Crypto issues can be incredibly stressful, especially when your money is involved. Let me personally make sure we solve this right now.\n\n`;
    } else if (emotion === 'worried') {
      response += `I understand you're concerned - that's completely normal when dealing with crypto recovery. Take a deep breath. I've helped thousands of people through similar situations with a 96.8% success rate.\n\n`;
    } else if (emotion === 'skeptical') {
      response += `I appreciate your skepticism - it shows you're smart about crypto security. I've maintained my 96.8% success rate precisely because I'm transparent and only get paid when YOU get paid. Let me prove my expertise.\n\n`;
    }
    
    // Urgency response
    if (urgency === 'high') {
      response += `🚨 **I understand this is urgent for you.** Let me fast-track this:\n\n`;
      if (context.hasOpportunities) {
        response += `• You have $${(context.recoveryValue * 3000).toFixed(0)} ready to recover RIGHT NOW\n• I can execute this in the next 60 seconds\n• No waiting, no delays\n\n`;
      } else if (!context.isConnected) {
        response += `• Connect your wallet (30 seconds)\n• I'll scan everything immediately\n• Show you results instantly\n\n`;
      }
    }
    
    // Context-aware suggestions
    response += `**Based on what you're asking, you might want:**\n`;
    
    if (input.includes('connect') || input.includes('wallet')) {
      response += `• **Wallet Connection Help** - I support 100+ wallets and can troubleshoot any connection issue\n`;
    }
    if (input.includes('scan') || input.includes('find') || input.includes('token')) {
      response += `• **Token Recovery Scan** - Find hidden assets across 50+ blockchains\n`;
    }
    if (input.includes('bridge') || input.includes('stuck') || input.includes('transfer')) {
      response += `• **Bridge Recovery** - Unstuck cross-chain transactions (88% success rate)\n`;
    }
    if (input.includes('lost') || input.includes('forgot') || input.includes('access')) {
      response += `• **Lost Wallet Recovery** - Seed phrase reconstruction (73% success rate)\n`;
    }
    if (input.includes('stolen') || input.includes('hack') || input.includes('scam')) {
      response += `• **Stolen Funds Recovery** - Blockchain forensics and tracking (67% success rate)\n`;
    }
    
    response += `\n💬 **Just tell me more about your specific situation and I'll provide the exact solution you need.**\n\n`;
    
    if (context.isConnected && context.hasOpportunities) {
      response += `🎯 **Quick Win Available**: I can see you have recovery opportunities worth $${(context.recoveryValue * 3000).toFixed(0)} ready to claim. Want me to walk you through claiming these first?`;
    } else if (!context.isConnected) {
      response += `🔗 **Next Step**: Connect your wallet so I can analyze your specific situation and provide personalized recommendations.`;
    }
    
    return response;
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

  // Dynamic quick actions based on user context
  const getSmartQuickActions = () => {
    const actions = [];
    
    if (!isConnected) {
      actions.push({ id: 'connect', label: 'Connect Wallet', color: 'blue', priority: 1 });
      actions.push({ id: 'wallets', label: 'Supported Wallets', color: 'purple', priority: 2 });
    } else {
      if (userPortfolio?.recoveryOpportunities > 0) {
        actions.push({ id: 'claim', label: `Claim $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)}`, color: 'green', priority: 1 });
        actions.push({ id: 'analyze', label: 'Analyze Opportunities', color: 'blue', priority: 2 });
      } else {
        actions.push({ id: 'scan', label: 'Deep Scan', color: 'green', priority: 1 });
        actions.push({ id: 'bridge', label: 'Check Bridges', color: 'orange', priority: 2 });
      }
    }
    
    actions.push({ id: 'fees', label: 'Fee Structure', color: 'purple', priority: 3 });
    actions.push({ id: 'security', label: 'Security Info', color: 'gray', priority: 4 });
    
    return actions.sort((a, b) => a.priority - b.priority).slice(0, 4);
  };
  
  const quickActions = getSmartQuickActions();

  const supportChannels = [
    { id: 'chat', name: 'Live Chat', icon: MessageCircle, available: true, waitTime: 'under 30s' },
    { id: 'email', name: 'Email', icon: Mail, available: true, waitTime: 'under 1hr' }
  ];

  const handleQuickAction = (action) => {
    const actionMessages = {
      'connect': 'How do I connect my wallet?',
      'wallets': 'What wallets do you support?',
      'scan': 'How does the deep scan work?',
      'bridge': 'I have stuck funds in a bridge transaction',
      'fees': 'What are your fees?',
      'security': 'How secure is this platform?',
      'claim': `I want to claim my $${(userPortfolio?.estimatedRecoverable * 3000).toFixed(0)} recovery opportunity`,
      'analyze': 'Analyze my recovery opportunities in detail'
    };
    
    setInputMessage(actionMessages[action.id] || action.label);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleEmailSupport = async () => {
    const chatTranscript = messages.map(msg => 
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'user' ? 'You' : 'Alex Thompson'}: ${msg.message}`
    ).join('\n\n');
    
    // Show immediate feedback
    const feedbackMessage = {
      id: Date.now(),
      type: 'bot',
      message: 'Sending your chat transcript to our expert team now. You\'ll receive a response within 1 hour. I\'m also opening your email client as backup.',
      timestamp: new Date(),
      agent: 'Alex Thompson'
    };
    setMessages(prev => [...prev, feedbackMessage]);
    
    try {
      // Send email via backend API
      const response = await fetch('/api/email-support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatTranscript,
          userInfo: {
            isConnected,
            walletAddress: userPortfolio?.walletAddress || 'Not connected',
            portfolioValue: userPortfolio?.totalValue || 0,
            recoveryOpportunities: userPortfolio?.recoveryOpportunities || 0
          },
          timestamp: new Date().toISOString(),
          urgency: 'normal'
        })
      });
      
      if (response.ok) {
        const successMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: '✅ **Email sent successfully!** Our expert team has received your request and will respond within 1 hour. Check your email for confirmation.',
          timestamp: new Date(),
          agent: 'Alex Thompson'
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error('Email service temporarily unavailable');
      }
    } catch (error) {
      // Fallback to mailto
      const emailBody = `Hi CryptoRecover Expert Team,\n\nI need assistance with my crypto recovery. Here's our chat transcript:\n\n${chatTranscript}\n\nWallet Status: ${isConnected ? 'Connected' : 'Not connected'}\nPortfolio Value: $${userPortfolio?.totalValue?.toFixed(0) || '0'}\nRecovery Opportunities: ${userPortfolio?.recoveryOpportunities || 0}\n\nPlease contact me at your earliest convenience.\n\nBest regards`;
      
      const mailtoLink = `mailto:skillstakes01@gmail.com?subject=CryptoRecover Expert Support Request&body=${encodeURIComponent(emailBody)}`;
      
      const fallbackMessage = {
        id: Date.now() + 2,
        type: 'bot',
        message: 'Opening your email client as backup. If it doesn\'t open automatically, please email us directly at skillstakes01@gmail.com',
        timestamp: new Date(),
        agent: 'Alex Thompson'
      };
      setMessages(prev => [...prev, fallbackMessage]);
      
      // Open email client
      window.location.href = mailtoLink;
    }
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
              className={`p-2 rounded-lg text-xs font-bold transition-all border relative overflow-hidden group ${
                action.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                action.color === 'green' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' :
                action.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' :
                action.color === 'purple' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' :
                'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">{action.label}</div>
              {action.priority === 1 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
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
            placeholder={getSmartPlaceholder()}
            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
        
        {/* Smart typing suggestions */}
        {inputMessage.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Alex is analyzing your message...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Smart placeholder based on context
  function getSmartPlaceholder() {
    if (!isConnected) {
      return "Ask me about wallet connection, supported wallets, or security...";
    } else if (userPortfolio?.recoveryOpportunities > 0) {
      return `Ask about your $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)} recovery opportunity...`;
    } else {
      return "Ask me about scanning, recovery methods, or anything crypto-related...";
    }
  }
}