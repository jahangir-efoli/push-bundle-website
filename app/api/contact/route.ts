import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { submitContact } from "@/lib/cms/contact";

/**
 * Contact-form submit handler. The browser POSTs here (never straight to the
 * CMS) so we can gate every submission with layered anti-abuse before
 * forwarding to the CMS (docs/cmd.md — Contact form):
 *   1. Rate limit by IP — brute-force / flood throttle (burst + sustained).
 *   2. Honeypot — silently accept bot submissions that fill the hidden field.
 *   3. Server-side validation — required fields, email format, length caps
 *      (mirrors the CMS's own limits so we reject early).
 *   4. Forward to the CMS, which verifies the hCaptcha token with its secret.
 */
export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Field caps mirror the CMS (docs/cmd.md — Contact form).
const MAX = { name: 200, email: 320, subject: 300, message: 5000 } as const;

/** Best-effort client IP from the proxy headers Vercel sets. */
function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  // 1. Throttle: a short burst guard + a sustained per-IP cap. Either tripping
  //    blocks the submission with a Retry-After.
  const burst = rateLimit(`contact:burst:${ip}`, { limit: 3, windowMs: 30_000 });
  const sustained = rateLimit(`contact:sustained:${ip}`, {
    limit: 8,
    windowMs: 15 * 60_000,
  });
  if (!burst.ok || !sustained.ok) {
    const retryAfter = Math.max(burst.retryAfter, sustained.retryAfter);
    return NextResponse.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // 2. Honeypot: real users leave `company` empty. Return a success shape so a
  //    bot gets no signal that it was filtered.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // 3. Validate server-side (never trust the client).
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();
  const hcaptchaToken =
    typeof body.hcaptchaToken === "string" && body.hcaptchaToken
      ? body.hcaptchaToken
      : undefined;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email." },
      { status: 400 },
    );
  }
  if (
    name.length > MAX.name ||
    email.length > MAX.email ||
    subject.length > MAX.subject ||
    message.length > MAX.message
  ) {
    return NextResponse.json(
      { error: "One or more fields are too long." },
      { status: 400 },
    );
  }

  // 4. Forward to the CMS (it verifies hCaptcha + delivers the email).
  const result = await submitContact({
    name,
    email,
    subject: subject || undefined,
    message,
    hcaptchaToken,
  });

  if (result.ok) return NextResponse.json({ ok: true });
  return NextResponse.json({ error: result.error }, { status: result.status });
}
