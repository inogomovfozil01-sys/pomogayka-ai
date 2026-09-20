import { Bot, Context } from "grammy";
import { classifyIntent } from "./intent-router";
import { albumCollector } from "./album-collector";
import { contextManager } from "./context-manager";
import { handleHomeworkRequest } from "./handlers/homework";
import { handleCallbackQuery } from "./handlers/callbacks";
import {
  handleRulesCommand,
  handleMyWarnsCommand,
  handleReportCommand,
  handleWarnCommand,
  handleClearWarnsCommand,
  handleBanCommand,
  handleUnbanCommand,
} from "./handlers/moderation";

export function createBot(token?: string) {
  const botToken = token || process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    throw new Error("TELEGRAM_BOT_TOKEN is not defined in environment");
  }

  const bot = new Bot(botToken, {
    client: {
      fetch: (url: any, init: any) => {
        const { signal, ...rest } = init || {};
        return globalThis.fetch(url, rest);
      },
    },
  });

  // 1. Error boundary
  bot.catch((err) => {
    console.error("Telegram Bot Error:", err);
  });

  // 2. Command handlers
  bot.command("start", async (ctx) => {
    const webAppUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pomogayka.dfz.team";
    const welcome = `👋 <b>Привет! Я Помогайка AI</b> — твой умный помощник по домашним заданиям в DFZ.

📚 <b>Как получить помощь:</b>
1. Просто скинь фото задания в тему своего класса
2. Напиши, например: <i>«помогите 8,9»</i> или <i>«как решить 5?»</i>
3. Я пойму фото, найду номера и объясню решение по шагам!

⚡ <b>Команды:</b>
/rules — Правила нашего сообщества
/mywarns — Твои предупреждения
/report [причина] — Пожаловаться на нарушение
/ask [вопрос] — Задать вопрос по учебе

🌐 Наш сайт и Web App: <a href="${webAppUrl}">${webAppUrl}</a>`;

    await ctx.reply(welcome, {
      parse_mode: "HTML",
      message_thread_id: ctx.message?.message_thread_id,
    });
  });

  bot.command("help", async (ctx) => {
    await ctx.reply(
      `📖 <b>Справка Помогайка AI:</b>\n\n` +
        `• <b>Фото + вопрос:</b> Отправь фото страницы и напиши номера: <i>«помогите 8 и 9»</i>\n` +
        `• <b>Несколько фото:</b> Отправь альбом и напиши <i>«реши 5-10»</i>\n` +
        `• <b>Уточнение:</b> После решения напиши <i>«а 10?»</i> или <i>«почему так?»</i>\n` +
        `• <b>Проверка:</b> Напиши свой ответ: <i>«я получил 427, правильно?»</i>\n\n` +
        `⚙️ <b>Команды модерации:</b> /rules, /report, /mywarns`,
      {
        parse_mode: "HTML",
        message_thread_id: ctx.message?.message_thread_id,
      }
    );
  });

  bot.command("rules", handleRulesCommand);
  bot.command("mywarns", handleMyWarnsCommand);
  bot.command("report", handleReportCommand);

  // Ask command
  bot.command("ask", async (ctx) => {
    const query = ctx.message?.text?.replace(/^\/ask@?[a-zA-Z0-9_]*\s*/i, "").trim();
    if (!query) {
      await ctx.reply("Напиши свой вопрос после команды, например: <code>/ask что такое дискриминант?</code>", {
        parse_mode: "HTML",
      });
      return;
    }

    await handleHomeworkRequest({
      ctx,
      userPrompt: query,
    });
  });

  // Admin moderation commands
  bot.command("warn", handleWarnCommand);
  bot.command("clearwarns", handleClearWarnsCommand);
  bot.command("ban", handleBanCommand);
  bot.command("unban", handleUnbanCommand);

  // 3. Callback Queries (Inline buttons)
  bot.on("callback_query:data", handleCallbackQuery);

  // 4. Main message listener (Photos, Albums, Captions, Text)
  bot.on("message", async (ctx) => {
    const msg = ctx.message;
    const chatId = ctx.chat?.id;
    const userId = ctx.from?.id;
    const threadId = msg.message_thread_id;

    if (!chatId || !userId) return;

    // Check if message is from a bot
    if (ctx.from?.is_bot) return;

    const text = msg.text || msg.caption || "";
    const photos = msg.photo;
    const mediaGroupId = msg.media_group_id;

    // Record incoming message in DB
    const mediaFiles = photos
      ? [{ fileId: photos[photos.length - 1].file_id, fileUniqueId: photos[photos.length - 1].file_unique_id }]
      : undefined;

    await contextManager.recordMessage({
      chatId,
      threadId,
      userId,
      telegramMessageId: msg.message_id,
      text,
      replyToId: msg.reply_to_message?.message_id,
      mediaGroupId,
      isBot: false,
      mediaFiles,
    });

    // Check if album (media_group_id)
    if (mediaGroupId && photos && photos.length > 0) {
      const bestPhoto = photos[photos.length - 1];
      albumCollector.addPhoto({
        mediaGroupId,
        chatId,
        threadId,
        userId,
        photo: {
          fileId: bestPhoto.file_id,
          fileUniqueId: bestPhoto.file_unique_id,
          caption: msg.caption,
          messageId: msg.message_id,
        },
        onComplete: async (album) => {
          const userPrompt = album.firstCaption || "Реши и подробно объясни задания с присланных фотографий.";
          const fileIds = album.photos.map((p) => p.fileId);

          await handleHomeworkRequest({
            ctx,
            userPrompt,
            photoFileIds: fileIds,
          });
        },
      });
      return;
    }

    // Classify intent
    const hasPhoto = Boolean(photos && photos.length > 0);
    const intent = classifyIntent(text, hasPhoto);

    // If it's pure casual chatter ("привет", "лол", "спасибо") -> ignore to save Gemini tokens!
    if (intent.isCasualChat && !hasPhoto) {
      return;
    }

    // Check triggers:
    // 1) Has photo
    // 2) Reply to bot message
    // 3) Mention of bot username
    // 4) Recognized homework help request / continuation / verification
    const botUsername = ctx.me?.username || process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "pomogaykaTeamBot";
    const isBotMentioned = text.toLowerCase().includes(`@${botUsername.toLowerCase()}`);
    const isReplyToBot = msg.reply_to_message?.from?.id === ctx.me?.id;

    const shouldHandle =
      hasPhoto ||
      isBotMentioned ||
      isReplyToBot ||
      intent.isHelpRequest ||
      intent.isContinuation ||
      intent.isVerification;

    if (!shouldHandle) {
      return;
    }

    // Single photo + caption or photo alone
    if (hasPhoto && photos && photos.length > 0) {
      const bestPhoto = photos[photos.length - 1];
      const prompt = text || "Реши и понятно объясни задание с этой фотографии.";
      await handleHomeworkRequest({
        ctx,
        userPrompt: prompt,
        photoFileIds: [bestPhoto.file_id],
        isVerification: intent.isVerification,
      });
      return;
    }

    // Text message (could be "помогите 8,9", "а 10?", "почему в 9?", "проверь ответ...")
    await handleHomeworkRequest({
      ctx,
      userPrompt: text,
      isContinuation: intent.isContinuation,
      isVerification: intent.isVerification,
    });
  });

  return bot;
}
