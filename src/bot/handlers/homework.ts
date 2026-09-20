import { Context } from "grammy";
import { contextManager } from "../context-manager";
import { solveHomework } from "../../lib/gemini/solver";
import { formatSolutionMessage } from "../formatters/telegram-formatter";
import { prisma } from "../../lib/prisma";
import type { GeminiImageInput } from "../../lib/gemini/client";

/**
 * Downloads a Telegram photo file as base64 string
 */
export async function downloadTelegramFileAsBase64(
  ctx: Context,
  fileId: string
): Promise<GeminiImageInput | null> {
  try {
    const file = await ctx.api.getFile(fileId);
    if (!file.file_path) return null;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const url = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

    const res = await fetch(url);
    if (!res.ok) return null;

    const arrayBuffer = await res.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    let mimeType = "image/jpeg";
    if (file.file_path.endsWith(".png")) mimeType = "image/png";
    if (file.file_path.endsWith(".webp")) mimeType = "image/webp";

    return {
      mimeType,
      base64Data,
    };
  } catch (err) {
    console.error("Failed to download Telegram file:", err);
    return null;
  }
}

export async function handleHomeworkRequest(params: {
  ctx: Context;
  userPrompt: string;
  photoFileIds?: string[];
  isContinuation?: boolean;
  isVerification?: boolean;
}) {
  const { ctx, userPrompt, photoFileIds, isContinuation, isVerification } = params;
  const chatId = ctx.chat?.id;
  const userId = ctx.from?.id;
  const threadId = ctx.message?.message_thread_id;
  const messageId = ctx.message?.message_id;

  if (!chatId || !userId) return;

  // 1. Resolve context (topic grade, previous photos, prior solution)
  const resolved = await contextManager.resolveContext({
    chatId,
    threadId,
    userId,
    replyToMessageId: ctx.message?.reply_to_message?.message_id,
  });

  // Check if AI is disabled in this topic
  if (resolved.topicConfig?.aiMode === "OFF") {
    return;
  }

  // Check Human-First Mode
  if (resolved.topicConfig?.humanFirst && resolved.topicConfig.humanFirstDelay > 0) {
    // In human-first mode, let's wait the delay seconds before responding
    // Send a typing action first
    try {
      await ctx.replyWithChatAction("typing");
    } catch {}

    const delayMs = Math.min(resolved.topicConfig.humanFirstDelay, 300) * 1000;
    await new Promise((resolve) => setTimeout(resolve, delayMs));

    // Check if another message from another human arrived in this thread
    const newHumanMsg = await prisma.message.findFirst({
      where: {
        chat: { telegramChatId: BigInt(chatId) },
        threadId: threadId || null,
        isBot: false,
        user: { telegramId: { not: BigInt(userId) } },
        createdAt: { gte: new Date(Date.now() - delayMs) },
      },
    });

    if (newHumanMsg) {
      // Human helper answered! AI stands down gracefully.
      return;
    }
  }

  // 2. Determine which photo file IDs to use
  let activeFileIds: string[] = [];
  if (photoFileIds && photoFileIds.length > 0) {
    activeFileIds = photoFileIds;
  } else if (resolved.lastPhotoFileIds.length > 0) {
    // Automatically link to last photo sent by this user in this topic!
    activeFileIds = resolved.lastPhotoFileIds;
  }

  // 3. Download images if any
  const images: GeminiImageInput[] = [];
  for (const fId of activeFileIds.slice(0, 4)) {
    const downloaded = await downloadTelegramFileAsBase64(ctx, fId);
    if (downloaded) images.push(downloaded);
  }

  // Show typing state in chat
  try {
    await ctx.replyWithChatAction("typing");
  } catch {}

  // 4. Build context
  let previousContextStr = "";
  if (resolved.previousConversation) {
    const prev = resolved.previousConversation;
    previousContextStr = `Предмет: ${prev.subject || "Не указан"}\nПредыдущее задание: №${prev.lastTaskNumbers || "1"}\nРешение: ${prev.lastSteps || ""}\nОтвет: ${prev.lastAnswer || ""}`;
  }

  // 5. Call Gemini AI Engine
  let aiOutput;
  try {
    aiOutput = await solveHomework({
      userPrompt,
      images: images.length > 0 ? images : undefined,
      grade: resolved.grade,
      mode: isVerification ? "VERIFY" : "SOLUTION",
      previousContext: previousContextStr || undefined,
    });
  } catch (err) {
    console.error("Gemini solving error:", err);
    await ctx.reply(
      "⚠️ <b>Сейчас не получилось обработать задание.</b>\nПопробуй ещё раз через несколько секунд или пришли фото заново.",
      {
        parse_mode: "HTML",
        reply_parameters: messageId ? { message_id: messageId } : undefined,
      }
    );
    return;
  }

  const { result, tokensInput, tokensOutput, latencyMs, model } = aiOutput;

  // 6. Save records to database
  try {
    const user = await prisma.user.findUnique({
      where: { telegramId: BigInt(userId) },
    });

    const conversation = await prisma.aIConversation.create({
      data: {
        userId: user?.id,
        chatId: String(chatId),
        threadId: threadId || null,
        subject: result.subject,
        grade: result.grade || resolved.grade,
        mode: isVerification ? "VERIFY" : "SOLUTION",
        title: `${result.subject} · ${result.tasks.map((t) => t.taskNumber).join(", ")}`,
      },
    });

    const aiReq = await prisma.aIRequest.create({
      data: {
        conversationId: conversation.id,
        userId: user?.id,
        prompt: userPrompt,
        model,
        tokensInput,
        tokensOutput,
        latencyMs,
        status: "SUCCESS",
      },
    });

    const taskNums = result.tasks.map((t) => t.taskNumber).join(", ") || "1";
    const condition = result.tasks.map((t) => t.conditionText).filter(Boolean).join("\n");
    const steps = result.tasks
      .map((t) => t.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n"))
      .join("\n\n");
    const answers = result.tasks.map((t) => t.finalAnswer).join("; ");

    const solution = await prisma.solution.create({
      data: {
        requestId: aiReq.id,
        conversationId: conversation.id,
        subject: result.subject,
        grade: result.grade || resolved.grade,
        taskNumbers: taskNums,
        conditionText: condition || null,
        stepByStep: steps,
        finalAnswer: answers,
        explanation: result.tasks[0]?.explanation || null,
        mode: isVerification ? "VERIFY" : "SOLUTION",
        language: result.language || "ru",
        isVerified: result.verificationResult?.isCorrect,
        verificationFeedback: result.verificationResult?.feedback,
      },
    });

    // 7. Format and send response
    const { text, keyboard } = formatSolutionMessage(result, solution.id);

    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
      reply_parameters: messageId ? { message_id: messageId } : undefined,
    });
  } catch (dbErr) {
    console.error("Error saving solution to DB:", dbErr);
    // Still send response to user even if DB log had an issue
    const { text, keyboard } = formatSolutionMessage(result, "temp");
    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
      reply_parameters: messageId ? { message_id: messageId } : undefined,
    });
  }
}
