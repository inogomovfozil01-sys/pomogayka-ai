import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const rules = await prisma.rule.findMany({
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ rules });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, category, penalty, order, active } =
    await req.json();

  const created = await prisma.rule.create({
    data: {
      title,
      description,
      category: category || "DISCIPLINE",
      penalty: penalty || "WARN",
      order: order ? Number(order) : 0,
      active: active !== undefined ? Boolean(active) : true,
    },
  });

  return NextResponse.json({ success: true, rule: created });
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id, title, description, category, penalty, order, active } =
    await req.json();

  if (!id) {
    return NextResponse.json({ error: "Missing rule id" }, { status: 400 });
  }

  const updated = await prisma.rule.update({
    where: { id },
    data: {
      title,
      description,
      category,
      penalty,
      order: order !== undefined ? Number(order) : undefined,
      active: active !== undefined ? Boolean(active) : undefined,
    },
  });

  return NextResponse.json({ success: true, rule: updated });
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "Missing rule id" }, { status: 400 });
  }

  await prisma.rule.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
