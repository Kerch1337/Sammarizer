import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const res = await fetch(`${BACKEND_URL}/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new NextResponse(text, { status: res.status });
        }
    } catch (e) {
        console.error("[proxy] POST /api/post/create error:", e);
        return NextResponse.json({ error: "Backend unavailable" }, { status: 500 });
    }
}
