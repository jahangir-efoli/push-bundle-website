/**
 * Article post-processing for the blog single-post page (docs/PLAN.md §5.7c).
 *
 * The CMS body ships its own inline "Table of Contents" (`<h2>` + `<nav><ul>`)
 * and gives headings `id` anchors. We lift that TOC out of the flow and render
 * it as a sticky sidebar (matching the reference design), reusing the CMS's own
 * heading ids so the jump-links keep working. Headings that lack an id get one
 * injected, so the sidebar works even for posts authored without a TOC.
 */

export type TocItem = { id: string; text: string; level: 2 | 3 };

function stripTags(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 80) || "section"
  );
}

/**
 * Remove the CMS's inline "Table of Contents": an `<h2>` heading immediately
 * followed by its list. Matched STRUCTURALLY — by the `<nav>` (or a `<ul>`/`<ol>`
 * of in-page `#` anchors), NOT the heading text — so it works in every language.
 * The old English-only text match ("table of contents") left the inline TOC in
 * place on translated posts, so it showed twice (inline + sidebar).
 *
 * The tempered `<h2>` token `(?:(?!</h2>)[\s\S])*?` can't cross its own `</h2>`,
 * so the match only ever spans the single TOC heading + its list, never the
 * article content in between.
 */
const INLINE_TOC =
  /<h2[^>]*>(?:(?!<\/h2>)[\s\S])*?<\/h2>\s*(?:<nav[^>]*>[\s\S]*?<\/nav>|<(ul|ol)[^>]*>(?:(?!<\/\1>)[\s\S])*?href=["']#[\s\S]*?<\/\1>)/i;

export function processArticle(html: string): { html: string; toc: TocItem[] } {
  let out = html.replace(INLINE_TOC, "");

  const toc: TocItem[] = [];
  const seen = new Set<string>();

  out = out.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, lvl: string, attrs: string, inner: string) => {
      const level = Number(lvl) as 2 | 3;
      const text = stripTags(inner);
      // Skip empty headings and any lingering "Table of Contents" label.
      if (!text || /^table of contents$/i.test(text)) return match;

      let id = attrs.match(/id=["']([^"']+)["']/i)?.[1];
      if (!id) {
        const base = slugify(text);
        let unique = base;
        let n = 2;
        while (seen.has(unique)) unique = `${base}-${n++}`;
        id = unique;
      }
      seen.add(id);
      toc.push({ id, text, level });

      const attrsWithId = /id=/i.test(attrs) ? attrs : `${attrs} id="${id}"`;
      return `<h${lvl}${attrsWithId}>${inner}</h${lvl}>`;
    },
  );

  // Wrap tables so wide ones scroll horizontally instead of breaking the layout
  // on narrow screens (styled in globals.css `.prose-table`).
  out = out
    .replace(/<table(\s[^>]*)?>/gi, '<div class="prose-table"><table$1>')
    .replace(/<\/table>/gi, "</table></div>");

  return { html: out, toc };
}
