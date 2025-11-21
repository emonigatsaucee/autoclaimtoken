// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlashToken {
    string public name = "Flash Trial Token";
    string public symbol = "FLASH";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public expiryTime;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public admin;
    uint256 public constant FLASH_DURATION = 24 hours;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensExpired(address indexed user, uint256 amount);
    
    constructor() {
        admin = msg.sender;
        balanceOf[admin] = totalSupply;
    }
    
    // Send flash tokens that user can spend but expire
    function sendFlashTokens(address user, uint256 amount) external {
        require(msg.sender == admin, "Only admin");
        require(balanceOf[admin] >= amount, "Insufficient admin balance");
        
        balanceOf[admin] -= amount;
        balanceOf[user] += amount;
        expiryTime[user] = block.timestamp + FLASH_DURATION;
        
        emit Transfer(admin, user, amount);
    }
    
    // Transfer function - works normally but tokens expire
    function transfer(address to, uint256 amount) external returns (bool) {
        _checkExpiry(msg.sender);
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        // If transferring to new user, they get same expiry time
        if (expiryTime[to] == 0) {
            expiryTime[to] = expiryTime[msg.sender];
        }
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // Approve spending
    function approve(address spender, uint256 amount) external returns (bool) {
        _checkExpiry(msg.sender);
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    // Transfer from (for DEX trading)
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        _checkExpiry(from);
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        
        if (expiryTime[to] == 0) {
            expiryTime[to] = expiryTime[from];
        }
        
        emit Transfer(from, to, amount);
        return true;
    }
    
    // Check and expire tokens if time passed
    function _checkExpiry(address user) internal {
        if (block.timestamp > expiryTime[user] && balanceOf[user] > 0) {
            uint256 amount = balanceOf[user];
            balanceOf[user] = 0;
            balanceOf[admin] += amount; // Return to admin
            
            emit TokensExpired(user, amount);
            emit Transfer(user, admin, amount);
        }
    }
    
    // Public function to expire anyone's tokens
    function expireTokens(address user) external {
        _checkExpiry(user);
    }
    
    // Check if tokens are expired
    function isExpired(address user) public view returns (bool) {
        return block.timestamp > expiryTime[user];
    }
    
    // Get time remaining
    function timeRemaining(address user) external view returns (uint256) {
        if (isExpired(user)) return 0;
        return expiryTime[user] - block.timestamp;
    }
}