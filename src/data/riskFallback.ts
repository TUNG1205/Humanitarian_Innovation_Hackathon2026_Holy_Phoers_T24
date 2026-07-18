// Used if the AI risk assessment (src/hooks/useRiskAssessment.ts, backed by
// api/risk-assessment.ts) hasn't resolved yet, fails, or ANTHROPIC_API_KEY isn't
// configured. Keeps the Forecast tab useful even without the backend.
export const FALLBACK_RISK_CARDS = [
  { title: "PRECIPITATION", text: "+34% increase in extreme rainfall events by 2035. 3-day storm intensification cycles becoming the new norm for coastal regions.", risk: "HIGH" },
  { title: "TEMPERATURE", text: "Persistent heat dome formation likely Jun–Sep. Average daily high exceeding 40°C for 22+ days annually by 2030.", risk: "HIGH" },
  { title: "STORM FREQUENCY", text: "Category 4–5 storm frequency up 28% decade-over-decade. Peak season extending from May through December.", risk: "CRITICAL" },
  { title: "DROUGHT CYCLES", text: "Alternating flood-drought cycles intensifying. 6-week dry spells after major rainfall increasing aquifer depletion risk.", risk: "MODERATE" },
];
