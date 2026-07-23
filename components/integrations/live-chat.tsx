"use client";

import { useEffect } from "react";

/**
 * Tawk.to live chat (docs/PLAN.md §5.4, §7) — lazy + production-gated.
 *
 * Zero-dependency loader (the official React package peer-deps React ^18; we're
 * on 19). The widget script is injected only after the first user interaction
 * or a short idle fallback, so it has ~0 impact on Lighthouse/CWV — an audit
 * never interacts. Enabled only in production with `NEXT_PUBLIC_TAWK_SRC` set.
 *
 * `openLiveChat()` lets the Contact "Let's Chat" button open the widget on
 * demand (the click itself loads it if it hasn't loaded yet).
 */

const TAWK_SRC = process.env.NEXT_PUBLIC_TAWK_SRC;
const ENABLED = process.env.NODE_ENV === "production" && Boolean(TAWK_SRC);

type TawkApi = {
  maximize?: () => void;
  onLoad?: () => void;
};
type TawkWindow = Window & {
  Tawk_API?: TawkApi;
  Tawk_LoadStart?: Date;
  __pbTawkLoaded?: boolean;
  __pbTawkOpenOnLoad?: boolean;
};

function loadTawk(): boolean {
  if (typeof window === "undefined" || !ENABLED) return false;
  const w = window as TawkWindow;
  if (w.__pbTawkLoaded) return true;
  w.__pbTawkLoaded = true;

  w.Tawk_API = w.Tawk_API || {};
  w.Tawk_LoadStart = new Date();
  w.Tawk_API.onLoad = () => {
    if (w.__pbTawkOpenOnLoad) w.Tawk_API?.maximize?.();
  };

  const s = document.createElement("script");
  s.async = true;
  s.src = TAWK_SRC as string;
  s.charset = "UTF-8";
  s.setAttribute("crossorigin", "*");
  document.body.appendChild(s);
  return true;
}

/** Open the chat widget, loading it first if needed. */
export function openLiveChat() {
  if (typeof window === "undefined") return;
  const w = window as TawkWindow;
  if (w.Tawk_API?.maximize) {
    w.Tawk_API.maximize();
  } else {
    // Not loaded yet — load now and open once ready.
    w.__pbTawkOpenOnLoad = true;
    loadTawk();
  }
}

export function LiveChat() {
  useEffect(() => {
    if (!ENABLED) return;

    const load = () => {
      loadTawk();
      cleanup();
    };
    const events: (keyof WindowEventMap)[] = [
      "scroll",
      "mousemove",
      "touchstart",
      "keydown",
      "click",
    ];
    const opts: AddEventListenerOptions = { once: true, passive: true };
    events.forEach((e) => window.addEventListener(e, load, opts));
    const timer = window.setTimeout(load, 6000); // idle fallback

    function cleanup() {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    }
    return cleanup;
  }, []);

  return null;
}
