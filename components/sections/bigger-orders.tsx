import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { BundleMockup } from "@/components/visuals/bundle-mockup";
import { Eyebrow } from "@/components/ui/eyebrow";
import { biggerOrders } from "@/lib/content/home";
import { cn } from "@/lib/utils";

/** "Bigger Orders with Smart Bundling" — alternating rows (docs/PLAN.md §5.1 §4). */
export function BiggerOrders() {
  return (
    <Section>
      <Eyebrow>Grow AOV</Eyebrow>
      <h2 className="mt-3 max-w-2xl text-display-md">{biggerOrders.title}</h2>

      <div className="mt-12 space-y-16">
        {biggerOrders.items.map((item, i) => {
          const reversed = i % 2 === 1;
          return (
            <AnimateIn key={item.title} direction={reversed ? "right" : "left"}>
              {/* min-w-0 on grid children: grid items default to
                  min-width:auto and would otherwise expand the track past the
                  container, causing horizontal scroll on narrow screens. */}
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className={cn("min-w-0", reversed && "md:order-2")}>
                  <h3 className="text-display-sm">{item.title}</h3>
                  <p className="mt-4 text-muted">{item.description}</p>
                  <Link
                    href={item.href}
                    className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                  >
                    Explore More
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </Link>
                </div>

                <div
                  className={cn(
                    "min-w-0 rounded-2xl bg-brand-gradient p-6",
                    reversed && "md:order-1",
                  )}
                >
                  <BundleMockup />
                </div>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </Section>
  );
}
