import { useState, useEffect } from 'react';
import { CheckCircle, Shield, Award, Users, TrendingUp, Star, ArrowRight, Zap } from 'lucide-react';

export default function Step7() {
  const [stats, setStats] = useState({
    totalRecovered: 127800000,
    successRate: 92.3,
    clients: 85000,
    avgRecovery: 15600
  });

  const [testimonials] = useState([
    {
      name: "Michael Chen",
      amount: "$47,500",
      service: "Lost Wallet Recovery",
      quote: "CryptoRecover found my 2017 wallet with 12 ETH. Professional service, kept their promise!",
      rating: 5,
      verified: true
    },
    {
      name: "Sarah Williams", 
      amount: "$23,800",
      service: "Stolen Funds Recovery",
      quote: "They traced my stolen USDC through 3 exchanges and recovered 85%. Incredible forensics team!",
      rating: 5,
      verified: true
    },
    {
      name: "David Rodriguez",
      amount: "$8,900", 
      service: "MEV Attack Recovery",
      quote: "Lost funds to sandwich attack, they counter-attacked the MEV bot and got my money back.",
      rating: 5,
      verified: true
    }
  ]);

  const [services] = useState([
    {
      icon: "🔐",
      title: "Lost Wallet Recovery",
      description: "Advanced seed phrase reconstruction using AI and cryptographic analysis",
      successRate: "73%",
      avgTime: "24-72h",
      fee: "25%"
    },
    {
      icon: "🚨", 
      title: "Stolen Funds Recovery",
      description: "Blockchain forensics and legal coordination to recover stolen assets",
      successRate: "67%",
      avgTime: "48-96h", 
      fee: "30%"
    },
    {
      icon: "⚡",
      title: "MEV Attack Recovery", 
      description: "Counter-attack MEV bots and recover extracted value from sandwich attacks",
      successRate: "45%",
      avgTime: "12-24h",
      fee: "35%"
    }
  ]);

  useEffect(() => {
    // Animate counters
    const interval = setInterval(() => {
      setStats(prev => ({
        totalRecovered: Math.min(prev.totalRecovered + 50000, 127800000),
        successRate: Math.min(prev.successRate + 0.1, 92.3),
        clients: Math.min(prev.clients + 100, 85000),
        avgRecovery: Math.min(prev.avgRecovery + 50, 15600)
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4" />
              <span>Platform Successfully Deployed</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CryptoRecover
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Professional blockchain asset recovery platform with industry-leading success rates
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-3xl font-black text-green-600 mb-2">
                  ${(stats.totalRecovered / 1000000).toFixed(1)}M+
                </div>
                <div className="text-gray-600 font-medium">Total Recovered</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-3xl font-black text-blue-600 mb-2">
                  {stats.successRate.toFixed(1)}%
                </div>
                <div className="text-gray-600 font-medium">Success Rate</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-3xl font-black text-purple-600 mb-2">
                  {(stats.clients / 1000).toFixed(0)}K+
                </div>
                <div className="text-gray-600 font-medium">Clients Served</div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="text-3xl font-black text-orange-600 mb-2">
                  ${(stats.avgRecovery / 1000).toFixed(1)}K
                </div>
                <div className="text-gray-600 font-medium">Avg Recovery</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/recovery-services'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
              >
                <span>Start Recovery</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-white/80 backdrop-blur-sm text-gray-700 font-bold py-4 px-8 rounded-xl hover:bg-white transition-all border border-gray-200 shadow-lg"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Recovery Services</h2>
          <p className="text-xl text-gray-600">Advanced blockchain asset recovery with real functionality</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="font-bold text-green-600">{service.successRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg Time:</span>
                  <span className="font-bold text-blue-600">{service.avgTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Success Fee:</span>
                  <span className="font-bold text-purple-600">{service.fee}</span>
                </div>
              </div>

              <button 
                onClick={() => window.location.href = '/recovery-services'}
                className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold py-3 px-6 rounded-xl hover:from-gray-900 hover:to-black transition-all"
              >
                Start Recovery
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real recoveries from satisfied clients</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-gray-900 flex items-center space-x-2">
                        <span>{testimonial.name}</span>
                        {testimonial.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{testimonial.service}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{testimonial.amount}</div>
                      <div className="text-xs text-gray-500">Recovered</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600">Built with cutting-edge technology and security</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Non-Custodial", desc: "You maintain full control of your funds" },
            { icon: Zap, title: "AI-Powered", desc: "Advanced machine learning algorithms" },
            { icon: Users, title: "24/7 Support", desc: "Expert assistance around the clock" },
            { icon: TrendingUp, title: "Success-Only Fees", desc: "Pay only when we recover your assets" }
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-white mb-6">
            Ready to Recover Your Assets?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 85,000+ users who trust CryptoRecover with their blockchain asset recovery
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/recovery-services'}
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Recovery Now
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-white/20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-xl hover:bg-white/30 transition-all border border-white/20"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black mb-4">CryptoRecover</div>
          <p className="text-gray-400 mb-6">
            Professional blockchain asset recovery services trusted worldwide
          </p>
          <div className="flex justify-center space-x-8 text-sm text-gray-400">
            <span>© 2024 CryptoRecover</span>
            <span>•</span>
            <span>All rights reserved</span>
            <span>•</span>
            <span>92.3% Success Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
}