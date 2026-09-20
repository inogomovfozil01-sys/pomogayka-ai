import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      telegramId: user.telegramId?.toString(),
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      role: user.role,
      grade: user.grade,
      language: user.language,
      learningMode: user.learningMode,
      isAdmin: isUserAdmin(user),
    },
  });
}
