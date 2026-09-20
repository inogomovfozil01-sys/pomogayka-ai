"use client";

import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/lib/utils";
import { BookOpen, Search, ArrowLeft, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [solutions, setSolutions] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((d) => setSolutions(d.solutions || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = solutions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.subject.toLowerCase().includes(q) ||
      s.taskNumbers.toLowerCase().includes(q) ||
      (s.conditionText && s.conditionText.toLowerCase().includes(q)) ||
      s.finalAnswer.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Назад в кабинет</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            История решенных заданий
          </h1>
          <p className="text-sm text-muted-foreground">
            Все твои обращения к Помогайка AI сохранены здесь.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по предмету или №..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Загрузка истории...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="text-base font-bold text-foreground">Ничего не найдено</p>
          <p className="text-xs text-muted-foreground">
            {search ? "Попробуй изменить поисковый запрос" : "Ты пока не решал заданий с Помогайкой."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-sm">
                      {item.subject[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-foreground">
                        {item.subject} · Задание №{item.taskNumbers}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.grade ? `${item.grade} класс` : "Школа"} • {formatDateTime(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {/* Snippet */}
                {!isExpanded && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
                    <span className="text-muted-foreground truncate max-w-md">
                      Ответ: {item.finalAnswer}
                    </span>
                    <button
                      onClick={() => setExpandedId(item.id)}
                      className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                    >
                      Посмотреть шаги
                    </button>
                  </div>
                )}

                {/* Expanded full steps */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-border text-sm">
                    {item.conditionText && (
                      <div className="p-3 rounded-xl bg-secondary/60 text-xs italic text-foreground/90">
                        {item.conditionText}
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        Шаги решения:
                      </p>
                      <div className="whitespace-pre-wrap leading-relaxed text-foreground/95 bg-background/50 p-4 rounded-2xl border border-border">
                        {item.stepByStep}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary-600" />
                        <span className="font-semibold text-xs text-foreground">Ответ:</span>
                      </div>
                      <code className="font-bold font-mono text-xs text-primary-600 dark:text-primary-400">
                        {item.finalAnswer}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
