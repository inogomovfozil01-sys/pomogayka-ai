import React from "react";
import Link from "next/link";
import { Sparkles, BookOpen, CheckCircle, ArrowRight } from "lucide-react";

export default function SubjectsPage() {
  const subjects = [
    {
      name: "Математика",
      icon: "📐",
      grades: "1–6 классы",
      description: "Арифметика, дроби обыкновенные и десятичные, проценты, пропорции, базовые уравнения.",
      topics: ["Сложение и вычитание столбиком", "Таблица умножения и деление", "Дроби и проценты", "Уравнения и текстовые задачи"],
    },
    {
      name: "Алгебра",
      icon: "📊",
      grades: "7–11 классы",
      description: "Степени, корни, многочлены, формулы сокращенного умножения, квадратные уравнения, неравенства, прогрессии.",
      topics: ["Формулы (a+b)² и разность квадратов", "Дискриминант и теорема Виета", "Системы линейных уравнений", "Функции и графики"],
    },
    {
      name: "Геометрия",
      icon: "📏",
      grades: "7–11 классы",
      description: "Планиметрия, стереометрия, треугольники, теорема Пифагора, векторы, окружности, площади фигур.",
      topics: ["Признаки равенства треугольников", "Теорема Пифагора и синусы", "Площади многоугольников", "Векторы и координаты"],
    },
    {
      name: "Физика",
      icon: "⚡",
      grades: "7–11 классы",
      description: "Механика, кинематика, динамика, законы Ньютона, термодинамика, электричество, оптика.",
      topics: ["Скорость, путь и время", "Законы Ньютона (F = ma)", "Закон Ома и цепи", "Архимедова сила и давление"],
    },
    {
      name: "Химия",
      icon: "🧪",
      grades: "8–11 классы",
      description: "Периодическая таблица Менделеева, валентность, реакции, расстановка коэффициентов, молярная масса.",
      topics: ["Уравнивание реакций", "Расчет массы и количества вещества", "Оксиды, кислоты, основания, соли", "Органическая химия"],
    },
    {
      name: "Русский язык",
      icon: "📖",
      grades: "1–11 классы",
      description: "Орфография, пунктуация, морфологический и синтаксический разбор, части речи, правила переноса.",
      topics: ["Синтаксический разбор предложения", "Н и НН в суффиксах", "Запятые при причастных оборотах", "Морфемный состав слова"],
    },
    {
      name: "English",
      icon: "🇬🇧",
      grades: "1–11 классы",
      description: "Времена глаголов (Present, Past, Future), артикли, пассивный залог, модальные глаголы, перевод текстов.",
      topics: ["Present Simple vs Continuous", "Past Simple & Present Perfect", "Passive Voice", "Conditionals (0, 1, 2, 3)"],
    },
    {
      name: "Информатика",
      icon: "💻",
      grades: "5–11 классы",
      description: "Системы счисления, логические выражения, основы Python, алгоритмы и блок-схемы.",
      topics: ["Перевод систем (2, 8, 10, 16)", "Логика (И, ИЛИ, НЕ)", "Циклы и массивы в Python", "Алгоритмы сортировки"],
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-xs font-semibold text-primary-600 dark:text-primary-400">
          <BookOpen className="h-4 w-4" />
          <span>Образовательная база</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Школьные предметы в Помогайке
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Помогайка AI обучена школьной программе с 1 по 11 класс. Отправь фото любой задачи — бот сам поймет предмет и уровень сложности.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => (
          <div
            key={sub.name}
            className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4 hover:border-primary-300 dark:hover:border-primary-800 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{sub.icon}</span>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{sub.name}</h3>
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/60 px-2 py-0.5 rounded-md border border-primary-200 dark:border-primary-800">
                    {sub.grades}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {sub.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Частые темы:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-foreground/90">
                {sub.topics.map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    <span className="truncate">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <Link
                href="/ai"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
              >
                <span>Решить задачу по этому предмету</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
