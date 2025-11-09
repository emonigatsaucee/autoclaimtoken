import { useState } from 'react';
import { ChevronDown, Shield, Search, Zap, AlertTriangle, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Recovery Services',
      icon: Shield,
      description: 'Professional asset recovery solutions',
      items: [
        { name: 'Lost Wallet Recovery', href: '/recovery-services?tab=lost-wallet', desc: 'Seed phrase reconstruction' },
        { name: 'Stolen Funds Recovery', href: '/recovery-services?tab=stolen-funds', desc: 'Blockchain forensics' },
        { name: 'MEV Attack Recovery', href: '/recovery-services?tab=mev-recovery', desc: 'Counter MEV bots' }
      ]
    },
    {
      title: 'Investment Management',
      icon: TrendingUp,
      description: 'AI-powered automated investing',
      items: [
        { name: 'Trusted Wallet Manager', href: '/recovery-services?tab=trusted-wallet', desc: 'Automated DeFi investments' },
        { name: 'Portfolio Analytics', href: '/portfolio-analytics', desc: 'Performance tracking' },
        { name: 'Risk Management', href: '/risk-management', desc: 'Advanced risk controls' }
      ]
    },
    {
      title: 'Platform Tools',
      icon: Search,
      description: 'Blockchain analysis tools',
      items: [
        { name: 'Wallet Scanner', href: '/?scan=true', desc: 'Multi-chain token scanner' },
        { name: 'Bridge Recovery', href: '/bridge-recovery', desc: 'Stuck transaction recovery' },
        { name: 'Staking Rewards', href: '/staking-rewards', desc: 'Claimable rewards finder' }
      ]
    },
    {
      title: 'Support & Analytics',
      icon: Users,
      description: 'Customer support and insights',
      items: [
        { name: 'Professional Support', href: '/recovery-services?tab=support', desc: '24/7 expert assistance' },
        { name: 'Success Stories', href: '/success-stories', desc: 'Client testimonials' },
        { name: 'Platform Statistics', href: '/statistics', desc: 'Recovery analytics' }
      ]
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
      >
        <BarChart3 className="w-4 h-4" />
        <span>Services</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {menuItems.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <a
                          key={itemIndex}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.desc}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-black text-green-600">$127.8M+</div>
                    <div className="text-sm text-gray-500">Total Recovered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-blue-600">92.3%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-purple-600">85K+</div>
                    <div className="text-sm text-gray-500">Clients Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-orange-600">24/7</div>
                    <div className="text-sm text-gray-500">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}