import type { VercelRequest, VercelResponse } from "@vercel/node";

// Server-side only: proxies live conditions to Groq (Llama 3) and returns a structured
// climate risk assessment for Lami, Fiji. Never call the Groq API directly from the
// browser — the API key would be exposed in client-side code.

// Verified working 2026-07-19 against a live call. If this errors with
// "model_decommissioned", check https://console.groq.com/docs/deprecations for the
// current replacement — Groq retires model IDs on a rolling basis.
const MODEL = "llama-3.3-70b-versatile";

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
  airQuality?: number | null;
}

interface RiskAssessment {
  title: "PRECIPITATION" | "TEMPERATURE" | "STORM FREQUENCY" | "DROUGHT CYCLES";
  text: string;
  risk: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

const RISK_ASSESSMENT_TOOL = {
  type: "function",
  function: {
    name: "submit_risk_assessment",
    description: "Submit the four climate risk category assessments for Lami, Fiji.",
    parameters: {
      type: "object",
      properties: {
        assessments: {
          type: "array",
          minItems: 4,
          maxItems: 4,
          items: {
            type: "object",
            properties: {
              title: {
                type: "string",
                enum: ["PRECIPITATION", "TEMPERATURE", "STORM FREQUENCY", "DROUGHT CYCLES"],
              },
              text: {
                type: "string",
                description: "2-3 sentence risk narrative, factual and specific to Lami, Fiji. No invented statistics.",
              },
              risk: { type: "string", enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"] },
            },
            required: ["title", "text", "risk"],
          },
        },
      },
      required: ["assessments"],
    },
  },
};

function buildPrompt(current: CurrentConditions | null | undefined, forecast: DayForecast[] | undefined, airQuality: number | null | undefined): string {
  const currentSummary = current
    ? `Temperature ${current.temperature}°C, humidity ${current.humidity}%, wind ${current.windSpeed}km/h (gusts ${current.windGusts}km/h), precipitation ${current.precipitation}mm/hr, conditions: ${current.condition}.`
    : "Live current conditions unavailable.";

  const forecastSummary = forecast?.length
    ? forecast.map(f => `${f.d}: ${f.lo}-${f.hi}°C, ${f.rain}% rain chance, ${f.wind}km/h wind, ${f.cond}`).join("; ")
    : "Live forecast unavailable.";

  const aqiSummary = airQuality != null ? `US AQI ${airQuality}.` : "Air quality data unavailable.";

  return `You are generating a short climate risk assessment for Lami, Fiji (-18.13, 178.42), a coastal peri-urban town on Queens Highway immediately west of Suva, for a disaster-management dashboard used by NGOs and local officers.

Live current conditions: ${currentSummary}
7-day forecast: ${forecastSummary}
${aqiSummary}

Regional context: Lami sits on a low-lying coastal strip facing Suva Harbour, with the Colo-i-Suva forest reserve inland. The area has a tropical maritime climate and has been affected by Tropical Cyclone Winston (2016), Tropical Cyclone Yasa (2020), and Tropical Cyclone Harold (2020).

Produce exactly four risk assessments — PRECIPITATION, TEMPERATURE, STORM FREQUENCY, DROUGHT CYCLES — each grounded in the live data above where relevant. Keep each assessment factual and concise (2-3 sentences). Do not invent precise statistics you cannot support from the data given; where you extrapolate beyond the live data, say so in general terms (e.g. "typical for this season") rather than fabricating numbers.

Call submit_risk_assessment with your answer — do not reply in plain text.`;
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
  const prompt = buildPrompt(body.current, body.forecast, body.airQuality);

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        tools: [RISK_ASSESSMENT_TOOL],
        tool_choice: { type: "function", function: { name: "submit_risk_assessment" } },
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      res.status(502).json({ error: `Groq API error (${groqRes.status}): ${errText}` });
      return;
    }

    const data = await groqRes.json() as {
      choices?: Array<{ message?: { tool_calls?: Array<{ function?: { name: string; arguments: string } }> } }>;
    };
    const toolCall = data.choices?.[0]?.message?.tool_calls?.find(tc => tc.function?.name === "submit_risk_assessment");

    if (!toolCall?.function) {
      res.status(502).json({ error: "Model did not return a structured assessment" });
      return;
    }

    let parsed: { assessments: RiskAssessment[] };
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      res.status(502).json({ error: "Model returned malformed JSON" });
      return;
    }

    res.status(200).json({ assessments: parsed.assessments });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
}
