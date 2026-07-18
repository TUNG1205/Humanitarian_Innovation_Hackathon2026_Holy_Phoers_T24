import { useState } from "react";
import { MapContainer, TileLayer, Polyline, Polygon, Rectangle, Circle, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mono, condensed, sans, cardBorder, radius, radiusSm, accent, cardBg, cardShadow } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { RiskBadge } from "../shared/RiskBadge";
import {
  MAP_CENTER, MAP_ZOOM, LANDMARKS, QUEENS_ROAD,
  PRIMARY_EVACUATION_ROUTES, SECONDARY_EVACUATION_ROUTES, ASSEMBLY_POINTS, FLOOD_ZONE,
  DRAINAGE_CHANNELS, PUMP_STATIONS, RETENTION_PONDS, SUSCEPTIBILITY_ZONES,
} from "../../data/mapGeo";

// Leaflet's default marker image breaks under Vite bundling — use small styled
// divIcons instead, matching the app's existing mono-font marker aesthetic.
function boxIcon(label: string, bg: string, border: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;background:${bg};border:1.5px solid ${border};display:flex;align-items:center;justify-content:center;color:#fff;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;">${label}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function circleIcon(label: string, bg: string, border: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:22px;height:22px;border-radius:50%;background:${bg};border:2px solid ${border};display:flex;align-items:center;justify-content:center;color:${border};font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:600;">${label}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function landmarkIcon(label: string) {
  const halo = "-1.5px -1.5px 0 #fff, 1.5px -1.5px 0 #fff, -1.5px 1.5px 0 #fff, 1.5px 1.5px 0 #fff, 0 0 4px rgba(255,255,255,0.9)";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;gap:6px;white-space:nowrap;transform:translateX(7px);"><div style="width:9px;height:9px;border-radius:50%;background:#0ea5e9;border:1.5px solid #fff;flex-shrink:0;box-shadow:0 0 3px rgba(0,0,0,0.5);"></div><span style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;color:#0c4a6e;text-shadow:${halo};">${label}</span></div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 5],
  });
}

const roadStyle = { color: "#6a5a18", weight: 3, opacity: 0.7 };

function LegendPanel({ rows }: { rows: { swatch: React.ReactNode; label: string }[] }) {
  return (
    <div style={{
      position: "absolute", bottom: 12, right: 12, zIndex: 1000,
      background: "rgba(8,10,16,0.94)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: radiusSm,
      padding: "10px 14px", display: "grid", gap: 8,
    }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {r.swatch}
          <span style={{ fontFamily: mono, fontSize: 9, color: "#cbd5e1" }}>{r.label}</span>
        </div>
      ))}
    </div>
  );
}

export function DigitalTwinTab() {
  const [layer, setLayer] = useState<"evacuation" | "drainage" | "susceptibility">("evacuation");

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["evacuation", "drainage", "susceptibility"] as const).map(l => (
          <button key={l} onClick={() => setLayer(l)} style={{
            fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em",
            padding: "8px 18px", cursor: "pointer", borderRadius: radiusSm,
            border: `1px solid ${layer === l ? accent : "rgba(255,255,255,0.1)"}`,
            background: layer === l ? "rgba(56,189,248,0.1)" : cardBg,
            color: layer === l ? accent : "#a3b1c9",
          }}>
            {l === "evacuation" ? "EVACUATION ROUTES" : l === "drainage" ? "DRAINAGE SYSTEMS" : "SUSCEPTIBILITY ZONES"}
          </button>
        ))}
      </div>

      <div style={{ background: "#0c111c", border: cardBorder, borderRadius: radius, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
          <div style={{ fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#a3b1c9" }}>
            {layer === "evacuation" ? "DIGITAL TWIN — EVACUATION ROUTE MODEL — LAMI, FIJI" :
             layer === "drainage" ? "DIGITAL TWIN — DRAINAGE INFRASTRUCTURE — LAMI, FIJI" :
             "DIGITAL TWIN — DISASTER SUSCEPTIBILITY MODEL — LAMI, FIJI"}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#8492ab" }}>ILLUSTRATIVE OVERLAY — NOT AN OFFICIAL EVACUATION PLAN</div>
        </div>

        <div style={{ position: "relative", height: 460 }}>
          <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height: "100%", width: "100%", background: "#0c111c" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            <Polyline positions={QUEENS_ROAD} pathOptions={roadStyle} />

            {LANDMARKS.map(l => (
              <Marker key={l.name} position={l.position} icon={landmarkIcon(l.name)} interactive={false} />
            ))}

            {layer === "evacuation" && <>
              {PRIMARY_EVACUATION_ROUTES.map((route, i) => (
                <Polyline key={i} positions={route} pathOptions={{ color: "#ff6b35", weight: 3.5 }} />
              ))}
              {SECONDARY_EVACUATION_ROUTES.map((route, i) => (
                <Polyline key={i} positions={route} pathOptions={{ color: "#facc15", weight: 2, dashArray: "8 5" }} />
              ))}
              {ASSEMBLY_POINTS.map(p => (
                <Marker key={p.id} position={p.position} icon={boxIcon(p.id, "#14532d", "#22c55e")} />
              ))}
              <Polygon positions={FLOOD_ZONE} pathOptions={{ color: "rgba(255,60,60,0.35)", weight: 1, dashArray: "4 3", fillColor: "#ff0000", fillOpacity: 0.07 }} />
              <LegendPanel rows={[
                { swatch: <div style={{ width: 24, height: 3, background: "#ff6b35" }} />, label: "PRIMARY EVACUATION" },
                { swatch: <div style={{ width: 24, height: 2, background: "repeating-linear-gradient(90deg,#facc15,#facc15 6px,transparent 6px,transparent 10px)" }} />, label: "SECONDARY ROUTE" },
                { swatch: <div style={{ width: 14, height: 14, background: "#14532d", border: "1px solid #22c55e" }} />, label: "ASSEMBLY POINT" },
                { swatch: <div style={{ width: 14, height: 10, background: "rgba(255,0,0,0.12)", border: "1px solid rgba(255,60,60,0.35)" }} />, label: "FLOOD DANGER ZONE" },
              ]} />
            </>}

            {layer === "drainage" && <>
              {DRAINAGE_CHANNELS.map((channel, i) => (
                <Polyline key={i} positions={channel} pathOptions={{ color: "#60a5fa", weight: i === 0 ? 3 : 1.5, dashArray: i === 0 ? undefined : "6 3" }} />
              ))}
              {PUMP_STATIONS.map(p => (
                <Marker key={p.id} position={p.position} icon={circleIcon("P", "#1a3a5f", "#60a5fa")} />
              ))}
              {RETENTION_PONDS.map((pond, i) => (
                <Circle key={i} center={pond.position} radius={pond.radiusMeters} pathOptions={{ color: "#1d4ed8", weight: 2, dashArray: "4 2", fillColor: "#0a234b", fillOpacity: 0.6 }} />
              ))}
              <LegendPanel rows={[
                { swatch: <div style={{ width: 24, height: 3, background: "#60a5fa" }} />, label: "MAIN DRAINAGE CHANNEL" },
                { swatch: <div style={{ width: 24, height: 2, background: "repeating-linear-gradient(90deg,#3b82f6,#3b82f6 5px,transparent 5px,transparent 8px)" }} />, label: "SECONDARY DRAIN" },
                { swatch: <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#1a3a5f", border: "1.5px solid #60a5fa" }} />, label: "PUMP STATION" },
                { swatch: <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#0a234b", border: "1px solid #1d4ed8" }} />, label: "RETENTION POND" },
              ]} />
            </>}

            {layer === "susceptibility" && <>
              {SUSCEPTIBILITY_ZONES.map(z => (
                <Rectangle key={z.level} bounds={z.bounds} pathOptions={{ color: z.color, weight: 0, fillColor: z.color, fillOpacity: 0.18 }} />
              ))}
              <LegendPanel rows={[
                { swatch: <div style={{ width: 14, height: 14, background: "#ef4444", opacity: 0.5 }} />, label: "EXTREME RISK" },
                { swatch: <div style={{ width: 14, height: 14, background: "#fb923c", opacity: 0.5 }} />, label: "HIGH RISK" },
                { swatch: <div style={{ width: 14, height: 14, background: "#eab308", opacity: 0.5 }} />, label: "MODERATE RISK" },
                { swatch: <div style={{ width: 14, height: 14, background: "#4ade80", opacity: 0.5 }} />, label: "LOW / MINIMAL RISK" },
              ]} />
            </>}
          </MapContainer>
        </div>
      </div>

      {layer === "evacuation" && (
        <div>
          <SectionTitle>Assembly Point Details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {[
              { id: "A1", area: "LAMI TOWN ROUTE", capacity: "~800 people", elevation: "Est. 45m above sea level", facilities: "Water point, first aid station, generator backup" },
              { id: "A2", area: "VEISARI ROUTE", capacity: "~500 people", elevation: "Est. 38m above sea level", facilities: "Water point, covered shelter area" },
              { id: "A3", area: "WAILADA ROUTE", capacity: "~600 people", elevation: "Est. 52m above sea level", facilities: "Water point, first aid station" },
            ].map((item, i) => (
              <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: "#f1f5f9", maxWidth: 150 }}>{item.area}</div>
                  <div style={{ fontFamily: mono, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "3px 8px", background: "#14532d", border: "1px solid #22c55e", color: "#22c55e" }}>{item.id}</div>
                </div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#a3b1c9", lineHeight: 1.65, marginBottom: 10 }}>{item.facilities}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 11, color: "#60a5fa" }}>
                  <span>CAPACITY: {item.capacity}</span>
                  <span>{item.elevation}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#8492ab", marginTop: 10 }}>
            Capacity and elevation figures are illustrative planning estimates, not surveyed data.
          </div>
        </div>
      )}

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
              <div key={i} style={{ background: cardBg, border: cardBorder, borderRadius: radius, boxShadow: cardShadow, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: "#f1f5f9", maxWidth: 140 }}>{item.title}</div>
                  <RiskBadge level={item.priority} />
                </div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#a3b1c9", lineHeight: 1.65, marginBottom: 10 }}>{item.desc}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: "#60a5fa" }}>EST. COST: {item.cost}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
