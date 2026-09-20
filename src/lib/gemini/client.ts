export interface GeminiImageInput {
  mimeType: string;
  base64Data: string;
}

export interface GeminiCallParams {
  systemPrompt: string;
  userPrompt: string;
  images?: GeminiImageInput[];
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  expectJson?: boolean;
}

export interface GeminiCallResponse {
  text: string;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  model: string;
}

const FALLBACK_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-2.5-pro",
];

export async function callGemini(
  params: GeminiCallParams
): Promise<GeminiCallResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment");
  }

  const requestedModel =
    params.model || process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const modelsToTry = [
    requestedModel,
    ...FALLBACK_MODELS.filter((m) => m !== requestedModel),
  ];

  // Prepare parts
  const parts: Array<
    | { text: string }
    | { inlineData: { mimeType: string; data: string } }
  > = [];

  if (params.images && params.images.length > 0) {
    for (const img of params.images) {
      parts.push({
        inlineData: {
          mimeType: img.mimeType || "image/jpeg",
          data: img.base64Data,
        },
      });
    }
  }

  parts.push({
    text: params.userPrompt || "Реши задание с фотографии и объясни понятно.",
  });

  const bodyPayload: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    systemInstruction: {
      parts: [
        {
          text: params.systemPrompt,
        },
      ],
    },
    generationConfig: {
      temperature: params.temperature ?? 0.2,
      maxOutputTokens: params.maxOutputTokens ?? 2048,
    },
  };

  if (params.expectJson) {
    (bodyPayload.generationConfig as Record<string, unknown>).responseMimeType =
      "application/json";
  }

  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const startTime = Date.now();

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        });

        const latencyMs = Date.now() - startTime;

        if (!response.ok) {
          const errorBody = await response.text();
          // If 503 or 429, retry after small backoff
          if (response.status === 503 || response.status === 429) {
            console.warn(
              `Gemini ${model} attempt ${attempt} got ${response.status}. Retrying in ${attempt * 1000}ms...`
            );
            await new Promise((r) => setTimeout(r, attempt * 1000));
            continue;
          }
          throw new Error(`Gemini API error [${response.status}]: ${errorBody}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];
        if (!candidate) {
          throw new Error("Gemini returned empty candidate response");
        }

        const text =
          candidate.content?.parts
            ?.map((p: { text?: string }) => p.text || "")
            .join("") || "";

        const tokensInput = result.usageMetadata?.promptTokenCount || 0;
        const tokensOutput = result.usageMetadata?.candidatesTokenCount || 0;

        return {
          text,
          tokensInput,
          tokensOutput,
          latencyMs,
          model,
        };
      } catch (err) {
        lastError = err as Error;
      }
    }
  }

  throw lastError || new Error("Failed to call Gemini API after retries and fallback models");
}
