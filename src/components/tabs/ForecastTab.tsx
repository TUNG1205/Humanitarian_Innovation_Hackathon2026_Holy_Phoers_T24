import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SEA_LEVEL_DATA } from "../../data/seaLevel";
import { FALLBACK_WEATHER } from "../../data/climate";
import { FALLBACK_RISK_CARDS } from "../../data/riskFallback";
import { useWeather } from "../../hooks/useWeather";
import { useRiskAssessment } from "../../hooks/useRiskAssessment";
import { mono, condensed, sans, cardBorder, radius, radiusSm, cardBg, cardShadow } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { RiskBadge } from "../shared/RiskBadge";

export function ForecastTab({ region }: { region: string }) {
  const { current, forecast, airQuality, loading, error } = useWeather();
  const forecastDays = forecast.length ? forecast : FALLBACK_WEATHER;

  const risk = useRiskAssessment(current, forecast, airQuality, !loading);
  const riskCards = risk.assessments ?? FALLBACK_RISK_CARDS;

  const tt = {
    contentStyle: { background: cardBg, border: "1px solid rgba(255,255,255,0.12)", borderRadius: radiusSm, boxShadow: cardShadow, fontFamily: mono, fontSize: 11, color: "#f1f5f9" },
    labelStyle: { color: "#a3b1c9" },
    itemStyle: { color: "#f1f5f9" },
  };

  const statusText = error
    ? `Live forecast unavailable: ${error}. Showing fallback data.`
    : loading
      ? "Connecting to live forecast..."
      : "Live forecast connected.";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "20px 22px" }}>
        <SectionTitle>Sea Level Rise Projection — 2000–2050 · {region}</SectionTitle>
        <div style={{ fontFamily: mono, fontSize: 11, color: error ? "#fda4af" : "#b8c4da", marginTop: 8 }}>
          {statusText}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SEA_LEVEL_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontFamily: mono, fontSize: 10, fill: "#8492ab" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#8492ab" }} axisLine={false} tickLine={false} unit="mm" />
            <Tooltip {...tt} />
            <ReferenceLine x="2025" stroke="#f97316" strokeDasharray="4 4"
              label={{ value: "NOW", fill: "#f97316", fontSize: 9, fontFamily: mono, position: "top" }} />
            <Area key="sea-area" type="monotone" dataKey="mm" stroke="#60a5fa" strokeWidth={2} fill="url(#seaGrad)" name="Sea Level Rise (mm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "20px 22px" }}>
          <SectionTitle>7-Day Forecast — {loading ? "syncing live data…" : "Lami, Fiji"}</SectionTitle>
          {error ? (
            <div style={{ color: "#fda4af", fontFamily: mono, fontSize: 12, padding: "18px 10px" }}>
              Live forecast unavailable: {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecastDays} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="d" tick={{ fontFamily: mono, fontSize: 10, fill: "#8492ab" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#8492ab" }} axisLine={false} tickLine={false} unit="°" domain={[20, 42]} />
                <Tooltip {...tt} />
                <Line key="high-line" type="monotone" dataKey="hi" stroke="#f97316" strokeWidth={2} dot={false} name="High (°C)" />
                <Line key="low-line" type="monotone" dataKey="lo" stroke="#facc15" strokeWidth={2} dot={false} name="Low (°C)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "20px 22px" }}>
          <SectionTitle>Live Conditions — {loading ? "fetching..." : "Lami, Fiji"}</SectionTitle>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#f1f5f9" }}>
              <div style={{ fontFamily: condensed, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>CURRENT</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: "#b8c4da" }}>{loading ? "live update..." : current?.condition ?? "—"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Temp</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#f97316", marginTop: 6 }}>
                  {current ? `${current.temperature}°C` : "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>AQI</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#60a5fa", marginTop: 6 }}>
                  {airQuality ?? "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Humidity</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#22c55e", marginTop: 6 }}>
                  {current ? `${current.humidity}%` : "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Wind</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#facc15", marginTop: 6 }}>
                  {current ? `${current.windSpeed} km/h` : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>
          Risk Outlook{risk.error ? " — AI assessment unavailable, showing baseline" : risk.loading && !loading ? " — generating live assessment…" : risk.assessments ? " — AI-generated, live" : ""}
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
          {riskCards.map((item, i) => (
            <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: "#f1f5f9" }}>{item.title}</div>
                <RiskBadge level={item.risk} />
              </div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#b8c4da", lineHeight: 1.65 }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
