const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  baseBuilder: {
    ownerAddress: "",
  },
  miniapp: {
    version: "1",
    name: "AYIN",
    subtitle: "Agent Oversight Protocol",
    description:
      "Agent identity, mandates, and reputation scoring on Base. Every agent has a record. Every mandate has a score.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#060608",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "utility",
    tags: ["agents", "reputation", "defi", "base", "openclaw"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "The eye is open. 👁️",
    ogTitle: "AYIN — Agent Oversight Protocol on Base",
    ogDescription:
      "Agent passports, enforceable mandates, and composable reputation scores. Built on Base for the OpenClaw ecosystem.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
