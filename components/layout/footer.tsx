import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { site, socialLinks, whenlabApps } from "@/lib/site-config";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Site footer (docs/PLAN.md §4.2, §8).
 * Server Component. Newsletter posts to a real handler in Phase 9.
 */

const SOCIAL_PATH: Record<string, string> = {
  Facebook:
    "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z",
  LinkedIn:
    "M6.9 8.5H4V20h2.9V8.5ZM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.9-3 1.6V8.5H10.4V20h2.9v-6.1c0-1.3.8-2 1.8-2s1.9.6 1.9 2V20H20v-6.4Z",
  Twitter:
    "M18.9 3H21l-6.5 7.4L22 21h-6l-4.7-6.2L5.9 21H3.7l7-8L2 3h6.2l4.2 5.6L18.9 3Zm-1 16.2h1.2L7.2 4.7H5.9l12 14.5Z",
  YouTube:
    "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z",
};

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const footerLinks = [
    { label: dict.nav.contact, href: localizePath("/contact-us", locale) },
    { label: dict.nav.faq, href: localizePath("/faq", locale) },
    { label: dict.nav.privacy, href: localizePath("/privacy-policy", locale) },
    { label: dict.nav.changelog, href: localizePath("/changelog", locale) },
  ];

  return (
    <footer className="border-t border-border bg-inverse text-inverse-foreground">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">
          <div>
            <p className="font-display text-xl font-extrabold">PushBundle</p>
            <p className="mt-4 max-w-xs text-sm opacity-70">{site.tagline}</p>
            <p className="mt-6 text-sm opacity-70">
              <a href={`mailto:${site.email}`} className="underline">
                {site.email}
              </a>
            </p>
          </div>

          <nav aria-label={dict.common.usefulLinks}>
            <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
              {dict.common.usefulLinks}
            </h2>
            <ul className="mt-4 space-y-1">
              {footerLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex min-h-11 items-center text-sm opacity-80 transition-opacity hover:opacity-100 hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={dict.common.ourApps}>
            <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
              {dict.common.ourApps}
            </h2>
            <ul className="mt-4 space-y-1">
              {whenlabApps.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="flex min-h-11 items-center text-sm opacity-80 transition-opacity hover:opacity-100 hover:underline"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60">
              {dict.common.newsletterTitle}
            </h2>
            <p className="mt-4 text-sm opacity-70">
              {dict.common.newsletterBody}
            </p>
            {/*
              Uses inverse-aware styling rather than the shared <Input>, whose
              page-surface colours are unreadable on the always-dark footer.
              Wired to a real backend in Phase 9 (docs/PLAN.md §9 #12).
            */}
            <form className="mt-4 flex flex-col gap-3">
              <label
                htmlFor="footer-newsletter-email"
                className="text-sm font-semibold text-inverse-foreground"
              >
                Email address
              </label>
              <input
                id="footer-newsletter-email"
                type="email"
                name="email"
                placeholder="you@store.com"
                className="h-12 w-full rounded-lg border border-white/20 bg-white/10 px-4 text-inverse-foreground placeholder:text-inverse-foreground/60 transition-colors focus-visible:border-white/50"
              />
              <Button type="submit" variant="primary" size="sm">
                {dict.common.subscribe}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm opacity-60">
            Copyright @{site.legalEntity} 2026. All Rights Reserved.
          </p>

          <ul className="flex items-center gap-1">
            {socialLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  aria-label={item.label}
                  className="grid size-11 place-items-center rounded-lg opacity-70 transition-opacity hover:opacity-100"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="size-5"
                    fill="currentColor"
                  >
                    <path d={SOCIAL_PATH[item.label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
