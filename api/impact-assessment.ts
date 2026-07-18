import type { VercelRequest, VercelResponse } from "@vercel/node";
import { callGroqTool, type GroqTool } from "./_lib/groq";

// Server-side only: proxies live conditions to Groq (Llama 3) and returns a structured
// 12-month sector impact assessment for Lami, Fiji (the Overview tab's "Regional Impact
// Snapshot"). Never call the Groq API directly from the browser.

interface CurrentConditions {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windGusts: number;
  precipitation: number;
  condition: string;
}

interface RequestBody {
  current?: CurrentConditions | null;
  airQuality?: number | null;
}

interface ImpactAssessment {
  label: "Financial" | "Infrastructure" | "Habitability" | "Tourism" | "Forestation";
  current: number;
  projected: number;
  desc: string;
}

const IMPACT_ASSESSMENT_TOOL: GroqTool = {
  name: "submit_impact_assessment",
  description: "Submit the five 12-month sector impact assessments for Lami, Fiji.",
  parameters: {
    type: "object",
    properties: {
      assessments: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            label: {
              type: "string",
              enum: ["Financial", "Infrastructure", "Habitability", "Tourism", "Forestation"],
            },
            current: { type: "integer", description: "Current impact severity, 0-100" },
            projected: { type: "integer", description: "Projected impact severity 12 months from now, 0-100. Should be >= current given accelerating climate trends, unless there's a specific reason it wouldn't be." },
            desc: {
              type: "string",
              description: "2-3 sentence explanation grounded in Lami, Fiji context and live conditions where relevant. No invented statistics.",
            },
          },
          required: ["label", "current", "projected", "desc"],
        },
      },
    },
    required: ["assessments"],
  },
};

function buildPrompt(current: CurrentConditions | null | undefined, airQuality: number | null | undefined): string {
  const currentSummary = current
    ? `Temperature ${current.temperature}°C, humidity ${current.humidity}%, wind ${current.windSpeed}km/h (gusts ${current.windGusts}km/h), precipitation ${current.precipitation}mm/hr, conditions: ${current.condition}.`
    : "Live current conditions unavailable.";

  const aqiSummary = airQuality != null ? `US AQI ${airQuality}.` : "Air quality data unavailable.";

  return `You are generating a 12-month climate impact outlook for Lami, Fiji (-18.13, 178.42), a coastal peri-urban town on Queens Highway immediately west of Suva, for a disaster-management dashboard used by NGOs and local officers.

Live current conditions: ${currentSummary}
${aqiSummary}

Regional context: Lami sits on a low-lying coastal strip facing Suva Harbour, with the Colo-i-Suva forest reserve inland and an industrial area at Wailada. The area has a tropical maritime climate and has been affected by Tropical Cyclone Winston (2016), Tropical Cyclone Yasa (2020), and Tropical Cyclone Harold (2020).

Produce exactly five sector impact assessments — Financial, Infrastructure, Habitability, Tourism, Forestation — each as a 0-100 severity score for right now ("current") and a projection 12 months out ("projected"), plus a short grounded explanation.

Important framing: "current" and "projected" both measure the ongoing climate-change trend for Lami (sea-level rise, warming, intensifying storm patterns), NOT whether today's specific weather event will have resolved. "projected" should almost always be higher than "current", reflecting that underlying trend continuing to worsen over the next 12 months — lower "projected" than "current" for a sector should be rare and only when you have a specific structural reason (e.g. a funded mitigation project). Live conditions may still inform "current" (e.g. active heavy rain raising near-term Financial/Infrastructure severity), but do not let a single passing storm make "projected" look like an improvement. Do not invent precise statistics you cannot support; where you extrapolate, say so in general terms rather than fabricating numbers.

Call submit_impact_assessment with your answer — do not reply in plain text.`;
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
  const prompt = buildPrompt(body.current, body.airQuality);

  try {
    const result = await callGroqTool<{ assessments: ImpactAssessment[] }>(apiKey, prompt, IMPACT_ASSESSMENT_TOOL);
    res.status(200).json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(502).json({ error: message });
  }
}
