import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Escapes characters for Telegram HTML formatting
 * Telegram HTML supports <b>, <i>, <code>, <pre>, <blockquote>, <a>
 * All other user/AI text MUST be escaped to avoid breaking formatting or injection.
 */
export function escapeTelegramHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatGrade(grade?: number | null): string {
  if (!grade) return "Любой класс";
  return `${grade} класс`;
}
