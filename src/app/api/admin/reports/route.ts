import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({
    reports: reports.map((r) => ({
      ...r,
      reporterUserId: r.reporterUserId.toString(),
      targetUserId: r.targetUserId?.toString() || null,
      chatId: r.chatId?.toString() || null,
      handledBy: r.handledBy?.toString() || null,
    })),
  });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, status, resolution } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const updated = await prisma.report.update({
    where: { id },
    data: {
      status,
      resolution,
      handledBy: user?.telegramId || null,
    },
  });

  return NextResponse.json({ success: true, report: updated });
}
