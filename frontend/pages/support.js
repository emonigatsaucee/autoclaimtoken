import { useState } from 'react';
import { MessageCircle, Send, User, Bot } from 'lucide-react';

export default function Support() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hello! I\'m here to help with your crypto recovery. What can I assist you with today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickResponses = [
    'My wallet is not connecting',
    'I can\'t see my tokens',
    'Recovery is taking too long',
    'Need help with seed phrase',
    'Transaction failed'
  ];

  const botResponses = {
    'wallet': 'For wallet connection issues, please ensure you have the latest version installed and try refreshing the page. Our recovery system supports MetaMask, Trust Wallet, and Coinbase Wallet.',
    'tokens': 'If you can\'t see your tokens, they might be on a different network. Our scanner checks 50+ blockchains including Ethereum, BSC, Polygon, and Arbitrum.',
    'recovery': 'Recovery typically takes 2-5 minutes depending on network congestion. Our system has a 73% success rate for token recovery.',
    'seed': 'Never share your seed phrase with anyone. Our system only needs wallet connection, not your private keys or seed phrase.',
    'transaction': 'Transaction failures can occur due to network congestion or insufficient gas. Try increasing gas fees or waiting for lower network activity.',
    'default': 'I understand your concern. Our expert team is available 24/7. For complex issues, please contact our live support team who can provide personalized assistance.'
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const messageKey = Object.keys(botResponses).find(key => 
        inputMessage.toLowerCase().includes(key)
      ) || 'default';

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        message: botResponses[messageKey],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickResponse = (response) => {
    setInputMessage(response);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h1 className="text-lg font-bold">CryptoRecover Support</h1>
                <p className="text-blue-100 text-sm">Expert assistance available 24/7</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                    {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`p-3 rounded-lg ${msg.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Responses */}
          <div className="p-4 border-t">
            <p className="text-sm text-gray-600 mb-2">Quick responses:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickResponses.map((response, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickResponse(response)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                >
                  {response}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}