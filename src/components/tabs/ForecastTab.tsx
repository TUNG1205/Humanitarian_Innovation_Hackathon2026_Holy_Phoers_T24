import { useEffect, useState } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { SEA_LEVEL_DATA } from "../../data/seaLevel";
import { FALLBACK_WEATHER } from "../../data/climate";
import { IMPACT_DATA } from "../../data/impact";
import { mono, condensed, sans, cardBorder, radius, radiusSm } from "../../lib/theme";
import { SectionTitle } from "../shared/SectionTitle";
import { RiskBadge } from "../shared/RiskBadge";

interface CurrentConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  condition: string;
  icon: string;
}

interface ForecastPoint {
  d: string;
  icon: string;
  hi: number;
  lo: number;
  rain: number;
  wind: number;
  cond: string;
}

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

const DAY_LABELS = ["TODAY", "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export function ForecastTab({ region }: { region: string }) {
  const [current, setCurrent] = useState<CurrentConditions | null>(null);
  const [forecast, setForecast] = useState<ForecastPoint[]>([]);
  const [airQuality, setAirQuality] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const forecastDays = forecast.length ? forecast : FALLBACK_WEATHER;

  useEffect(() => {
    const controller = new AbortController();
    const weatherUrl =
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_gusts_10m,precipitation,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
      `&timezone=Pacific%2FFiji&forecast_days=7`;
    const aqiUrl =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}` +
      `&hourly=pm10,pm2_5,us_aqi&timezone=Pacific%2FFiji`;

    async function fetchForecast() {
      try {
        const [weatherRes, aqiRes] = await Promise.all([
          fetch(weatherUrl, { signal: controller.signal }),
          fetch(aqiUrl, { signal: controller.signal }),
        ]);

        if (!weatherRes.ok) throw new Error(`Weather API returned ${weatherRes.status}`);
        if (!aqiRes.ok) throw new Error(`AQI API returned ${aqiRes.status}`);

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        const currentConditions: CurrentConditions = {
          temperature: Math.round(weatherData.current.temperature_2m),
          humidity: Math.round(weatherData.current.relative_humidity_2m),
          windSpeed: Math.round(weatherData.current.wind_speed_10m),
          windGusts: Math.round(weatherData.current.wind_gusts_10m),
          precipitation: weatherData.current.precipitation,
          condition: conditionFor(weatherData.current.weather_code).label,
          icon: conditionFor(weatherData.current.weather_code).icon,
        };

        const forecastPoints: ForecastPoint[] = weatherData.daily.time.map((_: string, i: number) => {
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
        const latestAqi = Array.isArray(aqiSeries) && aqiSeries.length
          ? Math.round(aqiSeries[aqiSeries.length - 1])
          : null;

        setCurrent(currentConditions);
        setForecast(forecastPoints);
        setAirQuality(latestAqi);
        setError(null);
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown API error");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchForecast();
    return () => controller.abort();
  }, []);

  const tt = {
    contentStyle: { background: "#131a26", border: "1px solid rgba(255,255,255,0.12)", borderRadius: radiusSm, fontFamily: mono, fontSize: 11, color: "#f1f5f9" },
    labelStyle: { color: "#8895a7" },
    itemStyle: { color: "#f1f5f9" },
  };

  const statusText = error
    ? `Live forecast unavailable: ${error}. Showing fallback data.`
    : loading
      ? "Connecting to live forecast..."
      : "Live forecast connected.";

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
        <SectionTitle>Sea Level Rise Projection — 2000–2050 · {region}</SectionTitle>
        <div style={{ fontFamily: mono, fontSize: 11, color: error ? "#fda4af" : "#94a3b8", marginTop: 8 }}>
          {statusText}
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={SEA_LEVEL_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="year" tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} unit="mm" />
            <Tooltip {...tt} />
            <ReferenceLine x="2025" stroke="#f97316" strokeDasharray="4 4"
              label={{ value: "NOW", fill: "#f97316", fontSize: 9, fontFamily: mono, position: "top" }} />
            <Area key="sea-area" type="monotone" dataKey="mm" stroke="#60a5fa" strokeWidth={2} fill="url(#seaGrad)" name="Sea Level Rise (mm)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
          <SectionTitle>7-Day Forecast — {loading ? "syncing live data…" : "Lami, Fiji"}</SectionTitle>
          {error ? (
            <div style={{ color: "#fda4af", fontFamily: mono, fontSize: 12, padding: "18px 10px" }}>
              Live forecast unavailable: {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecastDays} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="d" tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: mono, fontSize: 10, fill: "#4b5875" }} axisLine={false} tickLine={false} unit="°" domain={[20, 42]} />
                <Tooltip {...tt} />
                <Line key="high-line" type="monotone" dataKey="hi" stroke="#f97316" strokeWidth={2} dot={false} name="High (°C)" />
                <Line key="low-line" type="monotone" dataKey="lo" stroke="#facc15" strokeWidth={2} dot={false} name="Low (°C)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "20px 22px" }}>
          <SectionTitle>Live Conditions — {loading ? "fetching..." : "Lami, Fiji"}</SectionTitle>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: "#f1f5f9" }}>
              <div style={{ fontFamily: condensed, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>CURRENT</div>
              <div style={{ fontFamily: mono, fontSize: 10, color: "#94a3b8" }}>{loading ? "live update..." : current?.condition ?? "—"}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Temp</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#f97316", marginTop: 6 }}>
                  {current ? `${current.temperature}°C` : "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>AQI</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#60a5fa", marginTop: 6 }}>
                  {airQuality ?? "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Humidity</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#22c55e", marginTop: 6 }}>
                  {current ? `${current.humidity}%` : "—"}
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: radiusSm, padding: 12 }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: "#f1f5f9" }}>Wind</div>
                <div style={{ fontFamily: condensed, fontSize: 24, color: "#facc15", marginTop: 6 }}>
                  {current ? `${current.windSpeed} km/h` : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {[
          { title: "PRECIPITATION", text: "+34% increase in extreme rainfall events by 2035. 3-day storm intensification cycles becoming the new norm for coastal regions.", risk: "HIGH" },
          { title: "TEMPERATURE", text: "Persistent heat dome formation likely Jun–Sep. Average daily high exceeding 40°C for 22+ days annually by 2030.", risk: "HIGH" },
          { title: "STORM FREQUENCY", text: "Category 4–5 storm frequency up 28% decade-over-decade. Peak season extending from May through December.", risk: "CRITICAL" },
          { title: "DROUGHT CYCLES", text: "Alternating flood-drought cycles intensifying. 6-week dry spells after major rainfall increasing aquifer depletion risk.", risk: "MODERATE" },
        ].map((item, i) => (
          <div key={i} style={{ background: "#131a26", border: cardBorder, borderRadius: radius, padding: "16px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: condensed, fontSize: 15, fontWeight: 700, letterSpacing: "0.1em", color: "#f1f5f9" }}>{item.title}</div>
              <RiskBadge level={item.risk} />
            </div>
            <div style={{ fontFamily: sans, fontSize: 12, color: "#94a3b8", lineHeight: 1.65 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
