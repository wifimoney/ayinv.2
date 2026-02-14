// AYIN Protocol - Multi-Chain Contract Configuration

export const CHAIN_CONFIGS = {
  // Base Mainnet
  8453: {
    name: "Base",
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    contracts: {
      // TODO: Fill in after mainnet deployment
      AgentRegistry: "0x0000000000000000000000000000000000000000",
      DelegationPolicy: "0x0000000000000000000000000000000000000000",
      AyinSmartAccount: "0x0000000000000000000000000000000000000000",
      PredictionMarket: "0x0000000000000000000000000000000000000000",
    },
  },
  // Base Sepolia (testnet)
  84532: {
    name: "Base Sepolia",
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    contracts: {
      AgentRegistry: "0xF2Cc613924e7f3e3Ee453f417F5eA63Aa78cC1D4",
      DelegationPolicy: "0x71d50d575A86E6F34BE05abC223ac704da0d7a1d",
      AyinSmartAccount: "0x25269aB39a7dF7303fb35cfA947a12E5244e23fC",
      PredictionMarket: "0x89ecC0E5345D409930426cF1b352E30930da563E",
    },
  },
} as const;

// Default to mainnet in production, sepolia in dev
export const DEFAULT_CHAIN_ID =
  process.env.NODE_ENV === "production" ? 8453 : 84532;

export function getChainConfig(chainId: number = DEFAULT_CHAIN_ID) {
  return CHAIN_CONFIGS[chainId as keyof typeof CHAIN_CONFIGS];
}

export function getContracts(chainId: number = DEFAULT_CHAIN_ID) {
  return getChainConfig(chainId).contracts;
}

// Backward compat — default contracts for static imports
const defaultContracts = getContracts();
export const CONTRACTS = defaultContracts;

// AgentRegistry ABI (core read/write functions)
export const AGENT_REGISTRY_ABI = [
  {
    name: "registerAgent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "operator", type: "address" },
      { name: "strategyHash", type: "bytes32" },
      { name: "agentType", type: "uint8" },
    ],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
  {
    name: "getAgent",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "operator", type: "address" },
          { name: "strategyHash", type: "bytes32" },
          { name: "agentType", type: "uint8" },
          { name: "registeredAt", type: "uint256" },
          { name: "active", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "getAgentByOperator",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "operator", type: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "operator", type: "address" },
          { name: "strategyHash", type: "bytes32" },
          { name: "agentType", type: "uint8" },
          { name: "registeredAt", type: "uint256" },
          { name: "active", type: "bool" },
        ],
      },
    ],
  },
  {
    name: "agentCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "isRegistered",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "operator", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

// DelegationPolicy ABI (mandate management)
export const DELEGATION_POLICY_ABI = [
  {
    name: "createMandate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "maxTradeSize", type: "uint256" },
      { name: "allowedMarkets", type: "address[]" },
      { name: "expiry", type: "uint256" },
    ],
    outputs: [{ name: "mandateId", type: "uint256" }],
  },
  {
    name: "revokeMandate",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "mandateId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getMandate",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "mandateId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "delegator", type: "address" },
          { name: "agentId", type: "uint256" },
          { name: "maxTradeSize", type: "uint256" },
          { name: "expiry", type: "uint256" },
          { name: "active", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "getMandatesByDelegator",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "delegator", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "getMandatesByAgent",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "agentId", type: "uint256" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "checkPolicy",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "mandateId", type: "uint256" },
      { name: "market", type: "address" },
      { name: "tradeSize", type: "uint256" },
    ],
    outputs: [{ name: "allowed", type: "bool" }],
  },
] as const;

// PredictionMarket ABI (read-only for display)
export const PREDICTION_MARKET_ABI = [
  {
    name: "getMarket",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "marketId", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "creator", type: "address" },
          { name: "question", type: "string" },
          { name: "yesPool", type: "uint256" },
          { name: "noPool", type: "uint256" },
          { name: "resolved", type: "bool" },
          { name: "outcome", type: "bool" },
          { name: "createdAt", type: "uint256" },
        ],
      },
    ],
  },
  {
    name: "marketCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

// Agent types enum
export const AGENT_TYPES: Record<number, string> = {
  0: "Trader",
  1: "Market Maker",
  2: "Predictor",
  3: "Deployer",
  4: "Orchestrator",
};

// Reputation data shape
export interface AgentReputation {
  agentId: number;
  address: string;
  score: number; // 0-100
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  mandatesCompleted: number;
  mandatesRevoked: number;
  lastActive: number;
}
