// Smart contract templates for recovery operations

const RECOVERY_CONTRACT_ABI = [
  "function executeRecovery(address target, bytes calldata data) external payable returns (bool success, bytes memory result)",
  "function batchExecute(address[] calldata targets, bytes[] calldata datas) external payable returns (bool[] memory successes)",
  "function emergencyWithdraw(address token, uint256 amount) external",
  "function setOwner(address newOwner) external",
  "event RecoveryExecuted(address indexed target, bool success, uint256 value)",
  "event BatchExecuted(uint256 indexed batchId, uint256 successCount, uint256 totalCount)"
];

const RECOVERY_CONTRACT_BYTECODE = `
pragma solidity ^0.8.19;

contract AutoRecoveryContract {
    address public owner;
    mapping(address => bool) public authorizedRecoverers;
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    modifier onlyAuthorized() {
        require(msg.sender == owner || authorizedRecoverers[msg.sender], "Not authorized");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function executeRecovery(
        address target,
        bytes calldata data
    ) external payable onlyAuthorized returns (bool success, bytes memory result) {
        (success, result) = target.call{value: msg.value}(data);
        emit RecoveryExecuted(target, success, msg.value);
    }
    
    function batchExecute(
        address[] calldata targets,
        bytes[] calldata datas
    ) external payable onlyAuthorized returns (bool[] memory successes) {
        require(targets.length == datas.length, "Array length mismatch");
        
        successes = new bool[](targets.length);
        uint256 successCount = 0;
        
        for (uint256 i = 0; i < targets.length; i++) {
            (bool success,) = targets[i].call(datas[i]);
            successes[i] = success;
            if (success) successCount++;
        }
        
        emit BatchExecuted(block.timestamp, successCount, targets.length);
    }
    
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            payable(owner).transfer(amount);
        } else {
            IERC20(token).transfer(owner, amount);
        }
    }
    
    function authorizeRecoverer(address recoverer) external onlyOwner {
        authorizedRecoverers[recoverer] = true;
    }
    
    function revokeRecoverer(address recoverer) external onlyOwner {
        authorizedRecoverers[recoverer] = false;
    }
    
    receive() external payable {}
}

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}
`;

const MULTICALL_TEMPLATE = {
  abi: [
    "function aggregate(tuple(address target, bytes callData)[] calls) returns (uint256 blockNumber, bytes[] returnData)",
    "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) returns (tuple(bool success, bytes returnData)[] returnData)",
    "function tryBlockAndAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) returns (uint256 blockNumber, bytes32 blockHash, tuple(bool success, bytes returnData)[] returnData)"
  ],
  addresses: {
    1: "0xcA11bde05977b3631167028862bE2a173976CA11", // Ethereum
    56: "0xcA11bde05977b3631167028862bE2a173976CA11", // BSC
    137: "0xcA11bde05977b3631167028862bE2a173976CA11", // Polygon
    42161: "0xcA11bde05977b3631167028862bE2a173976CA11", // Arbitrum
    10: "0xcA11bde05977b3631167028862bE2a173976CA11" // Optimism
  }
};

const COMMON_TOKEN_ABIS = {
  ERC20: [
    "function balanceOf(address owner) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)"
  ],
  
  UNISWAP_V2_PAIR: [
    "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    "function token0() view returns (address)",
    "function token1() view returns (address)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)"
  ],
  
  COMPOUND_CTOKEN: [
    "function balanceOf(address owner) view returns (uint256)",
    "function exchangeRateStored() view returns (uint256)",
    "function supplyRatePerBlock() view returns (uint256)",
    "function borrowRatePerBlock() view returns (uint256)",
    "function totalBorrows() view returns (uint256)",
    "function totalSupply() view returns (uint256)"
  ],
  
  AAVE_ATOKEN: [
    "function balanceOf(address user) view returns (uint256)",
    "function scaledBalanceOf(address user) view returns (uint256)",
    "function getScaledUserBalanceAndSupply(address user) view returns (uint256, uint256)"
  ]
};

const RECOVERY_METHODS = {
  DIRECT_CLAIM: {
    name: "Direct Claim",
    gasEstimate: 100000,
    successRate: 0.9,
    description: "Direct function call to claim tokens"
  },
  
  MULTICALL_BATCH: {
    name: "Multicall Batch",
    gasEstimate: 250000,
    successRate: 0.85,
    description: "Batch multiple claims in single transaction"
  },
  
  FLASHLOAN_RECOVERY: {
    name: "Flashloan Recovery",
    gasEstimate: 500000,
    successRate: 0.6,
    description: "Use flashloan to recover stuck funds"
  },
  
  SOCIAL_RECOVERY: {
    name: "Social Recovery",
    gasEstimate: 150000,
    successRate: 0.4,
    description: "Multi-signature social recovery mechanism"
  },
  
  GOVERNANCE_PROPOSAL: {
    name: "Governance Proposal",
    gasEstimate: 200000,
    successRate: 0.3,
    description: "Submit governance proposal for fund recovery"
  }
};

const PROTOCOL_SPECIFIC_METHODS = {
  UNISWAP: {
    claimUNI: "function claim(uint256 index, address account, uint256 amount, bytes32[] merkleProof)",
    removeLiquidity: "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline)"
  },
  
  COMPOUND: {
    claimComp: "function claimComp(address holder)",
    redeem: "function redeem(uint256 redeemTokens) returns (uint256)",
    redeemUnderlying: "function redeemUnderlying(uint256 redeemAmount) returns (uint256)"
  },
  
  AAVE: {
    claimRewards: "function claimRewards(address[] assets, uint256 amount, address to) returns (uint256)",
    withdraw: "function withdraw(address asset, uint256 amount, address to) returns (uint256)"
  },
  
  SUSHISWAP: {
    harvest: "function harvest(uint256 pid, address to)",
    emergencyWithdraw: "function emergencyWithdraw(uint256 pid, address to)"
  }
};

const GAS_OPTIMIZATION_STRATEGIES = {
  BATCH_OPERATIONS: {
    description: "Combine multiple operations into single transaction",
    gasSavings: "30-50%",
    implementation: "Use multicall or custom batch contract"
  },
  
  OPTIMAL_TIMING: {
    description: "Execute during low network congestion",
    gasSavings: "20-70%",
    implementation: "Monitor gas prices and execute during off-peak hours"
  },
  
  FLASHLOAN_ARBITRAGE: {
    description: "Use flashloans to avoid upfront capital requirements",
    gasSavings: "Variable",
    implementation: "Borrow, execute, repay in single transaction"
  },
  
  LAYER2_EXECUTION: {
    description: "Execute on Layer 2 when possible",
    gasSavings: "90-99%",
    implementation: "Use Arbitrum, Optimism, or Polygon for compatible tokens"
  }
};

module.exports = {
  RECOVERY_CONTRACT_ABI,
  RECOVERY_CONTRACT_BYTECODE,
  MULTICALL_TEMPLATE,
  COMMON_TOKEN_ABIS,
  RECOVERY_METHODS,
  PROTOCOL_SPECIFIC_METHODS,
  GAS_OPTIMIZATION_STRATEGIES
};