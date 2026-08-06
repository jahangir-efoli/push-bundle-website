"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dropdown } from "@/components/ui/dropdown";
import { buttonStyles } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { LocaleSwitcher } from "./locale-switcher";
import { installUrl } from "@/lib/site-config";
import { isLocale, localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/utils";

// Run before paint on the client (so we can read scroll position and set the
// correct initial look), but fall back to useEffect during SSR where there is
// no layout phase.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
  // `ready` gates the transitions: it stays false through the first paint (and
  // the pre-paint scroll correction below) so a reload while scrolled SNAPS to
  // the bar instead of flashing the pill and animating. It flips true on the
  // next frame, enabling smooth morphs for every subsequent scroll.
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // correct the initial state before the browser paints
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
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
      {/* The header morphs between two looks. To keep the morph perfectly
          smooth we DON'T animate any geometry that snaps (width, border-radius,
          margins): instead two fixed background layers cross-fade by opacity,
          and only the header HEIGHT eases. Content is vertically centred so it
          never jumps as the height changes.
          • MOBILE (any scroll) + DESKTOP once scrolled → BAR layer (full-bleed,
            bottom border).
          • DESKTOP at the top of the page → PILL layer (capped capsule that
            floats above the hero with a gap, rounded, all-round border, shadow).
          The pill layer only exists at `lg`, so mobile is always the bar. */}
      <header
        className={cn(
          "sticky top-0 z-40",
          ready &&
            "transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "h-16" : "h-16 lg:h-24",
        )}
      >
        {/* BAR background — full-bleed; the only chrome on mobile. Fades OUT on
            desktop while at the top, fades IN as you scroll. */}
        <div
          aria-hidden="true"
          className={cn(
            "absolute inset-0 border-b border-border bg-surface/95 backdrop-blur-md",
            ready && "transition-opacity duration-500 ease-out",
            scrolled ? "opacity-100" : "opacity-100 lg:opacity-0",
          )}
        />
        {/* PILL background — a capped capsule with a SYMMETRIC inset (inset-y-3),
            so its centre lines up with the vertically-centred content. Desktop
            only. As you scroll it fades AND gently expands upward (scale +
            lift), so the morph reads as the pill spreading into the bar rather
            than a plain cross-fade. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-gutter inset-y-3 mx-auto hidden max-w-6xl origin-top rounded-2xl border border-border bg-surface/95 shadow-soft backdrop-blur-md lg:block",
            ready && "transition-[opacity,transform] duration-500 ease-out",
            scrolled ? "scale-[1.03] opacity-0" : "scale-100 opacity-100",
          )}
        />
      <div
        className={cn(
          "relative mx-auto flex h-full w-full items-center gap-3 px-gutter",
          // Content tracks the active layer's width: it hugs the narrower
          // floating pill, then eases out to full width as it docks to the bar.
          ready &&
            "transition-[max-width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "max-w-site" : "max-w-site lg:max-w-6xl",
        )}
      >
        <div className="flex flex-1 items-center">
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
            {/* Solid wordmark (no gradient) — inherits text-foreground, so it's
                black on the light header and white on the dark header. */}
            <span>PushBundle</span>
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-1.5 xl:flex">
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

        <div className="flex flex-1 items-center justify-end gap-2">
          <span className="hidden xl:block">
            <LocaleSwitcher current={locale} label={dict.langSwitcher.label} />
          </span>
          <ThemeToggle />

          {/* Hide via a wrapper, not `hidden` on the link (buttonStyles sets
              inline-flex, which beats `hidden` in Tailwind's source order). */}
          <span className="hidden sm:block">
            <a
              href={installUrl("header")}
              target="_blank"
              rel="noopener noreferrer"
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
        </div>
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
