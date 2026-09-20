# Помогайка DFZ — AI-экосистема помощи с домашними заданиями

Современная production-ready образовательная платформа и интеллектуальный Telegram-бот для сообщества **«Помогайка DFZ»**. Бот работает в существующих темах супергруппы по классам (1–11 классы), мгновенно распознает фотографии учебников и тетрадей с помощью **Google Gemini Vision**, объясняет решения понятным школьнику соответствующего класса языком и поддерживает непрерывный диалог.

---

## 🌟 Ключевые возможности

1. **Telegram-бот с поддержкой тем (Topics):**
   - Автоматическое определение класса ученика (`USER_GRADE = 1..11`) по `message_thread_id`.
   - Объяснение строго по школьной программе: в 4 классе — по действиям без X; в старших классах — с формулами и доказательствами.
   - Поддержка альбомов нескольких фотографий (`media_group_id`) без дублирования ответов.
   - Связывание контекста: если ученик скинул фото, а затем написал *«помогите 8,9»* или *«а 10?»*, бот автоматически связывает запрос с последней фотографией в теме.
   - Детерминированный Intent Router: отсекает обычные разговоры участников (*«привет»*, *«кто в школу?»*, *«спс»*) без лишнего расхода токенов Gemini.
   - Режим **Human-First**: бот может подождать 1–5 минут помощи от участников, и отвечает только если никто не помог.
2. **AI Vision & Gemini Engine:**
   - Модель `gemini-3.6-flash` (с автоматическим fallback и повторами при пиковых нагрузках).
   - Распознавание печатного и рукописного текста, дробей, формул, геометрических чертежей и досок.
   - **OCR Safety (No Hallucinations):** если снимок размыт или обрезан, бот честно сообщает об этом, не выдумывая числа.
   - Защита от Prompt Injection: текст на фото и в задачах изолирован как пользовательские данные.
   - 3 режима: 📖 Пошаговое решение, ⚡ Только ответ, 🧠 Научи меня (сократовские подсказки).
   - Проверка решений: *«я получил 427, правильно?»* → точечный анализ каждого шага.
3. **Современная веб-платформа (Next.js 15):**
   - Интерактивная главная страница с живой демонстрацией работы AI.
   - **/ai** — AI Workspace и Telegram Mini App с поддержкой drag & drop, вставки из буфера обмена (Ctrl+V) и прямого захвата с камеры мобильного телефона (`capture="environment"`).
   - **/dashboard** — поддерживающий кабинет ученика (количество решенных задач, предметы, не превращаясь в стрессовую систему оценок).
   - **/history** — история обращений и решений с поиском и фильтрами.
   - **/community** — страница команды DFZ (`@realDFZ`, `@LoveIcelattee`, `@pomogaykaTeamBot`).
   - **/rules** & **/faq** — правила сообщества и подробные ответы на вопросы.
4. **Модерация и безопасность:**
   - Команды участников: `/rules`, `/mywarns`, `/report`, `/ask`.
   - Команды администрации: `/warn`, `/mute`, `/unmute`, `/ban`, `/unban`, `/clearwarns`.
   - Система 3-х предупреждений: 3 активных варна = автоматический бан в группе.
   - Панель управления **/admin** только для проверенных Telegram User ID (создатель `6564196947` и доверенные админы).
   - Управление сопоставлением топиков с классами и AI-режимами прямо из интерфейса.
   - Редактирование правил сообщества в базе данных.

---

## 🛠️ Стек технологий

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, PWA.
- **Backend:** Next.js Server Actions / API Routes, grammY (Telegram Bot API).
- **База данных:** PostgreSQL (Neon / Supabase), Prisma ORM v6.
- **AI:** Google Gemini API (Multimodal Vision, Structured Outputs).
- **Безопасность:** HMAC-SHA256 валидация Telegram Login Widget и Mini App initData, экранирование Telegram HTML, Zod, CSRF protection.

---

## 🚀 Установка и запуск

### 1. Клонирование и установка зависимостей
```bash
git clone https://github.com/your-repo/pomogayka.git
cd pomogayka
npm install
```

### 2. Настройка переменных окружения
Создайте файл `.env` на основе `.env.example`:
```env
# База данных PostgreSQL (Neon / Supabase)
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"

# Telegram Bot API
TELEGRAM_BOT_TOKEN="8990437531:AAHGXPcJmClVVSxgd5VBHXUEbKmcHcUyXiY"
TELEGRAM_CHAT_ID="-1002489987868"
TELEGRAM_WEBHOOK_SECRET="your-webhook-secret-token"
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME="pomogaykaTeamBot"

# Google Gemini API
GEMINI_API_KEY="AIzaSy..."
GEMINI_MODEL="gemini-3.6-flash"

# Домен приложения
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Telegram ID администраторов (через запятую)
ADMIN_TELEGRAM_IDS="6564196947,8806627868"

# Политика хранения данных (дни: 7, 30 или 90)
RETENTION_DAYS="30"
```

### 3. Синхронизация БД и сидинг данных
```bash
npx prisma db push
npm run db:seed
```

### 4. Запуск веб-сервера разработки
```bash
npm run dev
```
Веб-приложение доступно по адресу [http://localhost:3000](http://localhost:3000).

### 5. Запуск Telegram-бота (Long-Polling для разработки)
```bash
npm run bot
```

---

## 🤖 Настройка Telegram BotFather & Webhook

1. **Создание бота:**
   - Откройте [@BotFather](https://t.me/BotFather) и создайте бота или используйте существующий токен.
   - Включите поддержку групп: `/setjoingroups` → `Enable`.
   - Включите приватность или разрешение чтения сообщений: `/setprivacy` → `Disable` (чтобы бот видел учебные фото в супергруппе без явного тега).
   - Привяжите Web App: `/newapp` или укажите URL `/ai` как Main Web App.

2. **Настройка Webhook на production (Vercel / Always-On):**
   ```bash
   curl -F "url=https://your-domain.com/api/telegram/webhook" \
        -F "secret_token=your-webhook-secret-token" \
        https://api.telegram.org/bot<TOKEN>/setWebhook
   ```

---

## 🧪 Запуск тестов

```bash
# Запуск полного набора unit и integration тестов
npm test

# Проверка типов TypeScript
npm run typecheck

# Сборка production билда
npm run build
```

---

## 👥 Команда сообщества

- **Руководитель / Создатель:** 𝙟𝙪𝙨𝙩 𝙥𝙧𝙤𝙜𝙧𝙖𝙢𝙢𝙞𝙣𝙜 ([@realDFZ](https://t.me/realDFZ), ID: `6564196947`)
- **Администратор:** ::A`☕+⁰¹⁷ ([@LoveIcelattee](https://t.me/LoveIcelattee), ID: `8806627868`)
- **Официальный чат:** [@pomogaykaTeam](https://t.me/pomogaykaTeam)
- **Официальный бот:** [@pomogaykaTeamBot](https://t.me/pomogaykaTeamBot)

© {new Date().getFullYear()} Помогайка DFZ. Все права защищены.
