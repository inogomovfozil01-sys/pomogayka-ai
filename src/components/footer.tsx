import React from "react";
import Link from "next/link";
import { Sparkles, Send, Heart, Shield, BookOpen, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-soft">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary-600 to-brand-violet bg-clip-text text-transparent">
                Помогайка DFZ
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Образовательная экосистема нового поколения. Помощь с домашними заданиями от сообщества и умного AI на базе Gemini Vision.
            </p>
            <div className="pt-2">
              <a
                href="https://t.me/pomogaykaTeam"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Telegram @pomogaykaTeam</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3.5 text-foreground flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary-500" />
              <span>Навигация</span>
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/ai" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <span>AI Решалка</span>
                  <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.2 rounded font-bold">
                    NEW
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/subjects" className="hover:text-foreground transition-colors">
                  Школьные предметы
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-foreground transition-colors">
                  Сообщество DFZ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  Частые вопросы (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Rules and Safety */}
          <div>
            <h4 className="font-semibold text-sm mb-3.5 text-foreground flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span>Безопасность</span>
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/rules" className="hover:text-foreground transition-colors">
                  Правила группы
                </Link>
              </li>
              <li>
                <Link href="/rules#warns" className="hover:text-foreground transition-colors">
                  Система 3-х предупреждений
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Bot */}
          <div>
            <h4 className="font-semibold text-sm mb-3.5 text-foreground flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-brand-violet" />
              <span>Telegram Bot</span>
            </h4>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              Бот работает прямо в темах супергруппы. Распознает фото учебников и тетрадей по классам.
            </p>
            <a
              href="https://t.me/pomogaykaTeamBot"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              <span>@pomogaykaTeamBot</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} Помогайка DFZ. Разработано с</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
            <span>для школьников.</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Проект команды DFZ</span>
            <span>•</span>
            <a
              href="https://t.me/realDFZ"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              @realDFZ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
