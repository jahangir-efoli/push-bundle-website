import { cn } from "@/lib/utils";

/**
 * Button (docs/PLAN.md §6 semantic UI roles).
 * Server Component — no client JS. Use `buttonStyles` to style <Link>/<a>.
 * All sizes are ≥44px tall to satisfy the touch-target standard.
 */

export type ButtonVariant =
  | "primary"
  | "gradient"
  | "secondary"
  | "tertiary"
  /** Solid white — for use ON the brand gradient / dark surfaces. */
  | "inverse"
  /** Outlined white — secondary action on the brand gradient. */
  | "inverseOutline";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover shadow-glow hover:-translate-y-0.5",
  gradient:
    "bg-brand-gradient text-white shadow-glow hover:-translate-y-0.5 hover:shadow-lift",
  secondary:
    "border border-primary text-primary bg-transparent hover:bg-primary-subtle",
  tertiary: "text-foreground bg-transparent hover:bg-surface-subtle",
  // These exist as real variants rather than className overrides: Tailwind's
  // CSS source order makes `text-*`/`bg-*` overrides on buttonStyles()
  // unreliable, which once shipped white-on-white invisible CTA text.
  inverse:
    "bg-white text-[color:var(--pb-indigo-700)] shadow-soft hover:bg-white/90",
  inverseOutline:
    "border border-white/60 bg-transparent text-white hover:bg-white/10",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-11 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
    "transition-[background-color,transform,box-shadow] duration-200",
    "disabled:pointer-events-none disabled:border disabled:border-border",
    "disabled:bg-transparent disabled:text-muted disabled:shadow-none",
    VARIANT[variant],
    SIZE[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button className={buttonStyles({ variant, size, className })} {...props} />
  );
}
