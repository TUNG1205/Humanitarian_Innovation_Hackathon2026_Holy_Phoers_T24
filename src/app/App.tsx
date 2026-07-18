import { useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import {
  AlertTriangle, Radio, MapPin, ChevronRight, Wifi, WifiOff,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────

const REGIONS = [
  "Lami, Fiji",
  "SE Florida Coast, USA",
  "Manila Bay, Philippines",
  "Bangladesh Delta",
  "Venice Lagoon, Italy",
  "Jakarta, Indonesia",
  "Mekong Delta, Vietnam",
];

const SEA_LEVEL_DATA = [
  { year: "2000", mm: 0 }, { year: "2005", mm: 3.2 }, { year: "2010", mm: 7.1 },
  { year: "2015", mm: 12.4 }, { year: "2020", mm: 18.9 }, { year: "2025", mm: 24.3 },
  { year: "2030", mm: 31.8 }, { year: "2035", mm: 40.2 }, { year: "2040", mm: 50.7 },
  { year: "2045", mm: 64.1 }, { year: "2050", mm: 82.4 },
];

const TEMP_DATA = [
  { m: "Jan", avg: 28.2, max: 32.1 }, { m: "Feb", avg: 29.1, max: 33.4 },
  { m: "Mar", avg: 31.4, max: 35.8 }, { m: "Apr", avg: 33.8, max: 38.2 },
  { m: "May", avg: 35.2, max: 40.1 }, { m: "Jun", avg: 34.7, max: 39.3 },
  { m: "Jul", avg: 32.1, max: 36.8 }, { m: "Aug", avg: 31.9, max: 36.2 },
  { m: "Sep", avg: 33.4, max: 38.5 }, { m: "Oct", avg: 32.6, max: 37.1 },
  { m: "Nov", avg: 30.1, max: 34.6 }, { m: "Dec", avg: 28.8, max: 33.1 },
];

const IMPACT_DATA = [
  {
    label: "Financial",
    current: 34, projected: 67,
    desc: "Flood insurance claims and property devaluation in coastal zones are accelerating. Small businesses in low-lying districts face repeat disruption, eroding tax base and credit access.",
  },
  {
    label: "Infrastructure",
    current: 28, projected: 55,
    desc: "Saltwater intrusion is degrading bridge foundations and underground utilities faster than maintenance budgets allow. Storm surges are projected to inundate 3 major road corridors within 10 years.",
  },
  {
    label: "Habitability",
    current: 19, projected: 42,
    desc: "Extreme heat combined with humidity is pushing wet-bulb temperatures toward unsafe thresholds for outdoor labor. Coastal flooding encroaches on 14% of residential land within the study zone.",
  },
  {
    label: "Tourism",
    current: 41, projected: 73,
    desc: "Coral bleaching, beach erosion, and recurring storm closures are shortening the viable tourist season. Revenue loss in the hospitality sector already exceeds $280M annually in comparable regions.",
  },
  {
    label: "Forestation",
    current: 52, projected: 81,
    desc: "Mangrove and wetland coverage has declined 18% since 2010, removing critical storm buffer capacity. Invasive species thriving in warmer conditions are displacing native canopy at measurable rates.",
  },
];

const DISASTERS = [
  { year: 2023, name: "Tropical Cyclone Mocha", type: "CYCLONE", affected: "2.4M people", damage: "$1.2B", sev: 5 },
  { year: 2022, name: "Pakistan Superfloods", type: "FLOOD", affected: "33M people", damage: "$30.0B", sev: 5 },
  { year: 2022, name: "East Africa Drought", type: "DROUGHT", affected: "22M people", damage: "$8.5B", sev: 4 },
  { year: 2021, name: "European Floods", type: "FLOOD", affected: "800K people", damage: "$46.0B", sev: 4 },
  { year: 2021, name: "Siberian Wildfires", type: "WILDFIRE", affected: "380K displaced", damage: "$3.1B", sev: 3 },
  { year: 2020, name: "Australian Bushfire Season", type: "WILDFIRE", affected: "3B animals killed", damage: "$103B", sev: 5 },
  { year: 2019, name: "Cyclone Idai", type: "CYCLONE", affected: "1.85M people", damage: "$2.2B", sev: 4 },
  { year: 2017, name: "Hurricane Maria (Puerto Rico)", type: "HURRICANE", affected: "3.4M people", damage: "$91.6B", sev: 5 },
];

const EMERGENCY_NUMBERS = [
  { svc: "National Emergency", num: "112", cat: "GENERAL", live: true },
  { svc: "Fire & Rescue", num: "118", cat: "FIRE", live: true },
  { svc: "Police Emergency", num: "110", cat: "POLICE", live: true },
  { svc: "Medical Emergency", num: "119", cat: "MEDICAL", live: true },
  { svc: "Disaster Management HQ", num: "1-800-DISASTER", cat: "DISASTER", live: true },
  { svc: "Coast Guard", num: "1-800-SEA-WATCH", cat: "MARINE", live: false },
  { svc: "Red Cross Emergency", num: "1-800-RED-CROSS", cat: "AID", live: true },
  { svc: "FEMA Helpline", num: "1-800-621-3362", cat: "FEDERAL", live: true },
  { svc: "Poison Control", num: "1-800-222-1222", cat: "MEDICAL", live: true },
  { svc: "Mental Health Crisis Line", num: "988", cat: "MENTAL HEALTH", live: true },
];

const WEATHER = [
  { d: "TODAY", icon: "⛈", hi: 34, lo: 26, rain: 82, wind: 67, cond: "SEVERE STORM" },
  { d: "SAT", icon: "🌧", hi: 31, lo: 24, rain: 65, wind: 42, cond: "HEAVY RAIN" },
  { d: "SUN", icon: "🌦", hi: 28, lo: 22, rain: 30, wind: 24, cond: "SHOWERS" },
  { d: "MON", icon: "⛅", hi: 30, lo: 23, rain: 15, wind: 16, cond: "PARTLY CLOUDY" },
  { d: "TUE", icon: "☀️", hi: 33, lo: 25, rain: 5, wind: 10, cond: "CLEAR" },
  { d: "WED", icon: "☀️", hi: 35, lo: 27, rain: 2, wind: 7, cond: "HOT & SUNNY" },
  { d: "THU", icon: "⛅", hi: 32, lo: 24, rain: 20, wind: 15, cond: "PART. CLOUDY" },
];

const RECOVERY_PLANS = [
  {
    disaster: "FLOOD", phase: "72-HOUR PROTOCOL", color: "#3b82f6",
    steps: [
      "Confirm structural integrity before re-entering any building",
      "Document all water damage with timestamped photos immediately",
      "Contact insurance provider within 24 hours of event",
      "Sanitize all surfaces — 1 cup bleach per 5 gallons of water",
      "Remove wet drywall and insulation within 48 hours to prevent mold",
    ],
    resources: ["FEMA Flood Recovery Guide", "WHO Water Safety Guidelines", "NFIP Claims Hotline"],
  },
  {
    disaster: "WILDFIRE", phase: "2-WEEK PROTOCOL", color: "#f97316",
    steps: [
      "Wait for official structure clearance before returning home",
      "Wear P100 respirator — ash contains carcinogenic heavy metals",
      "Test well water before any consumption — contact local health lab",
      "Photograph all damage before cleanup for insurance claims",
      "Report unstable slopes and burned trees to the ranger station",
    ],
    resources: ["CAL FIRE Reentry Guide", "EPA Ash Cleanup Protocol", "Air Quality Index Monitor"],
  },
  {
    disaster: "CYCLONE", phase: "48-HOUR PROTOCOL", color: "#8b5cf6",
    steps: [
      "Avoid flooded roads — 6 inches of fast water can knock a person down",
      "Use generators OUTDOORS ONLY — carbon monoxide poisoning is lethal",
      "Refrigerated food is safe up to 4 hours after power loss",
      "Register at nearest disaster relief distribution center",
      "Check on elderly and isolated neighbors within the first 6 hours",
    ],
    resources: ["National Hurricane Center", "Red Cross Recovery Services", "FEMA Disaster Assistance"],
  },
  {
    disaster: "EARTHQUAKE", phase: "IMMEDIATE + 7-DAY", color: "#eab308",
    steps: [
      "Exit building via stairs only — elevators may be compromised",
      "Expect aftershocks for days to weeks following the main event",
      "Shut off gas valve immediately if you smell gas or hear hissing",
      "Do not use open flame of any kind if gas leak is suspected",
      "Have a structural engineer inspect before re-occupying any building",
    ],
    resources: ["USGS Aftershock Forecast", "FEMA Earthquake Safety", "Red Cross First Aid"],
  },
];

const OFFLINE_GUIDES = [
  {
    title: "FIRST AID BASICS",
    body: "Apply direct pressure to stop bleeding — maintain for 10 minutes. For burns: cool running water for 20 min, no ice. CPR: 30 chest compressions then 2 rescue breaths. AED: follow audio prompts step by step. Stay calm and call 119 the moment network is restored.",
  },
  {
    title: "WATER PURIFICATION",
    body: "Boil water at a rolling boil for 3+ minutes. Chemical treatment: 4 drops of unscented household bleach per liter, wait 30 minutes. SODIS method: clear PET bottle, place in direct sunlight for 6+ hours. Always filter through cloth before chemical treatment.",
  },
  {
    title: "SHELTER IN PLACE",
    body: "For chemical hazards: seal gaps under doors with wet towels and tape plastic sheeting over windows. Identify interior rooms with fewest windows. For tornadoes: lowest interior room, away from windows. For floods: move to highest accessible floor immediately.",
  },
  {
    title: "EVACUATION SIGNALS",
    body: "3 short horn blasts = evacuate now. Continuous siren = take cover immediately. Emergency broadcast tone = tune to AM radio and listen for instructions. Green flag at checkpoint = safe to proceed. Red flag = do not pass, seek alternate route.",
  },
  {
    title: "EMERGENCY KIT CHECKLIST",
    body: "Water: 1 gallon per person per day for 3 days. Non-perishable food for 3 days. First aid kit. Flashlight and extra batteries. NOAA weather radio. Whistle to signal for help. N95 dust masks. Plastic sheeting and duct tape. Moist towelettes. Manual can opener. Local paper maps.",
  },
  {
    title: "MEDICAL TRIAGE COLORS",
    body: "RED tag: life-threatening injury — needs immediate care. YELLOW tag: serious but stable — delayed care acceptable. GREEN tag: minor injuries — walking wounded, treat last. BLACK tag: deceased or unsurvivable injury — do not expend resources. BLACK does not mean abandoned — it means prioritizing survivors.",
  },
];

const TABS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "forecast", label: "CLIMATE FORECAST" },
  { id: "evacuation", label: "EVACUATION" },
  { id: "history", label: "DISASTER HISTORY" },
  { id: "recovery", label: "RECOVERY PLANS" },
  { id: "emergency", label: "EMERGENCY INFO" },
];

// ── Shared UI ─────────────────────────────────────────────────────

const mono = "'JetBrains Mono', monospace";
const condensed = "'Barlow Condensed', sans-serif";
const sans = "'Inter', sans-serif";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em",
      color: "#3a4a4a", marginBottom: 14, paddingBottom: 8,
      borderBottom: "1px solid rgba(255,255,255,0.06)", textTransform: "uppercase",
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, unit, sub, accent }: {
  label: string; value: string; unit?: string; sub?: string; accent?: string;
}) {
  return (
    <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "16px 20px" }}>
      <div style={{ fontFamily: mono, fontSize: 9, color: "#3a4a4a", letterSpacing: "0.14em", marginBottom: 10 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontFamily: condensed, fontSize: 38, fontWeight: 700, lineHeight: 1, color: accent || "#e8e4db" }}>
          {value}
        </span>
        {unit && <span style={{ fontFamily: mono, fontSize: 11, color: "#5a6a6a" }}>{unit}</span>}
      </div>
      {sub && <div style={{ fontFamily: mono, fontSize: 9, color: "#4a5a5a", marginTop: 5 }}>{sub}</div>}
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  const cfg: Record<string, { bg: string; color: string; border: string }> = {
    CRITICAL: { bg: "#3a0000", color: "#ef4444", border: "#ef4444" },
    HIGH:     { bg: "#1c0800", color: "#fb923c", border: "#fb923c" },
    MODERATE: { bg: "#1a1400", color: "#facc15", border: "#facc15" },
    LOW:      { bg: "#0a1e0a", color: "#22c55e", border: "#22c55e" },
  };
  const c = cfg[level] || cfg.LOW;
  return (
    <div style={{
      fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", padding: "2px 8px",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{level}</div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────

function OverviewTab({ alertLevel, region }: { alertLevel: number; region: string }) {
  const alertCfg = [
    null,
    { label: "LEVEL 1 — NORMAL", color: "#22c55e", bg: "#052e16" },
    { label: "LEVEL 2 — ELEVATED RISK", color: "#facc15", bg: "#1c1400" },
    { label: "LEVEL 3 — HIGH ALERT", color: "#fb923c", bg: "#1c0a00" },
    { label: "LEVEL 4 — SEVERE WARNING", color: "#ef4444", bg: "#1c0000" },
    { label: "LEVEL 5 — EMERGENCY", color: "#ff0040", bg: "#200010" },
  ][alertLevel]!;

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={{
        background: "#1c0800", border: "1px solid #ff4500",
        padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={18} color="#ff4500" />
          <div>
            <div style={{ fontFamily: condensed, fontSize: 16, fontWeight: 700, color: "#ff4500", letterSpacing: "0.1em" }}>
              ACTIVE WEATHER ADVISORY — {region.toUpperCase()}
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
        <StatCard label="TEMPERATURE" value="34°" unit="C" sub="Feels like 39°C" accent="#fb923c" />
        <StatCard label="WIND SPEED" value="67" unit="km/h NNE" sub="Gusts up to 94 km/h" accent="#facc15" />
        <StatCard label="HUMIDITY" value="87" unit="%" sub="Dew point 28°C" />
        <StatCard label="SEA LEVEL RISE" value="+24.3" unit="mm" sub="From 2000 baseline" accent="#60a5fa" />
        <StatCard label="RAINFALL TODAY" value="112" unit="mm" sub="3× monthly average" accent="#ff4500" />
        <StatCard label="AIR QUALITY" value="158" unit="AQI" sub="Unhealthy — stay indoors" accent="#ef4444" />
      </div>

      <div>
        <SectionTitle>7-Day Weather Forecast</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {WEATHER.map((w, i) => (
            <div key={i} style={{
              background: i === 0 ? "#1a0e00" : "#111318",
              border: `1px solid ${i === 0 ? "#ff4500" : "rgba(255,255,255,0.09)"}`,
              padding: "14px 10px", textAlign: "center",
            }}>
              <div style={{ fontFamily: condensed, fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: i === 0 ? "#ff4500" : "#4a5a5a", marginBottom: 8 }}>{w.d}</div>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{w.icon}</div>
              <div style={{ fontFamily: condensed, fontSize: 10, fontWeight: 600, color: i === 0 ? "#fb923c" : "#5a6a6a", marginBottom: 6, letterSpacing: "0.06em" }}>{w.cond}</div>
              <div style={{ fontFamily: mono, fontSize: 11, color: "#e8e4db", marginBottom: 4 }}>{w.hi}° / {w.lo}°</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#60a5fa", marginBottom: 2 }}>💧 {w.rain}%</div>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#5a6a6a" }}>💨 {w.wind}km/h</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionTitle>Regional Impact Snapshot — Next 12 Months</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {IMPACT_DATA.map((d, i) => (
            <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#3a4a4a", letterSpacing: "0.12em", marginBottom: 12 }}>{d.label.toUpperCase()}</div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: mono, fontSize: 9, color: "#5a6a6a" }}>CURRENT</span>
                <span style={{ fontFamily: mono, fontSize: 9, color: "#ff4500" }}>PROJECTED</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", height: 5, marginBottom: 4 }}>
                <div style={{ height: "100%", background: "#facc15", width: `${d.current}%`, transition: "width 0.4s" }} />
              </div>
              <div style={{ background: "rgba(255,255,255,0.05)", height: 5, marginBottom: 8 }}>
                <div style={{ height: "100%", background: "#ff4500", width: `${d.projected}%`, transition: "width 0.4s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontFamily: condensed, fontSize: 20, fontWeight: 700, color: "#facc15" }}>{d.current}%</span>
                <span style={{ fontFamily: condensed, fontSize: 20, fontWeight: 700, color: "#ff4500" }}>{d.projected}%</span>
              </div>
              <div style={{ fontFamily: sans, fontSize: 11, color: "#5a6a6a", lineHeight: 1.65, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 9 }}>
                {d.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Climate Forecast Tab ──────────────────────────────────────────

function ForecastTab({ region }: { region: string }) {
  const tt = {
    contentStyle: { background: "#111318", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 0, fontFamily: mono, fontSize: 11, color: "#e8e4db" },
    labelStyle: { color: "#5a6a6a" },
    itemStyle: { color: "#e8e4db" },
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "20px 22px" }}>
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
            <XAxis dataKey="year" tick={{ fontFamily: mono, fontSize: 10, fill: "#3a4a4a" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#3a4a4a" }} axisLine={false} tickLine={false} unit="mm" />
            <Tooltip {...tt} />
            <ReferenceLine x="2025" stroke="#ff4500" strokeDasharray="4 4"
              label={{ value: "NOW", fill: "#ff4500", fontSize: 9, fontFamily: mono, position: "top" }} />
            <Area key="sea-area" type="monotone" dataKey="mm" stroke="#60a5fa" strokeWidth={2} fill="url(#seaGrad)" name="Sea Level Rise (mm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "20px 22px" }}>
          <SectionTitle>Temperature Trend — Monthly Avg & Max</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TEMP_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="m" tick={{ fontFamily: mono, fontSize: 10, fill: "#3a4a4a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#3a4a4a" }} axisLine={false} tickLine={false} unit="°" domain={[25, 45]} />
              <Tooltip {...tt} />
              <Line key="avg-line" type="monotone" dataKey="avg" stroke="#facc15" strokeWidth={2} dot={false} name="Avg Temp (°C)" />
              <Line key="max-line" type="monotone" dataKey="max" stroke="#ff4500" strokeWidth={2} dot={false} name="Max Temp (°C)" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "20px 22px" }}>
          <SectionTitle>Projected Damage by Sector (%)</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={IMPACT_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fontFamily: mono, fontSize: 9, fill: "#3a4a4a" }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
              <YAxis type="category" dataKey="label" tick={{ fontFamily: mono, fontSize: 9, fill: "#5a6a6a" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...tt} />
              <Bar key="current-bar" dataKey="current" fill="#facc15" name="Current %" barSize={7} />
              <Bar key="projected-bar" dataKey="projected" fill="#ff4500" name="12-Mo Projected %" barSize={7} />
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
          <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: "#e8e4db" }}>{item.title}</div>
              <RiskBadge level={item.risk} />
            </div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#7a8a8a", lineHeight: 1.65 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Evacuation Tab ────────────────────────────────────────────────

function EvacuationTab() {
  const [layer, setLayer] = useState<"evacuation" | "drainage" | "susceptibility">("evacuation");

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["evacuation", "drainage", "susceptibility"] as const).map(l => (
          <button key={l} onClick={() => setLayer(l)} style={{
            fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
            padding: "8px 18px", cursor: "pointer",
            border: `1px solid ${layer === l ? "#ff4500" : "rgba(255,255,255,0.12)"}`,
            background: layer === l ? "#1c0800" : "#111318",
            color: layer === l ? "#ff4500" : "#5a6a6a",
          }}>
            {l === "evacuation" ? "EVACUATION ROUTES" : l === "drainage" ? "DRAINAGE SYSTEMS" : "SUSCEPTIBILITY ZONES"}
          </button>
        ))}
      </div>

      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.09)" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#5a6a6a" }}>
            {layer === "evacuation" ? "EVACUATION ROUTE MAP — SE FLORIDA COASTAL ZONE" :
             layer === "drainage" ? "DRAINAGE INFRASTRUCTURE — RECOMMENDED SYSTEMS" :
             "DISASTER SUSCEPTIBILITY HEATMAP — ZONE CLASSIFICATION"}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a" }}>SCALE 1:50,000</div>
        </div>

        <svg viewBox="0 0 800 460" style={{ width: "100%", display: "block" }}>
          {/* Ocean */}
          <rect x="0" y="0" width="255" height="460" fill="#07111e" />
          {[50,100,150,200,250,300,350,400].map(y => (
            <path key={y} d={`M0 ${y} Q40 ${y-7} 80 ${y} Q120 ${y+7} 160 ${y} Q200 ${y-7} 240 ${y} Q250 ${y+4} 255 ${y}`}
              stroke="rgba(20,60,120,0.25)" strokeWidth="1" fill="none" />
          ))}
          <text x="50" y="230" fill="#0e2a4a" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle"
            transform="rotate(-90 50 230)" letterSpacing="4">ATLANTIC OCEAN</text>

          {/* Shoreline */}
          <path d="M255 0 C265 60 252 120 264 180 C273 240 255 300 265 360 C272 420 255 460 255 460
                   L278 460 C278 420 292 360 283 300 C276 240 288 180 280 120 C270 60 283 0 278 0 Z"
            fill="#14281a" />

          {/* Land */}
          <rect x="268" y="0" width="532" height="460" fill="#111820" />

          {/* Grid */}
          {[320,380,440,500,560,620,680,740].map(x => <line key={x} x1={x} y1="0" x2={x} y2="460" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}
          {[60,120,180,240,300,360,420].map(y => <line key={y} x1="268" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}

          {/* Districts */}
          <rect x="298" y="60" width="130" height="110" fill="rgba(25,45,75,0.35)" stroke="rgba(50,90,130,0.25)" strokeWidth="1" />
          <text x="363" y="118" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">NORTH DISTRICT</text>
          <rect x="298" y="210" width="130" height="110" fill="rgba(25,45,75,0.35)" stroke="rgba(50,90,130,0.25)" strokeWidth="1" />
          <text x="363" y="268" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">CITY CENTER</text>
          <rect x="298" y="350" width="130" height="80" fill="rgba(25,45,75,0.35)" stroke="rgba(50,90,130,0.25)" strokeWidth="1" />
          <text x="363" y="394" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">SOUTH PORT</text>
          <rect x="470" y="100" width="150" height="220" fill="rgba(18,35,55,0.35)" stroke="rgba(35,70,100,0.25)" strokeWidth="1" />
          <text x="545" y="215" fill="#2a4a6a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">INLAND ZONE</text>

          {/* Roads */}
          {[90,200,320,410].map(y => <line key={y} x1="268" y1={y} x2="800" y2={y} stroke="rgba(100,110,130,0.35)" strokeWidth="1.5" />)}
          {[340,440,560,680].map(x => <line key={x} x1={x} y1="0" x2={x} y2="460" stroke="rgba(100,110,130,0.35)" strokeWidth="1.5" />)}
          <path d="M282 0 L282 460" stroke="rgba(160,140,50,0.4)" strokeWidth="3.5" />
          <text x="282" y="28" fill="#6a5a18" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">US-1</text>

          {layer === "evacuation" && <>
            {/* Primary routes */}
            <path d="M282 265 L360 265 L360 170 L450 170 L450 70 L580 70 L690 70"
              stroke="#ff6b35" strokeWidth="3.5" fill="none" />
            <polygon points="690,64 706,70 690,76" fill="#ff6b35" />
            <path d="M282 380 L440 380 L440 310 L570 310 L570 210 L710 210"
              stroke="#ff6b35" strokeWidth="3.5" fill="none" />
            <polygon points="710,204 726,210 710,216" fill="#ff6b35" />

            {/* Secondary routes */}
            <path d="M282 120 L450 120 L580 120 L690 120" stroke="#facc15" strokeWidth="2" fill="none" strokeDasharray="8 4" />
            <polygon points="690,114 704,120 690,126" fill="#facc15" />
            <path d="M282 415 L440 415 L570 380 L710 355" stroke="#facc15" strokeWidth="2" fill="none" strokeDasharray="8 4" />
            <polygon points="710,349 724,355 710,361" fill="#facc15" />

            {/* Assembly points */}
            {([[706,70],[726,210],[704,120],[724,355]] as [number,number][]).map(([x,y], i) => (
              <g key={i}>
                <rect x={x-11} y={y-11} width="22" height="22" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
                <text x={x} y={y+4} fill="white" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">A{i+1}</text>
              </g>
            ))}

            {/* Flood zone */}
            <rect x="268" y="140" width="90" height="200" fill="rgba(255,0,0,0.07)" stroke="rgba(255,60,60,0.22)" strokeWidth="1" strokeDasharray="4 3" />
            <text x="313" y="235" fill="rgba(255,80,80,0.5)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">FLOOD</text>
            <text x="313" y="247" fill="rgba(255,80,80,0.5)" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">ZONE</text>

            {/* Legend */}
            <g transform="translate(490,340)">
              <rect x="0" y="0" width="210" height="100" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="12" y1="22" x2="44" y2="22" stroke="#ff6b35" strokeWidth="3" />
              <text x="52" y="26" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">PRIMARY EVACUATION</text>
              <line x1="12" y1="44" x2="44" y2="44" stroke="#facc15" strokeWidth="2" strokeDasharray="6 3" />
              <text x="52" y="48" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">SECONDARY ROUTE</text>
              <rect x="12" y="56" width="16" height="16" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
              <text x="52" y="68" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">ASSEMBLY POINT</text>
              <rect x="12" y="78" width="16" height="12" fill="rgba(255,0,0,0.12)" stroke="rgba(255,60,60,0.35)" strokeWidth="1" />
              <text x="52" y="88" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">FLOOD DANGER ZONE</text>
            </g>
          </>}

          {layer === "drainage" && <>
            <path d="M282 95 L570 95 L570 240 L710 240" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M282 310 L440 310 L440 420 L610 420" stroke="#60a5fa" strokeWidth="3" fill="none" />
            <path d="M440 95 L440 310" stroke="#60a5fa" strokeWidth="2" fill="none" />
            {([[350,95,350,310],[510,95,510,310],[610,240,610,420]] as [number,number,number,number][]).map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="6 3" />
            ))}
            {([[282,95],[570,240],[610,420]] as [number,number][]).map(([x,y],i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="11" fill="#1a3a5f" stroke="#60a5fa" strokeWidth="2" />
                <text x={x} y={y+4} fill="#60a5fa" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="600">P</text>
                <text x={x+15} y={y-14} fill="#60a5fa" fontSize="8" fontFamily="JetBrains Mono">PS-{i+1}</text>
              </g>
            ))}
            <ellipse cx="660" cy="130" rx="42" ry="26" fill="rgba(10,35,75,0.6)" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4 2" />
            <text x="660" y="134" fill="#3b82f6" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">RETENTION</text>
            <ellipse cx="530" cy="400" rx="36" ry="20" fill="rgba(10,35,75,0.6)" stroke="#1d4ed8" strokeWidth="2" strokeDasharray="4 2" />
            <text x="530" y="404" fill="#3b82f6" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">POND B</text>

            <g transform="translate(490,330)">
              <rect x="0" y="0" width="210" height="110" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="12" y1="22" x2="44" y2="22" stroke="#60a5fa" strokeWidth="3" />
              <text x="52" y="26" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">MAIN DRAINAGE CHANNEL</text>
              <line x1="12" y1="44" x2="44" y2="44" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x="52" y="48" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">SECONDARY DRAIN</text>
              <circle cx="22" cy="64" r="9" fill="#1a3a5f" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="22" y="68" fill="#60a5fa" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">P</text>
              <text x="52" y="68" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">PUMP STATION</text>
              <ellipse cx="22" cy="86" rx="13" ry="8" fill="rgba(10,35,75,0.6)" stroke="#1d4ed8" strokeWidth="1" />
              <text x="52" y="90" fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">RETENTION POND</text>
            </g>
          </>}

          {layer === "susceptibility" && <>
            <rect x="268" y="0" width="90" height="460" fill="rgba(239,68,68,0.18)" />
            <rect x="358" y="0" width="80" height="460" fill="rgba(249,115,22,0.13)" />
            <rect x="438" y="0" width="90" height="460" fill="rgba(234,179,8,0.09)" />
            <rect x="528" y="0" width="120" height="460" fill="rgba(34,197,94,0.05)" />
            <rect x="648" y="0" width="152" height="460" fill="rgba(34,197,94,0.025)" />

            {([
              [313, 230, "EXTREME", "#ef4444"],
              [398, 230, "HIGH", "#fb923c"],
              [483, 230, "MODERATE", "#eab308"],
              [588, 230, "LOW", "#86efac"],
              [724, 230, "MINIMAL", "#4ade80"],
            ] as [number,number,string,string][]).map(([x,y,label,color]) => (
              <text key={label} x={x} y={y} fill={color} fillOpacity={0.7} fontSize="9"
                fontFamily="JetBrains Mono" textAnchor="middle"
                transform={`rotate(-90 ${x} ${y})`} letterSpacing="3">{label}</text>
            ))}

            {([[280,75],[305,225],[290,355],[320,130]] as [number,number][]).map(([x,y],i) => (
              <g key={i}>
                <rect x={x-8} y={y-8} width="16" height="16" fill="rgba(255,0,0,0.25)" stroke="#ef4444" strokeWidth="1.5" />
                <line x1={x-5} y1={y-5} x2={x+5} y2={y+5} stroke="#ef4444" strokeWidth="1.5" />
                <line x1={x+5} y1={y-5} x2={x-5} y2={y+5} stroke="#ef4444" strokeWidth="1.5" />
              </g>
            ))}

            <g transform="translate(490,340)">
              <rect x="0" y="0" width="200" height="100" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {([
                ["EXTREME RISK", "#ef4444"],
                ["HIGH RISK", "#fb923c"],
                ["MODERATE RISK", "#eab308"],
                ["LOW / MINIMAL RISK", "#4ade80"],
              ] as [string,string][]).map(([label, color], i) => (
                <g key={i}>
                  <rect x="12" y={14 + i * 22} width="14" height="12" fill={color} fillOpacity={0.25} stroke={color} strokeWidth="1" />
                  <text x="34" y={24 + i * 22} fill="#c8c4bb" fontSize="9" fontFamily="JetBrains Mono">{label}</text>
                </g>
              ))}
            </g>
          </>}
        </svg>
      </div>

      {layer === "drainage" && (
        <div>
          <SectionTitle>Recommended Drainage Interventions</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { title: "GREEN ROOF SYSTEMS", priority: "HIGH", desc: "Deploy on 60%+ of commercial buildings in Zone A. Reduces stormwater runoff 50–80%.", cost: "$2.4M" },
              { title: "BIOSWALE CORRIDORS", priority: "HIGH", desc: "Install along Main St and Harbor Blvd. Handles 3-inch rain events before overflow occurs.", cost: "$840K" },
              { title: "UNDERGROUND CISTERNS", priority: "CRITICAL", desc: "3 × 500,000-gallon cisterns under City Center Park. 72-hour surge storage capacity.", cost: "$8.1M" },
              { title: "PERMEABLE PAVEMENT", priority: "MODERATE", desc: "Replace 40% of parking surfaces. Reduces surface runoff by 35% per treated area.", cost: "$1.6M" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: "#e8e4db", maxWidth: 140 }}>{item.title}</div>
                  <RiskBadge level={item.priority} />
                </div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#6a7a7a", lineHeight: 1.65, marginBottom: 10 }}>{item.desc}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: "#60a5fa" }}>EST. COST: {item.cost}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Disaster History Tab ──────────────────────────────────────────

function HistoryTab() {
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
            fontFamily: mono, fontSize: 10, letterSpacing: "0.1em", padding: "6px 14px", cursor: "pointer",
            border: `1px solid ${filter === t ? "#ff4500" : "rgba(255,255,255,0.1)"}`,
            background: filter === t ? "#1c0800" : "transparent",
            color: filter === t ? "#ff4500" : "#5a6a6a",
          }}>{t}</button>
        ))}
      </div>

      <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 110px 150px 110px 90px", padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {["YEAR", "EVENT", "TYPE", "AFFECTED", "DAMAGE", "SEVERITY"].map(h => (
            <div key={h} style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a", letterSpacing: "0.14em" }}>{h}</div>
          ))}
        </div>
        {shown.map((d, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "70px 1fr 110px 150px 110px 90px",
            padding: "13px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
          }}>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#4a5a5a" }}>{d.year}</div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#c8c4bb" }}>{d.name}</div>
            <div>
              <span style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.06em", padding: "2px 7px",
                background: typeColors[d.type]?.bg || "#111",
                color: typeColors[d.type]?.color || "#aaa",
                border: `1px solid ${typeColors[d.type]?.border || "#444"}`,
              }}>{d.type}</span>
            </div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#6a7a7a" }}>{d.affected}</div>
            <div style={{ fontFamily: mono, fontSize: 11, color: "#e8e4db" }}>{d.damage}</div>
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
            <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "14px 16px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#c8c4bb", marginBottom: 12, letterSpacing: "0.05em" }}>{z.zone}</div>
              {([["FLOOD", z.flood], ["HIGH WIND", z.wind], ["STORM SURGE", z.surge]] as [string,number][]).map(([label, val]) => (
                <div key={label} style={{ marginBottom: 7 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a" }}>{label}</span>
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

// ── Recovery Plans Tab ────────────────────────────────────────────

function RecoveryTab() {
  const [sel, setSel] = useState(0);
  const p = RECOVERY_PLANS[sel];

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RECOVERY_PLANS.map((r, i) => (
            <button key={i} onClick={() => setSel(i)} style={{
              background: sel === i ? "#111318" : "transparent",
              border: `1px solid ${sel === i ? r.color : "rgba(255,255,255,0.09)"}`,
              padding: "14px 16px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>
                {r.disaster === "FLOOD" ? "💧" : r.disaster === "WILDFIRE" ? "🔥" : r.disaster === "CYCLONE" ? "🌀" : "⚡"}
              </span>
              <div>
                <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: sel === i ? r.color : "#c8c4bb" }}>{r.disaster}</div>
                <div style={{ fontFamily: mono, fontSize: 9, color: "#4a5a5a", marginTop: 2 }}>{r.phase}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "24px 28px" }}>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: condensed, fontSize: 26, fontWeight: 800, letterSpacing: "0.08em", color: p.color, lineHeight: 1 }}>
              {p.disaster} RECOVERY PROTOCOL
            </div>
            <div style={{ fontFamily: mono, fontSize: 10, color: "#4a5a5a", marginTop: 6 }}>{p.phase}</div>
          </div>

          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a", letterSpacing: "0.14em", marginBottom: 14 }}>ACTION STEPS</div>
            {p.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 16, marginBottom: 12, alignItems: "flex-start" }}>
                <div style={{ fontFamily: condensed, fontSize: 17, fontWeight: 700, color: p.color, minWidth: 26, lineHeight: 1.3 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontFamily: sans, fontSize: 13, color: "#a8a4a0", lineHeight: 1.65 }}>{step}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a", letterSpacing: "0.14em", marginBottom: 10 }}>RESOURCES & REFERENCES</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {p.resources.map((r, i) => (
                <div key={i} style={{
                  fontFamily: mono, fontSize: 10, padding: "6px 12px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
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
            { title: "ECONOMIC AID PROGRAMS", tag: "FINANCIAL", desc: "FEMA individual assistance, SBA disaster loans, and local grants available within 30 days of declared disaster." },
          ].map((item, i) => (
            <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)", padding: "16px 18px" }}>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#ff4500", letterSpacing: "0.1em", marginBottom: 8 }}>{item.tag}</div>
              <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, color: "#e8e4db", marginBottom: 8, letterSpacing: "0.06em" }}>{item.title}</div>
              <div style={{ fontFamily: sans, fontSize: 12, color: "#6a7a7a", lineHeight: 1.65 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Emergency Info Tab ────────────────────────────────────────────

function EmergencyTab() {
  const [openGuide, setOpenGuide] = useState<number | null>(null);

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#1c0000", border: "1px solid #ef4444", padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 10, height: 10, borderRadius: "50%", background: "#ef4444",
          boxShadow: "0 0 14px #ef4444",
          animation: "none",
        }} />
        <div>
          <div style={{ fontFamily: condensed, fontSize: 16, fontWeight: 700, color: "#ef4444", letterSpacing: "0.1em" }}>
            FOR LIFE-THREATENING EMERGENCIES — DIAL 112 IMMEDIATELY
          </div>
          <div style={{ fontFamily: mono, fontSize: 10, color: "#7a4a4a", marginTop: 3 }}>
            This page is cached locally and accessible without internet connectivity during disasters.
          </div>
        </div>
      </div>

      <div>
        <SectionTitle>Local Emergency Contacts</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
          {EMERGENCY_NUMBERS.map((e, i) => (
            <div key={i} style={{
              background: "#111318",
              border: `1px solid ${e.live ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.04)"}`,
              padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between",
              opacity: e.live ? 1 : 0.45,
            }}>
              <div>
                <div style={{ fontFamily: mono, fontSize: 9, color: "#2a3a3a", letterSpacing: "0.12em", marginBottom: 5 }}>{e.cat}</div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#a8a4a0", marginBottom: 5 }}>{e.svc}</div>
                <div style={{ fontFamily: condensed, fontSize: 22, fontWeight: 700, color: e.live ? "#22c55e" : "#4a5a5a", letterSpacing: "0.06em" }}>{e.num}</div>
              </div>
              <div style={{
                fontFamily: mono, fontSize: 9, letterSpacing: "0.1em", padding: "3px 8px",
                border: `1px solid ${e.live ? "#22c55e" : "#2a3a3a"}`,
                color: e.live ? "#22c55e" : "#4a5a5a",
              }}>{e.live ? "ACTIVE" : "OFFLINE"}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.16em", color: "#3a4a4a" }}>
            OFFLINE SAFETY GUIDELINES
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#22c55e", padding: "2px 8px", border: "1px solid #22c55e", letterSpacing: "0.1em" }}>
            CACHED · AVAILABLE OFFLINE
          </div>
        </div>
        <div style={{ fontFamily: sans, fontSize: 12, color: "#4a5a5a", marginBottom: 12 }}>
          These guidelines are stored in your browser cache and remain accessible even when the internet is unavailable during a disaster event.
        </div>
        <div style={{ display: "grid", gap: 5 }}>
          {OFFLINE_GUIDES.map((guide, i) => (
            <div key={i} style={{ background: "#111318", border: "1px solid rgba(255,255,255,0.09)" }}>
              <button onClick={() => setOpenGuide(openGuide === i ? null : i)} style={{
                width: "100%", background: "transparent", border: "none", cursor: "pointer",
                padding: "13px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, color: "#e8e4db", letterSpacing: "0.1em" }}>{guide.title}</div>
                <ChevronRight size={15} color="#3a4a4a" style={{ transform: openGuide === i ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
              </button>
              {openGuide === i && (
                <div style={{ padding: "0 20px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontFamily: sans, fontSize: 13, color: "#7a8a8a", lineHeight: 1.8, paddingTop: 13 }}>
                    {guide.body}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#070d1a", border: "1px solid rgba(96,165,250,0.25)", padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ fontSize: 20, marginTop: 2 }}>📱</div>
        <div>
          <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", marginBottom: 6 }}>
            SENSOR-BASED EMERGENCY DETECTION
          </div>
          <div style={{ fontFamily: sans, fontSize: 12, color: "#3a5a7a", lineHeight: 1.7 }}>
            This app uses device barometric pressure sensors to detect sudden atmospheric drops characteristic of approaching storms and tornadoes. When readings exceed the critical threshold, emergency alerts and evacuation procedures are activated automatically — even in low-connectivity zones. Enable sensor access in your browser settings to activate this feature.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root Component ────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("overview");
  const [region, setRegion] = useState(REGIONS[0]);
  const [alertLevel] = useState(2);
  const [isOffline] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: sans }}>
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", background: "#0b0c0e", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, background: "#ff4500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Radio size={17} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: condensed, fontSize: 19, fontWeight: 700, letterSpacing: "0.09em", color: "#e8e4db", lineHeight: 1.1 }}>
                CLIMATE RESILIENCE SYSTEM
              </div>
              <div style={{ fontFamily: mono, fontSize: 9, color: "#3a4a4a", letterSpacing: "0.12em" }}>
                MONITORING · PREDICTION · EMERGENCY RESPONSE
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <select value={region} onChange={e => setRegion(e.target.value)} style={{
                background: "#111318", border: "1px solid rgba(255,255,255,0.12)", color: "#e8e4db",
                fontFamily: mono, fontSize: 10, padding: "6px 28px 6px 10px",
                outline: "none", cursor: "pointer", appearance: "none", letterSpacing: "0.04em",
              }}>
                {REGIONS.map(r => <option key={r}>{r}</option>)}
              </select>
              <MapPin size={11} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "#ff4500", pointerEvents: "none" }} />
            </div>

            <div style={{
              background: "#1c0800", border: "1px solid #facc15",
              color: "#facc15", fontFamily: condensed, fontSize: 13, fontWeight: 700,
              letterSpacing: "0.1em", padding: "5px 12px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <AlertTriangle size={13} />
              LEVEL 2 — ELEVATED RISK
            </div>

            <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: "0.08em", color: isOffline ? "#ff4500" : "#22c55e", display: "flex", alignItems: "center", gap: 4 }}>
              {isOffline ? <WifiOff size={12} /> : <Wifi size={12} />}
              {isOffline ? "OFFLINE" : "ONLINE"}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1400, margin: "0 auto", paddingLeft: 20, display: "flex", overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              fontFamily: condensed, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em",
              padding: "10px 18px", border: "none", cursor: "pointer", background: "transparent",
              color: tab === t.id ? "#ff4500" : "#4a5a5a",
              borderBottom: tab === t.id ? "2px solid #ff4500" : "2px solid transparent",
              whiteSpace: "nowrap", transition: "color 0.12s",
            }}>{t.label}</button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: 1400, margin: "0 auto", padding: "22px 20px 40px" }}>
        {tab === "overview"   && <OverviewTab alertLevel={alertLevel} region={region} />}
        {tab === "forecast"   && <ForecastTab region={region} />}
        {tab === "evacuation" && <EvacuationTab />}
        {tab === "history"    && <HistoryTab />}
        {tab === "recovery"   && <RecoveryTab />}
        {tab === "emergency"  && <EmergencyTab />}
      </main>
    </div>
  );
}
