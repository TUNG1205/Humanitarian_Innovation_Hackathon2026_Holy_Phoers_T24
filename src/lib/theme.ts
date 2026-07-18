// Shared design tokens — kept minimal on purpose so the whole app reads as one system.
export const mono = "'JetBrains Mono', monospace";
export const condensed = "'Barlow Condensed', sans-serif";
export const sans = "'Inter', sans-serif";

export const radius = 10;
export const radiusSm = 6;

// Slate-tinted border instead of flat white-alpha — reads as "designed" rather than default.
export const cardBorder = "1px solid rgba(148,163,184,0.14)";

// Calm accent for navigation/selection (this is a normal state, not an alert).
// True alerts keep the red/orange palette below so they still stand out.
export const accent = "#22d3ee";
export const alertColor = "#f97316";
