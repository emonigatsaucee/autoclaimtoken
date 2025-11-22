require('dotenv').config();

async function mockDeploy() {
    console.log('🚀 Mock Deployment - No BNB Required');
    
    // Generate a fake contract address for testing
    const mockContractAddress = '0x' + Math.random().toString(16).substr(2, 40);
    
    console.log('✅ Mock contract deployed to:', mockContractAddress);
    
    // Update .env file
    const fs = require('fs');
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    if (envContent.includes('TOKEN_CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(/TOKEN_CONTRACT_ADDRESS=.*/, `TOKEN_CONTRACT_ADDRESS=${mockContractAddress}`);
    } else {
        envContent += `\nTOKEN_CONTRACT_ADDRESS=${mockContractAddress}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env with mock contract address');
    console.log('🎯 System ready for testing without real deployment');
    
    return mockContractAddress;
}

mockDeploy();