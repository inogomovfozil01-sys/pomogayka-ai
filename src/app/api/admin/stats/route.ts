import { NextResponse } from "next/server";
import { getCurrentUser, isUserAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!isUserAdmin(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [
      usersCount,
      aiRequestsCount,
      solutionsCount,
      reportsCount,
      warningsCount,
      bansCount,
      tokensAgg,
      recentRequests,
      subjectsBreakdown,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.aIRequest.count(),
      prisma.solution.count(),
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.warning.count({ where: { active: true } }),
      prisma.ban.count({ where: { active: true } }),
      prisma.aIRequest.aggregate({
        _sum: {
          tokensInput: true,
          tokensOutput: true,
        },
        _avg: {
          latencyMs: true,
        },
      }),
      prisma.aIRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 7,
        select: {
          id: true,
          createdAt: true,
          model: true,
          latencyMs: true,
          status: true,
        },
      }),
      prisma.solution.groupBy({
        by: ["subject"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 6,
      }),
    ]);

    const totalInput = tokensAgg._sum.tokensInput || 0;
    const totalOutput = tokensAgg._sum.tokensOutput || 0;
    // Gemini 2.5 Flash estimated cost: ~$0.075 per 1M input, ~$0.30 per 1M output
    const estimatedCostUsd =
      (totalInput / 1_000_000) * 0.075 + (totalOutput / 1_000_000) * 0.3;

    return NextResponse.json({
      stats: {
        users: usersCount,
        aiRequests: aiRequestsCount,
        solutions: solutionsCount,
        openReports: reportsCount,
        activeWarnings: warningsCount,
        activeBans: bansCount,
        totalTokens: totalInput + totalOutput,
        avgLatencyMs: Math.round(tokensAgg._avg.latencyMs || 0),
        estimatedCostUsd: Number(estimatedCostUsd.toFixed(4)),
      },
      recentRequests,
      subjectsBreakdown: subjectsBreakdown.map((s) => ({
        subject: s.subject,
        count: s._count.id,
      })),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
