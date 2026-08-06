import sanitizeHtmlLib from "sanitize-html";
import type {
  ChangelogCategory,
  ChangelogEntry,
  DocArticle,
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
 * images, and inline formatting. Scripts/styles and their contents are dropped.
 */
const SANITIZE_OPTIONS: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "a", "ul", "ol", "li", "nav", "blockquote",
    "b", "i", "strong", "em", "u", "s", "code", "pre", "kbd", "mark",
    "small", "sub", "sup", "abbr",
    "span", "div", "br", "hr", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "td", "th", "caption",
    "colgroup", "col",
    "img", "picture", "source",
  ],
  allowedAttributes: {
    "*": ["id", "class"],
    a: ["href", "name", "target", "rel", "title"],
    img: ["src", "alt", "title", "width", "height", "loading", "srcset", "sizes"],
    source: ["src", "srcset", "type", "media", "sizes"],
    td: ["colspan", "rowspan"],
    th: ["colspan", "rowspan", "scope"],
    col: ["span"],
  },
  // `#anchor` and relative hrefs have no scheme and are kept automatically.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowProtocolRelative: false,
};

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
  updatedAt?: string;
  readingTimeMinutes?: number;
};
type ApiDocCategory = { name: string; slug: string; order?: number; docs: ApiDoc[] };

export function mapDocs(payload: {
  categories?: ApiDocCategory[];
  uncategorized?: ApiDoc[];
}): DocArticle[] {
  const out: DocArticle[] = [];
  for (const cat of payload.categories ?? []) {
    cat.docs.forEach((d, i) =>
      out.push({
        slug: d.slug,
        title: decodeEntities(d.title),
        body: sanitizeHtml(d.content),
        category: cat.slug,
        categoryName: decodeEntities(cat.name),
        order: i,
        updatedAt: d.updatedAt ?? "",
        locale: "en",
      }),
    );
  }
  (payload.uncategorized ?? []).forEach((d, i) =>
    out.push({
      slug: d.slug,
      title: d.title,
      body: sanitizeHtml(d.content),
      category: "general",
      categoryName: "General",
      order: i,
      updatedAt: d.updatedAt ?? "",
      locale: "en",
    }),
  );
  return out;
}

export function mapDoc(d: ApiDoc, categoryName = "General", categorySlug = "general"): DocArticle {
  return {
    slug: d.slug,
    title: d.title,
    body: sanitizeHtml(d.content),
    category: categorySlug,
    categoryName,
    order: 0,
    updatedAt: d.updatedAt ?? "",
    locale: "en",
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
