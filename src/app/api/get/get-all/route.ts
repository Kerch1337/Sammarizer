import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET() {
    try {
        const res = await fetch(`${BACKEND_URL}/get-all-items`);
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            return NextResponse.json(data, { status: res.status });
        } catch {
            return new NextResponse(text, { status: res.status });
        }
    } catch (e) {
        console.error("[proxy] GET /api/get/get-all error:", e);
        return NextResponse.json({ error: "Backend unavailable" }, { status: 500 });
    }
}
