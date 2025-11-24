// API endpoint for dynamic gas price estimation

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { network, transactionType, amount, fromToken, toToken } = req.body;

    // Realistic gas estimates by network and transaction type
    const gasEstimates = {
      ethereum: {
        transfer: { gasLimit: 21000, baseFee: 15, priorityFee: 2 },
        erc20Transfer: { gasLimit: 65000, baseFee: 15, priorityFee: 2 },
        swap: { gasLimit: 150000, baseFee: 15, priorityFee: 3 },
        approve: { gasLimit: 46000, baseFee: 15, priorityFee: 2 }
      },
      bsc: {
        transfer: { gasLimit: 21000, baseFee: 3, priorityFee: 1 },
        erc20Transfer: { gasLimit: 65000, baseFee: 3, priorityFee: 1 },
        swap: { gasLimit: 120000, baseFee: 3, priorityFee: 1 },
        approve: { gasLimit: 46000, baseFee: 3, priorityFee: 1 }
      },
      polygon: {
        transfer: { gasLimit: 21000, baseFee: 30, priorityFee: 5 },
        erc20Transfer: { gasLimit: 65000, baseFee: 30, priorityFee: 5 },
        swap: { gasLimit: 140000, baseFee: 30, priorityFee: 8 },
        approve: { gasLimit: 46000, baseFee: 30, priorityFee: 5 }
      },
      arbitrum: {
        transfer: { gasLimit: 21000, baseFee: 0.1, priorityFee: 0.01 },
        erc20Transfer: { gasLimit: 65000, baseFee: 0.1, priorityFee: 0.01 },
        swap: { gasLimit: 200000, baseFee: 0.1, priorityFee: 0.02 },
        approve: { gasLimit: 46000, baseFee: 0.1, priorityFee: 0.01 }
      },
      optimism: {
        transfer: { gasLimit: 21000, baseFee: 0.001, priorityFee: 0.0001 },
        erc20Transfer: { gasLimit: 65000, baseFee: 0.001, priorityFee: 0.0001 },
        swap: { gasLimit: 180000, baseFee: 0.001, priorityFee: 0.0002 },
        approve: { gasLimit: 46000, baseFee: 0.001, priorityFee: 0.0001 }
      },
      avalanche: {
        transfer: { gasLimit: 21000, baseFee: 25, priorityFee: 2 },
        erc20Transfer: { gasLimit: 65000, baseFee: 25, priorityFee: 2 },
        swap: { gasLimit: 160000, baseFee: 25, priorityFee: 3 },
        approve: { gasLimit: 46000, baseFee: 25, priorityFee: 2 }
      },
      solana: {
        transfer: { gasLimit: 1, baseFee: 0.000005, priorityFee: 0 },
        tokenTransfer: { gasLimit: 1, baseFee: 0.000005, priorityFee: 0 },
        swap: { gasLimit: 1, baseFee: 0.00002, priorityFee: 0 }
      },
      cardano: {
        transfer: { gasLimit: 1, baseFee: 0.17, priorityFee: 0 },
        tokenTransfer: { gasLimit: 1, baseFee: 0.17, priorityFee: 0 }
      }
    };

    // Network congestion simulation
    const congestionLevels = ['low', 'medium', 'high', 'extreme'];
    const currentCongestion = congestionLevels[Math.floor(Math.random() * congestionLevels.length)];
    
    const congestionMultipliers = {
      low: 0.8,
      medium: 1.0,
      high: 2.2,
      extreme: 4.5
    };

    const networkGas = gasEstimates[network] || gasEstimates.ethereum;
    const txTypeGas = networkGas[transactionType] || networkGas.transfer;
    
    // Apply congestion multiplier
    const congestionMultiplier = congestionMultipliers[currentCongestion];
    const adjustedBaseFee = txTypeGas.baseFee * congestionMultiplier;
    const adjustedPriorityFee = txTypeGas.priorityFee * congestionMultiplier;
    
    // Calculate total gas cost
    const totalGasPrice = adjustedBaseFee + adjustedPriorityFee;
    const totalGasCost = (txTypeGas.gasLimit * totalGasPrice) / 1e9; // Convert to main unit
    
    // Token prices for USD conversion
    const tokenPrices = {
      ethereum: 3200,
      bsc: 310,
      polygon: 0.85,
      arbitrum: 3200,
      optimism: 3200,
      avalanche: 35,
      solana: 95,
      cardano: 0.45
    };
    
    const tokenPrice = tokenPrices[network] || 3200;
    const gasCostUSD = totalGasCost * tokenPrice;
    
    // Generate different speed options
    const gasOptions = {
      slow: {
        gasPrice: totalGasPrice * 0.8,
        gasCost: totalGasCost * 0.8,
        gasCostUSD: gasCostUSD * 0.8,
        estimatedTime: '5-10 minutes',
        confidence: 85
      },
      standard: {
        gasPrice: totalGasPrice,
        gasCost: totalGasCost,
        gasCostUSD: gasCostUSD,
        estimatedTime: '2-5 minutes',
        confidence: 95
      },
      fast: {
        gasPrice: totalGasPrice * 1.5,
        gasCost: totalGasCost * 1.5,
        gasCostUSD: gasCostUSD * 1.5,
        estimatedTime: '30 seconds - 2 minutes',
        confidence: 99
      },
      instant: {
        gasPrice: totalGasPrice * 2.2,
        gasCost: totalGasCost * 2.2,
        gasCostUSD: gasCostUSD * 2.2,
        estimatedTime: '15-30 seconds',
        confidence: 99.9
      }
    };

    const response = {
      success: true,
      network: network,
      transactionType: transactionType,
      congestion: currentCongestion,
      gasLimit: txTypeGas.gasLimit,
      baseFee: adjustedBaseFee,
      priorityFee: adjustedPriorityFee,
      options: gasOptions,
      timestamp: new Date().toISOString(),
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      recommendations: {
        recommended: currentCongestion === 'low' ? 'slow' : currentCongestion === 'medium' ? 'standard' : 'fast',
        reason: currentCongestion === 'low' ? 'Low network activity - save on fees' : 
                currentCongestion === 'medium' ? 'Normal network activity - standard speed recommended' :
                currentCongestion === 'high' ? 'High network activity - fast speed recommended' :
                'Extreme congestion - instant speed may be required'
      }
    };

    // Log gas estimation for monitoring
    console.log(`Gas estimation: ${network} ${transactionType}`, response);

    res.status(200).json(response);

  } catch (error) {
    console.error('Gas estimation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to estimate gas',
      message: error.message 
    });
  }
}