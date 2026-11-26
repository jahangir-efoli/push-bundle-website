/**
 * CMS custom HTML blocks — what the CMS editor's "Raw HTML" block saves:
 * `<div data-html-block>…author's markup…</div>`.
 *
 * That markup is written by the team in the CMS (the WordPress import never
 * produces it), so it is rendered EXACTLY as written — styles, scripts, forms,
 * buttons, embeds, inline styles and data attributes included — the same way
 * this site already renders CMS landing pages, and the way MultiVariants and
 * DiscountRay render it in posts. Everything OUTSIDE the blocks is still
 * sanitized (the migrated WordPress HTML around it; see sanitizeHtml).
 *
 * Splitting is done on the raw string: a block's end is found by balancing
 * `<div>`s, skipping comments and the bodies of `<script>`/`<style>` so a
 * "</div>" inside a script string can't end a block early. An unclosed block
 * runs to the end of the content. The CMS only emits blocks at the top level,
 * so the pieces between blocks are well-formed fragments on their own.
 */

const HTML_BLOCK_OPEN = /<div\b[^>]*\sdata-html-block(?=[\s=>/])[^>]*>/gi;
const DIV_TOKEN = /<!--[\s\S]*?-->|<(script|style)\b[\s\S]*?<\/\1\s*>|<(\/?)div\b[^>]*>/gi;

export type HtmlSegment = { html: string; raw: boolean };

/** The content as alternating ordinary / raw-block pieces, in order. */
export function splitHtmlBlocks(html: string): HtmlSegment[] {
  const segments: HtmlSegment[] = [];
  const open = new RegExp(HTML_BLOCK_OPEN.source, "gi");
  let pos = 0;
  let match: RegExpExecArray | null;

  while ((match = open.exec(html))) {
    const start = match.index;
    const token = new RegExp(DIV_TOKEN.source, "gi");
    token.lastIndex = start + match[0].length;
    let depth = 1;
    let end = html.length;
    let t: RegExpExecArray | null;
    while ((t = token.exec(html))) {
      if (t[0].startsWith("<!--") || t[1]) continue; // comment, <script>, <style>
      if (t[2] === "/") {
        if (--depth === 0) {
          end = t.index + t[0].length;
          break;
        }
      } else if (!t[0].endsWith("/>")) {
        depth++;
      }
    }

    if (start > pos) segments.push({ html: html.slice(pos, start), raw: false });
    segments.push({ html: html.slice(start, end), raw: true });
    pos = end;
    open.lastIndex = end;
  }

  if (pos < html.length) segments.push({ html: html.slice(pos), raw: false });
  return segments;
}

/** Apply `fn` to everything outside the custom HTML blocks; blocks pass through untouched. */
export function mapOutsideHtmlBlocks(html: string, fn: (segment: string) => string): string {
  return splitHtmlBlocks(html)
    .map((segment) => (segment.raw ? segment.html : fn(segment.html)))
    .join("");
}
