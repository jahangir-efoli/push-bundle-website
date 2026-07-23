import { cn } from "@/lib/utils";

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

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
