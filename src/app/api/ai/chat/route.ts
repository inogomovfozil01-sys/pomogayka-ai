import { NextRequest, NextResponse } from "next/server";
import { solveHomework } from "@/lib/gemini/solver";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const { message, conversationId, solutionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Missing message" }, { status: 400 });
    }

    // Load conversation and previous solutions for context
    let previousContext = "";
    let grade = user?.grade || 8;
    let subject = "Домашнее задание";

    if (conversationId) {
      const conv = await prisma.aIConversation.findUnique({
        where: { id: conversationId },
        include: {
          solutions: {
            orderBy: { createdAt: "desc" },
            take: 2,
          },
        },
      });

      if (conv) {
        if (conv.grade) grade = conv.grade;
        if (conv.subject) subject = conv.subject;

        const latestSol = conv.solutions[0];
        if (latestSol) {
          previousContext = `Предмет: ${latestSol.subject}\nЗадание: №${latestSol.taskNumbers}\nУсловие: ${latestSol.conditionText || ""}\nРешение: ${latestSol.stepByStep}\nОтвет: ${latestSol.finalAnswer}`;
        }
      }
    } else if (solutionId) {
      const sol = await prisma.solution.findUnique({
        where: { id: solutionId },
      });
      if (sol) {
        if (sol.grade) grade = sol.grade;
        if (sol.subject) subject = sol.subject;
        previousContext = `Предмет: ${sol.subject}\nЗадание: №${sol.taskNumbers}\nУсловие: ${sol.conditionText || ""}\nРешение: ${sol.stepByStep}\nОтвет: ${sol.finalAnswer}`;
      }
    }

    const { result, latencyMs } = await solveHomework({
      userPrompt: message,
      previousContext: previousContext || undefined,
      grade,
      subject,
      mode: "SOLUTION",
    });

    return NextResponse.json({
      success: true,
      result,
      latencyMs,
    });
  } catch (err) {
    console.error("AI chat API error:", err);
    return NextResponse.json(
      { error: "Произошла ошибка при обработке ответа." },
      { status: 500 }
    );
  }
}
