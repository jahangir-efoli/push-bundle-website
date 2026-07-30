"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { installUrl } from "@/lib/site-config";
import { buttonStyles } from "@/components/ui/button";
import { LocaleSwitcher } from "./locale-switcher";
import { localizePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * Mobile navigation drawer (docs/PLAN.md §6 responsive + a11y).
 *
 * A11y: role="dialog" aria-modal, focus moves in on open and returns to the
 * trigger on close, Tab is trapped inside, Escape closes, background scroll
 * is locked. No keyboard traps — Escape and Tab always have an exit.
 */
export function MobileNav({
  open,
  onClose,
  triggerRef,
  locale,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  locale: Locale;
  dict: Dictionary;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  const mainNav = [
    { label: dict.nav.home, href: localizePath("/", locale) },
    { label: dict.nav.features, href: localizePath("/features", locale) },
    { label: dict.nav.pricing, href: localizePath("/pricing", locale) },
    { label: dict.nav.about, href: localizePath("/about-us", locale) },
    { label: dict.nav.contact, href: localizePath("/contact-us", locale) },
  ];
  const resourcesNav = [
    { label: dict.nav.partners, href: localizePath("/partner", locale) },
    { label: dict.nav.docs, href: localizePath("/docs", locale) },
    { label: dict.nav.blog, href: localizePath("/blog", locale) },
    { label: dict.nav.changelog, href: localizePath("/changelog", locale) },
  ];

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Captured now: the ref may be null by the time cleanup runs.
    const trigger = triggerRef.current;

    // Lock background scroll while the drawer is open.
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = overflow;
      (trigger ?? previouslyFocused)?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={dict.common.menu}
        className="absolute inset-y-0 right-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto border-l border-border bg-surface p-6"
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold">
            {dict.common.menu}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.common.closeMenu}
            className="grid size-11 place-items-center rounded-lg text-foreground transition-colors hover:bg-surface-subtle"
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
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-6 flex flex-col">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex min-h-11 items-center rounded-lg px-3 font-medium text-foreground transition-colors hover:bg-surface-subtle"
            >
              {item.label}
            </Link>
          ))}

          <p className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {dict.nav.resources}
          </p>
          {resourcesNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex min-h-11 items-center rounded-lg px-3 font-medium text-foreground transition-colors hover:bg-surface-subtle"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={installUrl("mobile-nav")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: "gradient", className: "mt-8 w-full" })}
        >
          {dict.cta.install}
        </a>

        <div className="mt-4">
          <LocaleSwitcher current={locale} label={dict.langSwitcher.label} />
        </div>
      </div>
    </div>
  );
}
