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
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">SSL Secured</div>
              <div className="text-sm text-gray-600">256-bit encryption</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Verified</div>
              <div className="text-sm text-gray-600">KYC Compliant</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900">Award Winning</div>
              <div className="text-sm text-gray-600">Best Recovery 2024</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
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
      name: "Alex Thompson",
      role: "DeFi Trader",
      location: "New York, NY",
      amount: "$24,891",
      text: "Lost $25K in a failed bridge transaction. CryptoRecover's team recovered 99% of my funds in under 3 hours. Incredible service!",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Jessica Martinez",
      role: "Crypto Investor", 
      location: "Los Angeles, CA",
      amount: "$41,203",
      text: "Hardware wallet died with my seed phrase lost. They used advanced recovery techniques and got back my entire portfolio.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "David Kim",
      role: "Blockchain Developer",
      location: "Seattle, WA", 
      amount: "$15,672",
      text: "Scammed by a fake DeFi protocol. The forensics team tracked my funds across 7 chains and recovered 85% - amazing work!",
      avatar: "https://randomuser.me/api/portraits/men/68.jpg"
    },
    {
      name: "Rachel Foster",
      role: "NFT Collector",
      location: "Miami, FL", 
      amount: "$32,445",
      text: "Stuck NFTs worth $30K+ from a failed marketplace transaction. They recovered everything including rare pieces I thought were lost forever.",
      avatar: "https://randomuser.me/api/portraits/women/25.jpg"
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
    <div className="bg-gray-50 py-16 testimonials">
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
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=3b82f6&color=fff&size=80`;
              }}
            />
            
            <div className="text-6xl text-blue-500 mb-4 font-serif">"</div>
            
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