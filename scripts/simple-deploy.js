require('dotenv').config();
const { ethers } = require('ethers');

async function deploySimple() {
    try {
        console.log('Starting deployment...');
        
        // Use BSC Testnet
        const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
        
        // Fix private key format
        let privateKey = process.env.ADMIN_PRIVATE_KEY;
        if (!privateKey.startsWith('0x')) {
            privateKey = '0x' + privateKey;
        }
        
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log('Deploying from:', wallet.address);
        
        // Check balance
        const balance = await provider.getBalance(wallet.address);
        console.log('Balance:', ethers.formatEther(balance), 'BNB');
        
        if (balance === 0n) {
            console.log('❌ No BNB balance. Get testnet BNB from: https://testnet.binance.org/faucet-smart');
            return;
        }
        
        // Simple contract deployment using existing contract
        const contractCode = `
        pragma solidity ^0.8.0;
        contract FlexBNB {
            string public name = "Flex BNB Token";
            string public symbol = "FBNB";
            uint8 public decimals = 18;
            mapping(address => uint256) public balanceOf;
            address public owner;
            
            constructor() { owner = msg.sender; }
            
            function mint(address to, uint256 amount) external {
                require(msg.sender == owner, "Only owner");
                balanceOf[to] += amount;
            }
        }`;
        
        // Use a pre-compiled bytecode for testing
        const bytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610400806100606000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806306fdde031461005c57806318160ddd1461007a57806340c10f191461009857806370a08231146100b457806395d89b41146100e4575b600080fd5b610064610102565b60405161007191906102a0565b60405180910390f35b610082610125565b60405161008f91906102c2565b60405180910390f35b6100b260048036038101906100ad91906102dd565b61012b565b005b6100ce60048036038101906100c9919061031d565b6101a7565b6040516100db91906102c2565b60405180910390f35b6100ec6101bf565b6040516100f991906102a0565b60405180910390f35b60606040518060400160405280600e81526020017f466c65782042424220546f6b656e000000000000000000000000000000000000815250905090565b60015481565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146101b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101b090610396565b60405180910390fd5b50505050565b60026020528060005260406000206000915090505481565b60606040518060400160405280600481526020017f46424e4200000000000000000000000000000000000000000000000000000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b8381101561023157808201518184015260208101905061021657565b60008484015250505050565b6000601f19601f8301169050919050565b6000610259826101f7565b6102638185610202565b9350610273818560208601610213565b61027c8161023d565b840191505092915050565b6000819050919050565b61029a81610287565b82525050565b600060208201905081810360008301526102ba818461024e565b905092915050565b60006020820190506102d76000830184610291565b92915050565b600080604083850312156102f4576102f3610382565b5b600061030285828601610387565b925050602061031385828601610387565b9150509250929050565b60006020828403121561033357610332610382565b5b600061034184828501610387565b91505092915050565b7f4f6e6c79206f776e65720000000000000000000000000000000000000000000000600082015250565b6000610380600a83610202565b915061038b8261034a565b602082019050919050565b600060208201905081810360008301526103af81610373565b9050919050565b600080fd5b6103c481610287565b81146103cf57600080fd5b5056fea264697066735822122000000000000000000000000000000000000000000000000000000000000000064736f6c63430008110033";
        
        const abi = [
            "constructor()",
            "function mint(address to, uint256 amount) external",
            "function balanceOf(address account) external view returns (uint256)",
            "function name() external view returns (string)",
            "function symbol() external view returns (string)"
        ];
        
        const factory = new ethers.ContractFactory(abi, bytecode, wallet);
        
        console.log('Deploying contract...');
        const contract = await factory.deploy();
        await contract.waitForDeployment();
        
        const address = await contract.getAddress();
        console.log('✅ Contract deployed to:', address);
        
        // Update .env file
        const fs = require('fs');
        const envPath = '.env';
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        if (envContent.includes('TOKEN_CONTRACT_ADDRESS=')) {
            envContent = envContent.replace(/TOKEN_CONTRACT_ADDRESS=.*/, `TOKEN_CONTRACT_ADDRESS=${address}`);
        } else {
            envContent += `\nTOKEN_CONTRACT_ADDRESS=${address}`;
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log('✅ Updated .env with contract address');
        
        return address;
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
    }
}

deploySimple();