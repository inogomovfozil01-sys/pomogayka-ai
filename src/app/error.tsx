"use client";

import React, { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center max-w-md space-y-6">
      <div className="h-16 w-16 rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl font-black">
        <AlertCircle className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-foreground">
          Что-то пошло не так
        </h1>
        <p className="text-sm text-muted-foreground">
          Произошла непредвиденная ошибка при загрузке данных. Пожалуйста, попробуйте снова.
        </p>
      </div>
      <div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs shadow-soft transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Попробовать снова</span>
        </button>
      </div>
    </div>
  );
}
