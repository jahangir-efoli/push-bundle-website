"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale, localizePath, defaultLocale, type Locale } from "@/i18n/config";

/**
 * Locale-aware internal link (docs/PLAN.md §8).
 *
 * Auto-prefixes an internal `href` with the current URL's locale, so navigation
 * stays within the active language (e.g. on `/de/blog`, a card link to
 * `/blog/x` resolves to `/de/blog/x`). External/hash hrefs pass through
 * untouched. Client component so it can read the URL; usable inside server
 * components.
 */
export function LocaleLink({
  href,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href: string }) {
  const pathname = usePathname();
  const first = pathname.split("/")[1] ?? "";
  const current: Locale = isLocale(first) ? first : defaultLocale;

  const isInternal = href.startsWith("/");
  const resolved = isInternal ? localizePath(href, current) : href;

  return <Link href={resolved} {...props} />;
}
