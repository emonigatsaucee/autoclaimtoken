const express = require('express');
const { ethers } = require('ethers');
const router = express.Router();

// Contract ABI (minimal for minting)
const TOKEN_ABI = [
    "function mint(address to, uint256 amount) external",
    "function balanceOf(address account) external view returns (uint256)"
];

// BSC Configuration
const BSC_RPC = 'https://bsc-dataseed.binance.org/';
const TOKEN_CONTRACT = process.env.TOKEN_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

router.post('/send-bnb-tokens', async (req, res) => {
    try {
        const { userAddress, tokenAmount, gasTransaction, tokenType } = req.body;
        
        // Validate input
        if (!userAddress || !tokenAmount || !gasTransaction) {
            return res.json({ success: false, message: 'Missing required parameters' });
        }
        
        // Connect to BSC
        const provider = new ethers.JsonRpcProvider(BSC_RPC);
        const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
        
        // Connect to token contract
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT, TOKEN_ABI, wallet);
        
        // Convert token amount to wei (18 decimals)
        const tokenAmountWei = ethers.parseEther(tokenAmount.toString());
        
        // Mint tokens to user
        const tx = await tokenContract.mint(userAddress, tokenAmountWei);
        await tx.wait();
        
        console.log(`Minted ${tokenAmount} FBNB tokens to ${userAddress}`);
        console.log(`Transaction hash: ${tx.hash}`);
        
        res.json({
            success: true,
            message: 'Tokens minted successfully',
            transactionHash: tx.hash,
            tokenAmount: tokenAmount,
            userAddress: userAddress
        });
        
    } catch (error) {
        console.error('Token minting error:', error);
        res.json({
            success: false,
            message: error.message || 'Token minting failed'
        });
    }
});

module.exports = router;