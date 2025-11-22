import { useState, useEffect } from 'react';

export default function HeroSection({ onGetStarted }) {
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const phrases = [
    'Lost Crypto Assets',
    'Stuck Bridge Funds', 
    'Forgotten Wallets',
    'Failed Transactions',
    'Missing NFTs'
  ];

  useEffect(() => {
    const phrase = phrases[currentIndex];
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex < phrase.length) {
        setTypedText(phrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
          setTypedText('');
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentIndex]);

  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-300 font-semibold text-sm">85,000+ Users Trust Us</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                Recover Your
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Professional multi-chain recovery platform with <span className="text-yellow-400 font-bold">73% success rate</span>. 
                Scan 50+ blockchains for lost tokens, NFTs, and bridge funds.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-green-500/25 transition-all transform hover:scale-105"
              >
                Start Free Recovery Scan
              </button>
              
              <button className="border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-8 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all">
                View Success Stories
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-black text-yellow-400">$127M+</div>
                <div className="text-blue-200 text-sm">Recovered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-green-400">50+</div>
                <div className="text-blue-200 text-sm">Blockchains</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-purple-400">24/7</div>
                <div className="text-blue-200 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Demo */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Live Recovery Demo</h3>
                  <p className="text-blue-200">See how our scanner works</p>
                </div>
                
                <LiveDemo />
                
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="font-semibold text-green-300">Non-Custodial</div>
                      <div className="text-green-200 text-sm">Your keys, your crypto</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LiveDemo() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  const startDemo = () => {
    setScanning(true);
    setProgress(0);
    setResults(null);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setResults({
            tokens: 7,
            value: '$2,847',
            chains: 5
          });
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-900/50 rounded-lg p-4">
        <div className="text-sm text-gray-300 mb-2">Demo Wallet Address:</div>
        <div className="font-mono text-xs text-blue-300 break-all">
          0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4C
        </div>
      </div>
      
      {!scanning && !results && (
        <button 
          onClick={startDemo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Start Demo Scan
        </button>
      )}
      
      {scanning && (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Scanning blockchains...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {results && (
        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
          <div className="text-center space-y-2">
            <svg className="w-8 h-8 text-green-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="font-bold text-green-300">Recovery Opportunities Found!</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-white">{results.tokens}</div>
                <div className="text-xs text-gray-300">Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-400">{results.value}</div>
                <div className="text-xs text-gray-300">Value</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400">{results.chains}</div>
                <div className="text-xs text-gray-300">Chains</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}