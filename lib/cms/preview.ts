import "server-only";
import { CMS_BASE, CMS_SITE } from "./http/client";
import { mapPost } from "./http/mappers";
import type { Locale, Post } from "./types";

/**
 * Draft preview (docs/cmd.md — Draft preview). Only the single-item endpoints
 * (a blog post, a recipe, a landing page) support preview, so these are the only
 * draft-aware fetches. They forward the `x-preview-token` header and disable
 * caching, so an editor sees the newest unpublished draft. Kept separate from
 * `cmsFetch` on purpose: reading draft mode there would opt the whole
 * (statically generated) site into dynamic rendering.
 */
const apiLocale = (locale: Locale) => (locale === "en" ? undefined : locale);

/**
 * GET a CMS endpoint with the preview token, uncached. Returns the parsed JSON,
 * or null when preview is unconfigured, the item doesn't exist, or on any error.
 */
export async function previewFetch<T>(
  path: string,
  params: Record<string, string | undefined> = {},
): Promise<T | null> {
  const secret = process.env.PREVIEW_SECRET;
  if (!secret || !CMS_BASE) return null;

  const qs = new URLSearchParams({ site: CMS_SITE });
  for (const [k, v] of Object.entries(params)) if (v) qs.set(k, v);

  try {
    const res = await fetch(`${CMS_BASE}${path}?${qs}`, {
      headers: { "x-preview-token": secret, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getPreviewPost(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const raw = await previewFetch<Parameters<typeof mapPost>[0]>(
    `/api/public/posts/${slug}`,
    { locale: apiLocale(locale) },
  );
  return raw ? mapPost(raw, locale) : null;
}

/** A Recipe Contents draft (Setup Pantry) — same shape as a post. */
export async function getPreviewRecipe(
  slug: string,
  locale: Locale,
): Promise<Post | null> {
  const raw = await previewFetch<Parameters<typeof mapPost>[0]>(
    `/api/public/recipes/${slug}`,
    { locale: apiLocale(locale) },
  );
  return raw ? mapPost(raw, locale) : null;
}
