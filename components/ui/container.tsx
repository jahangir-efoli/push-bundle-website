import { cn } from "@/lib/utils";

/**
 * Centered content column — max 1200px with fluid gutters (docs/PLAN.md §6).
 * Server Component: no client JS.
 */
export function Container({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main" | "nav";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-site px-gutter",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
