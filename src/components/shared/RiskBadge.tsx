import { mono, radiusSm } from "../../lib/theme";

export function RiskBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; color: string; border: string }> = {
    CRITICAL: { bg: "#3a0000", color: "#ef4444", border: "#ef4444" },
    HIGH:     { bg: "#1c0800", color: "#fb923c", border: "#fb923c" },
    MODERATE: { bg: "#1a1400", color: "#facc15", border: "#facc15" },
    LOW:      { bg: "#0a1e0a", color: "#22c55e", border: "#22c55e" },
  };
  const c = cfg[level] || cfg.LOW;
  return (
    <div style={{
      fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: radiusSm,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{level}</div>
  );
}
