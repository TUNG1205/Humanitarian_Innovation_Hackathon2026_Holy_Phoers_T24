import { useState } from "react";
import { DISASTERS } from "../../data/disasters";
import { mono, sans, cardBorder, radius, radiusSm, accent } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";

export function HistoryTab() {
  const [filter, setFilter] = useState("ALL");
  const types = ["ALL", "FLOOD", "CYCLONE", "HURRICANE", "WILDFIRE", "DROUGHT"];
  const shown = filter === "ALL" ? DISASTERS : DISASTERS.filter(d => d.type === filter);

  const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    FLOOD:    { bg: "#071a3a", color: "#60a5fa", border: "#1d4ed8" },
    CYCLONE:  { bg: "#1a0a2e", color: "#a78bfa", border: "#7c3aed" },
    HURRICANE:{ bg: "#1a0a2e", color: "#c4b5fd", border: "#6d28d9" },
    WILDFIRE: { bg: "#2e0a00", color: "#fb923c", border: "#c2410c" },
    DROUGHT:  { bg: "#1a1400", color: "#facc15", border: "#a16207" },
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", padding: "6px 14px", cursor: "pointer", borderRadius: radiusSm,
            border: `1px solid ${filter === t ? accent : "rgba(255,255,255,0.1)"}`,
            background: filter === t ? "rgba(56,189,248,0.1)" : "transparent",
            color: filter === t ? accent : "#8895a7",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px 150px 110px 90px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {["YEAR", "EVENT", "TYPE", "AFFECTED", "DAMAGE", "SEVERITY"].map(h => (
            <div key={h} style={{ fontFamily: mono, fontSize: 9, color: "#3d4a63", letterSpacing: "0.14em" }}>{h}</div>
          ))}
        </div>
        {shown.map((d, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "70px 1fr 110px 150px 110px 90px",
            padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
          }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#64748b" }}>{d.year}</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#cbd5e1" }}>{d.name}</div>
            <div>
              <span style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: radiusSm,
                background: typeColors[d.type]?.bg || "#111",
                color: typeColors[d.type]?.color || "#aaa",
                border: `1px solid ${typeColors[d.type]?.border || "#444"}`,
              }}>{d.type}</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#8a97ab" }}>{d.affected}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#f1f5f9" }}>{d.damage}</div>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} style={{ width: 7, height: 7, background: j < d.sev ? (d.sev >= 5 ? "#ef4444" : d.sev >= 4 ? "#fb923c" : "#facc15") : "rgba(255,255,255,0.07)" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <SectionTitle>Susceptibility by Zone</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { zone: "COASTAL STRIP (0–2km)", flood: 98, wind: 95, surge: 99 },
            { zone: "RIVER FLOODPLAIN", flood: 94, wind: 40, surge: 60 },
            { zone: "LOW-ELEVATION URBAN", flood: 75, wind: 55, surge: 45 },
            { zone: "HILLSIDE / ESCARPMENT", flood: 20, wind: 80, surge: 5 },
            { zone: "INLAND CITY CORE", flood: 45, wind: 35, surge: 10 },
            { zone: "FORESTED PERIPHERY", flood: 30, wind: 60, surge: 5 },
          ].map((z, i) => (
            <div key={i} style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "14px 16px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#cbd5e1", marginBottom: 12, letterSpacing: "0.05em" }}>{z.zone}</div>
              {([["FLOOD", z.flood], ["HIGH WIND", z.wind], ["STORM SURGE", z.surge]] as [string,number][]).map(([label, val]) => (
                <div key={label} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: "#3d4a63" }}>{label}</span>
                    <span style={{ fontFamily: mono, fontSize: 9, color: val >= 80 ? "#ef4444" : val >= 50 ? "#fb923c" : "#eab308" }}>{val}%</span>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.05)", height: 4 }}>
                    <div style={{ height: "100%", background: val >= 80 ? "#ef4444" : val >= 50 ? "#fb923c" : "#eab308", width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
