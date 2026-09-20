import { NextRequest, NextResponse } from "next/server";
import { verifyTelegramLoginWidget, createOrUpdateTelegramUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const isValid = verifyTelegramLoginWidget(data);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Telegram authentication data" },
        { status: 400 }
      );
    }

    const { user, token } = await createOrUpdateTelegramUser({
      telegramId: Number(data.id),
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      photoUrl: data.photo_url,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        telegramId: user.telegramId?.toString(),
        username: user.username,
        firstName: user.firstName,
        role: user.role,
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
    console.error("Telegram Login Widget auth error:", err);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
