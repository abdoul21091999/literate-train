import { NextResponse } from "next/server";

// The mobile app's React Native Web build runs on a different Vercel
// origin (literate-train-nine.vercel.app) than this API (…literate-train
// .vercel.app), so its browser fetch()es are cross-origin and need CORS
// headers. Native iOS/Android builds ignore CORS entirely, so this is
// only exercised by the web preview.
const ALLOWED_HEADERS = "Content-Type, Authorization";

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
  };
}

export function corsJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, { ...init, headers: corsHeaders() });
}

export function corsPreflight() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}
