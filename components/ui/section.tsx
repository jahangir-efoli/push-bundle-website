import { cn } from "@/lib/utils";
import { Container } from "./container";

/**
 * Page section with consistent vertical rhythm and a background role.
 * Background variants map to the section-background scheme in docs/PLAN.md §6.
 */
type Tone = "default" | "alt" | "subtle" | "wash" | "inverse" | "gradient";

const TONE: Record<Tone, string> = {
  // Transparent so the fixed ambient aurora (globals.css) shows through; the
  // solid page colour still sits beneath it, so text contrast is unchanged.
  default: "text-foreground",
  alt: "bg-surface text-foreground",
  subtle: "bg-surface-subtle text-foreground",
  // Soft brand wash (§6) — airy in light, gently lifted in dark.
  wash: "section-wash text-foreground",
  inverse: "bg-inverse text-inverse-foreground",
  gradient: "bg-brand-gradient text-white",
};

export function Section({
  children,
  className,
  innerClassName,
  tone = "default",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: Tone;
  id?: string;
}) {
  return (
    // overflow-x-clip: horizontal AnimateIn reveals start translated on the
    // x-axis, which would otherwise push the page wider and create horizontal
    // scroll on narrow screens. `clip` (not `hidden`) avoids creating a scroll
    // container, so sticky positioning still works.
    <section
      id={id}
      className={cn("overflow-x-clip py-section", TONE[tone], className)}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  );
}
