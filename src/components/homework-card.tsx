"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Copy, Check, ChevronDown, ChevronUp, Sparkles, BookOpen, HelpCircle } from "lucide-react";
import type { SolveHomeworkResult } from "@/lib/types";

interface HomeworkCardProps {
  result: SolveHomeworkResult;
  onFollowUp?: (query: string) => void;
  isLoading?: boolean;
}

export function HomeworkCard({ result, onFollowUp, isLoading }: HomeworkCardProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Record<number, boolean>>({});

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const toggleDetails = (idx: number) => {
    setExpandedDetails((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-card border border-border shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              {result.subject} · {result.grade} класс
            </h3>
            <p className="text-xs text-muted-foreground">
              Язык: {result.language === "uz" ? "O'zbekcha" : result.language === "en" ? "English" : "Русский"}
            </p>
          </div>
        </div>

        {result.isVerification && result.verificationResult && (
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              result.verificationResult.isCorrect
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800"
            }`}
          >
            {result.verificationResult.isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Ответ верный</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Есть ошибка</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Unreadable warning banner if present */}
      {result.unreadableWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <p className="font-semibold mb-1">Не удалось четко распознать изображение</p>
            <p>{result.unreadableWarning}</p>
          </div>
        </div>
      )}

      {/* Verification feedback box */}
      {result.isVerification && result.verificationResult && (
        <div className="p-5 rounded-2xl bg-card border border-border space-y-3 shadow-soft">
          <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span>Результат проверки:</span>
          </h4>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {result.verificationResult.feedback}
          </p>
          {result.verificationResult.mistakeStep && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200">
              <span className="font-semibold">Где ошибка: </span>
              {result.verificationResult.mistakeStep}
            </div>
          )}
          {result.verificationResult.correctedAnswer && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
              <span className="font-semibold">Правильный ответ: </span>
              <code className="font-mono">{result.verificationResult.correctedAnswer}</code>
            </div>
          )}
        </div>
      )}

      {/* Tasks List */}
      {result.tasks.map((task, idx) => {
        const isExpanded = expandedDetails[idx] !== false; // default open
        return (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4 transition-all duration-200"
          >
            {/* Task Title & Copy button */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-white font-bold text-xs">
                  {task.taskNumber || idx + 1}
                </span>
                <span className="font-bold text-base text-foreground">
                  Задание {task.taskNumber ? `№${task.taskNumber}` : idx + 1}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(task.finalAnswer || task.steps.join("\n"), idx)}
                  aria-label="Копировать ответ"
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleDetails(idx)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Condition if present */}
            {task.conditionText && (
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border text-sm text-foreground/90 italic">
                {task.conditionText}
              </div>
            )}

            {/* Step-by-Step Solution */}
            {isExpanded && (
              <div className="space-y-3 pt-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Пошаговое решение:
                </h5>
                <div className="space-y-2.5">
                  {task.steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-3 text-sm">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-semibold text-xs mt-0.5">
                        {sIdx + 1}
                      </span>
                      <div className="flex-1 text-foreground leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Answer Banner */}
            {task.finalAnswer && (
              <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/40 dark:to-indigo-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0" />
                  <span className="font-semibold text-sm text-primary-950 dark:text-primary-200">
                    Ответ:
                  </span>
                </div>
                <code className="text-sm font-bold font-mono text-primary-700 dark:text-primary-300 bg-white/80 dark:bg-card px-2.5 py-1 rounded-lg border border-primary-200/60 dark:border-primary-800">
                  {task.finalAnswer}
                </code>
              </div>
            )}

            {/* Optional Explanation/Hint */}
            {task.explanation && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{task.explanation}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Follow-up Quick Action Chips */}
      {onFollowUp && (
        <div className="p-4 rounded-2xl bg-card border border-border shadow-soft space-y-2.5">
          <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary-500" />
            <span>Быстрые вопросы к этому решению:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "Объясни еще проще",
              "Покажи подробнее каждый шаг",
              "Почему в ответе получилось именно это число?",
              "Дай похожий пример для тренировки",
              "Какой формулой здесь пользовались?",
            ].map((chip) => (
              <button
                key={chip}
                disabled={isLoading}
                onClick={() => onFollowUp(chip)}
                className="text-xs px-3 py-1.5 rounded-xl bg-secondary hover:bg-primary-50 dark:hover:bg-primary-950/60 hover:text-primary-600 dark:hover:text-primary-400 border border-border hover:border-primary-300 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
