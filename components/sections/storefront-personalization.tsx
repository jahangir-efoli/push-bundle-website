import { Container } from "@/components/ui/container";
import { AnimateIn } from "@/components/motion/animate-in";
import { Icon, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { storefront } from "@/lib/content/home";
import { cn } from "@/lib/utils";

/**
 * "Next-Level Bundling: Dynamic Storefront Personalization" (§5.1 §5).
 *
 * This is the site's single deliberate DARK moment (docs/PLAN.md §5.1 revisions
 * 2026-07-22). Rather than a flat near-black band, it's a rich deep-indigo
 * gradient with brand + warm glows, so it reads as a premium highlight instead
 * of "the site went dark". The last column carries the warm accent to inject
 * commerce energy.
 */
export function StorefrontPersonalization() {
  return (
    <section
      id="storefront"
      className="relative isolate overflow-hidden bg-(--pb-indigo-900) py-section text-white"
    >
      {/* Rich brand + warm glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // Glows are kept OFF the top-left header area so the coral eyebrow
          // stays on dark indigo (contrast); axe can't see contrast over these.
          backgroundImage: [
            "radial-gradient(46rem 32rem at 78% -12%, rgba(47,107,255,.5), transparent 60%)",
            "radial-gradient(38rem 28rem at 100% 20%, rgba(58,217,238,.24), transparent 60%)",
            "radial-gradient(40rem 30rem at 88% 118%, rgba(255,107,74,.24), transparent 60%)",
          ].join(","),
        }}
      />

      <Container>
        <div className="max-w-3xl">
          <Eyebrow onDark>Storefront personalization</Eyebrow>
          <h2 className="mt-3 text-display-md">{storefront.title}</h2>
          <p className="mt-4 text-lg opacity-80">{storefront.subtitle}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {storefront.columns.map((column, i) => {
            const isImpact = i === storefront.columns.length - 1;
            return (
              <AnimateIn key={column.title} delay={i * 0.1} className="h-full">
                <div
                  className={cn(
                    "h-full rounded-2xl border p-6 backdrop-blur-sm",
                    isImpact
                      ? "border-(--pb-coral-400)/40 bg-(--pb-coral-500)/10"
                      : "border-white/10 bg-white/5",
                  )}
                >
                  <span
                    className={cn(
                      "inline-grid size-12 place-items-center rounded-xl border",
                      isImpact
                        ? "border-(--pb-coral-400)/40 bg-(--pb-coral-500)/15 text-(--pb-coral-400)"
                        : "border-white/15 bg-white/10 text-accent",
                    )}
                  >
                    <Icon name={column.icon as IconName} />
                  </span>
                  <h3 className="mt-5 text-display-sm">{column.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {column.points.map((point) => (
                      <li key={point} className="flex gap-3 opacity-90">
                        <span
                          aria-hidden="true"
                          className={
                            isImpact
                              ? "text-(--pb-coral-400)"
                              : "text-accent"
                          }
                        >
                          ✓
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
