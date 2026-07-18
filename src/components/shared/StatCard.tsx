import { mono, condensed, cardBorder, radius, cardBg, cardShadow } from "../../lib/theme";

export function StatCard({ label, value, unit, sub, accent }: {
  label: string; value: string; unit?: string; sub?: string; accent?: string;
}) {
  return (
    <div style={{
      position: "relative", background: cardBg, border: cardBorder, borderRadius: radius,
      padding: "18px 20px 16px", overflow: "hidden",
      boxShadow: accent ? `${cardShadow}, 0 0 26px -10px ${accent}` : cardShadow,
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: accent ? `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent}, white 40%))` : "rgba(255,255,255,0.08)",
      }} />
      <div style={{ fontFamily: mono, fontSize: 9, color: "#a3b1c9", letterSpacing: "0.14em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{
          fontFamily: condensed, fontSize: 38, fontWeight: 700, lineHeight: 1,
          ...(accent ? {
            backgroundImage: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent}, white 45%))`,
            WebkitBackgroundClip: "text" as const, backgroundClip: "text" as const,
            color: "transparent", WebkitTextFillColor: "transparent" as const,
          } : { color: "#f1f5f9" }),
        }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: mono, fontSize: 11, color: "#a3b1c9" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontFamily: mono, fontSize: 9, color: "#a3b1c9", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}
