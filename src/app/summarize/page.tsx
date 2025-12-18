"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Summarize() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const [summaryId, setSummaryId] = useState<string | null>(null);

  const router = useRouter();

    async function pollForSummary(id: number | string, onDone: () => void, onError?: (e: any) => void) {
        const intervalMs = 5000;
        const maxAttempts = 120;
        let attempts = 0;
        const timer = setInterval(async () => {
            attempts += 1;
            try {
                const res = await fetch(`/api/get/get-one?id=${id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.summary) {
                        clearInterval(timer);
                        onDone();
                    }
                } else if (res.status === 404) {

                } else {
                    console.error("poll error", res.status);
                }
            } catch (e) {
                console.error("poll exception", e);
                if (onError) onError(e);
            }
            if (attempts >= maxAttempts) {
                clearInterval(timer);
                if (onError) onError(new Error("Timeout waiting for summary"));
            }
        }, intervalMs);

        return () => clearInterval(timer);
    }

    const onSummarize = async () => {
        if (!url.trim()) {
            setError("Пожалуйста, вставьте ссылку на видео");
            return;
        }

        setError(null);
        setLoading(true);

        try {

            const res = await fetch("/api/post/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Ошибка сервера: ${res.status} ${text}`);
            }

            const data = await res.json();
            const id = data.id;

            
            setSummaryId(String(id));


            await new Promise<void>((resolve, reject) => {
                pollForSummary(
                    id,
                    () => {
                        resolve();
                    },
                    (err) => reject(err)
                );
            });

            router.push(`/history/${id}`);
        } catch (err: any) {
            console.error(err);
            setError("Не удалось отправить запрос: " + (err.message || err));
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-3xl font-semibold mb-2">
          Суммаризация видео
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Вставьте ссылку на видео в поле ниже:
        </p>
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
            {error && (
              <p className="text-left mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
          <Button
            type="button" 
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
          {loading && (
            <span className="text-sm text-muted-foreground">
                          Анализируем видео и выполняем суммаризацию…  {summaryId ? `(ID вашей суммаризации: ${summaryId})` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}