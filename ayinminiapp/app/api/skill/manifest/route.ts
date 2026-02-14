import { getContracts } from "../../../lib/contracts";

export async function GET() {
  const contracts = getContracts(8453);

  return Response.json(
    {
      name: "ayin",
      displayName: "AYIN Agent Oversight",
      version: "0.3.0",
      description:
        "Register agents with onchain identity, query reputation scores, and enforce delegation mandates",
      author: "AYIN Protocol",
      icon: "eye",
      capabilities: [
        {
          name: "register",
          method: "POST",
          endpoint: "/api/skill/register",
          description:
            "Register an agent in AYIN's AgentRegistry. Returns calldata for the registration transaction.",
          params: {
            operator: {
              type: "address",
              required: true,
              description: "Agent's operator wallet address",
            },
            strategyDescription: {
              type: "string",
              required: true,
              description: "Plain text description of agent's strategy",
            },
            agentType: {
              type: "number",
              required: false,
              description: "0=Trader, 1=Market Maker, 2=Predictor, 3=Deployer, 4=Orchestrator",
            },
          },
        },
        {
          name: "reputation",
          method: "GET",
          endpoint: "/api/skill/reputation",
          description:
            "Query an agent's AYIN reputation score and performance metrics",
          params: {
            address: {
              type: "address",
              required: true,
              description: "Agent's operator address",
            },
          },
        },
        {
          name: "check_mandate",
          method: "GET",
          endpoint: "/api/reputation/{address}",
          description:
            "Full reputation report including mandate summary",
          params: {
            address: {
              type: "address",
              required: true,
              description: "Agent's operator address",
            },
            chain: {
              type: "number",
              required: false,
              description: "8453 (mainnet) or 84532 (sepolia)",
            },
          },
        },
      ],
      contracts: {
        network: "Base",
        chainId: 8453,
        AgentRegistry: contracts.AgentRegistry,
        DelegationPolicy: contracts.DelegationPolicy,
        PredictionMarket: contracts.PredictionMarket,
      },
      tags: [
        "reputation",
        "agents",
        "mandates",
        "oversight",
        "base",
        "openclaw",
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
