import { mono, condensed, cardBorder, radius } from "../../lib/theme";

export function StatCard({ label, value, unit, sub, accent }: {
  label: string; value: string; unit?: string; sub?: string; accent?: string;
}) {
  return (
    <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "16px 20px" }}>
      <div style={{ fontFamily: mono, fontSize: 9, color: "#4b5875", letterSpacing: "0.14em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: condensed, fontSize: 38, fontWeight: 700, lineHeight: 1, color: accent || "#f1f5f9" }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: mono, fontSize: 11, color: "#8895a7" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontFamily: mono, fontSize: 9, color: "#64748b", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}
