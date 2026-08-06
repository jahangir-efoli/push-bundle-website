/**
 * Human-readable stylesheet for /sitemap.xml. Served as a route (not a public
 * file) so the `text/xsl` content-type is guaranteed — Vercel may serve a static
 * `.xsl` as octet-stream, which browsers refuse to apply as a stylesheet.
 *
 * Search engines ignore this entirely; it only affects how the sitemap looks
 * when a human opens it in a browser.
 */
export const dynamic = "force-static";

const XSL = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>PushBundle — XML Sitemap</title>
        <style>
          :root { color-scheme: light dark; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font: 15px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2430; background: #f6f7fb;
          }
          .wrap { max-width: 1100px; margin: 0 auto; padding: 0 20px 64px; }
          header {
            background: linear-gradient(100deg, #3b82f6, #22d3ee);
            color: #fff; padding: 28px 0; margin-bottom: 28px;
          }
          header .wrap { padding-bottom: 0; }
          h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.01em; }
          .sub { margin: 6px 0 0; opacity: .92; font-size: 14px; }
          .count { margin: 0 0 16px; color: #5b6472; }
          .count strong { color: #1f2430; }
          table { width: 100%; border-collapse: collapse; background: #fff;
            border: 1px solid #e6e8ef; border-radius: 12px; overflow: hidden; }
          th, td { text-align: left; padding: 10px 14px; font-size: 14px;
            border-bottom: 1px solid #eef0f5; white-space: nowrap; }
          th { background: #eef2ff; color: #3b4252; font-weight: 700;
            text-transform: uppercase; font-size: 11px; letter-spacing: .04em; }
          td.url { white-space: normal; word-break: break-all; }
          td.num { text-align: right; font-variant-numeric: tabular-nums; color: #6b7280; }
          tr:last-child td { border-bottom: 0; }
          tr:hover td { background: #f9fafe; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; min-width: 22px; text-align: center;
            padding: 1px 7px; border-radius: 999px; background: #e0e7ff; color: #3730a3;
            font-size: 12px; font-weight: 700; }
          @media (prefers-color-scheme: dark) {
            body { background: #0b0f1a; color: #e5e9f2; }
            .count { color: #9aa4b6; } .count strong { color: #e5e9f2; }
            table { background: #121826; border-color: #232a3a; }
            th { background: #1a2234; color: #b9c2d6; }
            td, th { border-color: #1c2334; }
            tr:hover td { background: #161d2c; }
            a { color: #7cc0ff; }
            .badge { background: #23305a; color: #b9c9ff; }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="wrap">
            <h1>PushBundle — XML Sitemap</h1>
            <p class="sub">This is a machine-readable file for search engines. The styled view below is only for humans.</p>
          </div>
        </header>
        <div class="wrap">
          <p class="count">This sitemap contains <strong><xsl:value-of select="count(s:urlset/s:url)"/></strong> URLs.</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>URL</th>
                <th>Languages</th>
                <th>Last Modified</th>
                <th>Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td class="num"><xsl:value-of select="position()"/></td>
                  <td class="url"><a href="{s:loc}"><xsl:value-of select="s:loc"/></a></td>
                  <td class="num"><span class="badge"><xsl:value-of select="count(xhtml:link)"/></span></td>
                  <td><xsl:value-of select="substring(s:lastmod, 1, 10)"/></td>
                  <td><xsl:value-of select="s:changefreq"/></td>
                  <td class="num"><xsl:value-of select="s:priority"/></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;

export function GET() {
  return new Response(XSL, {
    headers: {
      "content-type": "text/xsl; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
