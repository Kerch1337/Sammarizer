"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type SummaryListItem = {
    id: number | string;
    url: string;
    summary: string | null;
    created_at?: string | null;
    createdAt?: string | null;
    title?: string | null;
};

export default function History() {
    const [items, setItems] = useState<SummaryListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchId, setSearchId] = useState("");

    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        async function load() {
            setLoading(true);
            try {
                const res = await fetch("/api/get/get-all");
                if (!res.ok) {
                    if (mounted) setItems([]);
                    return;
                }
                const data = await res.json();

                if (!mounted) return;

                const mapped = (data as any[])
                    .map((d) => ({
                        id: d.id,
                        url: d.url ?? "",
                        summary: d.summary ?? null,
                        created_at: d.created_at ?? d.createdAt ?? null,
                        title: d.title ?? null,
                    } as SummaryListItem))
                    .filter((item) => String(item.summary ?? "").trim().length > 0);

                setItems(mapped);
            } catch (e) {
                console.error("Load history error:", e);
                if (mounted) setItems([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = items.filter((it) =>
        searchId.trim() ? String(it.id).includes(searchId.trim()) : true
    );

    return (
        <div className="min-h-[85vh] p-6">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">История суммаризаций</h1>

                <div className="mb-4 flex gap-2">
                    <input
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="Введите id для поиска"
                        className="flex-1 px-3 py-2 border rounded-md"
                        onKeyDown={(e) => {
                            if (e.key === "Escape") setSearchId("");
                        }}
                    />
                    <Button
                        type="button"
                        onClick={() => setSearchId("")}
                        className="bg-blue-600 text-white">
                        Сброс
                    </Button>
                </div>

                {loading ? (
                    <div>Загрузка…</div>
                ) : items.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        Выполненных суммаризаций нет
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                        По запросу ничего не найдено
                    </div>
                ) : (
                    <ul className="flex flex-col gap-3">
                        {filtered.map((it) => (
                            <li
                                key={it.id}
                                onClick={() => router.push(`/history/${it.id}`)}
                                className="cursor-pointer border rounded-md p-3 hover:shadow-sm transition-shadow"
                            >
                                <div className="flex justify-between">
                                    <div className="font-medium">
                                        {it.title?.trim() || "Видео без названия"} ({`id=${it.id}`})
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {it.created_at ? new Date(it.created_at).toLocaleString("ru-RU") : ""}
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mt-1">{it.url}</div>
                                <div className="text-sm text-slate-800 mt-2 line-clamp-3">{it.summary}</div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-6 flex justify-center">
                    <Button
                        type="button"
                        onClick={() => router.push("/summarize")}
                        className="bg-blue-600 text-white"
                    >
                        Новая суммаризация
                    </Button>
                </div>
            </div>
        </div>
    );
}
