"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/providers";
import { Settings, Shield, Trash2, Save, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user } = useAuth();
  const [grade, setGrade] = useState<number>(user?.grade || 8);
  const [language, setLanguage] = useState<string>("ru");
  const [learningMode, setLearningMode] = useState<string>("SOLUTION");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/user/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          if (data.settings.grade) setGrade(data.settings.grade);
          if (data.settings.language) setLanguage(data.settings.language);
          if (data.settings.learningMode) setLearningMode(data.settings.learningMode);
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, language, learningMode }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      alert("Не удалось сохранить настройки");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHistory = async () => {
    if (!confirm("Вы уверены, что хотите удалить всю историю запросов и решений? Это действие необратимо.")) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/user/settings", { method: "DELETE" });
      if (res.ok) {
        alert("История успешно удалена!");
      }
    } catch {
      alert("Ошибка при удалении истории");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Назад в кабинет</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary-500" />
          <span>Настройки профиля</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Управляй параметрами объяснения заданий и приватностью своих данных.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-6">
        <h2 className="font-bold text-base text-foreground pb-2 border-b border-border">
          Параметры обучения
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Твой класс обучения
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/80 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g}>
                  {g} класс
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Основной язык ответов
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/80 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="ru">Русский</option>
              <option value="uz">O&apos;zbek tili</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Предпочитаемый режим объяснения
          </label>
          <select
            value={learningMode}
            onChange={(e) => setLearningMode(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/80 border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="SOLUTION">📖 Подробное пошаговое решение</option>
            <option value="ONLY_ANSWER">⚡ Только краткий ответ с проверкой</option>
            <option value="TEACH_ME">🧠 «Научи меня» (подсказки без спойлера ответа)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-soft transition-all"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Сохранено!</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Сохранить настройки</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Privacy & Data Deletion */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Shield className="h-5 w-5 text-emerald-500" />
          <span>Конфиденциальность и данные</span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          В соответствии с политикой защиты данных вы можете удалить все сохраненные фотографии, запросы и историю решений с серверов Помогайки.
        </p>

        <div className="pt-2">
          <button
            onClick={handleDeleteHistory}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>{deleting ? "Удаление..." : "Очистить мою историю решений"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
