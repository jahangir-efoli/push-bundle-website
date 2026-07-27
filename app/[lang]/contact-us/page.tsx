import type { Metadata } from "next";
import { cms, DEFAULT_LOCALE } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/i18n/config";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { ContactForm } from "@/components/sections/contact-form";
import { FaqSection } from "@/components/sections/faq-section";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";
import {
  contactCopy,
  contactDetails,
  contactMethods,
} from "@/lib/content/contact";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata({
  title: "Contact — Shopify Bundle App Support",
  description:
    "Get in touch with the PushBundle team. Email us, start a live chat, or book a meeting — we reply within 24 hours.",
  path: "/contact-us",
    locale: lang as Locale,
  });
}

const SITE_URL = "https://pushbundle.com";

function contactPageLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/contact-us`,
    mainEntity: {
      "@type": "Organization",
      name: site.name,
      email: contactDetails.email,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: contactDetails.email,
        availableLanguage: "English",
        areaServed: "Worldwide",
      },
    },
  };
}

/** Contact us page (docs/PLAN.md §5.4). */
export default async function ContactPage() {
  const faqs = await cms.listFaqs({ locale: DEFAULT_LOCALE, limit: 4 });

  return (
    <>
      <JsonLd data={contactPageLd()} />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Contact us", path: "/contact-us" },
        ])}
      />

      <PageHero
        eyebrow={contactCopy.eyebrow}
        title={contactCopy.title}
        subtitle={contactCopy.subtitle}
      />

      {/* pt-0: the PageHero already provides the top gap — avoid a double one. */}
      <Section className="pt-0!">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <ContactForm />

          <div>
            <h2 className="font-display text-xl font-bold">
              {contactCopy.tagline}
            </h2>
            <p className="mt-2 text-muted">{contactCopy.taglineBody}</p>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground">Email</dt>
                <dd>
                  <a
                    href={`mailto:${contactDetails.email}`}
                    className="text-primary underline underline-offset-4"
                  >
                    {contactDetails.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Phone</dt>
                <dd className="text-muted">{contactDetails.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Address</dt>
                <dd className="text-muted">{contactDetails.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">Support hours</dt>
                <dd className="text-muted">{contactDetails.hours}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* Three contact-method cards */}
      <Section tone="alt">
        <ul className="grid gap-6 md:grid-cols-3">
          {contactMethods.map((method) => (
            <li key={method.title} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft">
                <IconTile name={method.icon as IconName} />
                <h3 className="mt-5 font-display text-lg font-bold">
                  {method.title}
                </h3>
                <p className="mt-2 flex-1 text-muted">{method.body}</p>
                {/* chat → Tawk.to floating widget; meeting → Calendly deferred. */}
                <a
                  href={
                    method.kind === "email"
                      ? `mailto:${contactDetails.email}`
                      : "#"
                  }
                  className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                >
                  {method.action}
                  <span aria-hidden="true" className="ml-1">
                    →
                  </span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection items={faqs} title="Frequently asked questions" />
      <TrialCta />
    </>
  );
}
