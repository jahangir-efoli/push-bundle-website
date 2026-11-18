import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { defaultLocale, isLocale } from "@/i18n/config";

/**
 * On-demand ISR (docs/PLAN.md §7; Phase 9 brief). The CMS calls this whenever
 * content changes (publish, edit, unpublish, delete — blog posts, docs, landing
 * pages, …), so edits appear within seconds without a redeploy. Body:
 * `{ "path": "/blog/x" }` or a root path like `{ "path": "/black-friday" }`;
 * when a URL changes the CMS also sends the old path. Token-gated against
 * REVALIDATE_SECRET. Without it, CMS content is stale.
 */
export const runtime = "nodejs";

/** `/x/?a=1#b` → `/x`; null when it isn't a usable path. */
function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const bare = raw.trim().split(/[?#]/)[0];
  if (!bare) return null;
  const p = bare.startsWith("/") ? bare : `/${bare}`;
  return p.length > 1 ? p.replace(/\/+$/, "") || "/" : p;
}

/**
 * The route path that actually renders a URL. `proxy.ts` rewrites unprefixed
 * URLs to the default locale (`/black-friday` → `/en/black-friday`), and
 * revalidatePath must be given the rewrite DESTINATION — the source path never
 * matches the cache entry.
 */
function routePath(path: string): string {
  const first = path.split("/")[1] ?? "";
  if (isLocale(first)) return path;
  return `/${defaultLocale}${path === "/" ? "" : path}`;
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-token") !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { path?: unknown; oldPath?: unknown; paths?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const path = normalizePath(body?.path);
  if (!path) {
    return NextResponse.json({ error: "path required" }, { status: 400 });
  }

  // Tolerate the old path arriving in the same request too, not only as its
  // own call.
  const extra = [body.oldPath, ...(Array.isArray(body.paths) ? body.paths : [])]
    .map(normalizePath)
    .filter((p): p is string => p !== null);

  for (const p of new Set([path, ...extra])) {
    revalidatePath(p);
    revalidatePath(routePath(p));
  }
  // Everything CMS-tagged (listings, teasers, the sitemap, landing pages).
  // `{ expire: 0 }` expires it immediately — the Next 16 form for an external
  // webhook — so the very next visit renders the new content. ("max" would
  // serve one more stale response first.)
  revalidateTag("cms", { expire: 0 });

  return NextResponse.json({ revalidated: true, path });
}
