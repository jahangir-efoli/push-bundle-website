import "server-only";
import { CMS_BASE, CMS_SITE } from "./http/client";
import { mapPost } from "./http/mappers";
import type { Locale, Post } from "./types";

/**
 * Draft preview (docs/cmd.md — Draft preview). Only the single-post endpoint
 * supports preview, so this is the one draft-aware fetch. It forwards the
 * `x-preview-token` header and disables caching, so an editor sees the newest
 * unpublished draft. Kept separate from `cmsFetch` on purpose: reading draft
 * mode there would opt the whole (statically generated) site into dynamic
 * rendering. Returns null when unconfigured or on any error.
 */
const apiLocale = (locale: Locale) => (locale === "en" ? undefined : locale);

export async function getPreviewPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret || !CMS_BASE) return null;

  const qs = new URLSearchParams({ site: CMS_SITE });
  const loc = apiLocale(locale);
  if (loc) qs.set("locale", loc);

  try {
    const res = await fetch(`${CMS_BASE}/api/public/posts/${slug}?${qs}`, {
      headers: { "x-preview-token": secret, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return mapPost(await res.json(), locale);
  } catch {
    return null;
  }
}
