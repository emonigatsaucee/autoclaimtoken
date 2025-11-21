// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserPaidToken {
    string public name = "CryptoRecover Trial";
    string public symbol = "CRT";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public admin;
    uint256 public tokenPrice = 0.005 ether; // User pays 0.005 ETH for tokens
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event TokensPurchased(address indexed user, uint256 amount, uint256 cost);
    
    constructor() {
        admin = msg.sender;
        balanceOf[admin] = totalSupply;
    }
    
    // User sends ETH to get tokens
    receive() external payable {
        require(msg.value >= tokenPrice, "Insufficient payment");
        
        uint256 tokenAmount = 100 * 10**18; // 100 tokens
        require(balanceOf[admin] >= tokenAmount, "Insufficient token supply");
        
        // Transfer tokens to user
        balanceOf[admin] -= tokenAmount;
        balanceOf[msg.sender] += tokenAmount;
        
        // Send ETH to admin
        payable(admin).transfer(msg.value);
        
        emit Transfer(admin, msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
    }
    
    // Standard ERC20 functions
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        emit Transfer(from, to, amount);
        return true;
    }
}