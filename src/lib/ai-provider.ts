export const DEFAULT_AI_BASE_URL = "https://api.ai.kmitl.ac.th/v1";
export const DEFAULT_AI_MODEL_PREFIX = "openrouter/";

const MODEL_CACHE_MS = 10 * 60 * 1000;

type ModelEntry = {
  id?: unknown;
  name?: unknown;
};

type ModelListResponse = {
  data?: ModelEntry[];
};

type ChatCompletionContentPart = {
  type?: unknown;
  text?: unknown;
};

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

type RankedModel = {
  id: string;
  haystack: string;
  score: number;
};

let cachedModel: { baseUrl: string; model: string; expiresAt: number } | undefined;

export function aiBaseUrl(raw = process.env.AI_BASE_URL): string {
  const value = raw?.trim() || DEFAULT_AI_BASE_URL;
  return value.replace(/\/+$/, "");
}

export function aiApiKey(): string {
  return process.env.AI_API_KEY?.trim() || "";
}

export function aiModelPrefix(raw = process.env.AI_MODEL_PREFIX): string {
  const value = raw?.trim();
  if (value === "") return "";
  return value || DEFAULT_AI_MODEL_PREFIX;
}

export function withModelPrefix(model: string, prefix = aiModelPrefix()): string {
  const clean = model.trim();
  if (!clean || !prefix || clean.startsWith(prefix)) return clean;
  return `${prefix}${clean}`;
}

function searchable(value: string): string {
  return value
    .toLowerCase()
    .replace(/^openrouter\//, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function includesAll(haystack: string, tokens: string[]): boolean {
  return tokens.every((token) => haystack.includes(token));
}

/**
 * Rank only models that the authenticated KMITL /models endpoint actually returns.
 * The order intentionally favors capability over price/speed because this project
 * uses the gateway for high-value speaking feedback and conversation coaching.
 * Unknown models are not guessed as "strongest"; set AI_CHAT_MODEL explicitly if
 * KMITL later adds a model that should outrank this table.
 */
export function modelCapabilityScore(entry: ModelEntry): number {
  const haystack = searchable(
    `${typeof entry.id === "string" ? entry.id : ""} ${typeof entry.name === "string" ? entry.name : ""}`
  );
  if (!haystack) return 0;

  const tiers: Array<{ tokens: string[]; score: number }> = [
    { tokens: ["gpt", "5", "6", "sol"], score: 1600 },
    { tokens: ["claude", "fable", "5"], score: 1550 },
    { tokens: ["grok", "4", "6"], score: 1500 },
    { tokens: ["kimi", "k3"], score: 1400 },
    { tokens: ["deepseek", "v4", "pro"], score: 1300 },
    { tokens: ["deepseek", "v4", "flash"], score: 1200 }
  ];

  for (const tier of tiers) {
    if (includesAll(haystack, tier.tokens)) return tier.score;
  }
  return 0;
}

export function chooseStrongestKmitlModel(entries: ModelEntry[]): string | undefined {
  const ranked: RankedModel[] = entries
    .map((entry) => {
      const id = typeof entry.id === "string" ? entry.id.trim() : "";
      return {
        id,
        haystack: searchable(`${id} ${typeof entry.name === "string" ? entry.name : ""}`),
        score: modelCapabilityScore(entry)
      };
    })
    .filter((entry) => entry.id && entry.score > 0)
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

  return ranked[0]?.id;
}

// Backward-compatible export for existing tests/imports.
export const chooseRecommendedKmitlModel = chooseStrongestKmitlModel;

export async function resolveChatModel(
  apiKey: string,
  baseUrl: string,
  explicitModel?: string
): Promise<string | undefined> {
  const configured = explicitModel?.trim();
  if (configured) return withModelPrefix(configured);

  if (cachedModel && cachedModel.baseUrl === baseUrl && cachedModel.expiresAt > Date.now()) {
    return cachedModel.model;
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}/models`, {
      method: "GET",
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store"
    });
  } catch {
    return undefined;
  }

  if (!response.ok) return undefined;

  let payload: ModelListResponse;
  try {
    payload = await response.json() as ModelListResponse;
  } catch {
    return undefined;
  }

  const selected = chooseStrongestKmitlModel(Array.isArray(payload.data) ? payload.data : []);
  if (!selected) return undefined;

  const model = selected.startsWith(DEFAULT_AI_MODEL_PREFIX) ? selected : withModelPrefix(selected);
  cachedModel = { baseUrl, model, expiresAt: Date.now() + MODEL_CACHE_MS };
  return model;
}

export function extractChatCompletionText(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const payload = data as ChatCompletionResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (!part || typeof part !== "object") return "";
      const value = part as ChatCompletionContentPart;
      return typeof value.text === "string" ? value.text : "";
    })
    .filter(Boolean)
    .join("\n")
    .trim();
}

export async function requestChatCompletion(options: {
  apiKey: string;
  baseUrl: string;
  model: string;
  system: string;
  user: string;
  temperature?: number;
}): Promise<{ response: Response; text: string }> {
  const response = await fetch(`${options.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: options.model,
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.user }
      ],
      temperature: options.temperature ?? 0.2
    }),
    cache: "no-store"
  });

  if (!response.ok) return { response, text: "" };
  const data = await response.json() as unknown;
  return { response, text: extractChatCompletionText(data) };
}
