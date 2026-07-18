import { AlertTriangle, Radio, MapPin, Wifi, WifiOff } from "lucide-react";
import { REGIONS, TABS } from "../data/regions";
import { ALERT_LEVELS } from "../data/alertLevels";
import { mono, condensed, radiusSm, accent } from "../lib/theme";

interface HeaderProps {
  region: string;
  setRegion: (region: string) => void;
  alertLevel: number;
  isOffline: boolean;
  tab: string;
  setTab: (tab: string) => void;
}

export function Header({ region, setRegion, alertLevel, isOffline, tab, setTab }: HeaderProps) {
  const alertCfg = ALERT_LEVELS[alertLevel]!;

  return (
    <header style={{ borderBottom: "1px solid rgba(148,163,184,0.12)", background: "#0a0f1a", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, background: "linear-gradient(135deg, #22d3ee, #0ea5e9)", boxShadow: "0 4px 14px rgba(34,211,238,0.3)", borderRadius: radiusSm, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Radio size={17} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: condensed, fontSize: 19, fontWeight: 700, letterSpacing: "0.09em", color: "#f1f5f9", lineHeight: 1.1 }}>
              CLIMATE RESILIENCE SYSTEM
            </div>
            <div style={{ fontFamily: mono, fontSize: 9, color: "#4b5875", letterSpacing: "0.12em" }}>
              MONITORING · PREDICTION · EMERGENCY RESPONSE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <select value={region} onChange={e => setRegion(e.target.value)} style={{
              background: "#131a26", border: "1px solid rgba(255,255,255,0.12)", borderRadius: radiusSm, color: "#f1f5f9",
              fontFamily: mono, fontSize: 10, padding: "6px 28px 6px 10px",
              outline: "none", cursor: "pointer", appearance: "none", letterSpacing: "0.04em",
            }}>
              {REGIONS.map(r => <option key={r}>{r}</option>)}
            </select>
            <MapPin size={11} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: accent, pointerEvents: "none" }} />
          </div>

          <div style={{
            background: alertCfg.bg, border: `1px solid ${alertCfg.color}`, borderRadius: radiusSm,
            color: alertCfg.color, fontFamily: condensed, fontSize: 13, fontWeight: 700,
            letterSpacing: "0.1em", padding: "5px 12px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <AlertTriangle size={13} />
            {alertCfg.label}
          </div>

          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.08em", color: isOffline ? "#f97316" : "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
            {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
            {isOffline ? "OFFLINE" : "ONLINE"}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", paddingLeft: 20, display: "flex", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            fontFamily: condensed, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
            padding: "10px 18px", border: "none", cursor: "pointer",
            background: tab === t.id ? "rgba(56,189,248,0.08)" : "transparent",
            borderRadius: "6px 6px 0 0",
            color: tab === t.id ? accent : "#64748b",
            borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
            whiteSpace: "nowrap", transition: "color 0.12s, background 0.12s",
          }}>{t.label}</button>
        ))}
      </div>
    </header>
  );
}
