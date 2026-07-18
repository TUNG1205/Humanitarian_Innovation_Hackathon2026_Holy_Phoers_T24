import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroqTool, type GroqTool } from "./_lib/groq";

// Server-side only: proxies live conditions to Groq (Llama 3) and returns the overall
// alert level (1-5) shown in the header badge and the Overview tab's advisory banner.
// Never call the Groq API directly from the browser.

interface CurrentConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  condition: string;
}

interface DayForecast {
  d: string;
  hi: number;
  lo: number;
  rain: number;
  wind: number;
  cond: string;
}

interface RequestBody {
  current?: CurrentConditions | null;
  forecast?: DayForecast[];
}

interface AlertLevelResult {
  level: 1 | 2 | 3 | 4 | 5;
  headline: string;
}

const ALERT_LEVEL_TOOL: GroqTool = {
  name: "submit_alert_level",
  description: "Submit the overall climate/weather alert level for Lami, Fiji right now.",
  parameters: {
    type: "object",
    properties: {
      level: {
        // Accept string or integer — Llama 3.3 on Groq sometimes emits the enum
        // value as a JSON string ("1") despite the integer type, which fails
        // Groq's own strict schema validation and 400s if only "integer" is
        // allowed here. Coerced back to a number below before responding.
        type: ["integer", "string"],
        enum: [1, 2, 3, 4, 5, "1", "2", "3", "4", "5"],
        description: "1=Normal (calm conditions), 2=Elevated Risk (minor hazard indicators), 3=High Alert (significant active hazard e.g. heavy rain or strong wind), 4=Severe Warning (severe imminent hazard), 5=Emergency (extreme, life-threatening conditions active right now).",
      },
      headline: {
        type: "string",
        description: "Short hazard summary, 1-3 phrases separated by ' · ' (e.g. 'Heavy Rain Advisory · Coastal Flood Watch'). Must be grounded only in the live data given — do not invent watches or warnings the data doesn't support. If conditions are calm, say so plainly (e.g. 'No active weather hazards').",
      },
    },
    required: ["level", "headline"],
  },
};

function buildPrompt(current: CurrentConditions | null | undefined, forecast: DayForecast[] | undefined): string {
  const currentSummary = current
    ? `Temperature ${current.temperature}°C, humidity ${current.humidity}%, wind ${current.windSpeed}km/h (gusts ${current.windGusts}km/h), precipitation ${current.precipitation}mm/hr, conditions: ${current.condition}.`
    : "Live current conditions unavailable — default to a calm/normal assessment.";

  const forecastSummary = forecast?.length
    ? forecast.slice(0, 3).map(f => `${f.d}: ${f.lo}-${f.hi}°C, ${f.rain}% rain chance, ${f.wind}km/h wind, ${f.cond}`).join("; ")
    : "Live forecast unavailable.";

  return `You are determining the overall weather/climate alert level for Lami, Fiji (-18.13, 178.42), a coastal town on Queens Road immediately west of Suva, for a disaster-management dashboard used by NGOs and local officers. This drives a persistent header badge, so be conservative — only escalate the level when the live data actually supports it.

Live current conditions: ${currentSummary}
Next few days: ${forecastSummary}

Call submit_alert_level with your answer — do not reply in plain text.`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: GROQ_API_KEY not set" });
    return;
  }

  const body = (req.body ?? {}) as RequestBody;
  const prompt = buildPrompt(body.current, body.forecast);

  try {
    const result = await callGroqTool<AlertLevelResult>(apiKey, prompt, ALERT_LEVEL_TOOL);
    const level = Math.min(5, Math.max(1, Math.round(Number(result.level)) || 2));
    res.status(200).json({ level, headline: result.headline });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: message });
  }
}
