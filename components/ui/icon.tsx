import { cn } from "@/lib/utils";

/**
 * Inline stroke icons (docs/PLAN.md §6).
 *
 * Hand-rolled rather than an icon package: these ship as markup with zero JS
 * and zero extra requests, and inherit `currentColor` so they follow the
 * semantic token system. Always decorative — label the surrounding content.
 */

export type IconName =
  | "layers"
  | "wand"
  | "calendar"
  | "cart"
  | "gauge"
  | "globe"
  | "sparkles"
  | "shield";

const PATHS: Record<IconName, React.ReactNode> = {
  // Multiple bundling options — stacked packs
  layers: (
    <>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5" />
      <path d="m4 16.5 8 4.5 8-4.5" />
    </>
  ),
  // Dynamic previews / one-click customization
  wand: (
    <>
      <path d="M15 4V2M15 10V8M12.5 6h-2M19.5 6h-2" />
      <path d="m3 21 9.5-9.5" />
      <path d="m13 8 3 3" />
      <path d="M18 15v-2M21 17h-2" />
    </>
  ),
  // Scheduling
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2 11h10l2-7H6" />
      <circle cx="9" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </>
  ),
  gauge: (
    <>
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="m12 12 5-3" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3Z" />
      <path d="M18 15.5 18.9 18l2.5.9-2.5.9-.9 2.5-.9-2.5-2.5-.9 2.5-.9.9-2.5Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

export function Icon({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
    >
      {PATHS[name]}
    </svg>
  );
}

/** Gradient tile that houses an icon — the section's main visual accent. */
export function IconTile({
  name,
  className,
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-grid size-12 place-items-center rounded-xl bg-brand-gradient text-white shadow-soft",
        className,
      )}
    >
      <Icon name={name} />
    </span>
  );
}
