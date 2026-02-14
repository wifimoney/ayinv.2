import { ImageResponse } from "next/og";
import { createPublicClient, http, isAddress } from "viem";
import { baseSepolia } from "viem/chains";
import {
  getChainConfig,
  getContracts,
  AGENT_REGISTRY_ABI,
} from "../../../../lib/contracts";

export const runtime = "edge";

function scoreColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#ffcc00";
  if (score >= 40) return "#ff8800";
  return "#ff3344";
}

function scoreTier(score: number): string {
  if (score >= 90) return "ELITE";
  if (score >= 75) return "TRUSTED";
  if (score >= 55) return "EMERGING";
  if (score >= 35) return "CAUTIOUS";
  return "UNPROVEN";
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  const agentName = `${address.slice(0, 6)}...${address.slice(-4)}`;
  let score = 50;
  let tier = "EMERGING";
  let isRegistered = false;

  if (isAddress(address)) {
    try {
      // Use sepolia in dev, would use mainnet in prod
      const chainId = 84532;
      const config = getChainConfig(chainId);
      const contracts = getContracts(chainId);

      const client = createPublicClient({
        chain: baseSepolia,
        transport: http(config.rpc),
      });

      const registered = (await client.readContract({
        address: contracts.AgentRegistry as `0x${string}`,
        abi: AGENT_REGISTRY_ABI,
        functionName: "isRegistered",
        args: [address as `0x${string}`],
      })) as boolean;

      isRegistered = registered;

      if (isRegistered) {
        // Default score for registered agents
        score = 50;
        tier = scoreTier(score);
      }
    } catch {
      // Fallback to defaults
    }
  }

  const color = scoreColor(score);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200",
          height: "630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060608",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {/* AYIN branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              color: "#00ff88",
              letterSpacing: "0.12em",
              fontWeight: 700,
            }}
          >
            AYIN
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
            }}
          >
            AGENT OVERSIGHT PROTOCOL
          </div>
        </div>

        {/* Score circle */}
        <div
          style={{
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            border: `4px solid ${color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              fontSize: "56px",
              fontWeight: 700,
              color,
            }}
          >
            {Math.round(score)}
          </div>
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em",
            }}
          >
            / 100
          </div>
        </div>

        {/* Tier */}
        <div
          style={{
            fontSize: "24px",
            color,
            letterSpacing: "0.15em",
            marginBottom: "12px",
            fontWeight: 600,
          }}
        >
          {tier}
        </div>

        {/* Agent address */}
        <div
          style={{
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "16px",
          }}
        >
          {agentName}
        </div>

        {/* Status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: isRegistered ? "#00ff88" : "#ff3344",
            }}
          />
          <div
            style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            {isRegistered ? "Registered Agent" : "Not Registered"}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: "14px",
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.06em",
          }}
        >
          ayin.app - Built on Base
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, immutable, no-transform, max-age=300",
      },
    }
  );
}
