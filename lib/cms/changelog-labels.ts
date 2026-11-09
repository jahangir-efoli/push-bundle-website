import type { ChangelogCategory } from "./types";

/**
 * Changelog label helpers, shared by the CMS mapper (server) and the timeline
 * (client) — keep this file free of server-only imports.
 *
 * Labels are DISPLAYED exactly as the editor entered them in the CMS
 * ("NEW FEATURE" stays "NEW FEATURE"). The loose matching below is only used
 * to order the filter tabs and to pick a fallback tone when the CMS sends no
 * colour.
 */

/**
 * Label spellings → known category. Keys are lowercased with everything but
 * letters stripped, so "NEW FEATURE", "New feature" and "new-feature" match.
 */
const ALIASES: Record<string, ChangelogCategory> = {
  newfeature: "New Feature",
  newfeatures: "New Feature",
  new: "New Feature",
  feature: "New Feature",
  improved: "Improved",
  improvement: "Improved",
  improvements: "Improved",
  enhancement: "Improved",
  enhancements: "Improved",
  enhanced: "Improved",
  fixed: "Fixed",
  fix: "Fixed",
  fixes: "Fixed",
  bugfix: "Fixed",
  bugfixes: "Fixed",
  recognition: "Recognition",
  award: "Recognition",
  launch: "Launch",
  launched: "Launch",
};

/** The known category a label corresponds to, if any. */
export function knownChangelogCategory(
  label: string,
): ChangelogCategory | undefined {
  return ALIASES[label.toLowerCase().replace(/[^a-z]/g, "")];
}

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** A CMS colour if it's a usable hex (`#rgb` / `#rrggbb`), else undefined. */
export function parseLabelColor(value?: string | null): string | undefined {
  const v = value?.trim();
  return v && HEX.test(v) ? v : undefined;
}

/**
 * Black or white — whichever reads better on `hex` (WCAG relative-luminance
 * contrast). Lets the badge use the exact CMS colour as its background and
 * still meet AA text contrast for any colour an editor picks.
 */
export function readableTextOn(hex: string): "#000000" | "#ffffff" {
  const h = hex.slice(1);
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  // Contrast vs black = (lum + 0.05) / 0.05; vs white = 1.05 / (lum + 0.05).
  return (lum + 0.05) / 0.05 >= 1.05 / (lum + 0.05) ? "#000000" : "#ffffff";
}
