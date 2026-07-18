// Shared design tokens — kept minimal on purpose so the whole app reads as one system.
export const mono = "'JetBrains Mono', monospace";
export const condensed = "'Barlow Condensed', sans-serif";
export const sans = "'Inter', sans-serif";

// Softer, more premium corner radii than the original sharp-cornered "terminal" look.
export const radius = 14;
export const radiusSm = 8;

// Slate-tinted border instead of flat white-alpha — reads as "designed" rather than default.
export const cardBorder = "1px solid rgba(148,163,184,0.16)";

// Elevated glass-card surface: soft shadow for lift + a thin top highlight to fake a
// light source from above — replaces flat solid-fill cards everywhere.
export const cardBg = "rgba(19,26,38,0.82)";
export const cardShadow = "0 14px 32px -18px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)";

// Calm accent for navigation/selection (this is a normal state, not an alert).
// True alerts keep the red/orange palette below so they still stand out.
export const accent = "#22d3ee";
export const alertColor = "#f97316";

// Secondary brand accent — used sparingly (logo/hero gradients, ambient glows) for visual
// interest distinct from both the nav accent and the alert palette.
export const accentWarm = "#fb7185";
