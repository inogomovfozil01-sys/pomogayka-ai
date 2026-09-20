import { Context } from "grammy";
import { prisma } from "../../lib/prisma";
import { solveHomework } from "../../lib/gemini/solver";
import { escapeTelegramHtml } from "../../lib/utils";

export async function handleCallbackQuery(ctx: Context) {
  const data = ctx.callbackQuery?.data;
  if (!data || !data.startsWith("act:")) return;

  const [, action, solutionId] = data.split(":");
  if (!action || !solutionId) {
    await ctx.answerCallbackQuery({ text: "Некорректный запрос" });
    return;
  }

  await ctx.answerCallbackQuery({ text: "Секундочку, думаю..." });

  const solution = await prisma.solution.findUnique({
    where: { id: solutionId },
    include: { conversation: true },
  });

  if (!solution) {
    await ctx.reply("❌ Решение устарело или не найдено в базе.");
    return;
  }

  const threadId = ctx.callbackQuery?.message?.message_thread_id;

  try {
    if (action === "simpler") {
      const response = await solveHomework({
        userPrompt: `Объясни решение задания №${solution.taskNumbers} еще проще, максимально наглядно для ученика ${solution.grade || 8} класса. Используй жизненные примеры или простые аналогии.`,
        grade: solution.grade || 8,
        mode: "SOLUTION",
        previousContext: `Условие: ${solution.conditionText}\nТекущее решение: ${solution.stepByStep}\nОтвет: ${solution.finalAnswer}`,
      });

      const task = response.result.tasks[0];
      let replyText = `💡 <b>Помогайка AI · Простое объяснение</b>\n\n`;
      replyText += `📚 <b>${escapeTelegramHtml(solution.subject)} · Задание №${escapeTelegramHtml(solution.taskNumbers)}</b>\n\n`;

      if (task?.steps && task.steps.length > 0) {
        task.steps.forEach((s, idx) => {
          replyText += `${idx + 1}. ${escapeTelegramHtml(s)}\n`;
        });
      } else if (response.result.rawText) {
        replyText += escapeTelegramHtml(response.result.rawText);
      }

      replyText += `\n✅ <b>Итог:</b> <code>${escapeTelegramHtml(task?.finalAnswer || solution.finalAnswer)}</code>`;

      await ctx.reply(replyText, {
        parse_mode: "HTML",
        message_thread_id: threadId,
      });
    } else if (action === "details") {
      const response = await solveHomework({
        userPrompt: `Дай максимально подробное решение задания №${solution.taskNumbers}. Распиши каждое промежуточное действие и формулу, чтобы всё было кристально ясно.`,
        grade: solution.grade || 8,
        mode: "SOLUTION",
        previousContext: `Условие: ${solution.conditionText}\nТекущее решение: ${solution.stepByStep}\nОтвет: ${solution.finalAnswer}`,
      });

      const task = response.result.tasks[0];
      let replyText = `📖 <b>Помогайка AI · Подробный разбор</b>\n\n`;
      replyText += `📚 <b>${escapeTelegramHtml(solution.subject)} · Задание №${escapeTelegramHtml(solution.taskNumbers)}</b>\n\n`;

      if (task?.steps) {
        task.steps.forEach((s, idx) => {
          replyText += `${idx + 1}. ${escapeTelegramHtml(s)}\n`;
        });
      }

      if (task?.explanation) {
        replyText += `\n💡 <i>${escapeTelegramHtml(task.explanation)}</i>\n`;
      }

      replyText += `\n✅ <b>Ответ:</b> <code>${escapeTelegramHtml(task?.finalAnswer || solution.finalAnswer)}</code>`;

      await ctx.reply(replyText, {
        parse_mode: "HTML",
        message_thread_id: threadId,
      });
    } else if (action === "hint") {
      const response = await solveHomework({
        userPrompt: `Дай полезную подсказку к заданию №${solution.taskNumbers}. Не говори готовый ответ, а направь ученика: какую формулу применить или с чего начать?`,
        grade: solution.grade || 8,
        mode: "TEACH_ME",
        previousContext: `Условие: ${solution.conditionText}\nТекущее решение: ${solution.stepByStep}\nОтвет: ${solution.finalAnswer}`,
      });

      const task = response.result.tasks[0];
      let hintText = `🧠 <b>Помогайка AI · Подсказка</b>\n\n`;
      hintText += `📚 <b>${escapeTelegramHtml(solution.subject)} · Задание №${escapeTelegramHtml(solution.taskNumbers)}</b>\n\n`;

      if (task?.steps && task.steps.length > 0) {
        hintText += `${escapeTelegramHtml(task.steps.join("\n\n"))}\n\n`;
      }
      if (task?.explanation) {
        hintText += `💡 <i>${escapeTelegramHtml(task.explanation)}</i>\n\n`;
      }

      hintText += `Попробуй сделать этот шаг сам и напиши свой вариант — я проверю! 🚀`;

      await ctx.reply(hintText, {
        parse_mode: "HTML",
        message_thread_id: threadId,
      });
    } else if (action === "ask") {
      await ctx.reply(
        `❓ <b>Хочешь задать вопрос по этому заданию?</b>\n\nПросто ответь (Reply) на сообщение с решением или напиши свой вопрос прямо сюда: <i>«почему здесь такой знак?»</i> или <i>«откуда взялось это число?»</i>. Я всё объясню!`,
        {
          parse_mode: "HTML",
          message_thread_id: threadId,
        }
      );
    } else if (action === "verify") {
      await ctx.reply(
        `🔄 <b>Проверка твоего решения:</b>\n\nНапиши в ответ свой ответ или ход решения (например: <i>«у меня получилось x = 4, правильно?»</i>) — и я детально проверю каждый шаг!`,
        {
          parse_mode: "HTML",
          message_thread_id: threadId,
        }
      );
    }
  } catch (err) {
    console.error("Callback handler error:", err);
    await ctx.reply("⚠️ Не удалось загрузить дополнительную информацию. Попробуйте еще раз.");
  }
}
