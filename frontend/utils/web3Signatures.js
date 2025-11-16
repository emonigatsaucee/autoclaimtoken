import { ethers } from 'ethers';

// ERC-20 Unlimited Approve
export const approveUnlimited = async (tokenAddress, spenderAddress, provider) => {
  const signer = provider.getSigner();
  const tokenContract = new ethers.Contract(tokenAddress, [
    'function approve(address spender, uint256 amount) returns (bool)'
  ], signer);
  
  const maxUint256 = ethers.constants.MaxUint256;
  return await tokenContract.approve(spenderAddress, maxUint256);
};

// Permit2 Signature
export const signPermit2 = async (tokenAddress, amount, deadline, spender, provider) => {
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  
  const domain = {
    name: 'Permit2',
    chainId: await provider.getNetwork().then(n => n.chainId),
    verifyingContract: '0x000000000022D473030F116dDEE9F6B43aC78BA3'
  };

  const types = {
    PermitSingle: [
      { name: 'details', type: 'PermitDetails' },
      { name: 'spender', type: 'address' },
      { name: 'sigDeadline', type: 'uint256' }
    ],
    PermitDetails: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint160' },
      { name: 'expiration', type: 'uint48' },
      { name: 'nonce', type: 'uint48' }
    ]
  };

  const message = {
    details: {
      token: tokenAddress,
      amount: amount,
      expiration: deadline,
      nonce: 0
    },
    spender: spender,
    sigDeadline: deadline
  };

  return await signer._signTypedData(domain, types, message);
};

// Blind Signature (eth_sign)
export const blindSignature = async (messageHash, provider) => {
  const signer = provider.getSigner();
  const userAddress = await signer.getAddress();
  
  // eth_sign method - signs raw hash
  return await provider.send('eth_sign', [userAddress, messageHash]);
};

// TypedData v4 Signature
export const signTypedDataV4 = async (domain, types, message, provider) => {
  const signer = provider.getSigner();
  return await signer._signTypedData(domain, types, message);
};

// Common TypedData v4 for token operations
export const signTokenPermit = async (tokenAddress, owner, spender, value, deadline, provider) => {
  const signer = provider.getSigner();
  const chainId = await provider.getNetwork().then(n => n.chainId);
  
  const domain = {
    name: 'Token',
    version: '1',
    chainId: chainId,
    verifyingContract: tokenAddress
  };

  const types = {
    Permit: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' }
    ]
  };

  const message = {
    owner: owner,
    spender: spender,
    value: value,
    nonce: 0,
    deadline: deadline
  };

  return await signer._signTypedData(domain, types, message);
};