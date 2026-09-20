import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    settings: {
      grade: user.grade,
      language: user.language,
      learningMode: user.learningMode,
    },
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { grade, language, learningMode } = await req.json();

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      grade: grade !== undefined ? Number(grade) : undefined,
      language: language || undefined,
      learningMode: learningMode || undefined,
    },
  });

  return NextResponse.json({ success: true, settings: updated });
}

// Data retention / privacy: allow user to delete their conversation history
export async function DELETE() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.aIConversation.deleteMany({
    where: { userId: user.id },
  });

  return NextResponse.json({
    success: true,
    message: "Ваша история запросов и решений полностью удалена.",
  });
}
