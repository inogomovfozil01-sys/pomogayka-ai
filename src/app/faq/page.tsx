"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search } from "lucide-react";

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Как отправить домашнее задание на решение?",
      a: "В Telegram-группе перейдите в тему своего класса (например, «4 класс» или «8 класс»), прикрепите фотографию страницы учебника или тетради и напишите номера заданий: «помогите 8 и 9». Бот автоматически свяжет текст с фотографией и пришлет пошаговое объяснение.",
    },
    {
      q: "Можно ли отправить просто фотографию, а номер написать следующим сообщением?",
      a: "Да! Это ключевая функция Помогайки. Вы можете сначала скинуть фотографию, а затем отдельным сообщением написать: «помогите 8,9». Бот найдет вашу последнюю фотографию в этой теме и решит нужные номера.",
    },
    {
      q: "Какие школьные предметы поддерживаются?",
      a: "Помогайка поддерживает абсолютно все школьные предметы: математику, алгебру, геометрию, физику, химию, русский язык, литературу, английский язык, биологию, историю, географию, информатику и другие.",
    },
    {
      q: "Можно ли задать уточняющий вопрос или спросить продолжение?",
      a: "Конечно! После решения вы можете просто написать «а 10?» — и бот поймет, что речь идет о задании №10 с предыдущего фото. Также можно спросить «почему в 9 получилось 16000?» или нажать кнопку «💡 Объяснить проще».",
    },
    {
      q: "Что делать, если AI не смог прочитать фото или условие размыто?",
      a: "Помогайка строго следует правилу OCR-достоверности и никогда не придумывает невидимый текст. Если фото размыто или обрезано, бот честно напишет: «Я не могу уверенно прочитать условие №X. Пришли, пожалуйста, фото ближе». Просто перефотографируйте страницу при хорошем освещении.",
    },
    {
      q: "Бесплатна ли Помогайка DFZ?",
      a: "Да, базовое использование Telegram-бота и сайта полностью бесплатно для всех школьников в сообществе DFZ.",
    },
    {
      q: "Как пожаловаться на нарушителя, спам или рекламу?",
      a: "Ответьте (Reply) на сообщение нарушителя командой /report [причина]. Жалоба мгновенно поступит в панель модераторов группы.",
    },
    {
      q: "Как работают предупреждения (варны)?",
      a: "За нарушения правил (мат, оскорбления, реклама, оффтоп) модераторы выдают предупреждения (/warn). При накоплении 3 активных предупреждений участник автоматически блокируется в группе навсегда.",
    },
    {
      q: "Хранятся ли мои фотографии?",
      a: "Мы уважаем приватность учащихся. Фотографии обрабатываются через Gemini Vision и автоматически очищаются в соответствии с политикой хранения данных (retention policy). В личном кабинете на сайте вы можете удалить всю историю в один клик.",
    },
  ];

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950 text-xs font-semibold text-primary-600 dark:text-primary-400">
          <HelpCircle className="h-4 w-4" />
          <span>База знаний</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
          Часто задаваемые вопросы
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Ответы на популярные вопросы о работе Telegram-бота, AI Vision и правилах сообщества Помогайки DFZ.
        </p>

        {/* Search */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по вопросам..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-card border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 shadow-soft"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <span>{item.q}</span>
                <span className="shrink-0 p-1.5 rounded-xl bg-secondary text-muted-foreground">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
