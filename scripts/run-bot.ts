import dotenv from "dotenv";
dotenv.config();

import { createBot } from "../src/bot/bot";

async function main() {
  console.log("🤖 Запуск Telegram-бота «Помогайка AI»...");

  const bot = createBot();

  // Fetch bot info
  const me = await bot.api.getMe();
  console.log(`✅ Бот успешно подключен: @${me.username} (ID: ${me.id})`);
  console.log(`📡 Запуск в режиме Long-Polling...`);

  // Start polling
  await bot.start({
    onStart: (botInfo) => {
      console.log(`🚀 Помогайка AI готова к приему сообщений! (@${botInfo.username})`);
    },
  });
}

main().catch((err) => {
  console.error("Критическая ошибка запуска бота:", err);
  process.exit(1);
});
