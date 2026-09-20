import { describe, it, expect } from "vitest";
import { classifyIntent, extractTaskNumbers } from "../src/bot/intent-router";

describe("Intent Router", () => {
  it("should classify casual chatter as isCasualChat and NOT a help request", () => {
    const casualMessages = [
      "привет",
      "ку всем",
      "кто сегодня в школу?",
      "ахахах",
      "лол",
      "спасибо большое",
      "пон",
      "ок",
      "salom",
      "hello",
    ];

    for (const msg of casualMessages) {
      const result = classifyIntent(msg, false);
      expect(result.isCasualChat).toBe(true);
      expect(result.isHelpRequest).toBe(false);
    }
  });

  it("should classify homework requests accurately", () => {
    const helpMessages = [
      { text: "помогите пожалуйста 8,9", expectedTasks: ["8", "9"] },
      { text: "решите 5", expectedTasks: ["5"] },
      { text: "кто поможет с 7?", expectedTasks: ["7"] },
      { text: "как это решить?", expectedTasks: [] },
      { text: "что такое дискриминант?", expectedTasks: [] },
      { text: "yordam bering 4", expectedTasks: ["4"] },
    ];

    for (const item of helpMessages) {
      const result = classifyIntent(item.text, false);
      expect(result.isHelpRequest).toBe(true);
      expect(result.isCasualChat).toBe(false);
      if (item.expectedTasks.length > 0) {
        expect(result.requestedTasks).toEqual(item.expectedTasks);
      }
    }
  });

  it("should classify continuation queries", () => {
    const continuations = [
      "а 10?",
      "а следующее?",
      "почему в 9 получилось 16000?",
      "почему здесь знак минус?",
    ];

    for (const msg of continuations) {
      const result = classifyIntent(msg, false);
      expect(result.isContinuation).toBe(true);
      expect(result.isHelpRequest).toBe(true);
    }
  });

  it("should classify verification questions", () => {
    const verifications = [
      "я получил 472 - 45 = 427, правильно?",
      "проверь мой ответ пожалуйста",
      "у меня получилось x = 4, верно?",
      "to'g'rimi bu javob?",
    ];

    for (const msg of verifications) {
      const result = classifyIntent(msg, false);
      expect(result.isVerification).toBe(true);
      expect(result.isHelpRequest).toBe(true);
    }
  });

  it("should extract task ranges like 5-10 correctly", () => {
    const tasks = extractTaskNumbers("решите пожалуйста 5-10");
    expect(tasks).toEqual(["5", "6", "7", "8", "9", "10"]);
  });

  it("should extract comma and 'и' separated tasks", () => {
    expect(extractTaskNumbers("задание 8 и 9")).toEqual(["8", "9"]);
    expect(extractTaskNumbers("номера 3, 4, 7")).toEqual(["3", "4", "7"]);
  });

  it("should prioritize photo presence as help request", () => {
    const result = classifyIntent("", true);
    expect(result.isHelpRequest).toBe(true);
    expect(result.isCasualChat).toBe(false);
  });
});
