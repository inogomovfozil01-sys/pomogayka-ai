"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Plus, Trash2, Edit2, Check, Save } from "lucide-react";

export default function AdminRulesPage() {
  const [rules, setRules] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  // New rule form modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("DISCIPLINE");
  const [newPenalty, setNewPenalty] = useState("WARN");

  useEffect(() => {
    fetch("/api/admin/rules")
      .then((r) => r.json())
      .then((d) => setRules(d.rules || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddRule = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Заполните заголовок и описание правила");
      return;
    }

    try {
      const res = await fetch("/api/admin/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          penalty: newPenalty,
          order: rules.length + 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRules((prev) => [...prev, data.rule]);
        setShowAddModal(false);
        setNewTitle("");
        setNewDescription("");
      }
    } catch {
      alert("Ошибка при добавлении правила");
    }
  };

  const handleDeleteRule = async (id: string) => {
    if (!confirm("Удалить это правило?")) return;
    try {
      const res = await fetch("/api/admin/rules", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setRules((prev) => prev.filter((r) => r.id !== id));
      }
    } catch {
      alert("Ошибка при удалении");
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Назад в панель</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            <span>Редактор правил сообщества</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Все изменения мгновенно отражаются на сайте и в команде Telegram /rules.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-soft transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Добавить правило</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-muted-foreground text-sm">
          Загрузка правил...
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((r, idx) => (
            <div
              key={r.id}
              className="p-5 rounded-3xl bg-card border border-border shadow-soft flex items-start justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold text-xs">
                    {idx + 1}
                  </span>
                  <h3 className="font-bold text-base text-foreground">{r.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase">
                    {r.penalty}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground pl-8 leading-relaxed">
                  {r.description}
                </p>
              </div>

              <button
                onClick={() => handleDeleteRule(r.id)}
                title="Удалить правило"
                aria-label="Удалить правило"
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-card border border-border shadow-glow space-y-4">
            <h3 className="font-bold text-lg text-foreground">Новое правило</h3>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Название:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Например: Спам и флуд"
                  className="w-full px-3.5 py-2 rounded-xl bg-secondary/80 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-muted-foreground">Описание:</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Подробный текст правила..."
                  className="w-full px-3.5 py-2 rounded-xl bg-secondary/80 border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Категория:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground"
                  >
                    <option value="DISCIPLINE">Дисциплина</option>
                    <option value="SAFETY">Безопасность</option>
                    <option value="ADVERTISING">Реклама</option>
                    <option value="ACADEMIC">Учеба</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-muted-foreground">Наказание:</label>
                  <select
                    value={newPenalty}
                    onChange={(e) => setNewPenalty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-secondary/80 border border-border text-foreground"
                  >
                    <option value="WARN">Предупреждение (WARN)</option>
                    <option value="MUTE">Ограничение чата (MUTE)</option>
                    <option value="BAN">Блокировка (BAN)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground"
              >
                Отмена
              </button>
              <button
                onClick={handleAddRule}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-soft"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
