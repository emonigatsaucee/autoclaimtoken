const { ethers } = require('ethers');

const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address

console.log('Testing wallet address validation...');
console.log('Address:', testAddress);
console.log('Is valid address:', ethers.isAddress(testAddress));
console.log('Address length:', testAddress.length);
console.log('Starts with 0x:', testAddress.startsWith('0x'));

// Test the exact validation logic from the API
function validateWalletAddress(address) {
  console.log('Validating:', address);
  console.log('Type:', typeof address);
  console.log('Truthy:', !!address);
  console.log('ethers.isAddress result:', ethers.isAddress(address));
  
  if (!address) {
    return { valid: false, error: 'Wallet address is required' };
  }
  
  if (ethers.isAddress(address)) {
    return { valid: true, type: 'ethereum', address: address.toLowerCase() };
  }
  
  return { valid: false, error: 'Invalid wallet address format' };
}

const result = validateWalletAddress(testAddress);
console.log('Validation result:', result);