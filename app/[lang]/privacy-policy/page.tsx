import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/ui/container";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { privacyMeta, privacySections } from "@/lib/content/privacy";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Privacy Policy",
  description:
    "How PushBundle (WhenLab F.Z.C) collects, uses, protects, and shares your information, including GDPR rights and cookie practices.",
  path: "/privacy-policy",
    locale: lang as Locale,
  });
}

/** Privacy Policy (docs/PLAN.md §5.10) — static long-form with TOC anchor nav. */
export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <PageHero eyebrow="Legal" title={privacyMeta.title}>
        <p className="text-sm text-muted">
          Last updated: {privacyMeta.lastUpdated} · {privacyMeta.entity}
        </p>
      </PageHero>

      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
          {/* Table of contents — sticky on desktop */}
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">
              On this page
            </p>
            <ul className="mt-4 space-y-1">
              {privacySections.map((section) => (
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
            <p className="max-w-2xl text-lg text-muted">{privacyMeta.intro}</p>

            <div className="mt-10 space-y-12">
              {privacySections.map((section) => (
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
              Questions about this policy? Email{" "}
              <a
                href={`mailto:${privacyMeta.contactEmail}`}
                className="text-primary underline underline-offset-4"
              >
                {privacyMeta.contactEmail}
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </>
  );
}
