"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import {
  Sparkles,
  BookOpen,
  Clock,
  ChevronRight,
  TrendingUp,
  Smile,
  ArrowUpRight,
  History,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => setHistory(data.solutions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalSolved = history.length;
  const subjectsMap: Record<string, number> = {};
  history.forEach((h) => {
    subjectsMap[h.subject] = (subjectsMap[h.subject] || 0) + 1;
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-brand-violet text-white shadow-glow space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
              <Smile className="h-4 w-4" />
              <span>Твой образовательный трекер</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Привет, {user?.firstName || user?.username || "Ученик"}! 👋
            </h1>
            <p className="text-primary-100 text-sm max-w-xl">
              Помогайка помогает тебе учиться с удовольствием. Никаких оценок или стресса — только понятные решения и поддержка.
            </p>
          </div>

          <Link
            href="/ai"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary-900 font-bold text-sm shadow-md hover:bg-primary-50 transition-colors shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Решить задание</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{totalSolved}</div>
            <div className="text-xs text-muted-foreground font-medium">Решено заданий</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {Object.keys(subjectsMap).length}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Предметов изучено</div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border shadow-soft flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">
              {user?.grade ? `${user.grade} класс` : "Школа"}
            </div>
            <div className="text-xs text-muted-foreground font-medium">Текущий уровень</div>
          </div>
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg sm:text-xl text-foreground flex items-center gap-2">
            <History className="h-5 w-5 text-primary-500" />
            <span>Последние решенные задания</span>
          </h2>
          <Link
            href="/history"
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
          >
            <span>Вся история</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            Загрузка истории...
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3">
            <p className="text-sm text-muted-foreground">Ты пока не решал заданий.</p>
            <Link
              href="/ai"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Попробовать первое решение</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-card border border-border shadow-soft space-y-2.5 hover:border-primary-300 dark:hover:border-primary-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">{item.subject}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    №{item.taskNumbers}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {item.conditionText || item.finalAnswer}
                </p>
                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {item.grade ? `${item.grade} класс` : "Решено"}
                  </span>
                  <Link
                    href="/history"
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                  >
                    <span>Подробнее</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
