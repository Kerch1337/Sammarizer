// src/app/history/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSummaryById } from "@/lib/mockStorage";
import { Summary } from "@/lib/mockStorage";
import { Button } from "@/components/ui/button";

export default function HistoryItem() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ?? "";
  const [item, setItem] = useState<Summary | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = getSummaryById(id);
    if (!found) {
      setItem(null);
    } else {
      setItem(found);
    }
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <div>Нет id в параметрах</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-[85vh] p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-semibold mb-3">Запись не найдена</h1>
          <p className="mb-4">Похоже, запись с таким id отсутствует.</p>
          <Button onClick={() => router.push("/history")} className="bg-blue-600 text-white">
            Назад к истории
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] p-6">
      <div className="max-w-3xl mx-auto">
        <Button onClick={() => router.push("/history")} className="mb-4">
          ← Back
        </Button>
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <div className="text-sm text-muted-foreground mt-2">
          <div>
            <strong>ID:</strong> {item.id}
          </div>
          <div>
            <strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="mt-4">
          <strong>Video URL</strong>
          <div className="mt-1">
            <a href={item.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
              {item.videoUrl}
            </a>
          </div>
        </div>

        <section className="mt-6">
          <h2 className="font-medium mb-2">Полученный текст суммаризации:</h2>
          <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">{item.summary}</div>
        </section>
      </div>
    </div>
  );
}
