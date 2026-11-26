"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";

/**
 * Renders a CMS landing page's HTML exactly as received — no sanitizing, no
 * prose wrapper, full width — and makes its `<script>` tags run exactly once.
 *
 * Also used for CMS article bodies (blog, Setup Pantry, docs, client stories),
 * with a `className` for their prose styles: their custom HTML blocks may carry
 * scripts, which must run after a client-side navigation too.
 *
 * Two ways the HTML reaches the DOM, and what each means for scripts:
 *  - Full page load: the HTML is server-rendered, so the browser's parser has
 *    ALREADY executed every script by the time React hydrates. Running them again
 *    would double-fire pixels/countdowns/forms, so they're only marked as ran.
 *  - Client-side navigation (or new content on the same instance): React sets
 *    `innerHTML`, which never executes scripts. Each one is re-created in place,
 *    in document order; a classic external script (no async/defer) is awaited
 *    before the next runs, so an inline `$(…)` after `<script src=jquery>` works
 *    like it does in a normal HTML page.
 *
 * `data-ran` guards against React Strict Mode running effects twice in dev.
 *
 * The `{ __html }` object is memoized on purpose: React 19 re-applies
 * `innerHTML` whenever that object's IDENTITY changes, so a fresh object on any
 * re-render (e.g. the one right after hydration) would wipe whatever the page's
 * scripts did to their DOM — embedded forms, countdowns — and swap in script
 * elements that never run.
 */

const subscribe = () => () => {};

/** Load promises of re-created blocking scripts, so a second effect pass
 * (Strict Mode) still waits for them before running the scripts after them. */
const pending = new WeakMap<HTMLScriptElement, Promise<unknown>>();

export function LandingHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // getServerSnapshot (→ true) is used during SSR and hydration only; a fresh
  // client render uses getSnapshot (→ false). Captured once, at first render.
  const hydrating = useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  );
  const fromServer = useRef(hydrating);
  const inner = useMemo(() => ({ __html: html }), [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const scripts = Array.from(root.querySelectorAll("script"));

    if (fromServer.current) {
      fromServer.current = false;
      for (const s of scripts) s.dataset.ran = "1";
      return;
    }

    let cancelled = false;
    (async () => {
      for (const old of scripts) {
        if (cancelled) return;
        if (old.dataset.ran) {
          const p = pending.get(old);
          if (p) await p;
          continue;
        }

        const s = document.createElement("script");
        for (const a of Array.from(old.attributes)) s.setAttribute(a.name, a.value);
        s.text = old.textContent ?? "";
        s.dataset.ran = "1";

        const blocking =
          old.hasAttribute("src") &&
          !old.hasAttribute("async") &&
          !old.hasAttribute("defer") &&
          old.type !== "module";
        let loaded: Promise<unknown> | null = null;
        if (blocking) {
          s.async = false;
          loaded = new Promise((done) => {
            s.onload = done;
            s.onerror = done;
          });
          pending.set(s, loaded);
        }

        old.replaceWith(s);
        if (loaded) await loaded;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={inner} />;
}
