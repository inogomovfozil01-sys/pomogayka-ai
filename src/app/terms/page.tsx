import React from "react";
import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl space-y-8">
      <div>
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2 font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>На главную</span>
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary-500" />
          <span>Пользовательское соглашение</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Правила использования сервиса «Помогайка DFZ»
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-soft space-y-6 text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">1. Назначение сервиса</h2>
          <p>
            «Помогайка DFZ» — некоммерческий образовательный проект, созданный для взаимопомощи школьников и объяснения учебных материалов с помощью технологий искусственного интеллекта.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">2. Академическая честность</h2>
          <p>
            Платформа предназначена для понимания методов решения и освоения школьной программы. Мы поощряем вдумчивое изучение шагов, а не бездумное копирование ответов.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">3. Дисциплина сообщества</h2>
          <p>
            Каждый пользователь обязуется соблюдать правила взаимоуважения в супергруппе Telegram. Спам, мат, реклама и токсичное поведение наказываются системой предупреждений вплоть до постоянной блокировки.
          </p>
        </section>
      </div>
    </div>
  );
}
