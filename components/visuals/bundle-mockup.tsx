import { cn } from "@/lib/utils";

/**
 * Decorative "build a box" product mockup.
 *
 * Pure CSS/SVG on purpose: real product screenshots are still outstanding
 * (docs/PLAN.md §9 #10) and shipping zero image bytes keeps the hero's LCP
 * text-only and fast (§7). Replace with <Image priority> once assets land.
 *
 * aria-hidden — it carries no information the copy doesn't already state.
 */
export function BundleMockup({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-2xl border border-white/15 bg-white/10 p-4 shadow-lift backdrop-blur-sm",
        className,
      )}
    >
      <div className="rounded-xl bg-surface p-4">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-24 rounded-full bg-foreground/15" />
          <div className="rounded-md bg-primary-subtle px-2 py-1">
            <div className="h-2 w-12 rounded-full bg-primary/70" />
          </div>
        </div>

        {/* Pack size selector */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-lg border p-3",
                i === 1
                  ? "border-primary bg-primary-subtle"
                  : "border-border bg-surface-subtle",
              )}
            >
              <div className="mx-auto h-6 w-6 rounded-md bg-foreground/10" />
              <div className="mx-auto mt-2 h-1.5 w-8 rounded-full bg-foreground/15" />
            </div>
          ))}
        </div>

        {/* Variant grid */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            "bg-primary/70",
            "bg-accent/70",
            "bg-foreground/15",
            "bg-primary/40",
            "bg-foreground/10",
            "bg-accent/50",
            "bg-primary/25",
            "bg-foreground/15",
          ].map((tone, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg border border-border bg-surface-subtle p-1.5"
            >
              <div className={cn("h-full w-full rounded-md", tone)} />
            </div>
          ))}
        </div>

        {/* Total + CTA */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-subtle p-3">
          <div className="space-y-1.5">
            <div className="h-1.5 w-10 rounded-full bg-foreground/15" />
            <div className="h-2.5 w-16 rounded-full bg-foreground/30" />
          </div>
          <div className="h-8 w-24 rounded-lg bg-brand-gradient" />
        </div>
      </div>
    </div>
  );
}
