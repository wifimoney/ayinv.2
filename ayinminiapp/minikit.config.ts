const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const minikitConfig = {
  accountAssociation: {
    // TODO: Generate these with Farcaster domain verification
    // https://miniapps.farcaster.xyz/docs/guides/publishing
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    // TODO: Set your wallet address
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "AYIN",
    subtitle: "Agent Oversight Protocol",
    description:
      "Agent identity, mandates, and reputation scoring on Base. Every agent has a record. Every mandate has a score.",
    screenshotUrls: [
      `${ROOT_URL}/screenshots/leaderboard.png`,
      `${ROOT_URL}/screenshots/agent-detail.png`,
      `${ROOT_URL}/screenshots/mandates.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#060608",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["agents", "reputation", "defi", "base", "openclaw"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "The eye is open.",
    ogTitle: "AYIN — Agent Oversight Protocol on Base",
    ogDescription:
      "Agent passports, enforceable mandates, and composable reputation scores. Built on Base.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
