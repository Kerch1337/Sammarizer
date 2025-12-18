// src/lib/mockStorage.ts
export type Summary = {
  id: string;
  title: string;
  videoUrl: string;
  summary: string;
  createdAt: string; // ISO string
};

const KEY = "summaries_v1";

const seed: Summary[] = [
  {
    id: "a1",
    title: "Образец: Основы React",
    videoUrl: "https://youtube.com/watch?v=sample1",
    summary: "Короткая заглушка: видео про основы React — компоненты, состояние, props.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "b2",
    title: "Образец: Архитектура приложений",
    videoUrl: "https://youtube.com/watch?v=sample2",
    summary: "Короткая заглушка: обсуждаются принципы модульности, разделения ответственности и тестируемости.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
];

function isBrowser() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function getSummaries(): Summary[] {
  if (!isBrowser()) return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw) as Summary[];
  } catch (e) {
    console.error("mockStorage get error", e);
    return seed;
  }
}

export function saveSummary(s: Summary) {
  if (!isBrowser()) return;
  try {
    const cur = getSummaries();
    const next = [s, ...cur];
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.error("mockStorage save error", e);
  }
}

export function getSummaryById(id: string): Summary | undefined {
  const list = getSummaries();
  return list.find((x) => x.id === id);
}