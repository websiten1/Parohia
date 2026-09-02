import { NextResponse } from "next/server";

interface WaitlistPayload {
  name: string;
  parish: string;
  location: string;
  email: string;
  phone?: string;
  parishioners?: string;
  language: "ro" | "en";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPayload(body: unknown): body is WaitlistPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.parish === "string" &&
    b.parish.trim().length > 0 &&
    typeof b.location === "string" &&
    b.location.trim().length > 0 &&
    typeof b.email === "string" &&
    EMAIL_PATTERN.test(b.email.trim())
  );
}

/**
 * Receives the waitlist submission and forwards it to the Google Apps Script
 * Web App backing the Sheet — the browser never talks to Google directly, and
 * the Sheet URL never reaches the client.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const sheetUrl = process.env.WAITLIST_SHEET_URL;
  if (!sheetUrl) {
    console.error("waitlist: WAITLIST_SHEET_URL is not configured");
    return NextResponse.json({ ok: false, error: "server_not_configured" }, { status: 500 });
  }

  const row = {
    timestamp: new Date().toISOString(),
    name: body.name.trim(),
    parish: body.parish.trim(),
    city_country: body.location.trim(),
    email: body.email.trim(),
    phone: typeof body.phone === "string" ? body.phone.trim() : "",
    approx_parishioners: typeof body.parishioners === "string" ? body.parishioners.trim() : "",
    language: body.language === "en" ? "en" : "ro",
  };

  try {
    const upstream = await fetch(sheetUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    if (!upstream.ok) {
      console.error("waitlist: Apps Script responded with", upstream.status);
      return NextResponse.json({ ok: false, error: "upstream_error" }, { status: 502 });
    }
  } catch (err) {
    console.error("waitlist: failed to reach Apps Script", err);
    return NextResponse.json({ ok: false, error: "upstream_unreachable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
