export const ALERT_LEVELS = [
  null,
  { label: "LEVEL 1 — NORMAL", color: "#22c55e", bg: "#052e16" },
  { label: "LEVEL 2 — ELEVATED RISK", color: "#facc15", bg: "#1c1400" },
  { label: "LEVEL 3 — HIGH ALERT", color: "#fb923c", bg: "#1c0a00" },
  { label: "LEVEL 4 — SEVERE WARNING", color: "#ef4444", bg: "#1c0000" },
  { label: "LEVEL 5 — EMERGENCY", color: "#ff0040", bg: "#200010" },
] as const;
