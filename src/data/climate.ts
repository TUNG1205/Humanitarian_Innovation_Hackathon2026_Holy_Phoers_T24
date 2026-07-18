// Approximate Suva/Lami climate normals (tropical maritime — Fiji rarely exceeds mid-30s°C).
export const TEMP_DATA = [
  { m: "Jan", avg: 26.5, max: 30.5 }, { m: "Feb", avg: 26.8, max: 30.8 },
  { m: "Mar", avg: 26.5, max: 30.2 }, { m: "Apr", avg: 26.0, max: 29.6 },
  { m: "May", avg: 25.0, max: 28.6 }, { m: "Jun", avg: 24.1, max: 27.7 },
  { m: "Jul", avg: 23.5, max: 27.1 }, { m: "Aug", avg: 23.6, max: 27.5 },
  { m: "Sep", avg: 24.2, max: 28.1 }, { m: "Oct", avg: 24.7, max: 28.6 },
  { m: "Nov", avg: 25.6, max: 29.5 }, { m: "Dec", avg: 26.2, max: 30.1 },
];

// Fallback only — used if the live Open-Meteo fetch (src/hooks/useWeather.ts) hasn't
// resolved yet or fails. Overwritten by real data whenever the API is reachable.
export const FALLBACK_WEATHER = [
  { d: "TODAY", icon: "⛈", hi: 34, lo: 26, rain: 82, wind: 67, cond: "SEVERE STORM" },
  { d: "SAT", icon: "🌧", hi: 31, lo: 24, rain: 65, wind: 42, cond: "HEAVY RAIN" },
  { d: "SUN", icon: "🌦", hi: 28, lo: 22, rain: 30, wind: 24, cond: "SHOWERS" },
  { d: "MON", icon: "⛅", hi: 30, lo: 23, rain: 15, wind: 16, cond: "PARTLY CLOUDY" },
  { d: "TUE", icon: "☀️", hi: 33, lo: 25, rain: 5, wind: 10, cond: "CLEAR" },
  { d: "WED", icon: "☀️", hi: 35, lo: 27, rain: 2, wind: 7, cond: "HOT & SUNNY" },
  { d: "THU", icon: "⛅", hi: 32, lo: 24, rain: 20, wind: 15, cond: "PART. CLOUDY" },
];
