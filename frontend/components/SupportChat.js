import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

export default function SupportChat({ isConnected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: isConnected 
        ? "Hi! I'm here to help you claim your staking rewards. What do you need assistance with?" 
        : "Hi! I'm here to help you get started with crypto recovery. Connect your wallet to begin!", 
      sender: 'support', 
      time: new Date() 
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const quickHelp = isConnected ? [
    "How to claim my 6.4 ETH rewards?",
    "What are the fees?",
    "Is it safe to use this service?",
    "How long does recovery take?"
  ] : [
    "How do I connect my wallet?",
    "What wallets are supported?",
    "Is this service safe?",
    "What can I recover?"
  ];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMsg = { id: Date.now(), text: newMessage, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    
    // Auto-reply based on message
    setTimeout(() => {
      let reply = "I'll help you with that. Let me connect you with a specialist.";
      
      if (!isConnected) {
        if (newMessage.toLowerCase().includes('connect') || newMessage.toLowerCase().includes('wallet')) {
          reply = "To connect: 1) Click any wallet button above 2) Approve connection in your wallet 3) Start scanning for recoverable assets. We support 100+ wallets!";
        } else if (newMessage.toLowerCase().includes('safe')) {
          reply = "Absolutely! We're non-custodial (you keep full control), 92.3% success rate, trusted by 85k+ users worldwide.";
        } else if (newMessage.toLowerCase().includes('recover')) {
          reply = "We recover: ETH/BTC/tokens, staking rewards, bridge funds, NFTs across 50+ blockchains. Connect wallet to see what you can claim!";
        }
      } else {
        if (newMessage.toLowerCase().includes('claim') || newMessage.toLowerCase().includes('6.4')) {
          reply = "To claim your 6.4 ETH rewards: 1) Go to Step 4: Staking Scanner 2) Click 'Scan Staking' 3) Click 'Claim Rewards' 4) Pay 15% fee, get 5.44 ETH!";
        } else if (newMessage.toLowerCase().includes('fee')) {
          reply = "Our fee is 15% of recovered amount. For 6.4 ETH rewards: fee is 0.96 ETH, you get 5.44 ETH. No upfront costs!";
        } else if (newMessage.toLowerCase().includes('safe')) {
          reply = "Yes! We're non-custodial (you keep control), 92.3% success rate, 85k+ satisfied users. Your wallet stays secure.";
        }
      }
      
      const botMsg = { id: Date.now() + 1, text: reply, sender: 'support', time: new Date() };
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
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-lg shadow-xl z-50 flex flex-col">
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Support Chat</h3>
        <button onClick={() => setIsOpen(false)}>
          <X size={20} />
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded-lg text-sm ${
              msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-2 border-t">
        <div className="grid grid-cols-1 gap-1 mb-2">
          {quickHelp.map((question, i) => (
            <button
              key={i}
              onClick={() => handleQuickHelp(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 p-1 rounded text-left"
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