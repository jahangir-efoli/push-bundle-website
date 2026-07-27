"use client";

import { usePathname } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown";
import {
  isLocale,
  localeMeta,
  locales,
  localizePath,
  type Locale,
} from "@/i18n/config";

/**
 * Language switcher (docs/PLAN.md §8). Preserves the current path when
 * switching locale (e.g. `/de/pricing` → `/fr/pricing`) and sets a cookie so
 * the choice is remembered. Accessible via the shared Dropdown.
 */
export function LocaleSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();

  // Strip any locale prefix to get the bare path (e.g. "/pricing").
  const segments = pathname.split("/");
  const bare = isLocale(segments[1]) ? `/${segments.slice(2).join("/")}` : pathname;
  const barePath = bare === "" ? "/" : bare;

  return (
    <Dropdown
      align="end"
      trigger={
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true">{localeMeta[current].flag}</span>
          <span className="sr-only">
            {label}: {localeMeta[current].name}
          </span>
          {/* Compact code (EN/DE/FR…) — full names stay in the menu. */}
          <span aria-hidden="true">{current.toUpperCase()}</span>
        </span>
      }
      items={locales.map((locale) => ({
        label: (
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{localeMeta[locale].flag}</span>
            {localeMeta[locale].name}
          </span>
        ),
        href: localizePath(barePath, locale),
        current: locale === current,
      }))}
    />
  );
}
