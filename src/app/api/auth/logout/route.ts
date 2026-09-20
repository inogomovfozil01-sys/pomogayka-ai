import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pomogayka_session")?.value;

  if (token) {
    try {
      await prisma.siteSession.delete({ where: { token } });
    } catch {}
  }

  const res = NextResponse.json({ success: true });
  res.cookies.delete("pomogayka_session");
  return res;
}
