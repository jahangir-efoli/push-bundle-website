import { test, expect } from "@playwright/test";

/**
 * Help centre (docs/PLAN.md §5.8): home, search, topic and article pages,
 * against the fixture docs (2 topics, 7 guides; the volume-bundle guide
 * carries an embedded walkthrough).
 */

test("docs home: hero search, quick start and topic cards", async ({ page }) => {
  await page.goto("/docs");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "How can we help you bundle?",
  );
  await expect(page.getByText("7 guides")).toBeVisible();

  // Quick start resolves today's CMS slugs, in order.
  const steps = page.getByRole("heading", { name: /Launch your first bundle in 3 steps/ });
  await expect(steps).toBeVisible();
  await expect(page.getByRole("link", { name: /^1\s*Installation/ })).toHaveAttribute(
    "href",
    "/docs/installation",
  );

  // Each topic card links to its topic page.
  await expect(page.getByRole("link", { name: "View all 5 guides" })).toHaveAttribute(
    "href",
    "/docs/category/setup-process",
  );
});

test("docs search: suggestions, keyboard, and the results page", async ({ page }) => {
  await page.goto("/docs");
  const box = page.getByRole("combobox", { name: "Search the docs" });

  // "/" focuses the search from anywhere.
  await page.locator("body").press("/");
  await expect(box).toBeFocused();

  await box.fill("mix");
  await expect(box).toHaveAttribute("aria-expanded", "true");
  const options = page.getByRole("option");
  await expect(options).toHaveCount(3); // 2 guides + "See all results"
  await expect(options.first()).toContainText("Mix and Match Single Product");

  // ↓ then Enter opens the highlighted guide.
  await box.press("ArrowDown");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/docs\/mix-and-match-single-product$/);

  // Enter with nothing highlighted goes to the full results page.
  await page.goto("/docs");
  await box.fill("bundle");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/docs\/search\?q=bundle$/);
  await expect(page.getByText("3 results for “bundle”")).toBeVisible();
  await expect(page.getByRole("link", { name: /How to setup volume bundle/ })).toBeVisible();
});

test("docs search page: empty state, and kept out of the index", async ({ page }) => {
  await page.goto("/docs/search?q=zzzz");
  await expect(page.getByText("0 results for “zzzz”")).toBeVisible();
  await expect(page.getByRole("link", { name: "ask our team" })).toHaveAttribute(
    "href",
    "/contact-us",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("docs topic page lists its guides in order", async ({ page }) => {
  await page.goto("/docs/category/setup-process");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Setup Process");
  const guides = page
    .locator("main li")
    .filter({ has: page.getByRole("link", { name: /min read/ }) });
  await expect(guides).toHaveCount(5);
  await expect(
    page.getByRole("navigation", { name: "Topics" }).getByRole("link", { name: /Setup Process/ }),
  ).toHaveAttribute("aria-current", "page");

  const missing = await page.goto("/docs/category/no-such-topic");
  expect(missing?.status()).toBe(404);
});

test("docs article: meta, walkthrough embed and the eFoli parts", async ({ page }) => {
  await page.goto("/docs/how-to-setup-volume-bundle");
  await expect(page.getByText("3 steps")).toBeVisible();
  await expect(page.getByText("2 min read")).toBeVisible();

  // The CMS iframe is lifted into the video slot, sandboxed (srcdoc).
  const embed = page.locator('iframe[title="Volume bundle walkthrough"]');
  await expect(embed).toHaveAttribute("sandbox", "allow-scripts");
  await expect(page.frameLocator('iframe[title="Volume bundle walkthrough"]').getByText("Step 1 of 3")).toBeVisible();

  await expect(page.locator(".doc-callout")).toContainText("Before you start:");
  await expect(page.locator(".doc-steps > li")).toHaveCount(3);
  await expect(page.locator(".doc-done")).toContainText("You're done");

  // Breadcrumb links back to the topic page.
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Setup Process" }),
  ).toHaveAttribute("href", "/docs/category/setup-process");
});

test("docs feedback sends a GA event and thanks the reader", async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { gtag: (...a: unknown[]) => void; __ga: unknown[][] };
    w.__ga = [];
    w.gtag = (...args) => w.__ga.push(args);
  });
  await page.goto("/docs/installation");
  await page.getByRole("button", { name: "Yes" }).click();
  await expect(page.getByText("Thanks! Glad it helped.")).toBeVisible();
  const events = await page.evaluate(() => (window as unknown as { __ga: unknown[][] }).__ga);
  expect(events).toContainEqual([
    "event",
    "doc_feedback",
    { doc_slug: "installation", helpful: "yes" },
  ]);
});

test("sitemap lists the docs topic pages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  expect(xml).toContain("https://pushbundle.com/docs/category/setup-process");
});
