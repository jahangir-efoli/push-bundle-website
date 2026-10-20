import { test, expect } from "@playwright/test";
import { extractDocEmbed, sanitizeHtml } from "../lib/cms/http/mappers";

/**
 * Fixes from the Ahrefs site audit of 15 Oct 2026: moved case studies 404'd,
 * and CMS bodies carried nofollowed / trailing-slash internal links.
 */

test("moved case studies 301 to the Client Showcase in every locale", async ({
  request,
}) => {
  const cases: Array<[string, string]> = [
    ["/blog/coho-with-pushbundle", "/clients-showcase/coho-online-bakery-pushbundle"],
    ["/de/blog/coho-with-pushbundle", "/de/clients-showcase/coho-online-bakery-pushbundle"],
    ["/blog/chameleon-colors-with-pushbundle", "/clients-showcase/chameleon-colors-with-pushbundle"],
    ["/zh/blog/chameleon-colors-with-pushbundle", "/zh/clients-showcase/chameleon-colors-with-pushbundle"],
  ];
  for (const [from, to] of cases) {
    const res = await request.get(from, { maxRedirects: 0 });
    expect(res.status(), from).toBe(308);
    expect(res.headers().location, from).toBe(to);
  }

  // The trailing-slash form the old posts link to lands in the same place.
  const res = await request.get("/fr/blog/coho-with-pushbundle/", { maxRedirects: 2 });
  expect(new URL(res.url()).pathname).toBe("/fr/clients-showcase/coho-online-bakery-pushbundle");
});

test("CMS internal links lose nofollow and the trailing slash", () => {
  const html = (href: string, rel = "noopener noreferrer nofollow") =>
    sanitizeHtml(`<a href="${href}" rel="${rel}">x</a>`);

  expect(html("https://pushbundle.com/blog/candy-and-chocolate-bundles/")).toBe(
    '<a href="https://pushbundle.com/blog/candy-and-chocolate-bundles" rel="noopener noreferrer">x</a>',
  );
  expect(html("/docs/installation/#step-2", "nofollow")).toBe(
    '<a href="/docs/installation#step-2">x</a>',
  );
  expect(html("https://www.pushbundle.com/pricing/?ref=blog", "nofollow")).toBe(
    '<a href="https://www.pushbundle.com/pricing?ref=blog">x</a>',
  );
  expect(html("https://pushbundle.com/", "nofollow")).toBe(
    '<a href="https://pushbundle.com/">x</a>',
  );

  // External links stay exactly as authored.
  expect(html("https://apps.shopify.com/push-bundle/", "noopener nofollow")).toBe(
    '<a href="https://apps.shopify.com/push-bundle/" rel="noopener nofollow">x</a>',
  );
});

test("doc bodies give up their first iframe to the video slot", () => {
  const { embed, html } = extractDocEmbed(
    `<p>a</p><figure class="wp-block-embed"><div class="wp-block-embed__wrapper"><iframe title="Walkthrough" width="1440" height="900" src="https://www.youtube.com/embed/x"></iframe></div></figure><p>b</p>`,
  );
  expect(embed).toEqual({
    title: "Walkthrough",
    width: 1440,
    height: 900,
    src: "https://www.youtube.com/embed/x",
  });
  expect(html).toBe("<p>a</p><p>b</p>");
  // Plain http is never embedded.
  expect(extractDocEmbed('<iframe src="http://x.example"></iframe>').embed).toBeUndefined();
});
