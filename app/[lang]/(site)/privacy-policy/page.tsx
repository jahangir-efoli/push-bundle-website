import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getPrivacyContent } from "@/i18n/content";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { privacyMeta } from "@/lib/content/privacy";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getPrivacyContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/privacy-policy",
    locale,
  });
}

/** Privacy Policy (docs/PLAN.md §5.10) — static long-form with TOC anchor nav. */
export default async function PrivacyPolicyPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const content = await getPrivacyContent(locale);
  // Contact email is data (single source of truth in lib/content/privacy.ts).
  const { contactEmail } = privacyMeta;

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <PageHero eyebrow={content.eyebrow} title={content.title}>
        <p className="text-sm text-muted">
          {content.lastUpdatedLabel}: {content.lastUpdated} · {content.entity}
        </p>
      </PageHero>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
          {/* Table of contents — sticky on desktop */}
          <nav aria-label={content.onThisPage} className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              {content.onThisPage}
            </p>
            <ul className="mt-4 space-y-1">
              {content.sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-9 items-center text-sm text-muted transition-colors hover:text-primary"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Policy body */}
          <div>
            <p className="max-w-2xl text-lg text-muted">{content.intro}</p>

            <div className="mt-10 space-y-12">
              {content.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  aria-labelledby={`${section.id}-h`}
                  className="scroll-mt-24"
                >
                  <h2
                    id={`${section.id}-h`}
                    className="text-display-sm text-balance"
                  >
                    {section.heading}
                  </h2>
                  <div className="mt-4 max-w-2xl space-y-4 leading-relaxed text-muted">
                    {section.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-12 border-t border-border pt-6 text-sm text-muted">
              {content.questionsPrefix}{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary underline underline-offset-4"
              >
                {contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
