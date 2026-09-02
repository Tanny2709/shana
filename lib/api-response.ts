import { NextResponse } from "next/server";

// The v1 API is a public, read-only surface meant to be consumed by anyone
// (per the project's "open-source project should be consumable
// programmatically too" goal) — so responses are CORS-open, unlike the rest
// of the app.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: { ...CORS_HEADERS, ...init?.headers },
  });
}

export function corsPreflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
