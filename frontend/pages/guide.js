import { useState } from 'react';
import { BookOpen, Wallet, Search, Zap, Shield, DollarSign } from 'lucide-react';
import Head from 'next/head';

export default function Guide() {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: "Connect Your Wallet",
      icon: <Wallet className="w-6 h-6" />,
      description: "Connect MetaMask, Trust Wallet, or any Web3 wallet to start scanning",
      details: [
        "Click 'Connect Wallet' on the homepage",
        "Select your wallet provider (MetaMask recommended)",
        "Approve the connection request",
        "Your wallet will be scanned automatically"
      ]
    },
    {
      id: 2,
      title: "Scan for Assets",
      icon: <Search className="w-6 h-6" />,
      description: "Our system scans 7+ blockchains for recoverable assets",
      details: [
        "Automatic scan starts after wallet connection",
        "Checks Ethereum, BSC, Polygon, Arbitrum, Optimism",
        "Finds stuck bridge transactions, unclaimed rewards",
        "Identifies forgotten DeFi positions and airdrops"
      ]
    },
    {
      id: 3,
      title: "Review Recovery Options",
      icon: <Zap className="w-6 h-6" />,
      description: "See what can be recovered and estimated success rates",
      details: [
        "View all recoverable assets with USD values",
        "See success probability for each recovery method",
        "Understand fees (15-35% of recovered amount)",
        "Choose which assets to recover"
      ]
    },
    {
      id: 4,
      title: "Authorize Recovery",
      icon: <Shield className="w-6 h-6" />,
      description: "Sign transactions to authorize our recovery system",
      details: [
        "Sign recovery authorization messages",
        "Grant temporary access to stuck assets",
        "All signatures are secure and time-limited",
        "You maintain full control of your wallet"
      ]
    },
    {
      id: 5,
      title: "Get Your Funds",
      icon: <DollarSign className="w-6 h-6" />,
      description: "Receive recovered assets minus our service fee",
      details: [
        "Assets are recovered to your original wallet",
        "Our fee is deducted automatically (15-35%)",
        "You receive 65-85% of recovered value",
        "All transactions are transparent on-chain"
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>How to Use CryptoRecover - Complete Guide</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">CryptoRecover Guide</h1>
                  <p className="text-xs text-gray-500 font-medium">How to recover your crypto assets</p>
                </div>
              </div>
              
              <a 
                href="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold"
              >
                Start Recovery
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-4">Complete Recovery Guide</h2>
            <p className="text-gray-600 mb-6">
              Follow these 5 simple steps to recover your lost, stuck, or forgotten crypto assets. 
              Our system has helped 85,000+ users recover over $2.3M in digital assets.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">🔒 Security First</h3>
              <p className="text-blue-700 text-sm">
                We never ask for your private keys or seed phrases. All recovery is done through secure, 
                time-limited signatures that you control.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recovery Steps</h3>
                <div className="space-y-2">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      onClick={() => setActiveStep(step.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeStep === step.id
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activeStep === step.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                        }`}>
                          {step.icon}
                        </div>
                        <div>
                          <div className="font-semibold">Step {step.id}</div>
                          <div className="text-sm">{step.title}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`bg-white rounded-xl p-8 shadow-lg ${
                    activeStep === step.id ? 'block' : 'hidden'
                  }`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-blue-500 text-white rounded-xl">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Step {step.id}: {step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {step.details.map((detail, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700">{detail}</p>
                      </div>
                    ))}
                  </div>

                  {step.id < steps.length && (
                    <button
                      onClick={() => setActiveStep(step.id + 1)}
                      className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
                    >
                      Next Step →
                    </button>
                  )}

                  {step.id === steps.length && (
                    <a
                      href="/"
                      className="mt-6 inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
                    >
                      Start Recovery Now →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Is this service safe?</h4>
                <p className="text-gray-600 text-sm">Yes, we use non-custodial methods and never access your private keys.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">What are the fees?</h4>
                <p className="text-gray-600 text-sm">15-35% of recovered funds. No upfront costs - you only pay if we succeed.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">How long does recovery take?</h4>
                <p className="text-gray-600 text-sm">Most recoveries complete within 24-48 hours after authorization.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">What can be recovered?</h4>
                <p className="text-gray-600 text-sm">Stuck bridges, unclaimed rewards, forgotten DeFi positions, and more.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}