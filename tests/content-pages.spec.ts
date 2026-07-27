import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 6 exit criteria (docs/PLAN.md §10):
 * all dynamic content routes render from the adapter, are accessible in light
 * + dark, hold across the responsive matrix, and expose correct metadata.
 */

const ROUTES = [
  "/blog",
  "/blog/fixed-vs-mix-and-match-bundle",
  "/blog/category/shopify-bundle",
  "/blog/page/2",
  "/docs",
  "/docs/installation",
  "/changelog",
  "/partner",
  "/faq",
];

for (const path of ROUTES) {
  test(`${path}: one h1 + no axe violations (light and dark)`, async ({
    page,
  }) => {
    // Reduced motion makes scroll reveals instant, so axe never samples a
    // colour mid-fade (blended values are a false contrast failure — the same
    // gradient/transition blind spot seen throughout the build).
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);

    for (const dark of [false, true]) {
      await page.evaluate((d) => {
        document.documentElement.classList.toggle("dark", d);
      }, dark);
      await page.waitForTimeout(300);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, `${path} ${dark ? "dark" : "light"}`).toEqual(
        [],
      );
    }
  });

  test(`${path}: no horizontal scroll (320–1440)`, async ({ page }) => {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `${path} @ ${width}px`).toBe(false);
    }
  });
}

test("blog post has BlogPosting JSON-LD with author + reviewer", async ({
  page,
}) => {
  await page.goto("/blog/fixed-vs-mix-and-match-bundle");
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  const post = blocks
    .map((b) => JSON.parse(b))
    .find((p) => p["@type"] === "BlogPosting");

  expect(post).toBeTruthy();
  expect(post.author.name).toBe("Syeda Rehnoma Tanzom");
  expect(post.reviewedBy.name).toBe("Technical Support Team");
});

test("blog pagination page 1 redirects to /blog", async ({ page }) => {
  const res = await page.goto("/blog/page/1");
  expect(new URL(page.url()).pathname).toBe("/blog");
  expect(res?.ok()).toBeTruthy();
});

test("unknown blog slug returns 404", async ({ page }) => {
  const res = await page.goto("/blog/this-post-does-not-exist");
  expect(res?.status()).toBe(404);
});

test("changelog filter narrows entries", async ({ page }) => {
  await page.goto("/changelog");
  const all = await page.locator("ol > li").count();
  await page.getByRole("button", { name: "Launch", exact: true }).click();
  const launch = await page.locator("ol > li").count();
  expect(launch).toBeGreaterThan(0);
  expect(launch).toBeLessThan(all);
});

test("changelog paginates and renders HTML bodies", async ({ page }) => {
  await page.goto("/changelog");

  const nav = page.getByRole("navigation", { name: "Changelog pages" });
  await expect(nav).toBeVisible();

  // Page 1 caps at 15 entries; bodies are rendered HTML, not escaped tags.
  const firstBefore = await page.locator("ol > li h2").first().textContent();
  expect(await page.locator("ol > li").count()).toBeLessThanOrEqual(15);
  await expect(page.locator("ol > li .prose-pb").first()).toBeVisible();

  await nav.getByRole("button", { name: "Next" }).click();
  const firstAfter = await page.locator("ol > li h2").first().textContent();
  expect(firstAfter).not.toBe(firstBefore);
});

test("faq search filters questions and keeps full FAQPage JSON-LD", async ({
  page,
}) => {
  await page.goto("/faq");

  // Full structured data regardless of the client search.
  const faq = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  )
    .map((b) => JSON.parse(b))
    .find((p) => p["@type"] === "FAQPage");
  expect(faq.mainEntity.length).toBeGreaterThanOrEqual(8);

  const before = await page.getByRole("button", { expanded: false }).count();
  await page.getByLabel("Search questions").fill("trial");
  const after = await page.getByRole("button", { expanded: false }).count();
  expect(after).toBeLessThan(before);
});

test("faq questions are deep-linkable via slug anchors", async ({ page }) => {
  await page.goto("/faq");
  await expect(page.locator("#free-trial")).toHaveCount(1);
});

test("docs article shows the sidebar with the current page marked", async ({
  page,
}) => {
  await page.goto("/docs/installation");
  const current = page
    .getByRole("navigation", { name: "Documentation" })
    .getByRole("link", { name: "Installation" });
  await expect(current).toHaveAttribute("aria-current", "page");
});

test("partner cards open in a new tab safely", async ({ page }) => {
  await page.goto("/partner");
  const visit = page.getByRole("link", { name: /Visit/ }).first();
  await expect(visit).toHaveAttribute("target", "_blank");
  await expect(visit).toHaveAttribute("rel", /noopener/);
});
