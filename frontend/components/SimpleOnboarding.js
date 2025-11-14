import { useState } from 'react';
import { Wallet, Search, Eye, ArrowRight, CheckCircle, Info } from 'lucide-react';

export default function SimpleOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [walletAddress, setWalletAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Connect Your Wallet',
      description: 'Enter your wallet address to get started',
      icon: Wallet,
      color: 'blue'
    },
    {
      number: 2,
      title: 'Scan Blockchains',
      description: 'We scan 50+ blockchains for your assets',
      icon: Search,
      color: 'purple'
    },
    {
      number: 3,
      title: 'View Your Results',
      description: 'See all your tokens and claimable rewards',
      icon: Eye,
      color: 'green'
    }
  ];

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!walletAddress || !walletAddress.startsWith('0x')) {
        alert('Please enter a valid wallet address');
        return;
      }
      setCurrentStep(2);
      setIsScanning(true);
      
      // Simulate scanning
      setTimeout(() => {
        setIsScanning(false);
        setCurrentStep(3);
      }, 3000);
    } else if (currentStep === 3) {
      onComplete(walletAddress);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Progress Bar - Mobile Responsive */}
      <div className="mb-6 sm:mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                    currentStep >= step.number
                      ? `bg-${step.color}-600 text-white`
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  <div className={`font-bold text-sm ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                </div>
                {/* Mobile: Show only step number */}
                <div className="text-center sm:hidden">
                  <div className={`text-xs font-bold ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                    Step {step.number}
                  </div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 sm:mx-4 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content - Mobile Responsive */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 border border-gray-100">
        {/* Step 1: Connect Wallet */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Connect Your Wallet</h2>
              <p className="text-sm sm:text-base text-gray-600 px-4">Enter your wallet address to scan for hidden assets</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-blue-800">
                <div className="font-medium mb-1">100% Safe & Non-Custodial</div>
                <div>We only need your public wallet address. We will NEVER ask for your private keys or seed phrase.</div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 sm:px-4 py-3 sm:py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-lg"
              />
              <p className="text-xs text-gray-500 mt-2 break-all">
                Example: 0x742d35Cc6634C0532925a3b8D4C9db96590c6196
              </p>
            </div>

            <button
              onClick={handleNext}
              disabled={!walletAddress}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>Start Scanning</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}

        {/* Step 2: Scanning */}
        {currentStep === 2 && (
          <div className="text-center py-6 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 px-4">Scanning Blockchains...</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">We're checking 50+ blockchains for your assets</p>

            <div className="max-w-md mx-auto space-y-2 sm:space-y-3">
              {['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'].map((chain, idx) => (
                <div key={chain} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm sm:text-base text-gray-700">{chain}</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Results Ready */}
        {currentStep === 3 && (
          <div className="text-center py-6 sm:py-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3 sm:mb-4 px-4">Scan Complete!</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">Your blockchain scan is ready to view</p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-green-600">7</div>
                  <div className="text-xs sm:text-sm text-gray-600">Chains Scanned</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-600">12</div>
                  <div className="text-xs sm:text-sm text-gray-600">Tokens Found</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-purple-600">3</div>
                  <div className="text-xs sm:text-sm text-gray-600">Claimable</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <span>View Full Results</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Need help? Check out our <a href="#" className="text-blue-600 hover:underline">Quick Start Guide</a></p>
      </div>
    </div>
  );
}


