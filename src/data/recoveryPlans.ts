export const RECOVERY_PLANS = [
  {
    disaster: "FLOOD", phase: "72-HOUR PROTOCOL", color: "#3b82f6",
    steps: [
      "Confirm structural integrity before re-entering any building",
      "Document all water damage with timestamped photos immediately",
      "Contact insurance provider within 24 hours of event",
      "Sanitize all surfaces — 1 cup bleach per 5 gallons of water",
      "Remove wet drywall and insulation within 48 hours to prevent mold",
    ],
    resources: ["NDMO Flood Recovery Guide", "WHO Water Safety Guidelines", "Fiji Red Cross Relief Line"],
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
    resources: ["Fiji Meteorological Service", "Fiji Red Cross Recovery Services", "NDMO Disaster Assistance"],
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
    resources: ["Fiji Mineral Resources Dept. Seismic Bulletin", "NDMO Earthquake Safety", "Fiji Red Cross First Aid"],
  },
];
