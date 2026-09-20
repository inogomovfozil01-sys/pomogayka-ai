import { callGemini, type GeminiImageInput } from "./client";
import { buildSystemPrompt } from "./prompts";
import type { SolveHomeworkResult, LearningMode } from "../types";

export interface SolveHomeworkOptions {
  userPrompt: string;
  images?: GeminiImageInput[];
  grade?: number;
  mode?: LearningMode;
  subject?: string;
  language?: "ru" | "uz" | "en";
  previousContext?: string;
}

export async function solveHomework(
  options: SolveHomeworkOptions
): Promise<{
  result: SolveHomeworkResult;
  tokensInput: number;
  tokensOutput: number;
  latencyMs: number;
  model: string;
}> {
  const grade = options.grade || 8;
  const mode = options.mode || "SOLUTION";
  const language = options.language || "ru";

  const systemPrompt = buildSystemPrompt({
    grade,
    mode,
    subject: options.subject,
    language,
  });

  let fullUserPrompt = options.userPrompt;
  if (options.previousContext) {
    fullUserPrompt = `[Контекст предыдущего диалога и решений]:\n${options.previousContext}\n\n[Новый запрос пользователя]:\n${options.userPrompt}`;
  }

  const response = await callGemini({
    systemPrompt,
    userPrompt: fullUserPrompt,
    images: options.images,
    expectJson: true,
    temperature: mode === "TEACH_ME" ? 0.3 : 0.1,
  });

  let parsed: SolveHomeworkResult;
  try {
    let rawText = response.text.trim();
    // Strip markdown code blocks if present
    if (rawText.startsWith("```json")) {
      rawText = rawText.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    parsed = JSON.parse(rawText);
  } catch (err) {
    console.warn("Failed to parse Gemini response as JSON. Raw text:", response.text);
    // Fallback structured result
    parsed = {
      subject: options.subject || "Домашнее задание",
      grade,
      language,
      tasks: [
        {
          taskNumber: "1",
          conditionText: "Задание с фото/вопроса",
          steps: [response.text],
          finalAnswer: "Смотри решение выше",
        },
      ],
      rawText: response.text,
    };
  }

  return {
    result: parsed,
    tokensInput: response.tokensInput,
    tokensOutput: response.tokensOutput,
    latencyMs: response.latencyMs,
    model: response.model,
  };
}
