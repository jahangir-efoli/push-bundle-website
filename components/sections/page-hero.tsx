import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";

/**
 * Shared compact page header for interior pages (docs/PLAN.md §5.2–5.5, §5.10).
 * Light, brand-tinted band with an optional warm eyebrow — keeps every
 * interior page consistent with the homepage's visual language.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: [
            "radial-gradient(42rem 24rem at 10% -40%, rgba(47,107,255,.16), transparent 60%)",
            "radial-gradient(36rem 22rem at 92% -30%, rgba(58,217,238,.14), transparent 60%)",
          ].join(","),
        }}
      />
      <Container className="py-16 lg:py-20">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-3xl text-display-lg text-balance">{title}</h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg text-muted">{subtitle}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </section>
  );
}
