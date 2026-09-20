"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/providers";
import { HomeworkCard } from "@/components/homework-card";
import type { SolveHomeworkResult, LearningMode } from "@/lib/types";
import {
  Upload,
  Camera,
  Sparkles,
  Send,
  Loader2,
  Trash2,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function AIWorkspacePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [prompt, setPrompt] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<number>(user?.grade || 8);
  const [selectedMode, setSelectedMode] = useState<LearningMode>("SOLUTION");
  const [images, setImages] = useState<Array<{ mimeType: string; base64Data: string; preview: string }>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [currentResult, setCurrentResult] = useState<SolveHomeworkResult | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentSolutionId, setCurrentSolutionId] = useState<string | null>(null);

  // Chat follow-up state
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [followUpInput, setFollowUpInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Listen for clipboard image paste (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) addImageFile(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const addImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Файл слишком большой. Максимальный размер 10 МБ.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Data = dataUrl.split(",")[1];
      setImages((prev) => [
        ...prev,
        {
          mimeType: file.type,
          base64Data,
          preview: dataUrl,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(addImageFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(addImageFile);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSolve = async () => {
    if (!prompt.trim() && images.length === 0) {
      alert("Пожалуйста, загрузите фотографию или напишите текст задания.");
      return;
    }

    setIsLoading(true);
    setProgressMsg("Анализирую изображение и условие задачи...");

    try {
      const payload = {
        prompt: prompt.trim() || undefined,
        images: images.map((img) => ({
          mimeType: img.mimeType,
          base64Data: img.base64Data,
        })),
        grade: selectedGrade,
        mode: selectedMode,
        conversationId: currentConversationId,
      };

      const res = await fetch("/api/ai/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Ошибка при решении задания");
      }

      setCurrentResult(data.result);
      setCurrentConversationId(data.conversationId);
      setCurrentSolutionId(data.solutionId);
      setChatMessages([]);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsLoading(false);
      setProgressMsg("");
    }
  };

  const handleFollowUp = async (text: string) => {
    if (!text.trim() || isChatLoading) return;

    const userText = text.trim();
    setFollowUpInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          conversationId: currentConversationId,
          solutionId: currentSolutionId,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Ошибка соединения");
      }

      // Format AI reply
      const firstTask = data.result?.tasks?.[0];
      const replyText =
        firstTask?.steps?.join("\n") ||
        firstTask?.explanation ||
        data.result?.rawText ||
        "Готово.";

      setChatMessages((prev) => [...prev, { role: "ai", text: replyText }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", text: `⚠️ ${(err as Error).message}` },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl space-y-8">
      {/* Workspace Title & Settings Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2">
            <span>AI Решалка</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
              Gemini Vision
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Загрузи фото задания, выбери свой класс и получи подробный пошаговый разбор.
          </p>
        </div>

        {/* Grade & Mode Selectors */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="text-muted-foreground">Класс:</span>
            <select
              aria-label="Выбор класса"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(Number(e.target.value))}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((g) => (
                <option key={g} value={g} className="bg-card text-foreground">
                  {g} класс
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className="text-muted-foreground">Режим:</span>
            <select
              aria-label="Выбор режима обучения"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as LearningMode)}
              className="bg-transparent text-foreground font-bold focus:outline-none cursor-pointer"
            >
              <option value="SOLUTION" className="bg-card text-foreground">
                📖 Пошаговое решение
              </option>
              <option value="ONLY_ANSWER" className="bg-card text-foreground">
                ⚡ Только ответ
              </option>
              <option value="TEACH_ME" className="bg-card text-foreground">
                🧠 Научи меня (подсказка)
              </option>
              <option value="VERIFY" className="bg-card text-foreground">
                🔄 Проверка ответа
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Upload / Input Zone */}
      <div className="space-y-4">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative rounded-3xl border-2 border-dashed border-border hover:border-primary-500 bg-card/60 p-6 sm:p-8 text-center transition-colors duration-200 space-y-4 group"
        >
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-4">
              <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
                <Upload className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-base text-foreground">
                  Перетащи фотографию задания сюда
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Поддерживаются JPG, PNG, WEBP, а также вставка из буфера обмена (Ctrl + V)
                </p>
              </div>

              {/* Upload & Mobile Camera Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                >
                  <ImageIcon className="h-4 w-4 text-primary-500" />
                  <span>Выбрать файл</span>
                </button>

                {/* Mobile Camera Direct Capture */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary-600 text-white hover:bg-primary-700 shadow-soft transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Сделать фото камерой</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-center">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-2xl overflow-hidden border border-border shadow-sm">
                    <img
                      src={img.preview}
                      alt={`Фото задания ${idx + 1}`}
                      className="h-28 w-28 object-cover rounded-2xl"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      title="Удалить фото"
                      aria-label="Удалить фото"
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                >
                  + Добавить еще фото
                </button>
              </div>
            </div>
          )}

          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <input
            type="file"
            ref={cameraInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />
        </div>

        {/* Text Prompt input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSolve()}
            placeholder="Напиши номера заданий (например: «помоги 8, 9») или текст вопроса..."
            className="flex-1 px-4 py-3.5 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-soft"
          />
          <button
            disabled={isLoading}
            onClick={handleSolve}
            className="px-6 py-3.5 rounded-2xl font-bold text-sm bg-primary-600 hover:bg-primary-500 active:scale-95 text-white shadow-glow disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Решаю...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Решить</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-card border border-border text-center space-y-3 shadow-soft animate-pulse">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          <p className="font-semibold text-sm text-foreground">{progressMsg}</p>
          <p className="text-xs text-muted-foreground">
            Gemini Vision сканирует текст, формулы и адаптирует решение под {selectedGrade} класс.
          </p>
        </div>
      )}

      {/* Result Display */}
      {currentResult && !isLoading && (
        <div className="space-y-6 animate-fadeIn">
          <HomeworkCard
            result={currentResult}
            onFollowUp={handleFollowUp}
            isLoading={isChatLoading}
          />

          {/* Follow-up Chat Dialogue */}
          <div className="p-6 rounded-3xl bg-card border border-border shadow-soft space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-500" />
              <span>Диалог с AI-помощником:</span>
            </h3>

            {chatMessages.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "ai" && (
                      <div className="h-7 w-7 rounded-lg bg-primary-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed max-w-xl whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-primary-600 text-white rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm border border-border"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={followUpInput}
                onChange={(e) => setFollowUpInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFollowUp(followUpInput)}
                placeholder="Задай вопрос по решению (например: «почему здесь минус?» или «объясни проще»)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <button
                disabled={isChatLoading || !followUpInput.trim()}
                onClick={() => handleFollowUp(followUpInput)}
                className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {isChatLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
