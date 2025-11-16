import { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import Head from 'next/head';
import SignatureManager from '../components/SignatureManager';

export default function Signatures() {
  const [provider, setProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      setProvider(window.ethereum);
      
      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setUserAddress(accounts[0]);
            setIsConnected(true);
          }
        });
    }
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setUserAddress(accounts[0]);
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
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
                Test advanced wallet interaction methods including ERC-20 unlimited approvals, 
                Permit2 signatures, blind signatures, and TypedData v4.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-yellow-800">Security Warning</h3>
                    <p className="text-yellow-700 text-sm">
                      These are advanced signature methods. Only use with test wallets and small amounts. 
                      Always verify what you're signing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {!isConnected ? (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600 mb-6">
                  Connect your wallet to test advanced signature methods
                </p>
                <button
                  onClick={connectWallet}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-bold"
                >
                  Connect Wallet
                </button>
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

                <SignatureManager provider={provider} userAddress={userAddress} />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-blue-800 mb-2">Signature Method Details</h3>
                      <div className="space-y-3 text-sm text-blue-700">
                        <div>
                          <strong>ERC-20 Unlimited Approve:</strong> Grants unlimited spending allowance to a contract
                        </div>
                        <div>
                          <strong>Permit2 Signature:</strong> Gasless token approvals using EIP-2612 standard
                        </div>
                        <div>
                          <strong>Blind Signature (eth_sign):</strong> Signs raw message hash without showing content
                        </div>
                        <div>
                          <strong>TypedData v4:</strong> Structured data signing with EIP-712 standard
                        </div>
                        <div>
                          <strong>Token Permit:</strong> Gasless token permissions using permit() function
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