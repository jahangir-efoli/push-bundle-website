import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * robots.txt (docs/PLAN.md §7). Explicit AI-bot allowlist for AEO/GEO; blanket
 * disallow on any non-production deploy so staging never gets indexed.
 */
const AI_AND_SEARCH_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "cohere-ai",
  "Googlebot",
  "Bingbot",
  "DuckDuckBot",
  "Applebot",
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/ui-preview"] },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
