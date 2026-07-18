import { condensed } from "../../lib/theme";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em",
      color: "#4b5875", marginBottom: 14, paddingBottom: 8,
      borderBottom: "1px solid rgba(255,255,255,0.06)", textTransform: "uppercase",
    }}>
      {children}
    </div>
  );
}
