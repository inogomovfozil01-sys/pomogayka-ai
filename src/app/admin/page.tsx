"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/providers";
import {
  ShieldAlert,
  Users,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Cpu,
  Layers,
  FileText,
  Radio,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.stats) setStats(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && (!user || !user.isAdmin)) {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Доступ ограничен</h1>
        <p className="text-sm text-muted-foreground">
          Панель управления доступна только авторизованным Telegram-администраторам.
        </p>
        <Link href="/" className="inline-block px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-xs">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Панель управления DFZ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Административный центр Помогайки
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Мониторинг запросов к AI, управление темами Telegram и модерация сообщества.
          </p>
        </div>

        {/* Quick Nav Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/topics"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            Темы и классы
          </Link>
          <Link
            href="/admin/reports"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            Жалобы
          </Link>
          <Link
            href="/admin/ai-logs"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            AI Монитор
          </Link>
          <Link
            href="/admin/rules"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
          >
            Редактор правил
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-muted-foreground text-sm">
          Загрузка статистики платформы...
        </div>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Пользователи</span>
                <Users className="h-4 w-4 text-primary-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats?.stats.users || 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Запросы к AI</span>
                <Sparkles className="h-4 w-4 text-brand-violet" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats?.stats.aiRequests || 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Решено заданий</span>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats?.stats.solutions || 0}
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Открытые жалобы</span>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-foreground">
                {stats?.stats.openReports || 0}
              </div>
            </div>
          </div>

          {/* Cost & AI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                <span>Примерный расход Gemini</span>
              </div>
              <div className="text-xl font-black text-foreground">
                ${stats?.stats.estimatedCostUsd || "0.0000"} USD
              </div>
              <p className="text-[11px] text-muted-foreground">
                Оценка на основе {stats?.stats.totalTokens?.toLocaleString() || 0} токенов
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4 text-primary-500" />
                <span>Средняя задержка (Latency)</span>
              </div>
              <div className="text-xl font-black text-foreground">
                {stats?.stats.avgLatencyMs || 0} мс
              </div>
              <p className="text-[11px] text-muted-foreground">
                Модель: gemini-2.5-flash
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <span>Варны и блокировки</span>
              </div>
              <div className="text-xl font-black text-foreground">
                {stats?.stats.activeWarnings || 0} варнов / {stats?.stats.activeBans || 0} банов
              </div>
              <p className="text-[11px] text-muted-foreground">
                3 активных варна = авто-бан
              </p>
            </div>
          </div>

          {/* Subjects breakdown */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4">
            <h3 className="font-bold text-base text-foreground">
              Распределение решенных заданий по предметам
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {stats?.subjectsBreakdown?.map((s: any) => (
                <div key={s.subject} className="p-3 rounded-2xl bg-secondary/60 text-center space-y-1">
                  <div className="text-lg font-black text-primary-600 dark:text-primary-400">
                    {s.count}
                  </div>
                  <div className="text-xs font-semibold text-foreground truncate">
                    {s.subject}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/admin/topics"
              className="p-6 rounded-3xl bg-card border border-border shadow-soft hover:border-primary-500 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-base text-foreground">
                  <Layers className="h-5 w-5 text-primary-500" />
                  <span>Темы Telegram (Топики классов)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Сопоставление message_thread_id → класс, выбор режима AI и Human-First задержки.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/admin/reports"
              className="p-6 rounded-3xl bg-card border border-border shadow-soft hover:border-primary-500 transition-colors flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-base text-foreground">
                  <Radio className="h-5 w-5 text-rose-500" />
                  <span>Жалобы участников (/report)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Просмотр открытых жалоб, принятие мер, выдача варнов и блокировок.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
