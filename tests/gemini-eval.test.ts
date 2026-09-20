import { describe, it, expect } from "vitest";
import dotenv from "dotenv";
dotenv.config();

import { solveHomework } from "../src/lib/gemini/solver";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe("Gemini AI Curriculum Evaluation", () => {
  it("should solve 4th grade arithmetic and adapt to primary school method", async () => {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("Skipping real Gemini call: GEMINI_API_KEY not set");
      return;
    }

    await sleep(2000);

    const { result, tokensInput, tokensOutput, latencyMs } = await solveHomework({
      userPrompt: "Реши задание: 472 - 45. Напиши по действиям.",
      grade: 4,
      mode: "SOLUTION",
    });

    expect(result.grade).toBe(4);
    expect(result.tasks.length).toBeGreaterThan(0);
    const task = result.tasks[0];
    expect(task.finalAnswer).toContain("427");
    expect(task.steps.length).toBeGreaterThan(0);
    expect(tokensInput).toBeGreaterThan(0);
    expect(tokensOutput).toBeGreaterThan(0);
    expect(latencyMs).toBeGreaterThan(0);
  }, 30000);

  it("should verify student calculation accurately", async () => {
    if (!process.env.GEMINI_API_KEY) return;

    await sleep(2000);

    const { result } = await solveHomework({
      userPrompt: "я посчитал: 472 - 45 = 427, правильно?",
      grade: 4,
      mode: "VERIFY",
    });

    expect(result.isVerification).toBe(true);
    expect(result.verificationResult?.isCorrect).toBe(true);
  }, 30000);

  it("should detect mistake in wrong student calculation", async () => {
    if (!process.env.GEMINI_API_KEY) return;

    await sleep(2000);

    const { result } = await solveHomework({
      userPrompt: "я посчитал: 472 - 45 = 430, правильно?",
      grade: 4,
      mode: "VERIFY",
    });

    expect(result.isVerification).toBe(true);
    expect(result.verificationResult?.isCorrect).toBe(false);
  }, 30000);
});
