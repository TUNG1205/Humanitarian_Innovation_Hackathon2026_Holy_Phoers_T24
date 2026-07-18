import { AlertTriangle } from "lucide-react";
import { useWeather } from "../../hooks/useWeather";
import { FALLBACK_WEATHER } from "../../data/climate";
import { IMPACT_DATA } from "../../data/impact";
import { ALERT_LEVELS } from "../../data/alertLevels";
import { mono, condensed, sans, cardBorder, radius, alertColor } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { StatCard } from "../shared/StatCard";

// US AQI breakpoints (airnow.gov).
function aqiCategory(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: "Good", color: "#22c55e" };
  if (aqi <= 100) return { label: "Moderate", color: "#facc15" };
  if (aqi <= 150) return { label: "Unhealthy (sensitive groups)", color: "#fb923c" };
  if (aqi <= 200) return { label: "Unhealthy — stay indoors", color: "#ef4444" };
  if (aqi <= 300) return { label: "Very unhealthy", color: "#a78bfa" };
  return { label: "Hazardous", color: "#7f1d1d" };
}

export function OverviewTab({ alertLevel, region }: { alertLevel: number; region: string }) {
  const { current, forecast, airQuality, loading } = useWeather();
  const forecastDays = forecast.length ? forecast : FALLBACK_WEATHER;
  const alertCfg = ALERT_LEVELS[alertLevel]!;

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{
        background: "linear-gradient(120deg, #2a1200, #1c0e04)", border: `1px solid ${alertCfg.color}`, borderRadius: radius,
        padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={18} color={alertCfg.color} />
          <div>
            <div style={{ fontFamily: condensed, fontSize: 16, fontWeight: 700, color: alertCfg.color, letterSpacing: "0.1em" }}>
              {alertCfg.label} — {region.toUpperCase()}
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "#c47a4a", marginTop: 3 }}>
              Tropical Storm Watch · Coastal Flood Advisory · High Wind Warning in Effect
            </div>
          </div>
        </div>
        <div style={{ fontFamily: mono, fontSize: 9, color: "#6a4a2a", letterSpacing: "0.08em" }}>
          UPDATED: {new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} LOCAL
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))", gap: 10 }}>
        <StatCard label="TEMPERATURE" value={current ? `${current.temperature}°` : "—"} unit="C" sub={loading ? "Loading live data…" : "Lami, Fiji — live"} accent="#fb923c" />
        <StatCard label="WIND SPEED" value={current ? `${current.windSpeed}` : "—"} unit="km/h" sub={current ? `Gusts up to ${current.windGusts} km/h` : "Loading live data…"} accent="#facc15" />
        <StatCard label="HUMIDITY" value={current ? `${current.humidity}` : "—"} unit="%" sub={current ? current.condition : "Loading live data…"} />
        <StatCard label="SEA LEVEL RISE" value="+24.3" unit="mm" sub="From 2000 baseline (modeled)" accent="#60a5fa" />
        <StatCard label="RAINFALL (NOW)" value={current ? `${current.precipitation}` : "—"} unit="mm/hr" sub={loading ? "Loading live data…" : "Lami, Fiji — live"} accent="#f97316" />
        <StatCard label="AIR QUALITY" value={airQuality !== null ? `${airQuality}` : "—"} unit="AQI" sub={loading ? "Loading live data…" : airQuality !== null ? aqiCategory(airQuality).label : "Lami, Fiji — live"} accent={airQuality !== null ? aqiCategory(airQuality).color : "#ef4444"} />
      </div>

      <div>
        <SectionTitle>7-Day Weather Forecast{loading ? " — syncing…" : ""}</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {forecastDays.map((w, i) => (
            <div key={i} style={{
              background: i === 0 ? "#1a0e00" : "#131a26",
              border: `1px solid ${i === 0 ? "#f97316" : "rgba(255,255,255,0.09)"}`,
              padding: "14px 10px", textAlign: "center",
            }}>
              <div style={{ fontFamily: condensed, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: i === 0 ? "#f97316" : "#64748b", marginBottom: 8 }}>{w.d}</div>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{w.icon}</div>
              <div style={{ fontFamily: condensed, fontSize: 10, fontWeight: 600, color: i === 0 ? "#fb923c" : "#8895a7", marginBottom: 6, letterSpacing: "0.06em" }}>{w.cond}</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: "#f1f5f9", marginBottom: 4 }}>{w.hi}° / {w.lo}°</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#60a5fa", marginBottom: 2 }}>💧 {w.rain}%</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#8895a7" }}>💨 {w.wind}km/h</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Regional Impact Snapshot — Next 12 Months</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {IMPACT_DATA.map((d, i) => (
            <div key={i} style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: mono, fontSize: 9, color: "#4b5875", letterSpacing: "0.12em" }}>{d.label.toUpperCase()}</div>
                <div style={{ fontFamily: mono, fontSize: 8, color: "#4b5875", letterSpacing: "0.1em" }}>12-MO OUTLOOK</div>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: condensed, fontSize: 22, fontWeight: 700, color: "#facc15" }}>{d.current}%</span>
                <span style={{ fontFamily: mono, fontSize: 11, color: "#4b5875" }}>→</span>
                <span style={{ fontFamily: condensed, fontSize: 22, fontWeight: 700, color: alertColor }}>{d.projected}%</span>
              </div>
              <div style={{ position: "relative", background: "rgba(255,255,255,0.05)", height: 6, borderRadius: 3, marginBottom: 12, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, width: `${d.projected}%`, background: "rgba(255,69,0,0.3)", transition: "width 0.4s" }} />
                <div style={{ position: "absolute", inset: 0, width: `${d.current}%`, background: "#facc15", transition: "width 0.4s" }} />
              </div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#8895a7", lineHeight: 1.65, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 9 }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
