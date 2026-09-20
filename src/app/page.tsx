"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Camera,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Users,
  MessageSquare,
  ChevronRight,
  Clock,
  Brain,
  Award,
} from "lucide-react";

export default function HomePage() {
  const [demoActive, setDemoActive] = useState(false);
  const [demoStep, setDemoStep] = useState<"idle" | "analyzing" | "solved">("idle");

  const runDemo = () => {
    setDemoActive(true);
    setDemoStep("analyzing");
    setTimeout(() => {
      setDemoStep("solved");
    }, 1200);
  };

  const subjects = [
    { name: "Математика", icon: "📐", grades: "1–6 классы", color: "from-blue-500/20 to-indigo-500/20" },
    { name: "Алгебра", icon: "📊", grades: "7–11 классы", color: "from-indigo-500/20 to-purple-500/20" },
    { name: "Геометрия", icon: "📏", grades: "7–11 классы", color: "from-purple-500/20 to-pink-500/20" },
    { name: "Физика", icon: "⚡", grades: "7–11 классы", color: "from-amber-500/20 to-orange-500/20" },
    { name: "Химия", icon: "🧪", grades: "8–11 классы", color: "from-emerald-500/20 to-teal-500/20" },
    { name: "Русский язык", icon: "📖", grades: "1–11 классы", color: "from-rose-500/20 to-red-500/20" },
    { name: "English", icon: "🇬🇧", grades: "1–11 классы", color: "from-sky-500/20 to-blue-500/20" },
    { name: "Информатика", icon: "💻", grades: "5–11 классы", color: "from-cyan-500/20 to-blue-500/20" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-grid-pattern">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/15 dark:bg-primary-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-brand-violet/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-semibold text-primary-700 dark:text-primary-300 shadow-sm animate-float">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              <span>Помогайка DFZ 2.0 · Новое поколение с Gemini Vision</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Домашка стала проще.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Отправь фотографию задания — получи понятное и подробное объяснение от сообщества и умного{" "}
              <span className="font-semibold text-foreground">Помогайка AI</span>. Без стресса, строго на уровне твоего класса.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
              <Link
                href="/ai"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-glow hover:shadow-glow-lg transition-all duration-200 active:scale-95"
              >
                <Sparkles className="h-5 w-5" />
                <span>Попробовать AI онлайн</span>
              </Link>
              <a
                href="https://t.me/pomogaykaTeam"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold bg-card hover:bg-secondary border border-border text-foreground transition-all duration-200"
              >
                <MessageSquare className="h-5 w-5 text-primary-500" />
                <span>Открыть Telegram-чат</span>
              </a>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>1–11 классы</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Распознавание рукописного текста</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% бесплатно</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Demo */}
          <div className="mt-14 max-w-3xl mx-auto">
            <div className="rounded-3xl border border-border/70 bg-card/90 backdrop-blur-xl shadow-glow overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border/70 bg-muted/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-medium text-muted-foreground">
                    Интерактивное демо: Помогайка AI в действии
                  </span>
                </div>
                <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950 px-2.5 py-0.5 rounded-md">
                  4 класс · Математика
                </span>
              </div>

              <div className="p-6 space-y-6">
                {/* Simulated User Message */}
                <div className="flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                    У
                  </div>
                  <div className="space-y-2 max-w-lg">
                    <div className="p-3.5 rounded-2xl rounded-tl-sm bg-secondary/80 border border-border text-sm">
                      <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground">
                        <Camera className="h-4 w-4 text-primary-500" />
                        <span>Страница учебника: Урок 12</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-background/90 border border-border font-mono text-xs text-foreground/80">
                        8. Найдите разность: 472 − 45 = ?<br />
                        9. Решите задачу: В 4 одинаковых коробках 36 карандашей. Сколько карандашей в 7 таких коробках?
                      </div>
                      <p className="mt-2 text-foreground font-medium">«помогите пожалуйста 8 и 9»</p>
                    </div>
                  </div>
                </div>

                {/* AI Response or Action Button */}
                {demoStep === "idle" && (
                  <div className="flex justify-center py-4">
                    <button
                      onClick={runDemo}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-glow active:scale-95 transition-transform"
                    >
                      <Zap className="h-4 w-4" />
                      <span>Нажми, чтобы AI решил задание</span>
                    </button>
                  </div>
                )}

                {demoStep === "analyzing" && (
                  <div className="p-6 rounded-2xl bg-secondary/40 border border-border text-center space-y-3">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    <p className="text-sm font-semibold text-foreground">
                      Gemini Vision сканирует условие и формулы...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Определен уровень: 4 класс. Подбор объяснения по действиям.
                    </p>
                  </div>
                )}

                {demoStep === "solved" && (
                  <div className="flex items-start gap-3.5 animate-fadeIn">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-600 to-brand-violet text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-soft">
                      🤖
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="p-4 rounded-2xl rounded-tl-sm bg-card border border-border shadow-soft space-y-3 text-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <span>🤖 Помогайка AI</span>
                            <span className="text-xs font-normal text-muted-foreground">· Математика 4 класс</span>
                          </span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                            Решено мгновенно
                          </span>
                        </div>

                        {/* Task 8 */}
                        <div className="space-y-1">
                          <p className="font-bold text-foreground">8️⃣ Задание: 472 − 45</p>
                          <p className="text-muted-foreground text-xs">
                            1. Вычитаем сначала круглые десятки: 472 − 40 = 432<br />
                            2. Затем вычитаем оставшиеся единицы: 432 − 5 = 427
                          </p>
                          <p className="font-semibold text-primary-600 dark:text-primary-400 text-xs">
                            ✅ Ответ: 427
                          </p>
                        </div>

                        <div className="border-t border-border pt-2 space-y-1">
                          <p className="font-bold text-foreground">9️⃣ Задание (Задача с карандашами)</p>
                          <p className="text-muted-foreground text-xs">
                            1. Сколько карандашей в 1 коробке: 36 : 4 = 9 (кар.)<br />
                            2. Сколько карандашей в 7 таких коробках: 9 · 7 = 63 (кар.)
                          </p>
                          <p className="font-semibold text-primary-600 dark:text-primary-400 text-xs">
                            ✅ Ответ: 63 карандаша
                          </p>
                        </div>
                      </div>

                      {/* Interactive demo buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border">
                          💡 Объяснить проще
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border">
                          📖 Подробнее
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-secondary text-muted-foreground border border-border">
                          🧠 Дай подсказку
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Pomogayka / Features Section */}
      <section className="py-16 md:py-24 bg-card/40 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Почему школьники выбирают Помогайку
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Мы создали не просто очередного бота, а надежную образовательную среду, которая учит понимать предмет, а не просто списывать.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Строго по программе твоего класса</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Если ты в 4 классе — объяснение будет по действиям без непонятных X. Если в 9 классе — с формулами сокращенного умножения и теоремами.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Понимает реальные фото тетрадей</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Google Gemini Vision разбирает формулы, дроби, геометрию, почерк, доски и страницы из учебников даже при слабом освещении.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-foreground">Живое сообщество + AI</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                В группе «Помогайка DFZ» участники помогают друг другу. Если ответа долго нет — AI аккуратно подхватывает и объясняет задание.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Catalog Overview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Поддерживаемые школьные предметы
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                AI автоматически распознает предмет и адаптирует терминологию.
              </p>
            </div>
            <Link
              href="/subjects"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              <span>Смотреть все предметы</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {subjects.map((sub) => (
              <div
                key={sub.name}
                className="p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-primary-300 dark:hover:border-primary-800 transition-all duration-150 group shadow-soft"
              >
                <span className="text-2xl mb-2 block">{sub.icon}</span>
                <h4 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {sub.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">{sub.grades}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Callout */}
      <section className="py-16 bg-gradient-to-r from-primary-600 via-indigo-600 to-brand-violet text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Присоединяйся к Помогайке DFZ
          </h2>
          <p className="text-primary-100 text-base sm:text-lg leading-relaxed">
            Тысячи школьников решают домашки, готовятся к контрольным и находят новых друзей в наших Telegram-темах.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://t.me/pomogaykaTeam"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-3.5 rounded-2xl bg-white text-primary-900 font-bold hover:bg-primary-50 transition-colors shadow-lg"
            >
              Вступить в Telegram-сообщество
            </a>
            <Link
              href="/ai"
              className="px-8 py-3.5 rounded-2xl bg-primary-700/60 hover:bg-primary-700 text-white font-bold border border-white/20 transition-colors"
            >
              Решать в веб-приложении
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
