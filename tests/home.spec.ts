import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 4 exit criteria (docs/PLAN.md §10):
 * Home renders all 12 sections, CMS content flows in, structured data is
 * valid and matches the visible page, axe is clean, responsive holds.
 */

test("hero renders the H1 and both CTAs", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Boost Your AOV and Sell More With the Best Shopify Bundle App/i,
    }),
  ).toBeVisible();

  const install = page
    .getByRole("link", { name: "Install Free on Shopify" })
    .first();
  await expect(install).toHaveAttribute(
    "href",
    "https://apps.shopify.com/push-bundle",
  );

  await expect(page.getByRole("link", { name: "View Demo" })).toBeVisible();
});

test("all marketing sections are present in order", async ({ page }) => {
  await page.goto("/");

  const headings = await page.locator("main h2").allTextContents();
  const expected = [
    "Your all-in-one bundle builder",
    "A complete bundling toolkit",
    "Bigger Orders with Smart Bundling",
    "Next-Level Bundling",
    "Seamless Mobile Bundling Experience",
    "Features Coming Soon",
    "Loved by Shopify merchants",
    "Expert Reads",
    "Unlock PushBundle's Full Potential",
    "Have you got any questions?",
  ];

  for (const [i, label] of expected.entries()) {
    expect(headings[i], `section ${i} should be "${label}"`).toContain(label);
  }
});

test("CMS content renders: posts, reviews, rating, FAQ", async ({ page }) => {
  await page.goto("/");

  // Blog teaser — real seeded post.
  await expect(
    page.getByRole("link", { name: /Fixed vs Mix and Match Bundle/i }),
  ).toBeVisible();

  // Reviews — real seeded quote + aggregate from the Shopify listing. The
  // marquee duplicates cards for a seamless loop (the copy is aria-hidden), so
  // scope to the first, real occurrence.
  await expect(page.getByText(/Great support team/).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "16 reviews" })).toBeVisible();

  // FAQ teaser sourced from the same CMS as /faq.
  await expect(
    page.getByRole("button", { name: /What types of bundles can I create/i }),
  ).toBeVisible();
});

test("structured data is valid and matches the visible rating", async ({
  page,
}) => {
  await page.goto("/");

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();

  const parsed = blocks.map((b) => JSON.parse(b));
  const types = parsed.map((p) => p["@type"]);
  expect(types).toEqual(
    expect.arrayContaining(["Organization", "SoftwareApplication", "FAQPage"]),
  );

  const app = parsed.find((p) => p["@type"] === "SoftwareApplication");
  expect(app.aggregateRating.ratingValue).toBe(4.9);
  expect(app.aggregateRating.reviewCount).toBe(16);
  expect(app.review.length).toBeGreaterThan(0);

  // The rating in the markup must match what users see (Google requirement).
  await expect(page.getByText("out of 5").first()).toContainText("4.9");

  const faq = parsed.find((p) => p["@type"] === "FAQPage");
  expect(faq.mainEntity.length).toBe(5);
  expect(faq.mainEntity[0].acceptedAnswer.text.length).toBeGreaterThan(10);
});

test("hero LCP text needs no JavaScript", async ({ browser }) => {
  // The hero must paint from server HTML alone (docs/PLAN.md §7).
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Install Free on Shopify" }).first(),
  ).toBeVisible();

  await context.close();
});

test("exactly one h1 and no heading level is skipped", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);

  const levels = await page.locator("main :is(h1,h2,h3,h4)").evaluateAll((els) =>
    els.map((el) => Number(el.tagName[1])),
  );

  for (let i = 1; i < levels.length; i++) {
    expect(
      levels[i] - levels[i - 1],
      `heading jumped from h${levels[i - 1]} to h${levels[i]}`,
    ).toBeLessThanOrEqual(1);
  }
});

test("home has no accessibility violations (light and dark)", async ({
  page,
}) => {
  await page.goto("/");

  for (const dark of [false, true]) {
    await page.evaluate((d) => {
      document.documentElement.classList.toggle("dark", d);
    }, dark);
    await page.waitForTimeout(400); // let colour transitions settle

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations, dark ? "dark theme" : "light theme").toEqual([]);
  }
});

test("no horizontal scroll across the responsive matrix", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, `horizontal scroll at ${width}px`).toBe(false);
  }
});

test("scroll reveals degrade gracefully without JavaScript", async ({
  browser,
}) => {
  // Reveal styles are gated behind the `js` class, so all content must be
  // visible when JavaScript is unavailable (docs/PLAN.md §6).
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Bigger Orders with Smart Bundling" }),
  ).toBeVisible();

  const hidden = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.9,
    ).length,
  );
  expect(hidden, "reveal elements should not be hidden without JS").toBe(0);

  await context.close();
});

test("reveals are disabled under prefers-reduced-motion", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(300);

  const unrevealed = await page.evaluate(() =>
    [...document.querySelectorAll(".reveal")].filter(
      (el) => (el as HTMLElement).dataset.revealed !== "true",
    ).length,
  );
  expect(unrevealed, "all reveals should show immediately").toBe(0);

  await context.close();
});

test("no invisible text: every CTA has contrast against its own background", async ({
  page,
}) => {
  // axe cannot compute contrast over gradient backgrounds, so it silently
  // passed a white-on-white CTA. This checks button colours directly.
  await page.goto("/");

  const bad = await page.evaluate(() => {
    const parse = (c: string) =>
      (c.match(/\d+/g) ?? []).slice(0, 3).map(Number);
    const lum = ([r, g, b]: number[]) => {
      const f = (v: number) => {
        const s = v / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };

    const problems: string[] = [];
    document.querySelectorAll("main a, main button").forEach((el) => {
      const cs = getComputedStyle(el);
      const bg = parse(cs.backgroundColor);
      // Only check controls with their own opaque background.
      if (bg.length < 3 || cs.backgroundColor.includes("rgba(0, 0, 0, 0)")) return;
      const fg = parse(cs.color);
      const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      const ratio = (l1 + 0.05) / (l2 + 0.05);
      if (ratio < 3) {
        problems.push(
          `"${el.textContent?.trim().slice(0, 30)}" ${cs.color} on ${cs.backgroundColor} = ${ratio.toFixed(2)}:1`,
        );
      }
    });
    return problems;
  });

  expect(bad, `low-contrast controls:\n${bad.join("\n")}`).toEqual([]);
});

test("View Demo opens the live storefront in a new tab", async ({ page }) => {
  await page.goto("/");

  const demo = page.getByRole("link", { name: /View Demo/i });
  await expect(demo).toHaveAttribute(
    "href",
    /^https:\/\/pushbundle\.myshopify\.com\//,
  );
  await expect(demo).toHaveAttribute("target", "_blank");
  // rel=noopener protects the opener window from the new tab.
  await expect(demo).toHaveAttribute("rel", /noopener/);
});

test("hero slider shows the feature previews and dots switch slides", async ({
  page,
}) => {
  await page.goto("/");

  const carousel = page.getByRole("group", {
    name: "PushBundle feature previews",
  });
  await expect(carousel).toBeVisible();
  await expect(carousel.locator("img")).toHaveCount(3);

  const dots = carousel.getByRole("button", { name: /Show slide/ });
  await expect(dots).toHaveCount(3);

  // Clicking a dot makes that slide the current one.
  await dots.nth(2).click();
  await expect(dots.nth(2)).toHaveAttribute("aria-current", "true");
});
