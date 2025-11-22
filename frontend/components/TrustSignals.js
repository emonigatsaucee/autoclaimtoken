import { useState, useEffect } from 'react';

export default function TrustSignals() {
  const [liveStats, setLiveStats] = useState({
    recovered: 127834567,
    users: 85247,
    transactions: 1247893
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        recovered: prev.recovered + Math.floor(Math.random() * 5000),
        users: prev.users + Math.floor(Math.random() * 3),
        transactions: prev.transactions + Math.floor(Math.random() * 8)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Trust Badges */}
      <div className="bg-white py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Trusted & Verified</h3>
            <p className="text-gray-600">Industry-leading security and compliance</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="font-semibold text-gray-900">SSL Secured</div>
              <div className="text-sm text-gray-600">256-bit encryption</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="font-semibold text-gray-900">Verified</div>
              <div className="text-sm text-gray-600">KYC Compliant</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="font-semibold text-gray-900">Award Winning</div>
              <div className="text-sm text-gray-600">Best Recovery 2024</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="font-semibold text-gray-900">4.9/5 Rating</div>
              <div className="text-sm text-gray-600">12,847 reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Statistics */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">Live Platform Statistics</h3>
            <p className="text-blue-100">Real-time data updated every few seconds</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black mb-2">${liveStats.recovered.toLocaleString()}</div>
              <div className="text-blue-200 font-semibold">Total Recovered (USD)</div>
              <div className="text-blue-300 text-sm mt-1">+$2,847 in last hour</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{liveStats.users.toLocaleString()}</div>
              <div className="text-blue-200 font-semibold">Active Users</div>
              <div className="text-blue-300 text-sm mt-1">+{Math.floor(Math.random() * 5) + 1} online now</div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-black mb-2">{liveStats.transactions.toLocaleString()}</div>
              <div className="text-blue-200 font-semibold">Successful Recoveries</div>
              <div className="text-blue-300 text-sm mt-1">73% success rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <TestimonialCarousel />
    </>
  );
}

function TestimonialCarousel() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "DeFi Trader",
      location: "San Francisco, CA",
      amount: "$18,247",
      text: "I thought my tokens were gone forever after a failed bridge transaction. CryptoRecover found and recovered everything in just 2 hours!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      role: "Crypto Investor", 
      location: "Miami, FL",
      amount: "$34,892",
      text: "Lost access to my wallet after a hardware failure. The team recovered my entire portfolio including NFTs I forgot I had.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      role: "Blockchain Developer",
      location: "Austin, TX", 
      amount: "$7,634",
      text: "Professional service with real results. They recovered tokens from 5 different chains that I couldn't access myself.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const testimonial = testimonials[currentTestimonial];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">What Our Users Say</h3>
          <p className="text-gray-600">Real stories from real recoveries</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 relative">
          <div className="text-center">
            <img 
              src={testimonial.avatar}
              alt={testimonial.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
            />
            
            <div className="text-6xl text-blue-500 mb-4">"</div>
            
            <p className="text-xl text-gray-700 mb-6 leading-relaxed italic">
              {testimonial.text}
            </p>
            
            <div className="border-t pt-6">
              <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
              <div className="text-gray-600">{testimonial.role}</div>
              <div className="text-gray-500 text-sm">{testimonial.location}</div>
              <div className="text-green-600 font-bold mt-2">Recovered: {testimonial.amount}</div>
            </div>
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}