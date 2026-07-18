// Shared by every api/*.ts function that needs a structured Groq response.
// Filenames under api/_lib are not routed by Vercel (leading underscore).

// Verified working 2026-07-19 against a live call. If this errors with
// "model_decommissioned", check https://console.groq.com/docs/deprecations for the
// current replacement — Groq retires model IDs on a rolling basis.
const MODEL = "llama-3.3-70b-versatile";

export interface GroqTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

// Calls Groq with a single forced tool call and returns the parsed arguments.
// Throws on any failure (HTTP error, missing tool call, malformed JSON) — callers
// should catch and map to an HTTP response.
export async function callGroqTool<T>(apiKey: string, prompt: string, tool: GroqTool): Promise<T> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      tools: [{ type: "function", function: tool }],
      tool_choice: { type: "function", function: { name: tool.name } },
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json() as {
    choices?: Array<{ message?: { tool_calls?: Array<{ function?: { name: string; arguments: string } }> } }>;
  };
  const toolCall = data.choices?.[0]?.message?.tool_calls?.find(tc => tc.function?.name === tool.name);

  if (!toolCall?.function) {
    throw new Error("Model did not return a structured response");
  }

  try {
    return JSON.parse(toolCall.function.arguments) as T;
  } catch {
    throw new Error("Model returned malformed JSON");
  }
}
