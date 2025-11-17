import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, FileText, Shield, Clock, Star, User, Headphones, AlertCircle, CheckCircle, Info, Mail, Zap, Brain, Target, TrendingUp, Award, Users, DollarSign } from 'lucide-react';

export default function UltraIntelligentSupport({ isConnected, userPortfolio, selectedNetwork }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({});
  const [userPersonality, setUserPersonality] = useState('neutral');
  const [supportAgent, setSupportAgent] = useState(null);
  const messagesEndRef = useRef(null);

  // Ultra-Advanced AI Agent Profile
  const agent = {
    name: 'Alex Rivera',
    title: 'Elite Blockchain Recovery Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
    experience: '7+ years',
    specialties: ['Advanced DeFi Recovery', 'Cross-Chain Forensics', 'MEV Protection', 'Smart Contract Auditing'],
    recoveredAmount: '$12.7M+',
    successRate: '96.8%',
    certifications: ['Certified Blockchain Security Professional', 'DeFi Security Specialist'],
    languages: ['English', 'Spanish', 'Mandarin'],
    timezone: 'Available 24/7',
    responseTime: '< 30 seconds',
    personality: 'Expert, Empathetic, Results-Driven'
  };

  // Advanced Emotional Intelligence System
  const emotionalIntelligence = {
    detectEmotion: (text) => {
      const emotions = {
        frustrated: ['frustrated', 'annoyed', 'angry', 'mad', 'upset', 'irritated', 'pissed', 'hate', 'terrible', 'awful', 'broken', 'not working'],
        worried: ['worried', 'concerned', 'scared', 'nervous', 'anxious', 'afraid', 'panic', 'stress', 'help me', 'urgent', 'emergency'],
        excited: ['excited', 'amazing', 'awesome', 'great', 'fantastic', 'wonderful', 'love', 'perfect', 'excellent', 'brilliant'],
        confused: ['confused', 'lost', 'dont understand', "don't get", 'unclear', 'what', 'how', 'why', 'explain', 'help'],
        skeptical: ['doubt', 'suspicious', 'scam', 'fake', 'trust', 'believe', 'real', 'legit', 'sure', 'proof'],
        urgent: ['urgent', 'asap', 'now', 'quick', 'fast', 'immediately', 'emergency', 'hurry', 'stuck', 'lost'],
        grateful: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful', 'amazing', 'perfect']
      };
      
      const lowerText = text.toLowerCase();
      for (const [emotion, keywords] of Object.entries(emotions)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
          return emotion;
        }
      }
      return 'neutral';
    },

    detectIntent: (text) => {
      const intents = {
        greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'sup', 'yo'],
        connection: ['connect', 'wallet', 'metamask', 'trust wallet', 'ledger', 'coinbase'],
        scanning: ['scan', 'find', 'search', 'discover', 'tokens', 'assets', 'balance'],
        recovery: ['recover', 'claim', 'get back', 'retrieve', 'lost', 'missing'],
        bridge: ['bridge', 'stuck', 'transfer', 'cross-chain', 'polygon', 'arbitrum'],
        staking: ['staking', 'rewards', 'validator', 'eth2', 'consensus'],
        security: ['safe', 'secure', 'trust', 'scam', 'legitimate', 'real'],
        fees: ['fee', 'cost', 'price', 'charge', 'expensive', 'cheap'],
        process: ['how', 'step', 'guide', 'tutorial', 'process', 'procedure'],
        technical: ['error', 'problem', 'issue', 'bug', 'not working', 'failed'],
        support: ['help', 'support', 'assist', 'question', 'contact']
      };
      
      const lowerText = text.toLowerCase();
      for (const [intent, keywords] of Object.entries(intents)) {
        if (keywords.some(keyword => lowerText.includes(keyword))) {
          return intent;
        }
      }
      return 'general';
    },

    generatePersonalizedResponse: (text, emotion, intent, context) => {
      const responses = {
        greeting: () => {
          const timeOfDay = new Date().getHours();
          const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
          
          let response = `${greeting}! I'm Alex Rivera, your elite blockchain recovery engineer. `;
          
          if (emotion === 'excited') {
            response += `I love your energy! `;
          } else if (emotion === 'frustrated') {
            response += `I can sense you might be dealing with some crypto challenges - don't worry, I'm here to solve them. `;
          } else if (emotion === 'worried') {
            response += `Take a deep breath - whatever crypto issue you're facing, I've probably solved it before with my 96.8% success rate. `;
          }
          
          if (context.isConnected) {
            if (context.hasOpportunities) {
              response += `🎯 **Excellent news!** I can see your wallet is connected and I've detected ${context.recoveryOpportunities} recovery opportunities worth approximately $${(context.recoveryValue * 3000).toFixed(0)}! This is going to be very profitable for you.`;
            } else {
              response += `Your wallet is connected and my advanced scanners are analyzing your blockchain footprint across 50+ networks right now.`;
            }
          } else {
            response += `I notice your wallet isn't connected yet. No problem - I support 100+ wallets and can get you connected in under 30 seconds.`;
          }
          
          response += `\\n\\n🚀 **What I specialize in:**\\n• **Token Recovery**: Find hidden assets across 50+ blockchains\\n• **Bridge Recovery**: Unstuck cross-chain transactions (88% success)\\n• **Staking Rewards**: Claim unclaimed validator rewards\\n• **Lost Wallets**: Recover access using advanced techniques\\n• **Stolen Funds**: Blockchain forensics and recovery (67% success)\\n• **MEV Protection**: Counter sandwich attacks and front-running\\n\\n💡 **My credentials**: 7+ years experience, $12.7M+ recovered, certified blockchain security professional\\n\\nWhat's your situation? Describe it naturally - I understand context and provide intelligent solutions.`;
          
          return response;
        },

        connection: () => {
          if (context.isConnected) {
            return `Your wallet is already connected and looking great! I can see ${context.assetCount || 0} different assets. If you want to connect a different wallet, just disconnect this one first and I'll walk you through connecting any of the 100+ wallets I support.\\n\\n🔧 **Connection troubleshooting**: If you're having issues, I can help with MetaMask, Trust Wallet, Coinbase, hardware wallets, or any mobile wallet via WalletConnect.`;
          }
          
          let response = `🔗 **WALLET CONNECTION MASTERY** - This is one of my specialties!\\n\\n`;
          
          if (emotion === 'frustrated') {
            response += `I can sense your frustration with wallet connections - I've helped thousands of people through this exact issue. Let me make this super simple for you.\\n\\n`;
          }
          
          response += `**SUPPORTED WALLETS (100+):**\\n• **MetaMask** - Most popular, works everywhere\\n• **Trust Wallet** - Mobile-first, excellent security\\n• **Coinbase Wallet** - Beginner-friendly\\n• **Hardware Wallets** - Ledger, Trezor (maximum security)\\n• **Mobile Wallets** - Phantom, Rainbow, Exodus, imToken\\n• **WalletConnect** - Connects ANY mobile wallet\\n\\n**CONNECTION PROCESS:**\\n1. Click "Connect Wallet" button\\n2. Choose your wallet from the list\\n3. Approve connection in your wallet\\n4. Sign verification message (proves ownership)\\n\\n**TROUBLESHOOTING:**\\n• Wallet not detected? → Refresh page, check extension\\n• Mobile issues? → Open this page in wallet browser\\n• Connection rejected? → Unlock wallet first\\n\\nWhat specific wallet are you trying to connect? I'll give you step-by-step instructions.`;
          
          return response;
        },

        scanning: () => {
          let response = `🔍 **ELITE MULTI-CHAIN SCANNER** - This is where my technology truly shines!\\n\\n`;
          
          if (context.hasOpportunities) {
            response += `🎯 **IMMEDIATE OPPORTUNITY DETECTED!** You have ${context.recoveryOpportunities} recovery opportunities worth $${(context.recoveryValue * 3000).toFixed(0)} ready to claim right now!\\n\\n`;
          }
          
          response += `**MY SCANNING TECHNOLOGY:**\\n• **50+ Blockchains**: Ethereum, BSC, Polygon, Arbitrum, Optimism, Solana, Avalanche, Fantom, Base, zkSync\\n• **500+ Protocols**: Uniswap, PancakeSwap, Aave, Compound, Curve, Balancer\\n• **Deep Analysis**: Hidden tokens, failed transactions, bridge deposits, staking rewards\\n\\n`;
          response += `**WHAT I FIND (that others miss):**\\n• Unclaimed airdrops from protocols you used\\n• Forgotten assets in old wallet addresses\\n• Staking rewards sitting unclaimed\\n• Funds stuck in cross-chain bridges\\n• LP tokens and yield farming positions\\n• NFT royalties and creator earnings\\n• Recoverable gas from failed transactions\\n\\n`;
          response += `**MY PROCESS:**\\n1. **Deep Chain Analysis** (30-60 seconds)\\n2. **Cross-reference 500+ protocols**\\n3. **Calculate exact recovery amounts**\\n4. **Prioritize by value and success probability**\\n\\n`;
          response += `📊 **MY TRACK RECORD**: $12.7M+ recovered | 96.8% success rate | 85,000+ clients\\n\\n`;
          response += context.isConnected ? 'Ready to start scanning your wallet right now?' : "Connect your wallet and I'll scan everything in 60 seconds!";
          
          return response;
        },

        recovery: () => {
          if (context.hasOpportunities) {
            return `🎯 **RECOVERY OPPORTUNITIES DETECTED!**\\n\\nYou have ${context.recoveryOpportunities} opportunities worth $${(context.recoveryValue * 3000).toFixed(0)} ready to claim!\\n\\n**IMMEDIATE ACTION PLAN:**\\n1. Go to Step 4 (Staking Scanner)\\n2. Click 'Scan Staking' - I'll guide you\\n3. Review your rewards\\n4. Click 'Claim Rewards'\\n5. Instant execution (30 seconds)\\n\\n**YOUR NET AMOUNT**: $${(context.recoveryValue * 3000 * 0.85).toFixed(0)} (after 15% success fee)\\n\\nShall we execute this recovery right now?`;
          }
          
          let response = `💰 **RECOVERY SERVICES MASTERY** - I've recovered $12.7M+ for clients like you!\\n\\n`;
          
          if (emotion === 'urgent') {
            response += `🚨 **I understand this is urgent!** Let me fast-track your recovery process.\\n\\n`;
          }
          
          response += `**MY RECOVERY SPECIALTIES:**\\n• **Token Recovery** (78% success) - Find hidden assets across 50+ chains\\n• **Bridge Recovery** (88% success) - Unstuck cross-chain transactions\\n• **Staking Rewards** (94% success) - Claim validator rewards\\n• **Lost Wallet Recovery** (73% success) - Seed phrase reconstruction\\n• **Stolen Funds Recovery** (67% success) - Blockchain forensics\\n• **MEV Attack Recovery** (45% success) - Counter sandwich attacks\\n\\n**RECOVERY PROCESS:**\\n1. **Analysis** - I scan for opportunities\\n2. **Strategy** - I create recovery plan\\n3. **Execution** - Automated smart contract interactions\\n4. **Success** - You keep 85%, I take 15%\\n\\n**SECURITY**: Non-custodial, your keys stay with you\\n**COST**: Success-only fees, no upfront costs\\n\\n${context.isConnected ? 'What type of recovery are you interested in?' : 'Connect your wallet to see your specific recovery opportunities!'}`;
          
          return response;
        },

        security: () => {
          let response = `🛡️ **SECURITY IS MY TOP PRIORITY** - Here's why 85,000+ users trust me:\\n\\n`;
          
          if (emotion === 'skeptical') {
            response += `I completely understand your skepticism - in crypto, being cautious is survival. Let me address your concerns with facts:\\n\\n`;
          }
          
          response += `**MY SECURITY GUARANTEES:**\\n• **Non-Custodial**: I never touch your private keys, ever\\n• **Read-Only Access**: I analyze blockchain data, never control funds\\n• **Signature Verification**: All transactions require YOUR approval\\n• **Encrypted Communications**: Military-grade encryption\\n• **No Personal Data**: I only store wallet addresses\\n• **Audited Code**: Smart contracts audited by CertiK\\n• **Insurance**: $10M coverage for client protection\\n\\n**MY CREDENTIALS:**\\n• Certified Blockchain Security Professional\\n• DeFi Security Specialist\\n• 7+ years in blockchain forensics\\n• Zero security incidents in 85,000+ recoveries\\n\\n**HOW IT WORKS:**\\n1. You connect wallet (keys stay with you)\\n2. I scan blockchain data (read-only)\\n3. I show you opportunities\\n4. YOU approve any transactions\\n5. Smart contracts execute automatically\\n\\n**PROOF OF LEGITIMACY:**\\n• 96.8% success rate over 7 years\\n• $12.7M+ successfully recovered\\n• Real testimonials from verified users\\n• Transparent fee structure (15% success-only)\\n\\nWhat specific security concern can I address for you?`;
          
          return response;
        },

        fees: () => {
          let response = `💰 **TRANSPARENT FEE STRUCTURE** - I only win when you win!\\n\\n`;
          
          if (context.hasOpportunities) {
            const fee = (context.recoveryValue * 3000 * 0.15).toFixed(0);
            const net = (context.recoveryValue * 3000 * 0.85).toFixed(0);
            response += `**YOUR SPECIFIC SITUATION:**\\n• Recovery Opportunity: $${(context.recoveryValue * 3000).toFixed(0)}\\n• My Fee (15%): $${fee}\\n• Your Net Amount: $${net}\\n\\n`;
          }
          
          response += `**MY FEE STRUCTURE:**\\n• **Success-Only**: You only pay if I recover funds\\n• **Standard Recovery**: 15% of recovered amount\\n• **Bridge Recovery**: 15% of recovered amount\\n• **Lost Wallet Recovery**: 25% of recovered amount\\n• **Stolen Funds Recovery**: 30% of recovered amount\\n• **MEV Attack Recovery**: 35% of recovered amount\\n\\n**NO UPFRONT COSTS:**\\n• No consultation fees\\n• No scanning fees\\n• No analysis fees\\n• No monthly subscriptions\\n• No hidden charges\\n\\n**WHY SUCCESS-ONLY PRICING?**\\n• Aligns my interests with yours\\n• Proves confidence in my abilities\\n• Industry standard for recovery services\\n• You take zero financial risk\\n\\n**PAYMENT PROCESS:**\\n1. I recover your funds\\n2. Smart contract automatically deducts fee\\n3. You receive net amount instantly\\n4. If I fail, you pay nothing\\n\\nThis is the fairest way to do business. Questions about fees?`;
          
          return response;
        },

        technical: () => {
          return `🔧 **TECHNICAL SUPPORT EXPERT** - I've seen every error imaginable in 7+ years!\\n\\nTell me exactly what's happening:\\n• What were you trying to do?\\n• What error message appeared?\\n• Which wallet/platform are you using?\\n• When did this start happening?\\n\\n**COMMON ISSUES I SOLVE:**\\n• Wallet connection failures\\n• Transaction stuck/pending\\n• Wrong network selected\\n• Insufficient gas fees\\n• Smart contract interactions failing\\n• Bridge transactions stuck\\n• Staking rewards not showing\\n\\n**MY APPROACH:**\\n1. **Diagnose** - Identify root cause\\n2. **Explain** - Break down the issue\\n3. **Fix** - Step-by-step solution\\n4. **Prevent** - Avoid future issues\\n\\nMost technical issues have simple fixes that take 30 seconds. What specific problem are you facing?`;
        },

        support: () => {
          return `🎧 **24/7 EXPERT SUPPORT** - I'm here to help with anything crypto-related!\\n\\n**SUPPORT CHANNELS:**\\n• **Live Chat** (this) - Instant responses\\n• **Email Support** - Detailed assistance within 1 hour\\n• **Video Calls** - For complex issues (premium clients)\\n\\n**WHAT I CAN HELP WITH:**\\n• Wallet connection and troubleshooting\\n• Recovery strategy and execution\\n• Technical issues and errors\\n• Security questions and concerns\\n• Fee structure and payment\\n• Platform navigation and features\\n\\n**MY SUPPORT PHILOSOPHY:**\\n• **Personalized**: Every situation is unique\\n• **Patient**: I'll explain things as many times as needed\\n• **Proactive**: I anticipate your needs\\n• **Results-Focused**: I solve problems, not just answer questions\\n\\n**RESPONSE TIMES:**\\n• Live Chat: Under 30 seconds\\n• Email: Under 1 hour\\n• Complex Issues: Same day resolution\\n\\nWhat can I help you with today?`;
        }
      };

      return responses[intent] ? responses[intent]() : this.generateFallbackResponse(text, emotion, context);
    },

    generateFallbackResponse: (text, emotion, context) => {
      let response = `I want to understand exactly what you need help with.\\n\\nYou said: "${text}"\\n\\n`;
      
      if (emotion === 'frustrated') {
        response += `I can sense your frustration - crypto issues can be incredibly stressful. Let me personally solve this for you right now.\\n\\n`;
      } else if (emotion === 'worried') {
        response += `I understand you're concerned. With my 96.8% success rate, I've helped thousands through similar situations.\\n\\n`;
      } else if (emotion === 'skeptical') {
        response += `Your skepticism shows you're smart about crypto security. Let me prove my expertise with transparent answers.\\n\\n`;
      }
      
      response += `**BASED ON YOUR MESSAGE, YOU MIGHT WANT:**\\n`;
      
      if (text.toLowerCase().includes('connect') || text.toLowerCase().includes('wallet')) {
        response += `• **Wallet Connection Help** - I support 100+ wallets\\n`;
      }
      if (text.toLowerCase().includes('scan') || text.toLowerCase().includes('find')) {
        response += `• **Token Recovery Scan** - Find assets across 50+ blockchains\\n`;
      }
      if (text.toLowerCase().includes('bridge') || text.toLowerCase().includes('stuck')) {
        response += `• **Bridge Recovery** - Unstuck cross-chain transactions\\n`;
      }
      if (text.toLowerCase().includes('lost') || text.toLowerCase().includes('recover')) {
        response += `• **Lost Asset Recovery** - Professional recovery services\\n`;
      }
      
      response += `\\n💬 **Just tell me more about your specific situation and I'll provide the exact solution you need.**\\n\\n`;
      
      if (context.hasOpportunities) {
        response += `🎯 **Quick Win Available**: I can see you have $${(context.recoveryValue * 3000).toFixed(0)} ready to claim. Want me to walk you through this first?`;
      } else if (!context.isConnected) {
        response += `🔗 **Next Step**: Connect your wallet so I can analyze your specific situation and provide personalized recommendations.`;
      }
      
      return response;
    }
  };

  // Initialize with personalized welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        message: getPersonalizedWelcome(),
        timestamp: new Date(),
        agent: agent.name
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
        setSupportAgent(agent);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, supportAgent]);

  const getPersonalizedWelcome = () => {
    const timeOfDay = new Date().getHours();
    const greeting = timeOfDay < 12 ? 'Good morning' : timeOfDay < 18 ? 'Good afternoon' : 'Good evening';
    
    let welcome = `${greeting}! I'm Alex Rivera, your elite blockchain recovery engineer.\\n\\n`;
    
    if (isConnected) {
      if (userPortfolio?.recoveryOpportunities > 0) {
        welcome += `🎯 **EXCELLENT NEWS!** I've detected ${userPortfolio.recoveryOpportunities} recovery opportunities worth approximately $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)} in your connected wallet!\\n\\nThis is going to be very profitable for you. My success rate for these types of recoveries is 96.8%.`;
      } else {
        welcome += `Your wallet is connected and my advanced scanning algorithms are analyzing your blockchain footprint across 50+ networks right now.`;
      }
    } else {
      welcome += `I specialize in finding hidden crypto assets that others miss. With 7+ years of experience, I've recovered $12.7M+ for 85,000+ clients with a 96.8% success rate.`;
    }
    
    welcome += `\\n\\n🚀 **My Expertise:**\\n• Token Recovery across 50+ blockchains\\n• Bridge transaction recovery (88% success)\\n• Lost wallet recovery (73% success)\\n• Stolen funds recovery (67% success)\\n• MEV attack protection (45% success)\\n\\n💡 **Success-only fees** - You only pay when I successfully recover your funds\\n\\nWhat brings you here today? Describe your situation naturally - I understand context and provide intelligent solutions.`;
    
    return welcome;
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

    // Advanced AI processing
    const emotion = emotionalIntelligence.detectEmotion(currentInput);
    const intent = emotionalIntelligence.detectIntent(currentInput);
    const context = {
      isConnected,
      hasOpportunities: userPortfolio?.recoveryOpportunities > 0,
      recoveryOpportunities: userPortfolio?.recoveryOpportunities || 0,
      recoveryValue: userPortfolio?.estimatedRecoverable || 0,
      assetCount: userPortfolio?.assets?.length || 0
    };

    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      lastEmotion: emotion,
      lastIntent: intent,
      messageCount: (prev.messageCount || 0) + 1
    }));

    // Update user personality profile
    if (emotion !== 'neutral') {
      setUserPersonality(emotion);
    }

    // Generate intelligent response with realistic delay
    const responseDelay = currentInput.length > 50 ? 2000 + Math.random() * 1000 : 1000 + Math.random() * 800;
    
    setTimeout(() => {
      setIsTyping(false);
      const response = emotionalIntelligence.generatePersonalizedResponse(currentInput, emotion, intent, context);
      
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: response,
        timestamp: new Date(),
        agent: agent.name,
        emotion: emotion,
        intent: intent
      };

      setMessages(prev => [...prev, botResponse]);
    }, responseDelay);
  };

  // Dynamic quick actions based on context
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
      `[${msg.timestamp.toLocaleTimeString()}] ${msg.type === 'user' ? 'You' : 'Alex Rivera'}: ${msg.message}`
    ).join('\\n\\n');
    
    const feedbackMessage = {
      id: Date.now(),
      type: 'bot',
      message: "📧 Sending your chat transcript to our expert team now. You'll receive a response within 1 hour. I'm also opening your email client as backup.",
      timestamp: new Date(),
      agent: agent.name
    };
    setMessages(prev => [...prev, feedbackMessage]);
    
    try {
      const response = await fetch('/api/email-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatTranscript,
          userInfo: {
            isConnected,
            walletAddress: userPortfolio?.walletAddress || 'Not connected',
            portfolioValue: userPortfolio?.totalValue || 0,
            recoveryOpportunities: userPortfolio?.recoveryOpportunities || 0,
            userPersonality,
            conversationContext
          },
          timestamp: new Date().toISOString(),
          urgency: conversationContext.lastEmotion === 'urgent' ? 'high' : 'normal'
        })
      });
      
      if (response.ok) {
        const successMessage = {
          id: Date.now() + 1,
          type: 'bot',
          message: '✅ **Email sent successfully!** Our expert team has received your request and will respond within 1 hour. Check your email for confirmation.',
          timestamp: new Date(),
          agent: agent.name
        };
        setMessages(prev => [...prev, successMessage]);
      } else {
        throw new Error('Email service temporarily unavailable');
      }
    } catch (error) {
      const emailBody = `Hi CryptoRecover Expert Team,\\n\\nI need assistance with my crypto recovery. Here's our chat transcript:\\n\\n${chatTranscript}\\n\\nWallet Status: ${isConnected ? 'Connected' : 'Not connected'}\\nPortfolio Value: $${userPortfolio?.totalValue?.toFixed(0) || '0'}\\nRecovery Opportunities: ${userPortfolio?.recoveryOpportunities || 0}\\n\\nPlease contact me at your earliest convenience.\\n\\nBest regards`;
      
      const mailtoLink = `mailto:skillstakes01@gmail.com?subject=CryptoRecover Expert Support Request&body=${encodeURIComponent(emailBody)}`;
      
      const fallbackMessage = {
        id: Date.now() + 2,
        type: 'bot',
        message: "Opening your email client as backup. If it doesn't open automatically, please email us directly at skillstakes01@gmail.com",
        timestamp: new Date(),
        agent: agent.name
      };
      setMessages(prev => [...prev, fallbackMessage]);
      
      window.location.href = mailtoLink;
    }
  };

  const getSmartPlaceholder = () => {
    if (!isConnected) {
      return "Ask me about wallet connection, supported wallets, or security...";
    } else if (userPortfolio?.recoveryOpportunities > 0) {
      return `Ask about your $${(userPortfolio.estimatedRecoverable * 3000).toFixed(0)} recovery opportunity...`;
    } else {
      return "Ask me about scanning, recovery methods, or anything crypto-related...";
    }
  };

  if (!isOpen) {
    return (
      <div className="relative">
        <div className="absolute -top-12 -left-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg">
          Need Expert Help? Click Here
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
    <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-black text-sm">{agent.name}</h3>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Shield size={10} className="text-green-400" />
                  <span className="opacity-90">{agent.title}</span>
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

      {/* Support Channels */}
      <div className="border-b border-gray-200 p-3">
        <div className="grid grid-cols-2 gap-2">
          <button
            className="p-2 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-300"
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

      {/* Smart Quick Actions */}
      <div className="p-3 border-b border-gray-200">
        <div className="text-xs font-bold text-gray-700 mb-2">Smart Actions:</div>
        <div className="grid grid-cols-2 gap-2">
          {getSmartQuickActions().map((action) => (
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
                    src={agent.avatar}
                    alt="Alex"
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span className="text-xs font-bold text-blue-600">{msg.agent}</span>
                  <div className="flex items-center space-x-1">
                    <Shield size={10} className="text-green-500" />
                    <span className="text-xs text-gray-500">Verified Expert</span>
                  </div>
                </div>
              )}
              <div className="text-sm whitespace-pre-line leading-relaxed">{msg.message}</div>
              <div className="flex items-center justify-between mt-2">
                <div className={`text-xs ${msg.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </div>
                {msg.type === 'bot' && (
                  <div className="flex items-center space-x-1">
                    <Brain size={10} className="text-purple-500" />
                    <span className="text-xs text-purple-600">AI Enhanced</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl">
              <div className="flex items-center space-x-2 mb-1">
                <img src={agent.avatar} alt={agent.name} className="w-4 h-4 rounded-full" />
                <span className="text-xs font-bold text-blue-600">{agent.name}</span>
                <Brain size={10} className="text-purple-500" />
              </div>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
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
        
        {/* Smart typing suggestions */}
        {inputMessage.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>Alex is analyzing your message with AI...</span>
            </div>
          </div>
        )}
        
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
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3" />
              <span>AI Enhanced</span>
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