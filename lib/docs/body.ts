/**
 * Shape a (sanitized) CMS doc body for the article template. eFoli help docs
 * follow one format — intro, "Before you start:", one numbered list of steps,
 * "You're done" — so the template recognises those parts and styles them:
 *
 * - the "Before you start:" paragraph becomes a callout,
 * - the first <ol> becomes the numbered step list (and is counted for the meta),
 * - the "You're done" heading and what follows it, up to the next <h2>, become
 *   the green completion card.
 *
 * Docs written before the format (or translated ones) simply render as prose.
 */

function withClass(attrs: string, cls: string) {
  return /\bclass="/.test(attrs)
    ? attrs.replace(/\bclass="/, `class="${cls} `)
    : `${attrs} class="${cls}"`;
}

export function enhanceDocBody(html: string): { html: string; steps: number } {
  let steps = 0;

  let out = html.replace(
    /<p(\s[^>]*)?>(\s*(?:<(?:strong|b)>)?\s*Before you start)/i,
    (_, attrs = "", rest) => `<p${withClass(attrs, "doc-callout")}>${rest}`,
  );

  const ol = out.match(/<ol(\s[^>]*)?>/i);
  if (ol?.index !== undefined) {
    // Count only the list's own items, not those of a list nested in a step.
    let depth = 0;
    const tags = /<(\/?)(ol|ul|li)\b/gi;
    tags.lastIndex = ol.index;
    for (let t; (t = tags.exec(out)); ) {
      const [, close, tag] = t;
      if (tag.toLowerCase() === "li") {
        if (!close && depth === 1) steps++;
      } else {
        depth += close ? -1 : 1;
        if (depth === 0) break;
      }
    }
    const open = `<ol${withClass(ol[1] ?? "", "doc-steps")}>`;
    out = out.slice(0, ol.index) + open + out.slice(ol.index + ol[0].length);
  }

  out = out.replace(
    /(<h2\b[^>]*>\s*You(?:'|’|&#39;|&rsquo;)re done[\s\S]*?)(?=<h2\b|$)/i,
    (section) => `<div class="doc-done">${section}</div>`,
  );

  return { html: out, steps };
}
