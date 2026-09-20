import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramWebAppData, createOrUpdateTelegramUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { initData } = await req.json();

    if (!initData) {
      return NextResponse.json({ error: "Missing initData" }, { status: 400 });
    }

    const verification = verifyTelegramWebAppData(initData);
    if (!verification.isValid || !verification.user) {
      return NextResponse.json(
        { error: "Invalid Telegram WebApp signature" },
        { status: 401 }
      );
    }

    const { user, token } = await createOrUpdateTelegramUser({
      telegramId: verification.user.id,
      username: verification.user.username,
      firstName: verification.user.first_name,
      lastName: verification.user.last_name,
      photoUrl: verification.user.photo_url,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId?.toString(),
        username: user.username,
        firstName: user.firstName,
        role: user.role,
        grade: user.grade,
      },
    });

    res.cookies.set("pomogayka_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return res;
  } catch (err) {
    console.error("Telegram WebApp auth error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
