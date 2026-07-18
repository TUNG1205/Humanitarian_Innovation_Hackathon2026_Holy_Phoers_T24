import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { EMERGENCY_NUMBERS } from "../../data/emergencyContacts";
import { OFFLINE_GUIDES } from "../../data/offlineGuides";
import { mono, condensed, sans, cardBorder, radius, radiusSm, cardBg, cardShadow } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";

export function EmergencyTab() {
  const [openGuide, setOpenGuide] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#1c0000", border: "1px solid #ef4444", borderRadius: radius, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", background: "#ef4444",
          boxShadow: "0 0 14px #ef4444",
          animation: "none",
        }} />
        <div>
          <div style={{ fontFamily: condensed, fontSize: 16, fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em" }}>
            FOR LIFE-THREATENING EMERGENCIES — DIAL 917 (POLICE) / 911 (AMBULANCE)
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: "#e0a8a8", marginTop: 3 }}>
            This page is designed to stay readable on a weak signal — see the connectivity status in the header.
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Local Emergency Contacts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
          {EMERGENCY_NUMBERS.map((e, i) => (
            <div key={i} style={{
              background: cardBg, boxShadow: cardShadow, borderRadius: radius,
              border: `1px solid ${e.live ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)"}`,
              padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
              opacity: e.live ? 1 : 0.45,
            }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 9, color: "#8492ab", letterSpacing: "0.12em", marginBottom: 5 }}>{e.cat}</div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#b8c4da", marginBottom: 5 }}>{e.svc}</div>
                <div style={{ fontFamily: condensed, fontSize: 22, fontWeight: 700, color: e.live ? "#22c55e" : "#a3b1c9", letterSpacing: "0.06em" }}>{e.num}</div>
              </div>
              <div style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", padding: "3px 8px", borderRadius: radiusSm,
                border: `1px solid ${e.live ? "#22c55e" : "#8492ab"}`,
                color: e.live ? "#22c55e" : "#a3b1c9",
              }}>{e.live ? "ACTIVE" : "OFFLINE"}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", color: "#a3b1c9" }}>
            OFFLINE SAFETY GUIDELINES
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#22c55e", padding: "2px 8px", border: "1px solid #22c55e", borderRadius: radiusSm, letterSpacing: "0.1em" }}>
            NO CONNECTION REQUIRED TO READ
          </div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: "#a3b1c9", marginBottom: 12 }}>
          Plain-text guidance intended for low-connectivity zones — no images, maps, or live data required to read these steps.
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          {OFFLINE_GUIDES.map((guide, i) => (
            <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow }}>
              <button onClick={() => setOpenGuide(openGuide === i ? null : i)} style={{
                width: "100%", background: "transparent", border: "none", cursor: "pointer",
                padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, color: "#f1f5f9", letterSpacing: "0.1em" }}>{guide.title}</div>
                <ChevronRight size={15} color="#8492ab" style={{ transform: openGuide === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {openGuide === i && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: sans, fontSize: 13, color: "#b8c4da", lineHeight: 1.8, paddingTop: 13 }}>
                    {guide.body}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#070d1a", border: "1px solid rgba(96,165,250,0.25)", borderRadius: radius, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 20, marginTop: 2 }}>📱</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em" }}>
              SENSOR-BASED EMERGENCY DETECTION
            </div>
            <div style={{ fontFamily: mono, fontSize: 8, letterSpacing: "0.1em", padding: "2px 6px", border: "1px solid #60a5fa", borderRadius: radiusSm, color: "#60a5fa" }}>ROADMAP</div>
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: "#8fb4d9", lineHeight: 1.7 }}>
            Planned: on-device barometric pressure sensors to flag sudden atmospheric drops characteristic of approaching storms, triggering local alerts even with no signal. Not yet implemented — device sensor APIs need per-platform validation before this can ship.
          </div>
        </div>
      </div>
    </div>
  );
}
