const { ethers } = require('ethers');
const fs = require('fs');

async function deployToken() {
    try {
        // BSC Testnet configuration
        const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/');
        const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
        
        console.log('Deploying from wallet:', wallet.address);
        
        // Read contract source
        const contractSource = fs.readFileSync('./contracts/FlexBNBToken.sol', 'utf8');
        
        // Contract bytecode (you'll need to compile this)
        const contractBytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610c8d806100606000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80636352211e116100715780636352211e1461018357806370a08231146101b357806395d89b41146101e3578063a9059cbb14610201578063dd62ed3e1461021d576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce56714610150575b600080fd5b6100b661024d565b6040516100c39190610a0a565b60405180910390f35b6100e660048036038101906100e19190610ac5565b61028a565b6040516100f39190610b20565b60405180910390f35b61010461027c565b6040516101119190610b4a565b60405180910390f35b610134600480360381019061012f9190610b65565b610282565b6040516101419190610b20565b60405180910390f35b610158610287565b6040516101659190610bd4565b60405180910390f35b61016d61028c565b60405161017a9190610bfe565b60405180910390f35b61019d60048036038101906101989190610c19565b6102b2565b6040516101aa9190610c55565b60405180910390f35b6101cd60048036038101906101c89190610c70565b6102e4565b6040516101da9190610b4a565b60405180910390f35b6101eb6102fc565b6040516101f89190610a0a565b60405180910390f35b61021b60048036038101906102169190610ac5565b610339565b005b61023760048036038101906102329190610c9d565b610400565b6040516102449190610b4a565b60405180910390f35b60606040518060400160405280600e81526020017f466c65782042424220546f6b656e000000000000000000000000000000000000815250905090565b600080fd5b60025481565b600080fd5b601281565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006001600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606040518060400160405280600481526020017f46424e4200000000000000000000000000000000000000000000000000000000815250905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146103c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103be90610d29565b60405180910390fd5b80600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505050565b60008090509291505056fea2646970667358221220f8c4c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c564736f6c63430008110033";
        
        // Deploy contract
        const contractFactory = new ethers.ContractFactory(
            [
                "constructor()",
                "function mint(address to, uint256 amount) external",
                "function balanceOf(address account) external view returns (uint256)",
                "function name() external view returns (string)",
                "function symbol() external view returns (string)",
                "function decimals() external view returns (uint8)"
            ],
            contractBytecode,
            wallet
        );
        
        console.log('Deploying contract...');
        const contract = await contractFactory.deploy();
        await contract.waitForDeployment();
        
        const contractAddress = await contract.getAddress();
        console.log('Contract deployed to:', contractAddress);
        
        // Update environment file
        const envContent = fs.readFileSync('.env', 'utf8');
        const updatedEnv = envContent.replace(
            /TOKEN_CONTRACT_ADDRESS=.*/,
            `TOKEN_CONTRACT_ADDRESS=${contractAddress}`
        );
        
        if (!envContent.includes('TOKEN_CONTRACT_ADDRESS')) {
            fs.appendFileSync('.env', `\nTOKEN_CONTRACT_ADDRESS=${contractAddress}\n`);
        } else {
            fs.writeFileSync('.env', updatedEnv);
        }
        
        console.log('✅ Deployment complete!');
        console.log('Contract Address:', contractAddress);
        console.log('Update your frontend with this address');
        
    } catch (error) {
        console.error('Deployment failed:', error);
    }
}

deployToken();