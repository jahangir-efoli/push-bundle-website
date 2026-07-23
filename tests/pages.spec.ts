import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 5 exit criteria (docs/PLAN.md §10):
 * the four static pages render correctly, are accessible in light + dark,
 * and hold across the responsive matrix.
 */

const PAGES = [
  "/features",
  "/pricing",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
];

for (const path of PAGES) {
  test(`${path}: exactly one h1`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test(`${path}: no accessibility violations (light and dark)`, async ({
    page,
  }) => {
    await page.goto(path);
    for (const dark of [false, true]) {
      await page.evaluate((d) => {
        document.documentElement.classList.toggle("dark", d);
      }, dark);
      await page.waitForTimeout(400);

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(results.violations, `${path} ${dark ? "dark" : "light"}`).toEqual(
        [],
      );
    }
  });

  test(`${path}: no horizontal scroll (320–1920)`, async ({ page }) => {
    for (const width of [320, 375, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflows, `${path} @ ${width}px`).toBe(false);
    }
  });
}

test("pricing: yearly toggle shows the corrected $134.40 price", async ({
  page,
}) => {
  await page.goto("/pricing");

  // Monthly is the default.
  await expect(page.getByText("$14", { exact: false }).first()).toBeVisible();

  await page.getByRole("switch").click();
  await expect(page.getByText("$134.40")).toBeVisible();
  await expect(page.getByText("/year").first()).toBeVisible();
});

test("pricing: Growth plan links to the Shopify App Store", async ({ page }) => {
  await page.goto("/pricing");
  const ctas = page.getByRole("link", { name: "Get it on Shopify" });
  await expect(ctas.first()).toHaveAttribute(
    "href",
    "https://apps.shopify.com/push-bundle",
  );
});

test("contact form: shows inline errors and wires aria-describedby", async ({
  page,
}) => {
  await page.goto("/contact-us");
  await page.getByRole("button", { name: "Submit Form" }).click();

  const name = page.getByLabel("Full Name");
  await expect(name).toHaveAttribute("aria-invalid", "true");
  const described = await name.getAttribute("aria-describedby");
  expect(described).toBeTruthy();
  await expect(page.locator(`#${described}`)).toContainText("enter your name");
});

test("contact form: valid submission shows success", async ({ page }) => {
  await page.goto("/contact-us");
  const form = page.locator("form").filter({ hasText: "Submit Form" });
  await form.getByLabel("Full Name").fill("Jane Merchant");
  await form.getByLabel("Email").fill("jane@store.com");
  await form.getByLabel("Subject").fill("Bundle question");
  await form.getByLabel("Your Message").fill("How do volume bundles work?");
  await form.getByRole("button", { name: "Submit Form" }).click();

  await expect(page.getByText(/message received/i)).toBeVisible();
});

test("privacy: TOC anchors resolve to real sections", async ({ page }) => {
  await page.goto("/privacy-policy");
  const toc = page.getByRole("navigation", { name: "On this page" });
  const links = toc.getByRole("link");
  const count = await links.count();
  expect(count).toBe(9);

  for (let i = 0; i < count; i++) {
    const href = await links.nth(i).getAttribute("href");
    expect(href).toMatch(/^#/);
    await expect(page.locator(href!)).toHaveCount(1);
  }
});
