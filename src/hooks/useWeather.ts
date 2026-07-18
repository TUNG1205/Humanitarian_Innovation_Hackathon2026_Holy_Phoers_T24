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
  icon: string;
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
  airQuality: number | null;
  loading: boolean;
  error: string | null;
}

const DAY_LABELS = ["TODAY", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({
    current: null,
    forecast: [],
    airQuality: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,precipitation,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=Pacific%2FFiji&forecast_days=7`;
    const aqiUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}` +
      `&hourly=pm10,pm2_5,us_aqi&timezone=Pacific%2FFiji`;

    async function loadWeather() {
      try {
        const [weatherRes, aqiRes] = await Promise.all([fetch(weatherUrl), fetch(aqiUrl)]);

        if (!weatherRes.ok) throw new Error(`Weather API returned ${weatherRes.status}`);
        if (!aqiRes.ok) throw new Error(`Air quality API returned ${aqiRes.status}`);

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();
        if (cancelled) return;

        const current: CurrentConditions = {
          temperature: Math.round(weatherData.current.temperature_2m),
          humidity: Math.round(weatherData.current.relative_humidity_2m),
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          windGusts: Math.round(weatherData.current.wind_gusts_10m),
          precipitation: weatherData.current.precipitation,
          condition: conditionFor(weatherData.current.weather_code).label,
          icon: conditionFor(weatherData.current.weather_code).icon,
        };

        const forecast: DayForecast[] = weatherData.daily.time.map((_: string, i: number) => {
          const c = conditionFor(weatherData.daily.weather_code[i]);
          return {
            d: i === 0 ? "TODAY" : DAY_LABELS[(new Date(weatherData.daily.time[i]).getDay() + 1) % 7] ?? "—",
            icon: c.icon,
            hi: Math.round(weatherData.daily.temperature_2m_max[i]),
            lo: Math.round(weatherData.daily.temperature_2m_min[i]),
            rain: Math.round(weatherData.daily.precipitation_probability_max[i]),
            wind: Math.round(weatherData.daily.wind_speed_10m_max[i]),
            cond: c.label,
          };
        });

        const aqiSeries = aqiData.hourly?.us_aqi;
        const airQuality = Array.isArray(aqiSeries) && aqiSeries.length
          ? Math.round(aqiSeries[aqiSeries.length - 1])
          : null;

        setState({ current, forecast, airQuality, loading: false, error: null });
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Unknown API error";
          setState((s: WeatherState) => ({ ...s, loading: false, error: message }));
        }
      }
    }

    loadWeather();
    return () => { cancelled = true; };
  }, []);

  return state;
}
