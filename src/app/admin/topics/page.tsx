"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, Save, Check, ShieldAlert } from "lucide-react";

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/topics")
      .then((r) => r.json())
      .then((d) => setTopics(d.topics || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (topic: any) => {
    setSavingId(topic.id);
    try {
      const res = await fetch("/api/admin/topics", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: topic.id,
          grade: topic.grade,
          aiMode: topic.aiMode,
          humanFirst: topic.humanFirst,
          humanFirstDelay: topic.humanFirstDelay,
          enabled: topic.enabled,
        }),
      });
      if (res.ok) {
        setSavedId(topic.id);
        setTimeout(() => setSavedId(null), 2000);
      }
    } catch {
      alert("Ошибка при сохранении");
    } finally {
      setSavingId(null);
    }
  };

  const updateField = (id: string, field: string, val: any) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: val } : t))
    );
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
          <Layers className="h-6 w-6 text-primary-500" />
          <span>Управление темами Telegram (Topics)</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Сопоставление message_thread_id с классом ученика, настройка режимов работы AI и Human-First задержки.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Загрузка топиков...
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground font-bold text-xs uppercase tracking-wider">
                <th className="pb-3 pr-4">Тема / Класс</th>
                <th className="pb-3 px-3">Thread ID</th>
                <th className="pb-3 px-3">Класс (USER_GRADE)</th>
                <th className="pb-3 px-3">Режим AI</th>
                <th className="pb-3 px-3">Human-First</th>
                <th className="pb-3 px-3">Задержка</th>
                <th className="pb-3 pl-3 text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {topics.map((t) => (
                <tr key={t.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="py-3.5 pr-4 font-bold text-foreground">
                    {t.name}
                  </td>

                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={t.threadId}
                      onChange={(e) => updateField(t.id, "threadId", Number(e.target.value))}
                      className="w-24 px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs font-mono"
                    />
                  </td>

                  <td className="py-3.5 px-3">
                    <select
                      value={t.grade || ""}
                      onChange={(e) => updateField(t.id, "grade", Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                        <option key={g} value={g}>
                          {g} класс
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="py-3.5 px-3">
                    <select
                      value={t.aiMode}
                      onChange={(e) => updateField(t.id, "aiMode", e.target.value)}
                      className="px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs font-semibold"
                    >
                      <option value="PHOTOS_AND_HELP">PHOTOS_AND_HELP</option>
                      <option value="HELP_REQUESTS">HELP_REQUESTS</option>
                      <option value="MENTION_ONLY">MENTION_ONLY</option>
                      <option value="ALWAYS_ASSIST">ALWAYS_ASSIST</option>
                      <option value="OFF">OFF (Отключен)</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={t.humanFirst}
                        onChange={(e) => updateField(t.id, "humanFirst", e.target.checked)}
                        className="rounded text-primary-600 h-4 w-4"
                      />
                      <span className="text-xs">Вкл</span>
                    </label>
                  </td>

                  <td className="py-3.5 px-3">
                    <select
                      value={t.humanFirstDelay}
                      onChange={(e) => updateField(t.id, "humanFirstDelay", Number(e.target.value))}
                      className="px-2 py-1 rounded-lg bg-secondary/80 border border-border text-xs"
                    >
                      <option value={0}>Без задержки</option>
                      <option value={30}>30 сек</option>
                      <option value={60}>1 мин</option>
                      <option value={120}>2 мин</option>
                      <option value={300}>5 мин</option>
                    </select>
                  </td>

                  <td className="py-3.5 pl-3 text-right">
                    <button
                      onClick={() => handleUpdate(t)}
                      disabled={savingId === t.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-soft transition-colors inline-flex items-center gap-1"
                    >
                      {savedId === t.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-300" />
                          <span>ОК</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-3 w-3" />
                          <span>{savingId === t.id ? "..." : "Сохранить"}</span>
                        </>
                      )}
                    </button>
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
