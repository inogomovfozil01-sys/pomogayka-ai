import { InlineKeyboard } from "grammy";
import { escapeTelegramHtml } from "../../lib/utils";
import type { SolveHomeworkResult } from "../../lib/types";

export function formatSolutionMessage(
  result: SolveHomeworkResult,
  solutionId: string
): {
  text: string;
  keyboard: InlineKeyboard;
} {
  // If unreadable warning
  if (result.unreadableWarning) {
    const warningText = `⚠️ <b>Помогайка AI</b>\n\n${escapeTelegramHtml(
      result.unreadableWarning
    )}\n\n💡 <i>Совет: сделай фото при хорошем освещении и сфокусируйся на номере задания.</i>`;
    return {
      text: warningText,
      keyboard: new InlineKeyboard().text("🔄 Попробовать снова", `act:verify:${solutionId}`),
    };
  }

  // Verification result format
  if (result.isVerification && result.verificationResult) {
    const v = result.verificationResult;
    let verifyText = `🤖 <b>Помогайка AI · Проверка ответа</b>\n\n`;
    verifyText += `📚 <b>${escapeTelegramHtml(result.subject)} · ${result.grade} класс</b>\n\n`;

    if (v.isCorrect) {
      verifyText += `✅ <b>Да, всё верно! Молодчина!</b>\n\n`;
      if (v.feedback) {
        verifyText += `<blockquote>${escapeTelegramHtml(v.feedback)}</blockquote>\n\n`;
      }
    } else {
      verifyText += `❌ <b>Здесь небольшая ошибка</b>\n\n`;
      if (v.mistakeStep) {
        verifyText += `<b>Где ошибка:</b> ${escapeTelegramHtml(v.mistakeStep)}\n\n`;
      }
      if (v.feedback) {
        verifyText += `<blockquote>${escapeTelegramHtml(v.feedback)}</blockquote>\n\n`;
      }
      if (v.correctedAnswer) {
        verifyText += `✅ <b>Правильный ответ:</b> <code>${escapeTelegramHtml(v.correctedAnswer)}</code>\n\n`;
      }
    }

    const keyboard = new InlineKeyboard()
      .text("💡 Объяснить подробнее", `act:details:${solutionId}`)
      .text("🔄 Проверить другой", `act:verify:${solutionId}`);

    return { text: verifyText, keyboard };
  }

  // Standard homework solution format
  let text = `🤖 <b>Помогайка AI</b>\n`;
  text += `📚 <b>${escapeTelegramHtml(result.subject)} · ${result.grade} класс</b>\n\n`;

  if (result.tasks.length === 0) {
    text += `Не удалось найти номера заданий на фотографии. Уточни, пожалуйста, какой номер нужно решить (например: <i>«помогите 8»</i>).`;
  } else {
    for (let i = 0; i < result.tasks.length; i++) {
      const task = result.tasks[i];
      const taskTitle = task.taskNumber ? `Задание №${task.taskNumber}` : `Задание ${i + 1}`;

      text += `<b>${escapeTelegramHtml(taskTitle)}</b>\n`;

      if (task.conditionText) {
        text += `<blockquote>${escapeTelegramHtml(task.conditionText)}</blockquote>\n`;
      }

      text += `\n<b>Решение:</b>\n`;
      if (task.steps && task.steps.length > 0) {
        task.steps.forEach((step, idx) => {
          text += `${idx + 1}. ${escapeTelegramHtml(step)}\n`;
        });
      }

      if (task.finalAnswer) {
        text += `\n✅ <b>Ответ:</b> <code>${escapeTelegramHtml(task.finalAnswer)}</code>\n`;
      }

      if (task.explanation) {
        text += `\n💡 <i>${escapeTelegramHtml(task.explanation)}</i>\n`;
      }

      if (i < result.tasks.length - 1) {
        text += `\n─────────────────────\n\n`;
      }
    }
  }

  const keyboard = new InlineKeyboard()
    .text("💡 Проще", `act:simpler:${solutionId}`)
    .text("📖 Подробнее", `act:details:${solutionId}`)
    .row()
    .text("🧠 Дай подсказку", `act:hint:${solutionId}`)
    .text("❓ Вопрос", `act:ask:${solutionId}`)
    .row()
    .text("🔄 Проверить ещё раз", `act:verify:${solutionId}`);

  return { text, keyboard };
}
