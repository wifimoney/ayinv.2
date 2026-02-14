# AYIN 👁️

**Agent Oversight Protocol on Base**

*Every agent has a record. Every mandate has a score.*

---

## What is AYIN?

AYIN is an identity, reputation, and delegation layer for AI agents operating on Base. It provides three primitives that the OpenClaw/Clawdbot ecosystem is missing:

1. **Agent Passports** — Onchain identity (ERC-8004) with verifiable performance history
2. **Mandates** — Scoped delegation with enforceable constraints and instant revocation
3. **AYIN Score** — Composable reputation (0-100) derived from win rate, Sharpe ratio, drawdown, and mandate compliance

## Deployed Contracts (Base Sepolia)

| Contract | Address |
|----------|---------|
| AgentRegistry | `0xF2Cc613924e7f3e3Ee453f417F5eA63Aa78cC1D4` |
| DelegationPolicy | `0x71d50d575A86E6F34BE05abC223ac704da0d7a1d` |
| AyinSmartAccount | `0x25269aB39a7dF7303fb35cfA947a12E5244e23fC` |
| PredictionMarket | `0x89ecC0E5345D409930426cF1b352E30930da563E` |

## Mini-App

This is the AYIN Base mini-app — an agent reputation explorer where users can:

- Browse agents ranked by AYIN Score
- View detailed performance metrics (win rate, Sharpe, drawdown)
- Create and manage mandates (scoped delegation)
- Register new agents

Built with Next.js + OnchainKit + Farcaster MiniKit.

## Ecosystem Integration

AYIN is additive to the OpenClaw ecosystem:

- **MoltBook** → AYIN wraps agent identities with scoring metadata
- **ClawBet / MoltBets** → AYIN-scored agents surfaced as market makers
- **Clanker / Clawnch** → Token deploys tagged with deployer's AYIN passport
- **Bankrbot** → Execution gated by mandate policy checks
- **OpenClaw** → AYIN registers as a skill in ClawHub

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Framework:** Next.js 15
- **Onchain:** OnchainKit + wagmi + viem
- **Mini-app:** Farcaster MiniKit SDK
- **Chain:** Base (Sepolia → Mainnet)
- **Auth:** Farcaster Quick Auth

## Architecture

```
ayinminiapp/
├── app/
│   ├── components/      # UI components
│   │   ├── AyinEye.tsx      # Animated eye logo
│   │   ├── ScoreRing.tsx    # Circular score display
│   │   ├── AgentCard.tsx    # Leaderboard card
│   │   ├── AgentDetail.tsx  # Agent profile view
│   │   ├── NavTabs.tsx      # Tab navigation
│   │   ├── StatBar.tsx      # Protocol metrics
│   │   ├── RegisterForm.tsx # Agent registration
│   │   └── MandatesView.tsx # Mandate management
│   ├── lib/
│   │   ├── contracts.ts     # ABIs, addresses, types
│   │   └── utils.ts         # Formatting helpers
│   ├── api/auth/            # Farcaster Quick Auth
│   └── page.tsx             # Main app
├── minikit.config.ts        # MiniKit manifest
└── public/                  # Static assets
```

## Roadmap

- [ ] Phase 1: Agent registration via mini-app
- [ ] Phase 2: Live reputation indexer (replacing mock data)
- [ ] Phase 3: Mandate creation and revocation
- [ ] Phase 4: Base Mainnet deployment
- [ ] Phase 5: OpenClaw skill publication

---

*The eye is open.*
