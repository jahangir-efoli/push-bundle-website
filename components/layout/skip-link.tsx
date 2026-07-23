/**
 * Skip to content (docs/PLAN.md §6 keyboard operability).
 * Visually hidden until focused — the first stop in the tab order.
 */
export function SkipLink({ label = "Skip to content" }: { label?: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:h-11 focus:items-center focus:rounded-lg focus:bg-primary focus:px-4 focus:font-semibold focus:text-primary-foreground"
    >
      {label}
    </a>
  );
}
