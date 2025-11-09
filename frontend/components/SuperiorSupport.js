import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Phone, Video, FileText, Zap, Shield, Clock, Star, User, Bot, Headphones } from 'lucide-react';

export default function SuperiorSupport({ isConnected, userPortfolio, selectedNetwork }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [supportAgent, setSupportAgent] = useState(null);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('general');
  const messagesEndRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        message: `👋 Welcome to CryptoRecover Premium Support!\n\n🚀 **Instant Help Available:**\n• Live Expert Chat (24/7)\n• Video Call Support\n• Priority Recovery Queue\n• Advanced Forensics Team\n\n${isConnected ? `✅ **Your Status:** Connected (${userPortfolio?.totalValue ? `$${userPortfolio.totalValue.toFixed(0)} portfolio` : 'Scanning...'})\n` : ''}How can our recovery experts help you today?`,
        timestamp: new Date(),
        agent: 'CryptoRecover AI'
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
          responseTime: '< 30 seconds'
        });
      }, 2000);
    }
  }, [isOpen]);

  const quickActions = [
    { id: 'emergency', label: '🚨 Emergency Recovery', color: 'red', priority: 'critical' },
    { id: 'stuck-funds', label: '💰 Stuck Funds', color: 'orange', priority: 'high' },
    { id: 'bridge-help', label: '🌉 Bridge Issues', color: 'blue', priority: 'medium' },
    { id: 'general', label: '💬 General Help', color: 'gray', priority: 'low' }
  ];

  const supportChannels = [
    { id: 'chat', name: 'Live Chat', icon: MessageCircle, available: true, waitTime: '< 30s' },
    { id: 'video', name: 'Video Call', icon: Video, available: true, waitTime: '< 2min' },
    { id: 'phone', name: 'Phone Support', icon: Phone, available: true, waitTime: '< 1min' },
    { id: 'expert', name: 'Expert Team', icon: Shield, available: true, waitTime: '< 5min' }
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `I understand you need help with "${inputMessage}". Let me connect you with our recovery specialist who can provide immediate assistance.`,
        `Thanks for reaching out! Based on your message, I'm escalating this to our expert team. ${supportAgent ? supportAgent.name : 'A specialist'} will respond shortly.`,
        `I see you're experiencing issues. Our advanced recovery system is analyzing your case. Expected resolution time: 15-30 minutes.`,
        `Your request has been prioritized. Our forensics team is reviewing your wallet data and will provide a detailed recovery plan within the hour.`
      ];

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        agent: supportAgent ? supportAgent.name : 'CryptoRecover AI'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (action) => {
    setPriority(action.priority);
    setInputMessage(`I need help with ${action.label.replace(/[^\w\s]/gi, '').trim()}`);
    handleSendMessage();
  };

  if (!isOpen) {
    return (
      <div className="relative">
        {/* Floating notification */}
        <div className="absolute -top-12 -left-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg">
          💬 Need Help? Click Here!
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
              <h3 className="font-black text-lg">Premium Support</h3>
              <p className="text-white/90 text-sm font-medium">24/7 Expert Recovery Team</p>
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
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
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
        <div className="text-xs font-bold text-gray-700 mb-2">Quick Actions:</div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action)}
              className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                action.color === 'red' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' :
                action.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' :
                action.color === 'blue' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' :
                'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
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
                  <Bot className="w-4 h-4" />
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
                <Bot className="w-4 h-4" />
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
            placeholder="Type your message..."
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
              <span>Avg response: 30s</span>
            </div>
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure chat</span>
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