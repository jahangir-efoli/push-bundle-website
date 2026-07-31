"use client";

import { useCallback } from "react";

/**
 * A link that opens a Calendly scheduling page in Calendly's in-page popup
 * overlay instead of navigating away, so the visitor never leaves the site.
 *
 * Progressive enhancement: it renders a real `<a href>` to the scheduling page,
 * so with JS disabled (or if the widget fails to load) the click still works —
 * it just opens in a new tab. The Calendly script + CSS are lazy-loaded on the
 * first click, so they cost nothing for visitors who never book.
 */

const CSS_HREF = "https://assets.calendly.com/assets/external/widget.css";
const JS_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

let loader: Promise<void> | null = null;
function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loader) return loader;
  loader = new Promise<void>((resolve, reject) => {
    if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CSS_HREF;
      document.head.appendChild(link);
    }
    const s = document.createElement("script");
    s.src = JS_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loader = null; // allow a retry on the next click
      reject(new Error("Calendly widget failed to load"));
    };
    document.body.appendChild(s);
  });
  return loader;
}

export function CalendlyLink({
  url,
  className,
  children,
}: {
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  const onClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Respect modifier / middle clicks — let the browser open the fallback tab.
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }
      e.preventDefault();
      try {
        await loadCalendly();
        window.Calendly?.initPopupWidget({ url });
      } catch {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [url],
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {children}
    </a>
  );
}
