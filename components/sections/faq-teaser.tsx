import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { Accordion } from "@/components/ui/accordion";
import { buttonStyles } from "@/components/ui/button";
import { faqTeaser } from "@/lib/content/home";
import type { FaqItem } from "@/lib/cms";

/**
 * FAQ teaser (docs/PLAN.md §5.1 §11) — CMS-driven, same source as /faq.
 * Shared with Pricing / About / Contact.
 */
export function FaqTeaser({ items }: { items: FaqItem[] }) {
  return (
    <Section tone="subtle">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-display-md">{faqTeaser.title}</h2>
          <p className="mt-4 text-muted">{faqTeaser.subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/faq" className={buttonStyles({ variant: "secondary" })}>
              {faqTeaser.cta}
            </Link>
          </div>

          <p className="mt-8 text-sm text-muted">
            {faqTeaser.supportPrompt}{" "}
            <Link
              href="/contact-us"
              className="text-primary underline underline-offset-4"
            >
              {faqTeaser.supportCta}
            </Link>
          </p>
        </div>

        <Accordion
          items={items.map((item) => ({
            question: item.question,
            answer: item.answer,
            slug: item.slug,
          }))}
        />
      </div>
    </Section>
  );
}
