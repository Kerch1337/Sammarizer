"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SummaryItem = {
    id: number | string;
    url: string;
    summary: string | null;
    created_at?: string | null;
    createdAt?: string | null;
    title?: string | null;
};


export default function HistoryItem() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id ?? "";
    const [item, setItem] = useState<SummaryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        let intervalId: ReturnType<typeof setInterval> | null = null;

        async function loadOnce() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/get/get-one?id=${encodeURIComponent(id)}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        if (mounted) setItem(null);
                        return;
                    }
                    throw new Error(`Server returned ${res.status}`);
                }
                const data = await res.json();
                if (!mounted) return;

                const mapped: SummaryItem = {
                    id: data.id,
                    url: data.url,
                    summary: data.summary ?? null,
                    created_at: data.created_at ?? data.createdAt ?? null,
                    title: data.title ?? null,
                };

           

                setItem(mapped);
            } catch (e: any) {
                console.error("Load item error:", e);
                if (mounted) setError(String(e?.message ?? e));
            } finally {
                if (mounted) setLoading(false);
            }
        }

        
        loadOnce();

 
        intervalId = setInterval(async () => {
            try {
                const res = await fetch(`/api/get/get-one?id=${encodeURIComponent(id)}`);
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;

                const mapped: SummaryItem = {
                    id: data.id,
                    url: data.url,
                    summary: data.summary ?? null,
                    created_at: data.created_at ?? data.createdAt ?? null,
                    title: data.title ?? null,
                };
                

                setItem(mapped);
                
                if (mapped.summary) {
                    if (intervalId) {
                        clearInterval(intervalId);
                        intervalId = null;
                    }
                }
            } catch (e) {
                console.error("Polling error:", e);
            }
        }, 5000);

        return () => {
            mounted = false;
            if (intervalId) clearInterval(intervalId);
        };
    }, [id]);

    if (!id) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center">
                <div>Нет id в параметрах</div>
            </div>
        );
    }

    if (loading && !item) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center">Loading…</div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[85vh] p-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-xl font-semibold mb-3">Ошибка</h1>
                    <p className="mb-4">{error}</p>
                    <Button onClick={() => router.push("/history")} className="bg-blue-600 text-white">
                        Назад к истории
                    </Button>
                </div>
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
                    ← Назад
                </Button>
                <h1 className="text-2xl font-semibold">{item.title}</h1>
                <div className="text-sm text-muted-foreground mt-2">
                    <div>
                        <strong>ID:</strong> {item.id}
                    </div>
                    <div>
                        <strong>Date:</strong> {item.created_at ? new Date(item.created_at).toLocaleString() : "—"}
                    </div>
                </div>

                <div className="mt-4">
                    <strong>Video URL</strong>
                    <div className="mt-1">
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                            {item.url}
                        </a>
                    </div>
                </div>

                <section className="mt-6">
                    <h2 className="font-medium mb-2">Полученный текст суммаризации:</h2>
                    <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">
                        {item.summary || "Обрабатывается..."}
                    </div>
                </section>
            </div>
        </div>
    );
}
