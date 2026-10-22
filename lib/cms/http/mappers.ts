import sanitizeHtmlLib from "sanitize-html";
import type {
  ChangelogCategory,
  ChangelogEntry,
  ClientStory,
  DocArticle,
  DocEmbed,
  FaqItem,
  Locale,
  Partner,
  Post,
  Review,
} from "../types";

/**
 * Map efoli CMS API payloads → our content models (docs/PLAN.md §7).
 *
 * The API's `content` HTML was migrated from previously-compromised WordPress
 * sites — sanitise before it reaches a page (the brief requires this).
 */
/**
 * Sanitize trusted-but-migrated CMS HTML. Uses `sanitize-html` (pure JS) rather
 * than DOMPurify/jsdom, which fails to run in Vercel's serverless runtime and
 * 500'd the blog/docs single pages. Preserves what our article rendering needs:
 * heading `id`s + `#` anchors (the Table of Contents), tables, lists, nav,
 * images, inline formatting, and video embeds from trusted hosts. Scripts,
 * styles and their contents are dropped.
 */

/**
 * Hosts whose players may be embedded from the CMS raw-HTML block (stored as
 * `<div data-html-block><iframe …>`). An iframe from anywhere else is dropped.
 */
const VIDEO_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
  "www.loom.com",
  "loom.com",
  "fast.wistia.net",
];

const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "a", "ul", "ol", "li", "nav", "blockquote",
    // `details`/`summary` power the CMS FAQ accordion (FAQ answers, and FAQ
    // blocks embedded in posts/docs) — keep them so the disclosure survives.
    "details", "summary",
    "b", "i", "strong", "em", "u", "s", "code", "pre", "kbd", "mark",
    "small", "sub", "sup", "abbr",
    "span", "div", "br", "hr", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption",
    "colgroup", "col",
    "img", "picture", "source",
    "iframe",
  ],
  allowedAttributes: {
    "*": ["id", "class"],
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading", "srcset", "sizes"],
    source: ["src", "srcset", "type", "media", "sizes"],
    // `open` lets an FAQ item render expanded by default.
    details: ["open"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    col: ["span"],
    iframe: [
      "src", "title", "width", "height", "allow", "allowfullscreen",
      "loading", "referrerpolicy", "style",
    ],
  },
  allowedIframeHostnames: VIDEO_HOSTS,
  allowIframeRelativeUrls: false,
  // Only the player's shape survives (set from width/height in videoEmbed).
  allowedStyles: { iframe: { "aspect-ratio": [/^\d+\s*\/\s*\d+$/] } },
  // A non-allowed host loses its src above; drop the empty frame entirely.
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
  // `#anchor` and relative hrefs have no scheme and are kept automatically.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
  transformTags: {
    // The WordPress-migrated CMS bodies use <h1> for in-article section
    // headings, but every page already renders the single page <h1> (post/doc
    // title). Demote body h1 → h2 so a page never has multiple H1s (SEO). The
    // string form preserves attributes, so heading `id` anchors survive and the
    // demoted headings now also feed the TOC (which reads h2/h3).
    h1: "h2",
    a: (tagName, attribs) => ({ tagName, attribs: tidyInternalLink(attribs) }),
    iframe: (tagName, attribs) => ({ tagName, attribs: videoEmbed(attribs) }),
  },
};

/**
 * A CMS video embed: https only, lazy-loaded, and responsive — the iframe's
 * width/height become its aspect ratio (CSS sizes it to the column).
 */
function videoEmbed(attribs: sanitizeHtmlLib.Attributes): sanitizeHtmlLib.Attributes {
  const out: sanitizeHtmlLib.Attributes = {
    ...attribs,
    // Screen readers name a frame by its title; pasted embeds sometimes lack one.
    title: attribs.title || "Embedded video",
    loading: "lazy",
  };
  if (!/^https:\/\//i.test(out.src ?? "")) delete out.src;
  const w = Number(attribs.width);
  const h = Number(attribs.height);
  if (w > 0 && h > 0) out.style = `aspect-ratio: ${w} / ${h}`;
  else delete out.style;
  return out;
}

/**
 * Internal links in CMS bodies (pushbundle.com or root-relative). The CMS
 * editor marks every link `rel="noopener noreferrer nofollow"`, and the
 * WordPress-era content uses trailing-slash URLs. Ahrefs flagged both
 * (Oct 2026: 351 nofollowed internal links, 817 slash URLs): `nofollow`
 * throws away our own link equity, and each trailing slash costs a 308 hop.
 * External links are left exactly as authored.
 */
function tidyInternalLink(attribs: sanitizeHtmlLib.Attributes): sanitizeHtmlLib.Attributes {
  const m = (attribs.href ?? "").match(
    /^(https?:\/\/(?:www\.)?pushbundle\.com|)(\/(?!\/)[^?#]*)([?#].*)?$/i,
  );
  if (!m) return attribs;
  const [, origin, path, rest = ""] = m;
  const out: sanitizeHtmlLib.Attributes = {
    ...attribs,
    href: origin + (path.replace(/\/+$/, "") || "/") + rest,
  };
  const rel = out.rel
    ?.split(/\s+/)
    .filter((t) => t && t.toLowerCase() !== "nofollow")
    .join(" ");
  if (rel) out.rel = rel;
  else delete out.rel;
  return out;
}

export function sanitizeHtml(html: string | undefined | null): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, SANITIZE_OPTIONS);
}

/**
 * Decode HTML entities in PLAIN-TEXT fields (titles, names, excerpts). The
 * WordPress-migrated CMS returns these encoded (e.g. `&#038;`, `&#8217;`), which
 * React would render literally since it's text, not HTML. Body/answer fields go
 * through `sanitizeHtml` instead — the browser decodes those natively.
 */
export function decodeEntities(s: string | undefined | null): string {
  if (!s) return "";
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&(?:apos|#0?39);/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Resolve an image URL from a CMS field that may be a string, an object
 * ({ url } / { src } / { sourceUrl }), or missing. Accepts several candidate
 * fields so we tolerate naming differences between CMS deployments
 * (coverImage / image / featuredImage / thumbnail, logoUrl / logo / image …).
 */
export function pickImage(
  ...candidates: Array<unknown>
): string | undefined {
  for (const c of candidates) {
    if (!c) continue;
    if (typeof c === "string") {
      const s = c.trim();
      if (s) return s;
    } else if (typeof c === "object") {
      const o = c as Record<string, unknown>;
      const url = o.url ?? o.src ?? o.sourceUrl ?? o.href ?? o.secure_url;
      if (typeof url === "string" && url.trim()) return url.trim();
    }
  }
  return undefined;
}

// ---- API shapes (only the fields we use) ---------------------------------
type ApiCategory = { name: string; slug: string };
type ApiPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  coverImage?: unknown;
  /** Alternate cover-image field names seen across CMS deployments. */
  image?: unknown;
  featuredImage?: unknown;
  thumbnail?: unknown;
  cover?: unknown;
  coverImageAlt?: string | null;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  author?: {
    name?: string;
    role?: string;
    bio?: string;
    avatarUrl?: unknown;
    avatar?: unknown;
    image?: unknown;
  };
  categories?: ApiCategory[];
  tags?: ApiCategory[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: unknown;
  isTranslated?: boolean;
};

export function mapPost(p: ApiPost, locale: Locale): Post {
  return {
    slug: p.slug,
    title: decodeEntities(p.title),
    // Strip WordPress's trailing read-more marker (" […]" / " [...]").
    excerpt: decodeEntities(p.excerpt)
      .replace(/\s*\[(?:…|\.{3})\]\s*$/u, "")
      .trim(),
    body: sanitizeHtml(p.content),
    coverImage: pickImage(
      p.coverImage,
      p.image,
      p.featuredImage,
      p.thumbnail,
      p.cover,
    ),
    // CMS-provided alt; blank/null falls back to the post title at render.
    coverImageAlt: decodeEntities(p.coverImageAlt).trim() || undefined,
    category: p.categories?.[0]?.slug ?? "uncategorized",
    tags: (p.tags ?? []).map((t) => t.slug),
    author: {
      name: p.author?.name ?? "PushBundle",
      avatar: pickImage(p.author?.avatarUrl, p.author?.avatar, p.author?.image),
      role: p.author?.role ? decodeEntities(p.author.role) : undefined,
      bio: p.author?.bio ? decodeEntities(p.author.bio) : undefined,
    },
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt ?? p.publishedAt,
    readingMinutes: p.readingTimeMinutes ?? 5,
    locale,
    isTranslated: p.isTranslated,
    seo: {
      metaTitle: p.metaTitle,
      metaDescription: p.metaDescription,
      ogImage: pickImage(p.ogImage),
    },
  };
}

/** Unique categories across a set of posts (the API has no blog-category list). */
export function categoriesFromPosts(posts: ApiPost[]) {
  const map = new Map<string, { slug: string; name: string }>();
  for (const p of posts) {
    for (const c of p.categories ?? []) {
      if (!map.has(c.slug)) map.set(c.slug, { slug: c.slug, name: decodeEntities(c.name) });
    }
  }
  return [...map.values()];
}

// ---- Docs -----------------------------------------------------------------
type ApiDoc = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  updatedAt?: string;
  readingTimeMinutes?: number;
  /** Only on the single-doc response. */
  category?: { name: string; slug: string } | null;
  /** True when the CMS served a real translation for the requested locale. */
  isTranslated?: boolean;
};
type ApiDocCategory = {
  name: string;
  slug: string;
  description?: string | null;
  order?: number;
  docs: ApiDoc[];
};

/**
 * Lift the first <iframe> out of a raw doc body — the CMS's custom HTML
 * section that carries the article's video walkthrough. Runs BEFORE
 * sanitizing, because the sanitizer drops iframes entirely. The page renders
 * the embed in its own video slot with attributes we control; anything that
 * isn't an https `src` or an inline `srcdoc` is discarded.
 */
export function extractDocEmbed(raw: string): { embed?: DocEmbed; html: string } {
  const match = raw.match(/<iframe\b([^>]*?)(?:\/>|>[\s\S]*?<\/iframe>)/i);
  if (!match) return { html: raw };

  const attrs: Record<string, string> = {};
  for (const m of match[1].matchAll(/([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3]);
  }

  // Drop the iframe, then any wrapper it leaves empty (e.g. WordPress's
  // <figure class="wp-block-embed"><div class="…__wrapper">).
  const html = raw
    .replace(match[0], "")
    .replace(/<(figure|div)\b[^>]*>(?:\s|<div\b[^>]*>\s*<\/div>)*<\/\1>/gi, "");

  const src = attrs.src?.startsWith("//") ? `https:${attrs.src}` : attrs.src;
  const size = (v?: string) => (v && /^\d+$/.test(v) ? Number(v) : undefined);
  const base = {
    title: attrs.title || undefined,
    width: size(attrs.width),
    height: size(attrs.height),
  };
  if (src && /^https:\/\//i.test(src)) return { embed: { ...base, src }, html };
  if (attrs.srcdoc?.trim()) return { embed: { ...base, srcdoc: attrs.srcdoc }, html };
  return { html };
}

export function mapDocs(
  payload: {
    categories?: ApiDocCategory[];
    uncategorized?: ApiDoc[];
  },
  locale: Locale = "en",
): DocArticle[] {
  const out: DocArticle[] = [];
  for (const cat of payload.categories ?? []) {
    cat.docs.forEach((d, i) =>
      out.push({
        slug: d.slug,
        title: decodeEntities(d.title),
        body: sanitizeHtml(d.content),
        category: cat.slug,
        categoryName: decodeEntities(cat.name),
        categoryDescription: cat.description
          ? decodeEntities(cat.description)
          : undefined,
        order: i,
        updatedAt: d.updatedAt ?? "",
        excerpt: d.excerpt ? decodeEntities(d.excerpt) : undefined,
        readingTimeMinutes: d.readingTimeMinutes,
        locale,
        isTranslated: d.isTranslated,
      }),
    );
  }
  (payload.uncategorized ?? []).forEach((d, i) =>
    out.push({
      slug: d.slug,
      title: decodeEntities(d.title),
      body: sanitizeHtml(d.content),
      category: "general",
      categoryName: "General",
      order: i,
      updatedAt: d.updatedAt ?? "",
      excerpt: d.excerpt ? decodeEntities(d.excerpt) : undefined,
      readingTimeMinutes: d.readingTimeMinutes,
      locale,
      isTranslated: d.isTranslated,
    }),
  );
  return out;
}

export function mapDoc(
  d: ApiDoc,
  categoryName = "General",
  categorySlug = "general",
  locale: Locale = "en",
): DocArticle {
  const { embed, html } = extractDocEmbed(d.content ?? "");
  const seo = {
    ...(d.metaTitle && { metaTitle: decodeEntities(d.metaTitle) }),
    ...(d.metaDescription && {
      metaDescription: decodeEntities(d.metaDescription),
    }),
  };
  return {
    slug: d.slug,
    title: decodeEntities(d.title),
    body: sanitizeHtml(html),
    category: d.category?.slug ?? categorySlug,
    categoryName: d.category?.name
      ? decodeEntities(d.category.name)
      : categoryName,
    order: 0,
    updatedAt: d.updatedAt ?? "",
    excerpt: d.excerpt ? decodeEntities(d.excerpt) : undefined,
    readingTimeMinutes: d.readingTimeMinutes,
    embed,
    seo: Object.keys(seo).length ? seo : undefined,
    locale,
    isTranslated: d.isTranslated,
  };
}

// ---- FAQ ------------------------------------------------------------------
type ApiFaq = { id: string; question: string; answer: string };
type ApiFaqCategory = { name: string; slug: string; faqs: ApiFaq[] };

export function mapFaqs(payload: {
  categories?: ApiFaqCategory[];
  uncategorized?: ApiFaq[];
}): { items: FaqItem[]; categories: { slug: string; name: string }[] } {
  const items: FaqItem[] = [];
  const categories: { slug: string; name: string }[] = [];
  for (const cat of payload.categories ?? []) {
    categories.push({ slug: cat.slug, name: decodeEntities(cat.name) });
    cat.faqs.forEach((f, i) =>
      items.push({
        slug: f.id,
        question: decodeEntities(f.question),
        answer: sanitizeHtml(f.answer),
        category: cat.slug,
        order: i,
        locale: "en",
      }),
    );
  }
  if (payload.uncategorized?.length) {
    categories.push({ slug: "general", name: "General" });
    payload.uncategorized.forEach((f, i) =>
      items.push({
        slug: f.id,
        question: f.question,
        answer: sanitizeHtml(f.answer),
        category: "general",
        order: i,
        locale: "en",
      }),
    );
  }
  return { items, categories };
}

// ---- Changelog ------------------------------------------------------------
type ApiChangelog = {
  id: string;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  publishedAt?: string;
  date?: string;
  labels?: string[];
  category?: string;
  /** Optional featured image — field name varies across CMS deployments. */
  image?: unknown;
  coverImage?: unknown;
  featuredImage?: unknown;
  thumbnail?: unknown;
};

const CHANGELOG_LABELS = new Set<ChangelogCategory>([
  "New Feature",
  "Improved",
  "Fixed",
  "Recognition",
  "Launch",
]);

function toChangelogCategory(value?: string): ChangelogCategory {
  if (value && CHANGELOG_LABELS.has(value as ChangelogCategory)) {
    return value as ChangelogCategory;
  }
  return "Improved";
}

export function mapChangelog(c: ApiChangelog): ChangelogEntry {
  return {
    slug: c.slug,
    title: decodeEntities(c.title),
    body: sanitizeHtml(c.content ?? c.description ?? ""),
    category: toChangelogCategory(c.category ?? c.labels?.[0]),
    date: (c.publishedAt ?? c.date ?? "").slice(0, 10),
    image: pickImage(c.image, c.coverImage, c.featuredImage, c.thumbnail),
    locale: "en",
  };
}

// ---- Client showcase ------------------------------------------------------
type ApiClient = {
  id: string;
  title: string;
  /** Store / brand name — the card title. Null on older entries. */
  clientName?: string | null;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: unknown;
  coverImageAlt?: string | null;
  logoUrl?: unknown;
  link?: string | null;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  author?: { name?: string; avatarUrl?: unknown; bio?: string | null } | null;
  tags?: ApiCategory[] | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: unknown;
  noIndex?: boolean;
  isTranslated?: boolean | null;
};

export function mapClient(c: ApiClient, locale: Locale): ClientStory {
  const title = decodeEntities(c.title);
  return {
    slug: c.slug,
    // cms.md: `clientName ?? title` — never pull the card title from the body.
    name: decodeEntities(c.clientName).trim() || title,
    title,
    excerpt: decodeEntities(c.excerpt)
      .replace(/\s*\[(?:…|\.{3})\]\s*$/u, "")
      .trim(),
    body: sanitizeHtml(c.content),
    logo: pickImage(c.logoUrl),
    coverImage: pickImage(c.coverImage),
    coverImageAlt: decodeEntities(c.coverImageAlt).trim() || undefined,
    link: c.link?.trim() || undefined,
    tags: (c.tags ?? []).map((t) => ({ slug: t.slug, name: decodeEntities(t.name) })),
    author: c.author?.name
      ? {
          name: c.author.name,
          avatar: pickImage(c.author.avatarUrl),
          bio: c.author.bio ? decodeEntities(c.author.bio) : undefined,
        }
      : undefined,
    publishedAt: c.publishedAt,
    updatedAt: c.updatedAt ?? c.publishedAt,
    readingMinutes: c.readingTimeMinutes ?? 5,
    locale,
    // `null` (translation not supported for this site) counts as a fallback.
    isTranslated: c.isTranslated === true,
    seo: {
      metaTitle: c.metaTitle ?? undefined,
      metaDescription: c.metaDescription ?? undefined,
      ogImage: pickImage(c.ogImage),
      noIndex: c.noIndex === true,
    },
  };
}

// ---- Partners -------------------------------------------------------------
type ApiPartner = {
  id: string;
  title: string;
  description?: string;
  logoUrl?: unknown;
  /** Alternate logo field names across CMS deployments. */
  logo?: unknown;
  image?: unknown;
  icon?: unknown;
  link?: string;
  url?: string;
};

export function mapPartner(p: ApiPartner): Partner {
  return {
    slug: p.id,
    name: decodeEntities(p.title),
    description: decodeEntities(p.description),
    url: p.link ?? p.url ?? "#",
    logo: pickImage(p.logoUrl, p.logo, p.image, p.icon),
    locale: "en",
  };
}

// ---- Reviews (opinions) ---------------------------------------------------
type ApiOpinion = { id: string; title: string; description: string; logoUrl?: string | null };

export function mapReview(o: ApiOpinion): Review {
  return {
    slug: o.id,
    author: decodeEntities(o.title),
    quote: decodeEntities(o.description),
    rating: 5,
    source: "Direct",
    locale: "en",
  };
}
