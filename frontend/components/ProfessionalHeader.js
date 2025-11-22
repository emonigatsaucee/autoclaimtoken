import { useState, useEffect } from 'react';

export default function ProfessionalHeader() {
  const [currentPrice, setCurrentPrice] = useState(3247.82);
  const [priceChange, setPriceChange] = useState(2.34);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 10;
      setCurrentPrice(prev => Math.max(3000, prev + change));
      setPriceChange(change);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>Live Market Data</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>ETH:</span>
              <span className="font-semibold">${currentPrice.toFixed(2)}</span>
              <span className={`text-xs ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span>Bank-Grade Security</span>
            <span>24/7 Support</span>
            <span>Global Coverage</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">CR</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">CryptoRecover</h1>
                <p className="text-sm text-gray-600">Professional Asset Recovery Platform</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-green-800 text-sm font-semibold">Verified Platform</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-right">
              <div className="text-sm text-gray-600">Total Recovered</div>
              <div className="text-xl font-bold text-green-600">$127.8M+</div>
            </div>
            
            <div className="hidden md:block text-right">
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="text-xl font-bold text-blue-600">73.2%</div>
            </div>

            <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
              Start Recovery
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <a href="#scanner" onClick={(e) => { e.preventDefault(); document.getElementById('wallet-connection')?.scrollIntoView({ behavior: 'smooth' }); }} className="py-3 px-1 border-b-2 border-blue-500 text-blue-600 font-semibold text-sm cursor-pointer">
              Wallet Scanner
            </a>
            <a href="/recovery-services" className="py-3 px-1 text-gray-600 hover:text-gray-900 font-semibold text-sm">
              Recovery Services
            </a>
            <a href="/flashed" className="py-3 px-1 text-gray-600 hover:text-gray-900 font-semibold text-sm">
              Portfolio Analytics
            </a>
            <a href="#support" onClick={(e) => { e.preventDefault(); document.querySelector('[style*="position: fixed"][style*="bottom: 20px"]')?.scrollIntoView({ behavior: 'smooth' }); }} className="py-3 px-1 text-gray-600 hover:text-gray-900 font-semibold text-sm cursor-pointer">
              Expert Support
            </a>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.querySelector('footer')?.scrollIntoView({ behavior: 'smooth' }); }} className="py-3 px-1 text-gray-600 hover:text-gray-900 font-semibold text-sm cursor-pointer">
              About Us
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
}