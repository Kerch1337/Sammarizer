"use client";

import { useEffect, useState } from "react";
import { getSummaries, Summary } from "@/lib/mockStorage";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function History() {
  const [items, setItems] = useState<Summary[]>([]);
  const router = useRouter();

  useEffect(() => {
    setItems(getSummaries());
  }, []);

  return (
    <div className="min-h-[85vh] p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">История суммаризаций</h1>

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground">Выполненых суммаризаций нет</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((it) => (
              <li
                key={it.id}
                onClick={() => router.push(`/history/${it.id}`)}
                className="cursor-pointer border rounded-md p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(it.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-slate-600 mt-1">{it.videoUrl}</div>
                <div className="text-sm text-slate-800 mt-2 line-clamp-3">{it.summary}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Button onClick={() => router.push("/summarize")} className="bg-blue-600 text-white">
            New Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
