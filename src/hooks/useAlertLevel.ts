import { useEffect, useState } from "react";
import type { CurrentConditions, DayForecast } from "./useWeather";

export interface AlertLevelResult {
  level: number;
  headline: string;
}

interface AlertLevelState {
  result: AlertLevelResult | null;
  loading: boolean;
  error: string | null;
}

// Fires once weather data is ready and asks the backend (api/alert-level.ts, which
// calls Groq server-side) for the overall alert level shown in the header badge and
// the Overview tab's advisory banner. Falls back to a fixed level at the call site
// if this never resolves.
export function useAlertLevel(
  current: CurrentConditions | null,
  forecast: DayForecast[],
  ready: boolean,
): AlertLevelState {
  const [state, setState] = useState<AlertLevelState>({ result: null, loading: true, error: null });

  useEffect(() => {
    // Intentionally keyed on `ready` alone — fires once when weather data first
    // arrives, not on every re-render, so it doesn't spam the LLM endpoint.
    if (!ready) return;
    let cancelled = false;

    fetch("/api/alert-level", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ current, forecast }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Alert level API returned ${res.status}`);
        return res.json();
      })
      .then((data: AlertLevelResult) => {
        if (!cancelled) setState({ result: data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown error";
          setState({ result: null, loading: false, error: message });
        }
      });

    return () => { cancelled = true; };
  }, [ready]);

  return state;
}
