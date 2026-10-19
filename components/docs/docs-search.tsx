"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Icon } from "@/components/ui/icon";
import { useLocale } from "@/components/providers/locale-provider";
import { localizePath } from "@/i18n/config";
import { highlight, searchDocs, type DocIndexEntry } from "@/lib/docs/search";
import { cn } from "@/lib/utils";

export type DocsSearchUi = {
  label: string;
  placeholder: string;
  button: string;
  seeAll: string;
  noQuickMatch: string;
  shortcut: string;
};

/** Title with the matched words marked. */
export function Highlighted({ text, query }: { text: string; query: string }) {
  return highlight(text, query).map((s, i) =>
    s.hit ? (
      <mark key={i} className="rounded-sm bg-accent/25 px-px text-inherit">
        {s.text}
      </mark>
    ) : (
      s.text
    ),
  );
}

/**
 * Help-centre search (docs/PLAN.md §5.8a) — a WAI-ARIA combobox with instant
 * suggestions (↑/↓ to move, Enter to open, Esc to close) and `/` to focus from
 * anywhere. It is a real GET form to /docs/search, so Enter still searches
 * with JavaScript off; with it on, the form navigates client-side.
 */
export function DocsSearch({
  docs,
  ui,
  initialQuery = "",
  size = "lg",
  chips,
}: {
  docs: DocIndexEntry[];
  ui: DocsSearchUi;
  initialQuery?: string;
  size?: "lg" | "md";
  /** Suggested searches under the box (hero only). */
  chips?: { label: string; items: string[] };
}) {
  const id = useId();
  const listId = `${id}-list`;
  const router = useRouter();
  const locale = useLocale();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const q = query.trim();
  const results = useMemo(() => searchDocs(docs, q).slice(0, 6), [docs, q]);
  const searchHref = `/docs/search?q=${encodeURIComponent(q)}`;
  // The suggestions, then the "see all" row.
  const options = [...results.map((d) => `/docs/${d.slug}`), searchHref];
  const expanded = open && q.length > 0;

  // `/` focuses the search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
        return;
      e.preventDefault();
      input.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    router.push(localizePath(href, locale));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!q) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + step + options.length) % options.length);
    } else if (e.key === "Escape") {
      if (expanded) e.preventDefault();
      setOpen(false);
      setActive(-1);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expanded && active >= 0) go(options[active]);
    else if (q) go(searchHref);
    else input.current?.focus();
  };

  const lg = size === "lg";

  return (
    <div>
      <form
        role="search"
        action={localizePath("/docs/search", locale)}
        method="get"
        onSubmit={onSubmit}
        className="relative"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
      >
        <div
          className={cn(
            "flex items-center gap-3 border border-border bg-surface transition-[border-color,box-shadow] focus-within:border-primary focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)]",
            lg ? "rounded-2xl p-1.5 pl-5 shadow-lift" : "rounded-xl p-1 pl-4 shadow-soft",
          )}
        >
          <Icon name="search" className="size-5 shrink-0 text-muted" />
          <label htmlFor={`${id}-q`} className="sr-only">
            {ui.label}
          </label>
          <input
            ref={input}
            id={`${id}-q`}
            name="q"
            type="search"
            autoComplete="off"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={expanded}
            aria-controls={listId}
            aria-activedescendant={
              expanded && active >= 0 ? `${id}-opt-${active}` : undefined
            }
            placeholder={ui.placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className={cn(
              "docs-search-input min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted",
              lg ? "h-12 text-lg" : "h-10",
            )}
          />
          <kbd
            title={ui.shortcut}
            className="hidden rounded-md border border-border px-1.5 text-xs text-muted sm:inline"
          >
            /
          </kbd>
          <button
            type="submit"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-xl bg-button-gradient font-semibold text-white shadow-glow transition-[filter] hover:brightness-105",
              lg ? "h-12 px-5" : "h-10 px-4 text-sm",
            )}
          >
            {ui.button}
          </button>
        </div>

        {/* Kept mounted (hidden when collapsed) so aria-controls always resolves. */}
        <div
          id={listId}
          role="listbox"
          aria-label={ui.label}
          hidden={!expanded}
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-lift"
        >
          {results.map((doc, i) => (
            <Link
              key={doc.slug}
              id={`${id}-opt-${i}`}
              href={`/docs/${doc.slug}`}
              role="option"
              aria-selected={active === i}
              tabIndex={-1}
              onClick={() => setOpen(false)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex items-center gap-3 border-b border-border px-4 py-3",
                active === i && "bg-primary-subtle",
              )}
            >
              <Icon name="file-text" className="size-4 shrink-0 text-muted" />
              <span className="min-w-0">
                <span className="block text-foreground">
                  <Highlighted text={doc.title} query={q} />
                </span>
                <span className="block text-xs text-muted">{doc.categoryName}</span>
              </span>
            </Link>
          ))}
          <Link
            id={`${id}-opt-${results.length}`}
            href={searchHref}
            role="option"
            aria-selected={active === results.length}
            tabIndex={-1}
            onClick={() => setOpen(false)}
            onMouseEnter={() => setActive(results.length)}
            className={cn(
              "flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-semibold text-primary",
              active === results.length && "bg-primary-subtle",
            )}
          >
            {results.length ? ui.seeAll : ui.noQuickMatch}
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </form>

      {chips && chips.items.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          <span className="px-1 text-sm text-muted">{chips.label}</span>
          {chips.items.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => {
                setQuery(chip);
                setOpen(true);
                setActive(-1);
                input.current?.focus();
              }}
              className="min-h-9 rounded-full border border-border bg-surface px-3.5 text-sm text-muted transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {chip}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
