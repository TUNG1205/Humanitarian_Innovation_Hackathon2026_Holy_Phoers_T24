import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SEA_LEVEL_DATA } from "../../data/seaLevel";
import { TEMP_DATA } from "../../data/climate";
import { IMPACT_DATA } from "../../data/impact";
import { mono, condensed, sans, cardBorder, radius, radiusSm } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { RiskBadge } from "../shared/RiskBadge";

export function ForecastTab({ region }: { region: string }) {
  const tt = {
    contentStyle: { background: "#131a26", border: "1px solid rgba(255,255,255,0.12)", borderRadius: radiusSm, fontFamily: mono, fontSize: 11, color: "#f1f5f9" },
    labelStyle: { color: "#8895a7" },
    itemStyle: { color: "#f1f5f9" },
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
        <SectionTitle>Sea Level Rise Projection — 2000–2050 · {region}</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SEA_LEVEL_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} unit="mm" />
            <Tooltip {...tt} />
            <ReferenceLine x="2025" stroke="#f97316" strokeDasharray="4 4"
              label={{ value: "NOW", fill: "#f97316", fontSize: 9, fontFamily: mono, position: "top" }} />
            <Area key="sea-area" type="monotone" dataKey="mm" stroke="#60a5fa" strokeWidth={2} fill="url(#seaGrad)" name="Sea Level Rise (mm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
          <SectionTitle>Temperature Trend — Monthly Avg & Max</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TEMP_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="m" tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} unit="°" domain={[25, 45]} />
              <Tooltip {...tt} />
              <Line key="avg-line" type="monotone" dataKey="avg" stroke="#facc15" strokeWidth={2} dot={false} name="Avg Temp (°C)" />
              <Line key="max-line" type="monotone" dataKey="max" stroke="#f97316" strokeWidth={2} dot={false} name="Max Temp (°C)" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
          <SectionTitle>Projected Damage by Sector (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={IMPACT_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: mono, fontSize: 9, fill: "#4b5875" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="label" tick={{ fontFamily: mono, fontSize: 9, fill: "#8895a7" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...tt} />
              <Bar key="current-bar" dataKey="current" fill="#facc15" name="Current %" barSize={7} />
              <Bar key="projected-bar" dataKey="projected" fill="#f97316" name="12-Mo Projected %" barSize={7} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {[
          { title: "PRECIPITATION", text: "+34% increase in extreme rainfall events by 2035. 3-day storm intensification cycles becoming the new norm for coastal regions.", risk: "HIGH" },
          { title: "TEMPERATURE", text: "Persistent heat dome formation likely Jun–Sep. Average daily high exceeding 40°C for 22+ days annually by 2030.", risk: "HIGH" },
          { title: "STORM FREQUENCY", text: "Category 4–5 storm frequency up 28% decade-over-decade. Peak season extending from May through December.", risk: "CRITICAL" },
          { title: "DROUGHT CYCLES", text: "Alternating flood-drought cycles intensifying. 6-week dry spells after major rainfall increasing aquifer depletion risk.", risk: "MODERATE" },
        ].map((item, i) => (
          <div key={i} style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: "#f1f5f9" }}>{item.title}</div>
              <RiskBadge level={item.risk} />
            </div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
