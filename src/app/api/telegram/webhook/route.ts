import { NextRequest, NextResponse } from "next/server";
import { createBot } from "@/bot/bot";

const bot = createBot();

export async function POST(req: NextRequest) {
  try {
    const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (configuredSecret && secretHeader !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const update = await req.json();

    // Process update asynchronously so webhook responds in milliseconds
    bot.handleUpdate(update).catch((err) => {
      console.error("Error handling Telegram webhook update:", err);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    bot: "Помогайка AI Webhook",
    timestamp: new Date().toISOString(),
  });
}
