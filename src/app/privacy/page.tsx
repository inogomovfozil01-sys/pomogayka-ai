import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
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
          <Shield className="h-7 w-7 text-emerald-500" />
          <span>Политика конфиденциальности</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Редакция от {new Date().getFullYear()} года · Команда DFZ
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-soft space-y-6 text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты информации о пользователях образовательной платформы «Помогайка DFZ», веб-приложения и официального Telegram-бота.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">2. Обработка изображений и домашних заданий</h2>
          <p>
            Фотографии страниц учебников и тетрадей, отправленные пользователями, передаются в Google Gemini API исключительно с целью распознавания текста (OCR), математических формул и генерации пошагового объяснения.
          </p>
          <p className="p-3.5 rounded-xl bg-secondary/60 text-xs italic">
            Мы не используем фотографии школьников или их личные данные для коммерческих баз данных или обучения публичных моделей.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">3. Сроки хранения данных (Data Retention)</h2>
          <p>
            В системе установлена настраиваемая политика хранения данных (по умолчанию 30 дней). По истечении этого срока временные медиафайлы и сессии автоматически удаляются. Пользователь может в любой момент удалить свою историю решений через раздел настроек на сайте.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">4. Безопасность и защита от инъекций</h2>
          <p>
            Все материалы, отправленные учащимися, валидируются на стороне сервера. Никакой пользовательский контент не может изменить системные настройки бота или получить доступ к приватным ключам.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-base text-foreground">5. Контакты администрации</h2>
          <p>
            По всем вопросам защиты конфиденциальности обращайтесь к руководству сообщества через Telegram: <a href="https://t.me/realDFZ" className="text-primary-600 font-semibold hover:underline">@realDFZ</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
