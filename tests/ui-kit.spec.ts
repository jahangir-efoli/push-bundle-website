import { test, expect } from "@playwright/test";

/**
 * Phase 1 exit criteria (docs/PLAN.md §10):
 * components are keyboard operable, expose correct ARIA, and meet
 * the ≥44px touch-target standard.
 */

test("accordion exposes ARIA state and toggles", async ({ page }) => {
  await page.goto("/ui-preview");

  const trigger = page.getByRole("button", {
    name: /What types of bundles can I create/i,
  });

  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  // Panel content becomes visible and is a labelled region.
  const panelId = await trigger.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);
  await expect(panel).toBeVisible();
  await expect(panel).toHaveAttribute("role", "region");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("tabs support arrow-key navigation", async ({ page }) => {
  await page.goto("/ui-preview");

  const tabs = page.getByRole("tab");
  const first = tabs.nth(0);
  const second = tabs.nth(1);

  await first.focus();
  await expect(first).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("ArrowRight");
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute("aria-selected", "true");
  await expect(first).toHaveAttribute("aria-selected", "false");

  // Home returns to the first tab.
  await page.keyboard.press("Home");
  await expect(first).toBeFocused();
});

test("dropdown opens, closes on Escape, and returns focus", async ({ page }) => {
  await page.goto("/ui-preview");

  // Scoped to main — the header also has a "Resources" dropdown.
  const trigger = page.locator("main").getByRole("button", { name: /Resources/i });
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menu")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test("form fields have labels and wire errors via aria-describedby", async ({
  page,
}) => {
  await page.goto("/ui-preview");

  // Accessible name comes from the visible <label>.
  const subject = page.getByLabel("Subject");
  await expect(subject).toHaveAttribute("aria-invalid", "true");

  const describedBy = await subject.getAttribute("aria-describedby");
  expect(describedBy).toBeTruthy();
  await expect(page.locator(`#${describedBy}`)).toHaveText(
    "Please enter a subject.",
  );

  // A healthy field is not marked invalid.
  await expect(page.getByLabel("Full Name")).not.toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("interactive controls meet the 44px touch-target standard", async ({
  page,
}) => {
  await page.goto("/ui-preview");

  // Scoped to our own content — excludes the Next.js dev-overlay indicator.
  const buttons = page.locator("main").getByRole("button");
  const count = await buttons.count();

  for (let i = 0; i < count; i++) {
    const box = await buttons.nth(i).boundingBox();
    if (!box) continue;
    const name = (await buttons.nth(i).textContent())?.trim().slice(0, 40);
    expect(box.height, `"${name}" is only ${box.height}px tall`).toBeGreaterThanOrEqual(44);
  }
});
