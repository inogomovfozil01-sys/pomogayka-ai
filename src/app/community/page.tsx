import React from "react";
import { Users, Send, ShieldCheck, Heart, Sparkles, MessageCircle, Star } from "lucide-react";

export default function CommunityPage() {
  const team = [
    {
      name: "𝙟𝙪𝙨𝙩 𝙥𝙧𝙤𝙜𝙧𝙖𝙢𝙢𝙞𝙣𝙜",
      username: "realDFZ",
      role: "Создатель / Руководитель DFZ",
      badge: "Основатель",
      id: "6564196947",
      avatarBg: "bg-gradient-to-tr from-primary-600 to-indigo-600",
      description: "Основатель и главный разработчик проекта «Помогайка DFZ». Координация команды и развитие образовательной платформы.",
    },
    {
      name: "::A`☕+⁰¹⁷",
      username: "LoveIcelattee",
      role: "Администратор сообщества",
      badge: "Админ",
      id: "8806627868",
      avatarBg: "bg-gradient-to-tr from-amber-500 to-rose-500",
      description: "Модерация тем, поддержание порядка и дружелюбной учебной атмосферы среди участников сообщества.",
    },
    {
      name: "Помогайка AI",
      username: "pomogaykaTeamBot",
      role: "Интеллектуальный помощник",
      badge: "AI Бот",
      id: "8990437531",
      avatarBg: "bg-gradient-to-tr from-primary-500 to-brand-violet",
      description: "Официальный бот группы: решает домашние задания, распознает фотографии учебников и помогает модераторам.",
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-5xl space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950 text-xs font-semibold text-primary-700 dark:text-primary-300">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
          <span>Команда и Сообщество DFZ</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Помогайка — это больше, чем просто AI
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          «Помогайка DFZ» объединяет живых людей и технологии. Мы верим, что взаимопомощь между школьниками — это лучший способ научиться новому, а AI дополняет сообщество, отвечая там, где участники еще не успели помочь.
        </p>
      </div>

      {/* Community Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            🤝
          </div>
          <h3 className="font-bold text-base text-foreground">Взаимопомощь</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Каждый может помочь однокласснику или ученику младших классов. Объясняя материал другому, ты лучше закрепляешь его сам!
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
          <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            🛡️
          </div>
          <h3 className="font-bold text-base text-foreground">Безопасность и порядок</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            В группе нет места мату, травле, оффтопу и спаму. Наша модерация и система 3-х предупреждений берегут уют для всех.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            ⚡
          </div>
          <h3 className="font-bold text-base text-foreground">Human-First подход</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Бот дает возможность участникам ответить первым. Если вопрос остался без ответа — AI приходит на выручку.
          </p>
        </div>
      </div>

      {/* Official Team Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-foreground">Команда проекта</h2>
          <p className="text-xs text-muted-foreground">
            Реальные руководители и администраторы «Помогайки DFZ»
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.username}
              className="p-6 rounded-3xl bg-card border border-border shadow-soft flex flex-col justify-between space-y-4 hover:border-primary-300 dark:hover:border-primary-800 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-14 w-14 rounded-2xl ${member.avatarBg} text-white flex items-center justify-center font-black text-xl shadow-soft`}
                  >
                    {member.name[0]}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                    {member.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-foreground">{member.name}</h3>
                  <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {member.role}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">ID: {member.id}</p>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border">
                <a
                  href={`https://t.me/${member.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-secondary hover:bg-primary-50 dark:hover:bg-primary-950/60 text-foreground hover:text-primary-600 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>@{member.username}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Community CTA */}
      <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-4 shadow-soft">
        <h3 className="text-xl font-bold text-foreground">
          Присоединяйся к супергруппе прямо сейчас!
        </h3>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Темы по всем классам с 1 по 11. Отправляй задания, помогай другим и учись без затруднений.
        </p>
        <div>
          <a
            href="https://t.me/pomogaykaTeam"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-bold bg-primary-600 hover:bg-primary-500 text-white shadow-glow transition-all active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Вступить в Telegram-чат @pomogaykaTeam</span>
          </a>
        </div>
      </div>
    </div>
  );
}
