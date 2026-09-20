import { Context } from "grammy";
import { prisma } from "../../lib/prisma";
import { escapeTelegramHtml } from "../../lib/utils";

/**
 * Checks if the caller has admin permissions in the chat or internal DB
 */
export async function isAdmin(ctx: Context, userId: number): Promise<boolean> {
  // 1. Check environment variable list
  const envAdminIds = (process.env.ADMIN_TELEGRAM_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (envAdminIds.includes(String(userId))) {
    return true;
  }

  // 2. Check internal Admin table
  const dbAdmin = await prisma.admin.findUnique({
    where: { telegramUserId: BigInt(userId) },
  });
  if (dbAdmin) return true;

  // 3. Check Telegram API
  if (ctx.chat) {
    try {
      const member = await ctx.api.getChatMember(ctx.chat.id, userId);
      if (member.status === "creator" || member.status === "administrator") {
        return true;
      }
    } catch {
      // Fall through
    }
  }

  return false;
}

export async function handleRulesCommand(ctx: Context) {
  const rules = await prisma.rule.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  let text = `📜 <b>Правила сообщества «Помогайка DFZ»</b>\n\n`;
  if (rules.length === 0) {
    text += `1. Уважайте друг друга и не оскорбляйте участников.\n`;
    text += `2. Без мата и нецензурных выражений.\n`;
    text += `3. Отправляйте ДЗ в тему своего класса.\n`;
    text += `4. Запрещены спам и реклама.\n`;
    text += `5. 3 предупреждения = автоматический бан.\n`;
  } else {
    rules.forEach((r, i) => {
      text += `<b>${i + 1}. ${escapeTelegramHtml(r.title)}</b>\n`;
      text += `${escapeTelegramHtml(r.description)}\n`;
      text += `<i>Наказание: ${escapeTelegramHtml(r.penalty)}</i>\n\n`;
    });
  }

  text += `🌐 Подробнее на сайте: <a href="https://pomogayka.dfz.team/rules">pomogayka.dfz.team/rules</a>`;

  await ctx.reply(text, {
    parse_mode: "HTML",
    message_thread_id: ctx.message?.message_thread_id,
  });
}

export async function handleMyWarnsCommand(ctx: Context) {
  const userId = ctx.from?.id;
  if (!userId) return;

  const warns = await prisma.warning.findMany({
    where: {
      telegramUserId: BigInt(userId),
      active: true,
    },
    orderBy: { createdAt: "desc" },
  });

  let text = `⚠️ <b>Твои предупреждения в Помогайке:</b>\n\n`;
  if (warns.length === 0) {
    text += `У тебя 0 активных предупреждений. Ты отличный участник! 🎉`;
  } else {
    text += `Активных предупреждений: <b>${warns.length} из 3</b>\n\n`;
    warns.forEach((w, i) => {
      text += `${i + 1}. Причина: <i>${escapeTelegramHtml(w.reason)}</i>\n`;
    });
    if (warns.length >= 2) {
      text += `\n🚨 <i>Внимание: при получении 3-го предупреждения последует автоматический бан!</i>`;
    }
  }

  await ctx.reply(text, {
    parse_mode: "HTML",
    message_thread_id: ctx.message?.message_thread_id,
  });
}

export async function handleReportCommand(ctx: Context) {
  const reporterId = ctx.from?.id;
  if (!reporterId) return;

  const replyTo = ctx.message?.reply_to_message;
  const targetUserId = replyTo?.from?.id;
  const targetMessageId = replyTo?.message_id;

  const text = ctx.message?.text || "";
  const reason = text.replace(/^\/report@?[a-zA-Z0-9_]*\s*/i, "").trim() || "Не указана (жалоба на сообщение)";

  const report = await prisma.report.create({
    data: {
      reporterUserId: BigInt(reporterId),
      targetUserId: targetUserId ? BigInt(targetUserId) : null,
      chatId: ctx.chat ? BigInt(ctx.chat.id) : null,
      messageId: targetMessageId || null,
      reason,
      status: "OPEN",
    },
  });

  await ctx.reply(
    `✅ <b>Жалоба #${report.id.slice(0, 8)} отправлена администрации.</b>\nСпасибо за помощь в поддержании порядка в Помогайке!`,
    {
      parse_mode: "HTML",
      message_thread_id: ctx.message?.message_thread_id,
    }
  );
}

export async function handleWarnCommand(ctx: Context) {
  const actorId = ctx.from?.id;
  if (!actorId) return;

  const authorized = await isAdmin(ctx, actorId);
  if (!authorized) {
    await ctx.reply("❌ У вас нет прав администратора для этой команды.");
    return;
  }

  const replyTo = ctx.message?.reply_to_message;
  let targetUserId = replyTo?.from?.id;

  const text = ctx.message?.text || "";
  const parts = text.split(/\s+/).slice(1);

  let reason = "Нарушение правил сообщества";

  if (!targetUserId && parts.length > 0 && /^[0-9]+$/.test(parts[0])) {
    targetUserId = parseInt(parts[0], 10);
    reason = parts.slice(1).join(" ") || reason;
  } else if (parts.length > 0) {
    reason = parts.join(" ");
  }

  if (!targetUserId) {
    await ctx.reply("❌ Ответьте на сообщение нарушителя командой <code>/warn [причина]</code> или укажите user_id.", {
      parse_mode: "HTML",
    });
    return;
  }

  // Create Warning record
  await prisma.warning.create({
    data: {
      telegramUserId: BigInt(targetUserId),
      issuedBy: BigInt(actorId),
      reason,
      chatId: ctx.chat ? BigInt(ctx.chat.id) : null,
      messageId: replyTo?.message_id || null,
      active: true,
    },
  });

  // Count active warnings
  const activeCount = await prisma.warning.count({
    where: {
      telegramUserId: BigInt(targetUserId),
      active: true,
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: "WARN",
      actorId: BigInt(actorId),
      targetId: BigInt(targetUserId),
      details: { reason, activeCount },
    },
  });

  let messageText = `⚠️ <b>Выдано предупреждение!</b>\nПользователь ID: <code>${targetUserId}</code>\nПричина: <i>${escapeTelegramHtml(
    reason
  )}</i>\nВсего активных предупреждений: <b>${activeCount}/3</b>`;

  // Automatic Ban on 3 warnings
  if (activeCount >= 3) {
    messageText += `\n\n⛔ <b>Достигнут лимит в 3 предупреждения. Автоматический БАН!</b>`;
    if (ctx.chat) {
      try {
        await ctx.api.banChatMember(ctx.chat.id, targetUserId);
        await prisma.ban.create({
          data: {
            telegramUserId: BigInt(targetUserId),
            issuedBy: BigInt(actorId),
            reason: `Автоматический бан за 3 предупреждения (последнее: ${reason})`,
            chatId: BigInt(ctx.chat.id),
            active: true,
          },
        });
      } catch (banErr) {
        console.error("Failed to execute ban in Telegram:", banErr);
      }
    }
  }

  await ctx.reply(messageText, {
    parse_mode: "HTML",
    message_thread_id: ctx.message?.message_thread_id,
  });
}

export async function handleClearWarnsCommand(ctx: Context) {
  const actorId = ctx.from?.id;
  if (!actorId) return;

  const authorized = await isAdmin(ctx, actorId);
  if (!authorized) {
    await ctx.reply("❌ У вас нет прав администратора.");
    return;
  }

  const replyTo = ctx.message?.reply_to_message;
  let targetUserId = replyTo?.from?.id;

  const parts = (ctx.message?.text || "").split(/\s+/).slice(1);
  if (!targetUserId && parts.length > 0 && /^[0-9]+$/.test(parts[0])) {
    targetUserId = parseInt(parts[0], 10);
  }

  if (!targetUserId) {
    await ctx.reply("❌ Ответьте на сообщение пользователя или укажите его user_id.");
    return;
  }

  await prisma.warning.updateMany({
    where: {
      telegramUserId: BigInt(targetUserId),
      active: true,
    },
    data: { active: false },
  });

  await ctx.reply(`✅ Все предупреждения пользователя <code>${targetUserId}</code> успешно очищены.`, {
    parse_mode: "HTML",
    message_thread_id: ctx.message?.message_thread_id,
  });
}

export async function handleBanCommand(ctx: Context) {
  const actorId = ctx.from?.id;
  if (!actorId) return;

  const authorized = await isAdmin(ctx, actorId);
  if (!authorized) {
    await ctx.reply("❌ У вас нет прав администратора.");
    return;
  }

  const replyTo = ctx.message?.reply_to_message;
  let targetUserId = replyTo?.from?.id;
  const parts = (ctx.message?.text || "").split(/\s+/).slice(1);
  let reason = "Бан администратором";

  if (!targetUserId && parts.length > 0 && /^[0-9]+$/.test(parts[0])) {
    targetUserId = parseInt(parts[0], 10);
    reason = parts.slice(1).join(" ") || reason;
  } else if (parts.length > 0) {
    reason = parts.join(" ");
  }

  if (!targetUserId) {
    await ctx.reply("❌ Ответьте на сообщение нарушителя или укажите user_id.");
    return;
  }

  if (ctx.chat) {
    try {
      await ctx.api.banChatMember(ctx.chat.id, targetUserId);
      await prisma.ban.create({
        data: {
          telegramUserId: BigInt(targetUserId),
          issuedBy: BigInt(actorId),
          reason,
          chatId: BigInt(ctx.chat.id),
          active: true,
        },
      });
      await ctx.reply(`⛔ Пользователь <code>${targetUserId}</code> заблокирован.\nПричина: <i>${escapeTelegramHtml(reason)}</i>`, {
        parse_mode: "HTML",
        message_thread_id: ctx.message?.message_thread_id,
      });
    } catch (err) {
      await ctx.reply(`❌ Не удалось заблокировать пользователя: ${(err as Error).message}`);
    }
  }
}

export async function handleUnbanCommand(ctx: Context) {
  const actorId = ctx.from?.id;
  if (!actorId) return;

  const authorized = await isAdmin(ctx, actorId);
  if (!authorized) {
    await ctx.reply("❌ У вас нет прав администратора.");
    return;
  }

  const replyTo = ctx.message?.reply_to_message;
  let targetUserId = replyTo?.from?.id;
  const parts = (ctx.message?.text || "").split(/\s+/).slice(1);

  if (!targetUserId && parts.length > 0 && /^[0-9]+$/.test(parts[0])) {
    targetUserId = parseInt(parts[0], 10);
  }

  if (!targetUserId) {
    await ctx.reply("❌ Укажите user_id для разблокировки.");
    return;
  }

  if (ctx.chat) {
    try {
      await ctx.api.unbanChatMember(ctx.chat.id, targetUserId, { only_if_banned: true });
      await prisma.ban.updateMany({
        where: { telegramUserId: BigInt(targetUserId), active: true },
        data: { active: false },
      });
      await ctx.reply(`✅ Пользователь <code>${targetUserId}</code> разблокирован.`, {
        parse_mode: "HTML",
        message_thread_id: ctx.message?.message_thread_id,
      });
    } catch (err) {
      await ctx.reply(`❌ Не удалось разблокировать: ${(err as Error).message}`);
    }
  }
}
