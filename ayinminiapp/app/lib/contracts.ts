// AYIN Protocol - Base Sepolia Deployed Contracts
export const CHAIN_ID = 84532; // Base Sepolia

export const CONTRACTS = {
  AgentRegistry: "0xF2Cc613924e7f3e3Ee453f417F5eA63Aa78cC1D4" as const,
  DelegationPolicy: "0x71d50d575A86E6F34BE05abC223ac704da0d7a1d" as const,
  AyinSmartAccount: "0x25269aB39a7dF7303fb35cfA947a12E5244e23fC" as const,
  PredictionMarket: "0x89ecC0E5345D409930426cF1b352E30930da563E" as const,
} as const;

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

// Mock reputation data (until reputation indexer API is live)
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

// Placeholder data for demo — replaced by live indexer when ready
export const MOCK_AGENTS: AgentReputation[] = [
  {
    agentId: 1,
    address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
    score: 87,
    winRate: 0.72,
    sharpeRatio: 2.1,
    maxDrawdown: 0.08,
    totalTrades: 342,
    mandatesCompleted: 15,
    mandatesRevoked: 1,
    lastActive: Date.now() - 1000 * 60 * 30,
  },
  {
    agentId: 2,
    address: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
    score: 64,
    winRate: 0.58,
    sharpeRatio: 1.3,
    maxDrawdown: 0.15,
    totalTrades: 128,
    mandatesCompleted: 8,
    mandatesRevoked: 3,
    lastActive: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    agentId: 3,
    address: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
    score: 93,
    winRate: 0.81,
    sharpeRatio: 3.2,
    maxDrawdown: 0.04,
    totalTrades: 567,
    mandatesCompleted: 22,
    mandatesRevoked: 0,
    lastActive: Date.now() - 1000 * 60 * 5,
  },
  {
    agentId: 4,
    address: "0x4d5e6f7890abcdef1234567890abcdef12345678",
    score: 41,
    winRate: 0.45,
    sharpeRatio: 0.6,
    maxDrawdown: 0.22,
    totalTrades: 89,
    mandatesCompleted: 4,
    mandatesRevoked: 5,
    lastActive: Date.now() - 1000 * 60 * 60 * 24,
  },
  {
    agentId: 5,
    address: "0x5e6f7890abcdef1234567890abcdef1234567890",
    score: 76,
    winRate: 0.65,
    sharpeRatio: 1.8,
    maxDrawdown: 0.11,
    totalTrades: 201,
    mandatesCompleted: 11,
    mandatesRevoked: 2,
    lastActive: Date.now() - 1000 * 60 * 60,
  },
];
