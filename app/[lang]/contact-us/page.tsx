import type { Metadata } from "next";
import { cms } from "@/lib/cms";
import { pageMetadata } from "@/lib/seo/metadata";
import { isLocale, type Locale } from "@/i18n/config";
import { getCommon, getContactContent } from "@/i18n/content";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { IconTile, type IconName } from "@/components/ui/icon";
import { ContactForm } from "@/components/sections/contact-form";
import { getContactConfig } from "@/lib/cms/contact";
import { FaqSection } from "@/components/sections/faq-section";
import { TrialCta } from "@/components/sections/trial-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbLd } from "@/lib/seo/structured-data";
import { site } from "@/lib/site-config";
import { contactDetails } from "@/lib/content/contact";

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const { meta } = await getContactContent(locale);
  return pageMetadata({
    title: meta.title,
    description: meta.description,
    path: "/contact-us",
    locale,
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
export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const locale = toLocale(lang);

  const [content, common, faqs, contactConfig] = await Promise.all([
    getContactContent(locale),
    getCommon(locale),
    cms.listFaqs({ locale, limit: 4 }),
    getContactConfig(),
  ]);

  const { hero, sidebar, methods, form } = content;

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
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      />

      {/* pt-0: the PageHero already provides the top gap — avoid a double one. */}
      <Section className="pt-0!">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <ContactForm
            content={form}
            hcaptcha={{
              enabled: contactConfig.hcaptchaEnabled,
              siteKey: contactConfig.hcaptchaSiteKey,
            }}
          />

          <div>
            <h2 className="font-display text-xl font-bold">{sidebar.tagline}</h2>
            <p className="mt-2 text-muted">{sidebar.taglineBody}</p>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-foreground">
                  {sidebar.emailLabel}
                </dt>
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
                <dt className="font-semibold text-foreground">
                  {sidebar.phoneLabel}
                </dt>
                <dd className="text-muted">{contactDetails.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  {sidebar.addressLabel}
                </dt>
                <dd className="text-muted">{contactDetails.address}</dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground">
                  {sidebar.hoursLabel}
                </dt>
                <dd className="text-muted">{sidebar.hoursValue}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* Three contact-method cards */}
      <Section tone="alt">
        <ul className="grid gap-6 md:grid-cols-3">
          {methods.map((method) => (
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

      <FaqSection
        items={faqs}
        eyebrow={common.faq.eyebrow}
        title={common.faq.title}
      />
      <TrialCta content={common.trialCta} />
    </>
  );
}
