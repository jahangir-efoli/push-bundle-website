import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 0 exit criteria (docs/PLAN.md §10):
 * tokens + fonts render, a11y gate passes, no horizontal scroll.
 */

test("page renders with design tokens applied", async ({ page }) => {
  await page.goto("/ui-preview");

  await expect(
    page.getByRole("heading", { name: "UI Preview" }),
  ).toBeVisible();

  // Semantic token drives the body background (light theme = --pb-page-50).
  const bg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe("rgb(246, 247, 253)"); // --pb-page-50
});

test("brand fonts are loaded", async ({ page }) => {
  await page.goto("/ui-preview");

  const bodyFont = await page.evaluate(() =>
    getComputedStyle(document.body).fontFamily,
  );
  expect(bodyFont).toContain("Jakarta");

  const headingFont = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    return h1 ? getComputedStyle(h1).fontFamily : "";
  });
  expect(headingFont).toContain("Jakarta");
});

test("dark theme re-points semantic tokens", async ({ page }) => {
  await page.goto("/ui-preview");
  await page.evaluate(() => document.documentElement.classList.add("dark"));

  const bg = await page.evaluate(() =>
    getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).toBe("rgb(8, 10, 28)"); // --pb-bg-950
});

test("no horizontal scroll at any breakpoint", async ({ page }) => {
  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/ui-preview");

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, `horizontal scroll at ${width}px`).toBe(false);
  }
});

test("has no detectable accessibility violations", async ({ page }) => {
  await page.goto("/ui-preview");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
