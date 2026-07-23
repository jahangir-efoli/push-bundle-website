import { cn } from "@/lib/utils";

/**
 * Card surface (docs/PLAN.md §6 — soft layered depth, subtle border).
 * Server Component.
 */
export function Card({
  children,
  className,
  interactive = false,
  padded = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Adds hover lift — only use when the whole card is a link/button. */
  interactive?: boolean;
  /**
   * Applies the default `p-6`. Set false for media cards that pad their own
   * content — avoids a `p-6`/`p-0` class conflict (`cn` is not tailwind-merge,
   * so source order would otherwise decide, unreliably).
   */
  padded?: boolean;
  as?: "div" | "article" | "li";
}) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border bg-surface shadow-soft",
        padded && "p-6",
        interactive &&
          "transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardTitle({
  children,
  className,
  as: Tag = "h3",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h2" | "h3" | "h4";
}) {
  return (
    <Tag className={cn("text-display-sm wrap-break-word", className)}>
      {children}
    </Tag>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-2 text-muted wrap-break-word", className)}>{children}</p>
  );
}
