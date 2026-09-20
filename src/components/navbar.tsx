"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/providers";
import {
  Sparkles,
  BookOpen,
  Users,
  ShieldCheck,
  HelpCircle,
  Menu,
  X,
  Moon,
  Sun,
  LogIn,
  LogOut,
  LayoutDashboard,
  Settings as SettingsIcon,
  ShieldAlert,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, loading, theme, toggleTheme, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/ai", label: "AI Решалка", icon: Sparkles, badge: "Новое" },
    { href: "/subjects", label: "Предметы", icon: BookOpen },
    { href: "/community", label: "Сообщество", icon: Users },
    { href: "/rules", label: "Правила", icon: ShieldCheck },
    { href: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  const handleTelegramLoginPrompt = () => {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "pomogaykaTeamBot";
    window.open(`https://t.me/${botUsername}?start=login`, "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 glass-panel">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 text-white shadow-glow group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary-600 via-indigo-500 to-brand-violet bg-clip-text text-transparent">
                Помогайка
              </span>
              <span className="rounded-md bg-primary-100 dark:bg-primary-950/60 px-1.5 py-0.5 text-[10px] font-semibold text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">
                AI
              </span>
            </div>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
              DFZ Community
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-0.5 rounded-full bg-primary-500 px-1.5 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Theme switch, Dashboard, Auth */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            aria-label="Переключить тему"
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {!loading && user ? (
            <div className="flex items-center gap-2">
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Админ</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 hover:bg-primary-100 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Кабинет</span>
              </Link>

              <div className="flex items-center gap-2 pl-1 border-l border-border">
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user.firstName?.[0] || user.username?.[0] || "U"}
                </div>
                <button
                  onClick={logout}
                  title="Выйти"
                  aria-label="Выйти"
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleTelegramLoginPrompt}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 active:scale-95 transition-all duration-150 shadow-soft"
            >
              <LogIn className="h-4 w-4" />
              <span>Войти через Telegram</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Переключить тему"
            className="rounded-lg p-2 text-muted-foreground"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Меню"
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "text-primary-600 bg-primary-50 dark:bg-primary-950/50"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded-full bg-primary-500 px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Кабинет ученика</span>
                </Link>
                {user.isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  >
                    <ShieldAlert className="h-4 w-4" />
                    <span>Панель администратора</span>
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Выйти из аккаунта</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleTelegramLoginPrompt();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold bg-primary-600 text-white shadow-soft"
              >
                <LogIn className="h-4 w-4" />
                <span>Войти через Telegram</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
