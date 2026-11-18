import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { isLocale, defaultLocale } from "@/i18n/config";

/**
 * Enter draft preview (docs/cmd.md — Draft preview). The CMS "Preview on site"
 * button links here with `?secret=…&slug=…[&locale=…][&type=landing]`. Enables
 * draft mode (sets the cookie) and redirects to the item, which then fetches
 * the draft: a blog post by default, or a landing page (`type=landing`, served
 * at the site root, English only).
 * Returns 401 without the correct PREVIEW_SECRET; locked until that env is set.
 */
export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = process.env.PREVIEW_SECRET;

  if (!secret || searchParams.get("secret") !== secret) {
    return new Response("Invalid token", { status: 401 });
  }

  const slug = searchParams.get("slug");
  if (!slug) return new Response("slug required", { status: 400 });

  (await draftMode()).enable();

  if (searchParams.get("type") === "landing") {
    redirect(`/${encodeURIComponent(slug)}`);
  }

  const locale = searchParams.get("locale");
  const prefix =
    locale && isLocale(locale) && locale !== defaultLocale ? `/${locale}` : "";
  redirect(`${prefix}/blog/${encodeURIComponent(slug)}`);
}
