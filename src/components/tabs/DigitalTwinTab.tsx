import { useState } from "react";
import { mono, condensed, sans, cardBorder, radius, radiusSm, accent } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { RiskBadge } from "../shared/RiskBadge";

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
            background: layer === l ? "rgba(56,189,248,0.1)" : "#131a26",
            color: layer === l ? accent : "#8895a7",
          }}>
            {l === "evacuation" ? "EVACUATION ROUTES" : l === "drainage" ? "DRAINAGE SYSTEMS" : "SUSCEPTIBILITY ZONES"}
          </button>
        ))}
      </div>

      <div style={{ background: "#0c111c", border: cardBorder, borderRadius: radius, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: condensed, fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", color: "#8895a7" }}>
            {layer === "evacuation" ? "DIGITAL TWIN — EVACUATION ROUTE MODEL — LAMI, FIJI" :
             layer === "drainage" ? "DIGITAL TWIN — DRAINAGE INFRASTRUCTURE — LAMI, FIJI" :
             "DIGITAL TWIN — DISASTER SUSCEPTIBILITY MODEL — LAMI, FIJI"}
          </div>
          <div style={{ fontFamily: mono, fontSize: 9, color: "#3d4a63" }}>SCALE 1:50,000</div>
        </div>

        <svg viewBox="0 0 800 460" style={{ width: "100%", display: "block" }}>
          {/* Ocean */}
          <rect x="0" y="0" width="255" height="460" fill="#07111e" />
          {[50,100,150,200,250,300,350,400].map(y => (
            <path key={y} d={`M0 ${y} Q40 ${y-7} 80 ${y} Q120 ${y+7} 160 ${y} Q200 ${y-7} 240 ${y} Q250 ${y+4} 255 ${y}`}
              stroke="rgba(20,60,120,0.25)" strokeWidth="1" fill="none" />
          ))}
          <text x="50" y="230" fill="#0e2a4a" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle"
            transform="rotate(-90 50 230)" letterSpacing="4">SUVA HARBOUR</text>

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
          <text x="363" y="118" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">WAILADA</text>
          <rect x="298" y="210" width="130" height="110" fill="rgba(25,45,75,0.35)" stroke="rgba(50,90,130,0.25)" strokeWidth="1" />
          <text x="363" y="268" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">LAMI TOWN</text>
          <rect x="298" y="350" width="130" height="80" fill="rgba(25,45,75,0.35)" stroke="rgba(50,90,130,0.25)" strokeWidth="1" />
          <text x="363" y="394" fill="#3a5a7a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">VEISARI</text>
          <rect x="470" y="100" width="150" height="220" fill="rgba(18,35,55,0.35)" stroke="rgba(35,70,100,0.25)" strokeWidth="1" />
          <text x="545" y="215" fill="#2a4a6a" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">COLO-I-SUVA</text>

          {/* Roads */}
          {[90,200,320,410].map(y => <line key={y} x1="268" y1={y} x2="800" y2={y} stroke="rgba(100,110,130,0.35)" strokeWidth="1.5" />)}
          {[340,440,560,680].map(x => <line key={x} x1={x} y1="0" x2={x} y2="460" stroke="rgba(100,110,130,0.35)" strokeWidth="1.5" />)}
          <path d="M282 0 L282 460" stroke="rgba(160,140,50,0.4)" strokeWidth="3.5" />
          <text x="282" y="28" fill="#6a5a18" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">QUEENS HWY</text>

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
              <rect x="0" y="0" width="210" height="100" rx="6" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="12" y1="22" x2="44" y2="22" stroke="#ff6b35" strokeWidth="3" />
              <text x="52" y="26" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">PRIMARY EVACUATION</text>
              <line x1="12" y1="44" x2="44" y2="44" stroke="#facc15" strokeWidth="2" strokeDasharray="6 3" />
              <text x="52" y="48" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">SECONDARY ROUTE</text>
              <rect x="12" y="56" width="16" height="16" fill="#14532d" stroke="#22c55e" strokeWidth="1" />
              <text x="52" y="68" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">ASSEMBLY POINT</text>
              <rect x="12" y="78" width="16" height="12" fill="rgba(255,0,0,0.12)" stroke="rgba(255,60,60,0.35)" strokeWidth="1" />
              <text x="52" y="88" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">FLOOD DANGER ZONE</text>
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
              <rect x="0" y="0" width="210" height="110" rx="6" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="12" y1="22" x2="44" y2="22" stroke="#60a5fa" strokeWidth="3" />
              <text x="52" y="26" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">MAIN DRAINAGE CHANNEL</text>
              <line x1="12" y1="44" x2="44" y2="44" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5 3" />
              <text x="52" y="48" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">SECONDARY DRAIN</text>
              <circle cx="22" cy="64" r="9" fill="#1a3a5f" stroke="#60a5fa" strokeWidth="1.5" />
              <text x="22" y="68" fill="#60a5fa" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">P</text>
              <text x="52" y="68" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">PUMP STATION</text>
              <ellipse cx="22" cy="86" rx="13" ry="8" fill="rgba(10,35,75,0.6)" stroke="#1d4ed8" strokeWidth="1" />
              <text x="52" y="90" fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">RETENTION POND</text>
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
              <rect x="0" y="0" width="200" height="100" rx="6" fill="rgba(8,10,16,0.94)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {([
                ["EXTREME RISK", "#ef4444"],
                ["HIGH RISK", "#fb923c"],
                ["MODERATE RISK", "#eab308"],
                ["LOW / MINIMAL RISK", "#4ade80"],
              ] as [string,string][]).map(([label, color], i) => (
                <g key={i}>
                  <rect x="12" y={14 + i * 22} width="14" height="12" fill={color} fillOpacity={0.25} stroke={color} strokeWidth="1" />
                  <text x="34" y={24 + i * 22} fill="#cbd5e1" fontSize="9" fontFamily="JetBrains Mono">{label}</text>
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
              <div key={i} style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ fontFamily: condensed, fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", color: "#f1f5f9", maxWidth: 140 }}>{item.title}</div>
                  <RiskBadge level={item.priority} />
                </div>
                <div style={{ fontFamily: sans, fontSize: 12, color: "#8a97ab", lineHeight: 1.65, marginBottom: 10 }}>{item.desc}</div>
                <div style={{ fontFamily: mono, fontSize: 11, color: "#60a5fa" }}>EST. COST: {item.cost}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
