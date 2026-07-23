import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { BundleMockup } from "@/components/visuals/bundle-mockup";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mobileExperience } from "@/lib/content/home";

/** "Seamless Mobile Bundling Experience" (docs/PLAN.md §5.1 §6). */
export function MobileExperience() {
  return (
    <Section tone="wash">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Mobile-first</Eyebrow>
          <h2 className="mt-3 text-display-md">{mobileExperience.title}</h2>

          <div className="mt-8 space-y-6">
            {mobileExperience.items.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.08}>
                <div className="flex gap-4">
                  <IconTile
                    name={item.icon as IconName}
                    className="size-11 shrink-0 rounded-lg"
                  />
                  <div>
                    <h3 className="font-display text-lg font-bold">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-muted">{item.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <Link
            href="/docs"
            className="mt-8 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
          >
            {mobileExperience.cta}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </Link>
        </div>

        {/* Phone frame */}
        <div className="mx-auto w-full max-w-[18rem] rounded-[2rem] border-8 border-foreground/85 bg-brand-gradient p-3 shadow-lift">
          <BundleMockup />
        </div>
      </div>
    </Section>
  );
}
