import { useEffect, useState } from "react";

// Lami, Fiji coordinates.
const LAT = -18.13;
const LON = 178.42;

const WMO_CONDITION: Record<number, { icon: string; label: string }> = {
  0: { icon: "☀️", label: "CLEAR" },
  1: { icon: "🌤", label: "MOSTLY CLEAR" },
  2: { icon: "⛅", label: "PARTLY CLOUDY" },
  3: { icon: "☁️", label: "OVERCAST" },
  45: { icon: "🌫", label: "FOG" },
  48: { icon: "🌫", label: "FOG" },
  51: { icon: "🌦", label: "LIGHT DRIZZLE" },
  53: { icon: "🌦", label: "DRIZZLE" },
  55: { icon: "🌧", label: "HEAVY DRIZZLE" },
  61: { icon: "🌧", label: "LIGHT RAIN" },
  63: { icon: "🌧", label: "RAIN" },
  65: { icon: "🌧", label: "HEAVY RAIN" },
  80: { icon: "🌦", label: "SHOWERS" },
  81: { icon: "🌧", label: "HEAVY SHOWERS" },
  82: { icon: "⛈", label: "VIOLENT SHOWERS" },
  95: { icon: "⛈", label: "SEVERE STORM" },
  96: { icon: "⛈", label: "STORM + HAIL" },
  99: { icon: "⛈", label: "SEVERE STORM" },
};

function conditionFor(code: number) {
  return WMO_CONDITION[code] ?? { icon: "⛅", label: "—" };
}

export interface CurrentConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  condition: string;
}

export interface DayForecast {
  d: string;
  icon: string;
  hi: number;
  lo: number;
  rain: number;
  wind: number;
  cond: string;
}

interface WeatherState {
  current: CurrentConditions | null;
  forecast: DayForecast[];
  loading: boolean;
  error: string | null;
}

const DAY_LABELS = ["TODAY", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,precipitation,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=Pacific%2FFiji&forecast_days=7`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (cancelled) return;
        const current: CurrentConditions = {
          temperature: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          windGusts: Math.round(data.current.wind_gusts_10m),
          precipitation: data.current.precipitation,
          condition: conditionFor(data.current.weather_code).label,
        };

        const forecast: DayForecast[] = data.daily.time.map((_: string, i: number) => {
          const c = conditionFor(data.daily.weather_code[i]);
          return {
            d: i === 0 ? "TODAY" : DAY_LABELS[(new Date(data.daily.time[i]).getDay() + 1) % 7] ?? "—",
            icon: c.icon,
            hi: Math.round(data.daily.temperature_2m_max[i]),
            lo: Math.round(data.daily.temperature_2m_min[i]),
            rain: Math.round(data.daily.precipitation_probability_max[i]),
            wind: Math.round(data.daily.wind_speed_10m_max[i]),
            cond: c.label,
          };
        });

        setState({ current, forecast, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, []);

  return state;
}
