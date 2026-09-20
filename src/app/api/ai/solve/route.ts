import { NextRequest, NextResponse } from "next/server";
import { solveHomework } from "@/lib/gemini/solver";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { LearningMode } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      prompt,
      images,
      grade,
      mode = "SOLUTION",
      subject,
      language = "ru",
      conversationId,
    } = body;

    const userPrompt = prompt || "Реши задание с изображения и объясни решение.";
    const userGrade = grade ? Number(grade) : user?.grade || 8;

    // Call Gemini Vision / Multimodal
    const { result, tokensInput, tokensOutput, latencyMs, model } =
      await solveHomework({
        userPrompt,
        images,
        grade: userGrade,
        mode: mode as LearningMode,
        subject,
        language,
      });

    // Save conversation and solution in DB if user is authenticated or save as guest
    let activeConversationId = conversationId;
    let solutionId = "temp-" + Date.now();

    try {
      if (!activeConversationId) {
        const conv = await prisma.aIConversation.create({
          data: {
            userId: user?.id || null,
            subject: result.subject,
            grade: userGrade,
            mode,
            title: `${result.subject} · ${result.tasks.map((t) => t.taskNumber).join(", ") || "Задание"}`,
          },
        });
        activeConversationId = conv.id;
      }

      const aiReq = await prisma.aIRequest.create({
        data: {
          conversationId: activeConversationId,
          userId: user?.id || null,
          prompt: userPrompt,
          model,
          tokensInput,
          tokensOutput,
          latencyMs,
          status: "SUCCESS",
        },
      });

      const taskNums = result.tasks.map((t) => t.taskNumber).join(", ") || "1";
      const condition = result.tasks.map((t) => t.conditionText).filter(Boolean).join("\n");
      const steps = result.tasks
        .map((t) => t.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n"))
        .join("\n\n");
      const answers = result.tasks.map((t) => t.finalAnswer).join("; ");

      const sol = await prisma.solution.create({
        data: {
          requestId: aiReq.id,
          conversationId: activeConversationId,
          subject: result.subject,
          grade: userGrade,
          taskNumbers: taskNums,
          conditionText: condition || null,
          stepByStep: steps,
          finalAnswer: answers,
          explanation: result.tasks[0]?.explanation || null,
          mode,
          language: result.language || "ru",
          isVerified: result.verificationResult?.isCorrect,
          verificationFeedback: result.verificationResult?.feedback,
        },
      });

      solutionId = sol.id;
    } catch (dbErr) {
      console.error("Failed to save solution to DB in web solve route:", dbErr);
    }

    return NextResponse.json({
      success: true,
      result,
      solutionId,
      conversationId: activeConversationId,
      latencyMs,
    });
  } catch (err) {
    console.error("AI solve API error:", err);
    return NextResponse.json(
      {
        error:
          "⚠️ Не удалось решить задание. Проверьте фото или повторите попытку через пару секунд.",
      },
      { status: 500 }
    );
  }
}
