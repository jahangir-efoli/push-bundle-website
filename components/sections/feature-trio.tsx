import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { buttonStyles } from "@/components/ui/button";
import { featureTrio } from "@/lib/content/home";

/**
 * Feature trio (docs/PLAN.md §5.1 §3).
 *
 * Each card leads with a gradient icon tile, then a clear title/description
 * hierarchy, then three concrete capability chips — so the section scans in
 * three passes (icon → headline → specifics) instead of reading as a wall of
 * text. Icons are inline SVG: no extra requests, and they follow the tokens.
 */
export function FeatureTrio() {
  return (
    <Section tone="wash">
      <div className="max-w-2xl">
        <Eyebrow>The toolkit</Eyebrow>
        <h2 className="mt-3 text-display-md text-balance">{featureTrio.title}</h2>
        <p className="mt-4 text-lg text-muted">{featureTrio.subtitle}</p>
      </div>

      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {featureTrio.items.map((item, i) => (
          // h-full is threaded through every wrapper so all three cards match
          // height regardless of copy length; the chip row is pinned with
          // mt-auto so the bottom edges line up.
          <li key={item.title} className="h-full">
            <AnimateIn delay={i * 0.1} className="h-full">
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-background p-7 shadow-soft transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
                <IconTile
                  name={item.icon as IconName}
                  className="transition-transform duration-300 group-hover:scale-105"
                />

                {/* `text-balance` + hyphens-none stops awkward mid-word breaks */}
                <h3 className="mt-6 text-display-sm text-balance hyphens-none">
                  {item.title}
                </h3>

                <p className="mt-3 mb-6 leading-relaxed text-muted">
                  {item.description}
                </p>

                <ul className="mt-auto flex flex-wrap gap-2 border-t border-border pt-5">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="rounded-md bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </AnimateIn>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/features" className={buttonStyles({ variant: "secondary" })}>
          See more features
        </Link>
      </div>
    </Section>
  );
}
