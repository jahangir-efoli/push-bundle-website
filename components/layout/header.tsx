"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Dropdown } from "@/components/ui/dropdown";
import { buttonStyles } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { site } from "@/lib/site-config";
import { isLocale, localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

/**
 * Site header (docs/PLAN.md §4.2, §5.1, §8).
 * Sticky, condenses on scroll, collapses to an accessible drawer on mobile,
 * with a locale-aware nav + language switcher.
 */
export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const homeHref = localizePath("/", locale);
  // Nav carries the LINK href (localized) + the BARE path (for active state).
  const mainNav = [
    { label: dict.nav.home, href: homeHref, bare: "/" },
    { label: dict.nav.features, href: localizePath("/features", locale), bare: "/features" },
    { label: dict.nav.pricing, href: localizePath("/pricing", locale), bare: "/pricing" },
    { label: dict.nav.about, href: localizePath("/about-us", locale), bare: "/about-us" },
    { label: dict.nav.contact, href: localizePath("/contact-us", locale), bare: "/contact-us" },
  ];
  const resourcesNav = [
    { label: dict.nav.partners, href: localizePath("/partner", locale), bare: "/partner" },
    { label: dict.nav.docs, href: localizePath("/docs", locale), bare: "/docs" },
    { label: dict.nav.blog, href: localizePath("/blog", locale), bare: "/blog" },
    { label: dict.nav.changelog, href: localizePath("/changelog", locale), bare: "/changelog" },
  ];

  // usePathname may return the rewritten "/en/…" path, so compare BARE paths
  // (locale prefix stripped) rather than the localized hrefs.
  const segments = pathname.split("/");
  const barePath =
    (isLocale(segments[1]) ? `/${segments.slice(2).join("/")}` : pathname) || "/";
  const isActive = (bare: string) =>
    bare === "/" ? barePath === "/" : barePath.startsWith(bare);

  return (
    <>
      <header
        className={cn(
          // Only paint properties transition — the header height stays constant
          // (animating it shifted the document and caused a scroll shake).
          "sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-200",
          scrolled
            ? "border-border bg-background/85 shadow-soft backdrop-blur-md"
            : "border-transparent bg-background",
        )}
    >
      <Container className="flex h-20 items-center gap-4">
        <Link
          href={homeHref}
          className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-foreground"
        >
          <Image
            src="/images/pb-logo.webp"
            alt=""
            width={32}
            height={32}
            priority
            className="size-8 rounded-md"
          />
          <span>
            Push<span className="text-brand-gradient">Bundle</span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-0.5 xl:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.bare) ? "page" : undefined}
              className={cn(
                "flex h-11 shrink-0 items-center whitespace-nowrap rounded-lg px-2.5 text-[15px] font-medium transition-colors",
                isActive(item.bare)
                  ? "text-primary"
                  : "text-foreground hover:bg-surface-subtle",
              )}
            >
              {item.label}
            </Link>
          ))}

          <Dropdown
            trigger={dict.nav.resources}
            items={resourcesNav.map((item) => ({
              label: item.label,
              href: item.href,
              current: isActive(item.bare),
            }))}
          />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden xl:block">
            <LocaleSwitcher current={locale} label={dict.langSwitcher.label} />
          </span>
          <ThemeToggle />

          {/* Hide via a wrapper, not `hidden` on the link (buttonStyles sets
              inline-flex, which beats `hidden` in Tailwind's source order). */}
          <span className="hidden sm:block">
            <a
              href={site.shopifyAppUrl}
              className={buttonStyles({ variant: "gradient", size: "sm" })}
            >
              {dict.cta.install}
            </a>
          </span>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={dict.common.openMenu}
            aria-expanded={menuOpen}
            className="grid size-11 place-items-center rounded-lg text-foreground transition-colors hover:bg-surface-subtle xl:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
        </Container>
      </header>

      {/* Rendered OUTSIDE <header>: the header's `backdrop-filter` (when
          scrolled) would otherwise become the containing block for this
          `position: fixed` drawer, pinning it to the header instead of the
          viewport — so it only opened at the very top of the page. */}
      <MobileNav
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        triggerRef={menuButtonRef}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
