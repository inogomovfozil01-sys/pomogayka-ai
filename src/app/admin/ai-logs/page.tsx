"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Sparkles, Clock, Cpu } from "lucide-react";

export default function AdminAiLogsPage() {
  const [logs, setLogs] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ai-logs")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-8">
      <div>
        <Link
          href="/admin"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Назад в панель</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-brand-violet" />
          <span>AI Монитор (Gemini Logs)</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Журнал запросов, моделей, расхода токенов и задержки ответов. Конфиденциальные ключи скрыты.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Загрузка логов...
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-2">
          <p className="text-base font-bold text-foreground">Запросов пока нет</p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-bold text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">Время</th>
                <th className="pb-3 px-3">Предмет / Тема</th>
                <th className="pb-3 px-3">Модель</th>
                <th className="pb-3 px-3">Токены</th>
                <th className="pb-3 px-3">Latency</th>
                <th className="pb-3 px-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 pr-4 text-muted-foreground font-mono text-xs whitespace-nowrap">
                    {formatDateTime(log.createdAt)}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-foreground">
                    {log.conversation?.subject || "Задание"}
                    {log.conversation?.grade ? ` (${log.conversation.grade} кл)` : ""}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-mono text-primary-600 dark:text-primary-400">
                    {log.model}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-mono">
                    <span className="text-muted-foreground">вх: </span>
                    {log.tokensInput}
                    <span className="text-muted-foreground"> / вых: </span>
                    {log.tokensOutput}
                  </td>
                  <td className="py-3.5 px-3 text-xs font-mono">
                    {log.latencyMs} мс
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        log.status === "SUCCESS"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
