import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Phase 2 exit criteria (docs/PLAN.md §10):
 * navigation fully keyboard-operable; a11y gate passes on chrome + 404.
 */

test("skip link is the first tab stop and reaches main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible(); // becomes visible on focus

  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeVisible();
});

test("exactly one main landmark and one h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
});

test("header marks the current page", async ({ page }, testInfo) => {
  // The desktop nav is intentionally hidden below md — check it only there.
  test.skip(
    (testInfo.project.use.viewport?.width ?? 1280) < 768,
    "desktop nav is hidden on mobile; the drawer is covered separately",
  );

  await page.goto("/");
  const home = page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Home" });
  await expect(home).toHaveAttribute("aria-current", "page");
});

test("theme toggle switches theme and persists it", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: /Switch to (dark|light) theme/ });
  const before = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );

  await toggle.click();
  const after = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  expect(after).toBe(!before);

  // Choice survives a reload, applied before paint by ThemeScript.
  await page.reload();
  const persisted = await page.evaluate(() =>
    document.documentElement.classList.contains("dark"),
  );
  expect(persisted).toBe(after);
});

test("mobile drawer traps focus, closes on Escape, and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/");

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Menu" });
  await expect(dialog).toBeVisible();

  // Focus moved into the drawer.
  const focusedInDialog = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    return !!dlg && dlg.contains(document.activeElement);
  });
  expect(focusedInDialog).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("cookie consent records a decision and stays dismissed", async ({ page }) => {
  await page.goto("/");

  const banner = page.getByRole("dialog", { name: /We use cookies/i });
  await expect(banner).toBeVisible();

  await page.getByRole("button", { name: "Accept" }).click();
  await expect(banner).toHaveCount(0);

  expect(await page.evaluate(() => localStorage.getItem("pb-consent"))).toBe(
    "granted",
  );

  await page.reload();
  await expect(
    page.getByRole("dialog", { name: /We use cookies/i }),
  ).toHaveCount(0);
});

test("404 page renders branded content", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /This page went missing/i }),
  ).toBeVisible();
});

test("chrome has no accessibility violations (light and dark)", async ({
  page,
}) => {
  await page.goto("/");

  for (const dark of [false, true]) {
    await page.evaluate((d) => {
      document.documentElement.classList.toggle("dark", d);
    }, dark);

    // Let colour transitions finish — axe would otherwise sample a blended
    // mid-transition background and report false contrast failures.
    await page.waitForTimeout(400);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations, dark ? "dark theme" : "light theme").toEqual([]);
  }
});

test("header height is stable while scrolling (no layout shake)", async ({
  page,
}) => {
  // Animating the sticky header's height changed the document height at
  // scrollY 0, shifting every element and causing a visible shake with
  // Lenis inertia. Only paint properties may transition.
  await page.goto("/");

  const measure = () =>
    page.evaluate(() => ({
      header: document.querySelector("header")!.getBoundingClientRect().height,
      doc: document.body.scrollHeight,
    }));

  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  const scrolled = await measure();

  for (const y of [200, 20, 8, 0]) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(150);
    const now = await measure();
    expect(now.header, `header height changed at scrollY ${y}`).toBe(
      scrolled.header,
    );
    expect(now.doc, `document height changed at scrollY ${y}`).toBe(
      scrolled.doc,
    );
  }
});
