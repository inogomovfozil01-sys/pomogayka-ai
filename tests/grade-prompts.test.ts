import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "../src/lib/gemini/prompts";

describe("Grade & Safety Prompts", () => {
  it("should contain strict prompt injection defense instructions", () => {
    const prompt = buildSystemPrompt({ grade: 8 });
    expect(prompt).toContain("PROMPT INJECTION DEFENSE");
    expect(prompt).toContain("ПОЛЬЗОВАТЕЛЬСКИМ КОНТЕНТОМ");
    expect(prompt).toContain("ignore previous instructions");
  });

  it("should enforce OCR Safety (No Hallucinations)", () => {
    const prompt = buildSystemPrompt({ grade: 4 });
    expect(prompt).toContain("NO HALLUCINATIONS");
    expect(prompt).toContain("Я не могу уверенно прочитать условие");
  });

  it("should tailor arithmetic instructions for primary school (Grade 4)", () => {
    const prompt = buildSystemPrompt({ grade: 4 });
    expect(prompt).toContain("USER_GRADE = 4");
    expect(prompt).toContain("1–4 класс (начальная школа)");
    expect(prompt).toContain("Решение по действиям");
    expect(prompt).toContain("Никаких уравнений с X, дискриминантов");
  });

  it("should tailor algebra instructions for high school (Grade 10)", () => {
    const prompt = buildSystemPrompt({ grade: 10 });
    expect(prompt).toContain("USER_GRADE = 10");
    expect(prompt).toContain("10–11 класс");
    expect(prompt).toContain("Тригонометрия, логарифмы, производные");
  });

  it("should configure teach-me socratic mode", () => {
    const prompt = buildSystemPrompt({ grade: 8, mode: "TEACH_ME" });
    expect(prompt).toContain("MODE = TEACH_ME");
    expect(prompt).toContain("Сократовский метод");
    expect(prompt).toContain("НЕ давай сразу финальный ответ");
  });

  it("should configure answer verification mode", () => {
    const prompt = buildSystemPrompt({ grade: 8, mode: "VERIFY" });
    expect(prompt).toContain("MODE = VERIFY");
    expect(prompt).toContain("Проверка ответа ученика");
    expect(prompt).toContain("isVerification");
  });
});
