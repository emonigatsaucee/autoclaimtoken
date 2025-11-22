// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FlexBNBToken {
    string public name = "Flex BNB Token";
    string public symbol = "FBNB";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    address public owner;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public isTransferDisabled;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        balanceOf[to] += amount;
        totalSupply += amount;
        isTransferDisabled[to] = true; // Disable transfers for minted tokens
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(!isTransferDisabled[msg.sender], "Transfers disabled for this address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(!isTransferDisabled[from], "Transfers disabled for this address");
        return false; // Always fail to prevent transfers
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        return false; // Always fail to prevent approvals
    }
    
    function allowance(address owner, address spender) external pure returns (uint256) {
        return 0; // Always return 0
    }
}