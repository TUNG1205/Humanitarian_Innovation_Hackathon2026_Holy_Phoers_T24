// Modeled estimates for the Lami case study, informed by UNDP SIDS Fiji country profile
// (sids.data.undp.org/country-profiles/fiji) and historical cyclone/flood damage patterns
// (see disasters.ts). Illustrative for demo purposes, not a validated engineering forecast.
export const IMPACT_DATA = [
  {
    label: "Financial",
    current: 34, projected: 67,
    desc: "Flood-related claims and property devaluation along Lami's low-lying coastal strip are accelerating. Small businesses in Lami Town face repeat disruption, eroding tax base and credit access.",
  },
  {
    label: "Infrastructure",
    current: 28, projected: 55,
    desc: "Saltwater intrusion threatens road and drainage infrastructure along Queens Highway and the Wailada industrial area faster than maintenance budgets allow.",
  },
  {
    label: "Habitability",
    current: 19, projected: 42,
    desc: "Extreme heat combined with humidity is pushing wet-bulb temperatures toward unsafe thresholds for outdoor labor. Coastal flooding encroaches on low-lying residential land near Suva Harbour.",
  },
  {
    label: "Tourism",
    current: 41, projected: 73,
    desc: "Coastal erosion and recurring storm closures are shortening the viable travel season along the Suva-Lami corridor, echoing revenue losses seen across comparable Pacific coastal towns.",
  },
  {
    label: "Forestation",
    current: 52, projected: 81,
    desc: "Mangrove coverage around Suva Harbour is declining, removing storm-buffer capacity. The Colo-i-Suva forest reserve inland faces pressure from shifting rainfall patterns.",
  },
];
