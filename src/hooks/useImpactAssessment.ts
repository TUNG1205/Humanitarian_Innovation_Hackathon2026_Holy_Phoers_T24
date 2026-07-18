import { useEffect, useState } from "react";
import type { CurrentConditions } from "./useWeather";

export interface ImpactAssessment {
  label: string;
  current: number;
  projected: number;
  desc: string;
}

interface ImpactState {
  assessments: ImpactAssessment[] | null;
  loading: boolean;
  error: string | null;
}

// Fires once weather data is ready and asks the backend (api/impact-assessment.ts,
// which calls Groq server-side) for a live 12-month sector impact outlook. Falls back
// to static data at the call site if this never resolves.
export function useImpactAssessment(
  current: CurrentConditions | null,
  airQuality: number | null,
  ready: boolean,
): ImpactState {
  const [state, setState] = useState<ImpactState>({ assessments: null, loading: true, error: null });

  useEffect(() => {
    // Intentionally keyed on `ready` alone — fires once when weather data first
    // arrives, not on every re-render, so it doesn't spam the LLM endpoint.
    if (!ready) return;
    let cancelled = false;

    fetch("/api/impact-assessment", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, airQuality }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Impact assessment API returned ${res.status}`);
        return res.json();
      })
      .then((data: { assessments: ImpactAssessment[] }) => {
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
