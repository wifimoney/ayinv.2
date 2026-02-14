"use client";

export type Tab = "leaderboard" | "mandates" | "register";

export function NavTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (tab: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "leaderboard", label: "Agents", icon: "◎" },
    { id: "mandates", label: "Mandates", icon: "⊡" },
    { id: "register", label: "Register", icon: "+" },
  ];

  return (
    <nav
      style={{
        display: "flex",
        gap: "2px",
        padding: "3px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "10px",
        marginBottom: "1rem",
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: "0.5rem 0",
            background:
              active === tab.id
                ? "rgba(0,255,136,0.1)"
                : "transparent",
            border:
              active === tab.id
                ? "1px solid rgba(0,255,136,0.2)"
                : "1px solid transparent",
            borderRadius: "8px",
            color:
              active === tab.id
                ? "#00ff88"
                : "rgba(255,255,255,0.35)",
            fontSize: "0.75rem",
            fontWeight: active === tab.id ? 600 : 400,
            cursor: "pointer",
            transition: "all 0.15s ease",
            fontFamily: "inherit",
            letterSpacing: "0.03em",
          }}
        >
          <span style={{ marginRight: "0.3rem" }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
