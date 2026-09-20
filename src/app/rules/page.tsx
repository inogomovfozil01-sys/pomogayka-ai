import { prisma } from "@/lib/prisma";
import { ShieldCheck, AlertTriangle, MessageSquare, Ban } from "lucide-react";

export const revalidate = 60; // ISR cache

export default async function RulesPage() {
  const rules = await prisma.rule.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="h-4 w-4" />
          <span>Официальный регламент</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Правила сообщества «Помогайка DFZ»
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Мы стремимся создать безопасное, комфортное и дружелюбное учебное пространство для каждого школьника. Ознакомьтесь с правилами поведения в нашей супергруппе.
        </p>
      </div>

      {/* 3 Warnings Special Alert Box */}
      <div id="warns" className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-800 shadow-soft space-y-3">
        <div className="flex items-center gap-2.5 text-rose-700 dark:text-rose-400 font-bold text-base">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>Правило 3-х предупреждений (3 Warns → Ban)</span>
        </div>
        <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed">
          В сообществе действует автоматическая система учета нарушений. Если участник получает <b>3 активных предупреждения</b> от модераторов или автоматического фильтра — система автоматически блокирует его в группе навсегда. Проверить свои предупреждения можно командой <code>/mywarns</code>.
        </p>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule, idx) => (
          <div
            key={rule.id}
            className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-soft space-y-2.5 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 font-bold text-xs shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-base text-foreground">
                  {rule.title}
                </h3>
              </div>

              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                  rule.penalty === "BAN"
                    ? "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                    : rule.penalty === "MUTE"
                    ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                }`}
              >
                {rule.penalty === "BAN" ? "Бан" : rule.penalty === "MUTE" ? "Мут" : "Варн"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground pl-11 leading-relaxed">
              {rule.description}
            </p>
          </div>
        ))}
      </div>

      {/* Moderation Commands Help */}
      <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-soft">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary-500" />
          <span>Полезные команды в Telegram-чате:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-secondary/70 border border-border">
            <code className="font-bold text-primary-600 dark:text-primary-400">/rules</code>
            <p className="text-muted-foreground mt-0.5">Показать краткие правила прямо в чате</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/70 border border-border">
            <code className="font-bold text-primary-600 dark:text-primary-400">/mywarns</code>
            <p className="text-muted-foreground mt-0.5">Узнать количество своих предупреждений</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/70 border border-border">
            <code className="font-bold text-primary-600 dark:text-primary-400">/report [причина]</code>
            <p className="text-muted-foreground mt-0.5">Пожаловаться на спам или нарушение (в ответ на сообщение)</p>
          </div>
          <div className="p-3 rounded-xl bg-secondary/70 border border-border">
            <code className="font-bold text-primary-600 dark:text-primary-400">/ask [вопрос]</code>
            <p className="text-muted-foreground mt-0.5">Прямой вопрос к AI-помощнику</p>
          </div>
        </div>
      </div>
    </div>
  );
}
