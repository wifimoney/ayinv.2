import { getContracts } from "../../lib/contracts";

export async function GET() {
  const contracts = getContracts(8453);

  return Response.json(
    {
      protocol: "ayin",
      version: "0.3.0",
      description:
        "AYIN Agent Oversight Protocol — reputation and mandate data for Base agents",
      endpoints: {
        "GET /api/reputation/:address": {
          description:
            "Get agent reputation score and performance metrics",
          params: {
            address: "Ethereum address (operator)",
            chain:
              "Optional. 8453 (mainnet, default) or 84532 (sepolia)",
          },
          response:
            "AgentReputation object with score, tier, win rate, predictions",
          rateLimit: "60 requests/minute",
          x402: {
            status: "disabled (beta)",
            futurePrice: "0.001 USDC per request",
          },
        },
        "GET /api/og/agent/:address": {
          description: "Dynamic OG image for Farcaster embed",
          response: "PNG image 1200x630",
        },
        "GET /api/skill/manifest": {
          description: "OpenClaw skill manifest for AYIN integration",
        },
        "POST /api/skill/register": {
          description:
            "Get calldata for agent registration transaction",
        },
        "GET /api/skill/reputation": {
          description:
            "Query agent reputation in skill-friendly format",
        },
        "GET /api/docs": {
          description: "This documentation endpoint",
        },
      },
      contracts: {
        network: "Base (chain ID 8453)",
        AgentRegistry: contracts.AgentRegistry,
        DelegationPolicy: contracts.DelegationPolicy,
        PredictionMarket: contracts.PredictionMarket,
      },
      integrationExample: `// Read any agent's AYIN score in 3 lines:
const res = await fetch("https://ayin.app/api/reputation/0xAGENT_ADDRESS");
const data = await res.json();
console.log(data.reputation.score); // 0-100`,
      links: {
        app: "https://ayin.app",
        farcaster: "https://warpcast.com/ayin",
      },
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
