"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { ArrowLeft, Radio, Check, X, ShieldAlert } from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((r) => r.json())
      .then((d) => setReports(d.reports || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, resolution: `Решено администратором (${status})` }),
      });
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch {
      alert("Ошибка обновления статуса");
    }
  };

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
          <Radio className="h-6 w-6 text-rose-500" />
          <span>Жалобы участников (/report)</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Обработка жалоб на нарушения правил сообщества, спам и оскорбления.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Загрузка жалоб...
        </div>
      ) : reports.length === 0 ? (
        <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-2">
          <p className="text-base font-bold text-foreground">Открытых жалоб нет 🎉</p>
          <p className="text-xs text-muted-foreground">Все обращения успешно обработаны.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-3xl bg-card border border-border shadow-soft space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                    #{r.id.slice(0, 8)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(r.createdAt)}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    r.status === "OPEN"
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200"
                      : r.status === "RESOLVED"
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Отправитель: </span>
                  <code className="font-mono">{r.reporterUserId}</code>
                </div>
                {r.targetUserId && (
                  <div>
                    <span className="text-muted-foreground">Нарушитель: </span>
                    <code className="font-mono text-rose-600 dark:text-rose-400">
                      {r.targetUserId}
                    </code>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-secondary/60 text-xs text-foreground/90">
                <span className="font-semibold text-foreground">Причина: </span>
                {r.reason}
              </div>

              {/* Actions */}
              {r.status === "OPEN" && (
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleStatusUpdate(r.id, "REJECTED")}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                  >
                    Отклонить
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(r.id, "RESOLVED")}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-soft transition-colors"
                  >
                    Принять меры / Закрыть
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
