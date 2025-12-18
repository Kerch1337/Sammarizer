// src/app/summarize/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveSummary } from "@/lib/mockStorage";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Summarize() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  async function getVideoTitle(videoUrl: string): Promise<string> {
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
        videoUrl
      )}&format=json`;

      const res = await fetch(oEmbedUrl);
      if (!res.ok) throw new Error("oEmbed failed");
      const data = await res.json();
      return data.title as string;
    } catch {
      return deriveTitleFromUrl(videoUrl) || "Видео";
    }
  }

  function fakeSummaryFor(url: string) {
    return `Автоматическая заглушка-суммаризация для ${url}. Ключевые моменты:
1) Введение
2) Основные идеи
3) Выводы`;
  }

  const onSummarize = async () => {
    if (!url.trim()) {
      setError("Пожалуйста, вставь ссылку на видео");
      return;
    }

    setError(null);
    setLoading(true);

    setTimeout(async () => {
      const id = makeId();
      const title = await getVideoTitle(url);

      saveSummary({
        id,
        title,
        videoUrl: url.trim(),
        summary: fakeSummaryFor(url),
        createdAt: new Date().toISOString(),
      });

      router.push(`/history/${id}`);
    }, 1200);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Заголовок */}
        <h1 className="text-3xl font-semibold mb-2">
          Суммаризация видео
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Вставьте ссылку на видео в поле ниже:
        </p>

        {/* Форма */}
        <div className="flex flex-col gap-3 items-center">
          <div className="w-full">
            <Input
              value={url}
              onChange={(e) => {
                setUrl((e.target as HTMLInputElement).value);
                if (error) setError(null);
              }}
              placeholder="https://youtube.com/..."
              aria-invalid={!!error}
              className={cn(
                error && "border-red-500 focus-visible:ring-red-500/30"
              )}
            />

            {/* Сообщение об ошибке */}
            {error && (
              <p className="text-left mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          {/* Кнопка */}
          <Button
            onClick={onSummarize}
            size="lg"
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors px-8"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size={18} />
                <span>Summarizing…</span>
              </span>
            ) : (
              "Summarize"
            )}
          </Button>

          {/* Подпись под кнопкой при загрузке */}
          {loading && (
            <span className="text-sm text-muted-foreground">
              Анализируем видео и выполняем суммаризацию…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function deriveTitleFromUrl(url: string) {
  try {
    const u = new URL(url);
    return u.hostname + u.pathname;
  } catch {
    return "";
  }
}
