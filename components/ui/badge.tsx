import { cn } from "@/lib/utils";
import {
  knownChangelogCategory,
  readableTextOn,
} from "@/lib/cms/changelog-labels";

/**
 * Badge / pill (docs/PLAN.md §6).
 * Tinted background + readable status text colour (AA in light and dark).
 * Meaning is always carried by the label text, never colour alone (§6 a11y).
 * Server Component.
 */

export type BadgeTone =
  | "brand"
  | "warm"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

const TONE: Record<BadgeTone, string> = {
  brand:
    "bg-primary-subtle text-primary [.dark_&]:bg-primary/15 [.dark_&]:text-primary",
  warm: "bg-warm-subtle text-warm-foreground",
  success: "bg-success/12 text-success-foreground",
  warning: "bg-warning/15 text-warning-foreground",
  error: "bg-error/12 text-error-foreground",
  info: "bg-info/12 text-info-foreground",
  neutral: "bg-surface-subtle text-muted",
};

/** Changelog categories → tones (docs/PLAN.md §5.9). */
export const CHANGELOG_TONE = {
  "New Feature": "brand",
  Improved: "info",
  Fixed: "success",
  Recognition: "warning",
  Launch: "neutral",
} as const satisfies Record<string, BadgeTone>;

/**
 * Fallback tone for a changelog label with no CMS colour. Matched loosely
 * ("NEW FEATURE" → New Feature's tone); unknown labels are neutral.
 */
export function changelogTone(category: string): BadgeTone {
  const known = knownChangelogCategory(category);
  return known ? CHANGELOG_TONE[known] : "neutral";
}

export function Badge({
  children,
  tone = "neutral",
  color,
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  /**
   * Exact background colour (hex), e.g. from the CMS. Overrides `tone`; the
   * text is black or white, whichever meets contrast on that colour.
   */
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        !color && TONE[tone],
        className,
      )}
      style={
        color
          ? { backgroundColor: color, color: readableTextOn(color) }
          : undefined
      }
    >
      {children}
    </span>
  );
}
