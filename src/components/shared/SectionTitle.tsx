import { condensed, accent as themeAccent } from "../../lib/theme";

export function SectionTitle({ children, accent = themeAccent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{
          width: 3, height: 14, borderRadius: 2, flexShrink: 0,
          background: `linear-gradient(180deg, ${accent}, color-mix(in srgb, ${accent}, white 40%))`,
        }} />
        <div style={{
          fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em",
          color: "#a3b1c9", textTransform: "uppercase",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
