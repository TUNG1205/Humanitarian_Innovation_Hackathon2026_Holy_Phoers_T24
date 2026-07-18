import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { RECOVERY_PLANS } from "../../data/recoveryPlans";
import { mono, condensed, sans, cardBorder, radius, cardBg, cardShadow } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";

export function RecoveryTab() {
  const [sel, setSel] = useState(0);
  const p = RECOVERY_PLANS[sel];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RECOVERY_PLANS.map((r, i) => (
            <button key={i} onClick={() => setSel(i)} style={{
              background: sel === i ? cardBg : "transparent",
              border: `1px solid ${sel === i ? r.color : "rgba(255,255,255,0.08)"}`,
              padding: "14px 16px", cursor: "pointer", textAlign: "left", borderRadius: radius,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>
                {r.disaster === "FLOOD" ? "💧" : r.disaster === "WILDFIRE" ? "🔥" : r.disaster === "CYCLONE" ? "🌀" : "⚡"}
              </span>
              <div>
                <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: sel === i ? r.color : "#cbd5e1" }}>{r.disaster}</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: "#a3b1c9", marginTop: 2 }}>{r.phase}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "24px 28px" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: condensed, fontSize: 26, fontWeight: 800, letterSpacing: "0.08em", color: p.color, lineHeight: 1 }}>
              {p.disaster} RECOVERY PROTOCOL
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "#a3b1c9", marginTop: 6 }}>{p.phase}</div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: "#8492ab", letterSpacing: "0.14em", marginBottom: 14 }}>ACTION STEPS</div>
            {p.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
                <div style={{ fontFamily: condensed, fontSize: 17, fontWeight: 700, color: p.color, minWidth: 26, lineHeight: 1.3 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: sans, fontSize: 13, color: "#b8c4da", lineHeight: 1.65 }}>{step}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: mono, fontSize: 9, color: "#8492ab", letterSpacing: "0.14em", marginBottom: 10 }}>RESOURCES & REFERENCES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.resources.map((r, i) => (
                <div key={i} style={{
                  fontFamily: mono, fontSize: 10, padding: "6px 12px",
                  background: "rgba(255,255,255,0.03)", border: cardBorder, borderRadius: radius,
                  color: "#60a5fa", display: "flex", alignItems: "center", gap: 6,
                }}>
                  <ChevronRight size={10} /> {r}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Community Recovery & Recreational Programs</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
          {[
            { title: "COMMUNITY REBUILD DAYS", tag: "COMMUNITY", desc: "Organized volunteer clearing and rebuilding of damaged structures. Register at local disaster relief coordination center." },
            { title: "MENTAL HEALTH SUPPORT", tag: "HEALTH", desc: "Free counseling for disaster survivors. Call 988 for immediate crisis support available 24/7 nationally." },
            { title: "TEMPORARY GREEN SPACES", tag: "RECREATION", desc: "Pop-up parks and recreation areas in safe zones support psychological and community recovery after displacement." },
            { title: "ECONOMIC AID PROGRAMS", tag: "FINANCIAL", desc: "NDMO individual assistance, FNPF disaster hardship withdrawals, and Fiji Red Cross grants available within 30 days of a declared disaster." },
          ].map((item, i) => (
            <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#f97316", letterSpacing: "0.1em", marginBottom: 8 }}>{item.tag}</div>
              <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 8, letterSpacing: "0.06em" }}>{item.title}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#a3b1c9", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
