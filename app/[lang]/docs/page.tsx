import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
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
            className="group mt-4 inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary"
          >
            Contact support
            <Icon
              name="arrow-right"
              className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Container>
    </>
  );
}
