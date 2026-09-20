import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const topics = await prisma.telegramTopic.findMany({
    orderBy: [{ grade: "asc" }, { threadId: "asc" }],
    include: { chat: true },
  });

  return NextResponse.json({ topics });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, grade, aiMode, humanFirst, humanFirstDelay, enabled } =
    await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing topic id" }, { status: 400 });
  }

  const updated = await prisma.telegramTopic.update({
    where: { id },
    data: {
      grade: grade !== undefined ? Number(grade) : undefined,
      aiMode: aiMode || undefined,
      humanFirst: humanFirst !== undefined ? Boolean(humanFirst) : undefined,
      humanFirstDelay:
        humanFirstDelay !== undefined ? Number(humanFirstDelay) : undefined,
      enabled: enabled !== undefined ? Boolean(enabled) : undefined,
    },
  });

  return NextResponse.json({ success: true, topic: updated });
}
