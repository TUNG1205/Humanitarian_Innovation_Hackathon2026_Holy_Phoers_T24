import { useEffect, useState } from "react";
import type { CurrentConditions, DayForecast } from "./useWeather";

export interface RiskAssessment {
  title: string;
  text: string;
  risk: string;
}

interface RiskState {
  assessments: RiskAssessment[] | null;
  loading: boolean;
  error: string | null;
}

// Fires once weather data is ready and asks the backend (api/risk-assessment.ts,
// which calls Claude server-side) for a live risk narrative. Falls back to static
// data at the call site if this never resolves.
export function useRiskAssessment(
  current: CurrentConditions | null,
  forecast: DayForecast[],
  airQuality: number | null,
  ready: boolean,
): RiskState {
  const [state, setState] = useState<RiskState>({ assessments: null, loading: true, error: null });

  useEffect(() => {
    // Intentionally keyed on `ready` alone — fires once when weather data first
    // arrives, not on every re-render, so it doesn't spam the LLM endpoint.
    if (!ready) return;
    let cancelled = false;

    fetch("/api/risk-assessment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, forecast, airQuality }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Risk assessment API returned ${res.status}`);
        return res.json();
      })
      .then((data: { assessments: RiskAssessment[] }) => {
        if (!cancelled) setState({ assessments: data.assessments, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setState({ assessments: null, loading: false, error: message });
        }
      });

    return () => { cancelled = true; };
  }, [ready]);

  return state;
}
