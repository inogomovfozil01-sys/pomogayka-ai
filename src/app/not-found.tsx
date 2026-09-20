import React from "react";
import Link from "next/link";
import { Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-6">
      <div className="h-16 w-16 rounded-3xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto text-2xl font-black shadow-glow">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground">
          Страница не найдена
        </h1>
        <p className="text-sm text-muted-foreground">
          Кажется, эта тема или задание находится в другом учебнике.
        </p>
      </div>
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-soft transition-colors"
        >
          <Home className="h-4 w-4" />
          <span>Вернуться на главную</span>
        </Link>
      </div>
    </div>
  );
}
