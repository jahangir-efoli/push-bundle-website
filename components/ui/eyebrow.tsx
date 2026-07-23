import { cn } from "@/lib/utils";

/**
 * Warm section label above a heading (docs/PLAN.md §6 warm accent).
 * Adds energy + hierarchy; consistent across all homepage sections.
 * `onDark` uses the dark-surface warm shade for contrast.
 */
export function Eyebrow({
  children,
  className,
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <p
      className={cn(
        "text-sm font-semibold uppercase tracking-widest",
        onDark ? "text-(--pb-coral-400)" : "text-warm-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
