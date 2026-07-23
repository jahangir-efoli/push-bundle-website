import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { DocsBrowser } from "@/components/docs/docs-browser";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Docs — Setup & Help Center",
  description:
    "Documentation for the PushBundle Shopify bundle app — installation, setup, and how-to guides.",
  path: "/docs",
    locale: lang as Locale,
  });
}

/** Docs home (docs/PLAN.md §5.8a). */
export default async function DocsPage() {
  const docs = await cms.listDocs({ locale: DEFAULT_LOCALE });

  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Docs", path: "/docs" }])} />

      <PageHero
        eyebrow="Docs"
        title="Documentation"
        subtitle="Everything you need to install, set up, and get the most out of PushBundle."
      />

      <Container className="py-16">
        <DocsBrowser docs={docs} />

        <div className="mt-16 rounded-2xl border border-border bg-surface-subtle p-8 text-center">
          <p className="font-display text-lg font-bold">Still need help?</p>
          <p className="mt-2 text-muted">
            Can&rsquo;t find what you&rsquo;re looking for? Our team is here to help.
          </p>
          <Link
            href="/contact-us"
            className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
          >
            Contact support →
          </Link>
        </div>
      </Container>
    </>
  );
}
