import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { Eyebrow } from "@/components/ui/eyebrow";
import { comingSoon } from "@/lib/content/home";

/**
 * Roadmap teaser (docs/PLAN.md §5.1 §7).
 * Uses the warm accent — "what's next" is an energetic moment, and it
 * visually distinguishes upcoming (warm) from shipped (blue) features.
 */
export function ComingSoon() {
  return (
    <Section tone="subtle">
      <div className="max-w-2xl">
        <Eyebrow>On the roadmap</Eyebrow>
        <h2 className="mt-3 text-display-md">{comingSoon.title}</h2>
        <p className="mt-4 text-muted">{comingSoon.subtitle}</p>
      </div>

      <ul className="mt-8 flex flex-wrap gap-3">
        {comingSoon.items.map((item, i) => (
          <li key={item}>
            <AnimateIn delay={i * 0.05} direction="none">
              <span className="inline-flex items-center gap-2 rounded-lg border border-warm/30 bg-warm-subtle px-4 py-2 text-sm font-semibold text-warm-foreground">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-warm"
                />
                {item}
              </span>
            </AnimateIn>
          </li>
        ))}
      </ul>
    </Section>
  );
}
