import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { MobileVisual } from "@/components/visuals/mobile-visual";
import { IconTile, type IconName } from "@/components/ui/icon";
import { Eyebrow } from "@/components/ui/eyebrow";
import { mobileExperience } from "@/lib/content/home";

export type MobileContent = {
  eyebrow: string;
  title: string;
  cta: string;
  items: readonly { title: string; description: string }[];
};

/** English default so callers that don't localize still render. */
const DEFAULT_MOBILE: MobileContent = {
  eyebrow: "Mobile-first",
  title: mobileExperience.title,
  cta: mobileExperience.cta,
  items: mobileExperience.items.map((i) => ({
    title: i.title,
    description: i.description,
  })),
};

/** "Seamless Mobile Bundling Experience" (docs/PLAN.md §5.1 §6). */
export function MobileExperience({
  content = DEFAULT_MOBILE,
}: {
  content?: MobileContent;
} = {}) {
  return (
    <Section tone="wash">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 className="mt-3 text-display-md">{content.title}</h2>

          <div className="mt-8 space-y-6">
            {content.items.map((item, i) => (
              <AnimateIn key={item.title} delay={i * 0.08}>
                <div className="flex gap-4">
                  <IconTile
                    name={mobileExperience.items[i]?.icon as IconName}
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
            {content.cta}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </Link>
        </div>

        {/* Phone illustration (falls back to the code mockup until the image
            is uploaded). */}
        <MobileVisual alt={content.title} />
      </div>
    </Section>
  );
}
