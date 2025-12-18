import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        const res = await fetch(`${BACKEND_URL}/items/${id}`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new NextResponse(text, { status: res.status });
        }
    } catch (e) {
        console.error("[proxy] GET /api/get/get-one error:", e);
        return NextResponse.json({ error: "Backend unavailable" }, { status: 500 });
    }
}
