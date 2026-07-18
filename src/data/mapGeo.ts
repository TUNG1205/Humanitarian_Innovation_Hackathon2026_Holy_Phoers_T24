// Real landmark coordinates confirmed via OSM Nominatim geocoding (not GPS-surveyed,
// but grounded in actual OSM place data) vs. illustrative planning overlays (routes/
// zones/infrastructure). No public Fiji NDMO GIS dataset exists for a town Lami's
// size, so the overlays below are reasonable planning recommendations, not an
// official evacuation plan — same "modeled, not authoritative" framing used for the
// AI-generated risk/impact data.
//
// Geocoded 2026-07-19: Lami -18.1133,178.4067 · Wailada -18.1053,178.3841 ·
// Veisari -18.1169,178.3297 (matched to Montfort Boys Town, Queens Road, Navesi).
// Real order west-to-east along the coast is Veisari → Wailada → Lami Town → Suva.

export const MAP_CENTER: [number, number] = [-18.1133, 178.4067];
export const MAP_ZOOM = 13;

export const LANDMARKS: { name: string; position: [number, number] }[] = [
  { name: "VEISARI", position: [-18.1169, 178.3297] },
  { name: "WAILADA", position: [-18.1053, 178.3841] },
  { name: "LAMI TOWN", position: [-18.1133, 178.4067] },
];

// Approximate path of the real Queens Road corridor through Lami — the actual road
// geometry is rendered by the basemap tiles themselves; these waypoints just anchor
// where the illustrative overlays below connect to it.
export const QUEENS_ROAD: [number, number][] = [
  [-18.1169, 178.3297], // Veisari
  [-18.1110, 178.3550],
  [-18.1053, 178.3841], // Wailada
  [-18.1090, 178.3950],
  [-18.1133, 178.4067], // Lami Town
  [-18.1280, 178.4250],
  [-18.1416, 178.4422], // toward Suva
];

// Illustrative — heads inland/uphill (west, away from the harbour) from the coastal
// corridor toward notional higher-ground assembly points.
export const PRIMARY_EVACUATION_ROUTES: [number, number][][] = [
  [[-18.1133, 178.4067], [-18.1150, 178.3950], [-18.1170, 178.3850]],
  [[-18.1169, 178.3297], [-18.1190, 178.3200], [-18.1210, 178.3100]],
];

export const SECONDARY_EVACUATION_ROUTES: [number, number][][] = [
  [[-18.1053, 178.3841], [-18.1070, 178.3750], [-18.1090, 178.3650]],
];

export const ASSEMBLY_POINTS: { id: string; position: [number, number] }[] = [
  { id: "A1", position: [-18.1170, 178.3850] },
  { id: "A2", position: [-18.1210, 178.3100] },
  { id: "A3", position: [-18.1090, 178.3650] },
];

// Coastal strip along Suva Harbour, following the real road corridor.
export const FLOOD_ZONE: [number, number][] = [
  [-18.1190, 178.3260],
  [-18.1440, 178.4460],
  [-18.1390, 178.4400],
  [-18.1140, 178.3320],
];

export const DRAINAGE_CHANNELS: [number, number][][] = [
  [[-18.1169, 178.3297], [-18.1110, 178.3550], [-18.1053, 178.3841]],
  [[-18.1053, 178.3841], [-18.1090, 178.3950], [-18.1133, 178.4067]],
];

export const PUMP_STATIONS: { id: string; position: [number, number] }[] = [
  { id: "PS-1", position: [-18.1110, 178.3550] },
  { id: "PS-2", position: [-18.1090, 178.3950] },
];

export const RETENTION_PONDS: { position: [number, number]; radiusMeters: number }[] = [
  { position: [-18.1140, 178.3500], radiusMeters: 100 },
  { position: [-18.1070, 178.3900], radiusMeters: 80 },
];

// Five bands moving inland (west) from the harbour, re-anchored to the real
// Veisari(178.33)–Wailada(178.38)–Lami(178.41)–Suva(178.44) longitude span.
export const SUSCEPTIBILITY_ZONES: { level: string; color: string; bounds: [[number, number], [number, number]] }[] = [
  { level: "EXTREME", color: "#ef4444", bounds: [[-18.17, 178.415], [-18.09, 178.445]] },
  { level: "HIGH", color: "#fb923c", bounds: [[-18.17, 178.390], [-18.09, 178.415]] },
  { level: "MODERATE", color: "#eab308", bounds: [[-18.17, 178.360], [-18.09, 178.390]] },
  { level: "LOW", color: "#86efac", bounds: [[-18.17, 178.330], [-18.09, 178.360]] },
  { level: "MINIMAL", color: "#4ade80", bounds: [[-18.17, 178.295], [-18.09, 178.330]] },
];
