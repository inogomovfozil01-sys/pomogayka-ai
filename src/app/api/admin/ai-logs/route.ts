import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const logs = await prisma.aIRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      prompt: true,
      model: true,
      tokensInput: true,
      tokensOutput: true,
      latencyMs: true,
      status: true,
      error: true,
      user: {
        select: {
          username: true,
          firstName: true,
          telegramId: true,
        },
      },
      conversation: {
        select: {
          subject: true,
          grade: true,
          threadId: true,
        },
      },
    },
  });

  return NextResponse.json({
    logs: logs.map((l) => ({
      ...l,
      user: l.user
        ? {
            ...l.user,
            telegramId: l.user.telegramId?.toString() || null,
          }
        : null,
    })),
  });
}
