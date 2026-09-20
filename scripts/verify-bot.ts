import dotenv from "dotenv";
dotenv.config();

import { createBot } from "../src/bot/bot";

async function verify() {
  console.log("Verifying Telegram bot setup...");
  const bot = createBot();
  const me = await bot.api.getMe();
  console.log(`✅ Success! Bot connected: @${me.username} (${me.first_name}, ID: ${me.id})`);
}

verify()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });
