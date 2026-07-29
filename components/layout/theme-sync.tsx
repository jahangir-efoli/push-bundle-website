"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect on the client (re-apply before paint → no flash); useEffect
// during SSR to avoid the "useLayoutEffect does nothing on the server" warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Re-applies pre-hydration `<html>` classes after client navigations. Switching
 * locale (or any nav that re-renders the root `<html>`) makes React overwrite
 * `<html>`'s className from JSX, dropping the `.dark` and `.js` classes the
 * inline ThemeScript set — which only runs on a full page load. Without `.js`,
 * every JS-gated behavior (accordion collapse, scroll reveals) reverts to its
 * no-JS "all open / all visible" fallback. This restores both on every route
 * change.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    const root = document.documentElement;
    // `.js` marks the document as JS-enabled (JS-gated CSS keys off it).
    root.classList.add("js");
    try {
      const saved = localStorage.getItem("theme");
      const dark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    } catch {
      // localStorage/matchMedia unavailable — leave whatever the script set.
    }
  }, [pathname]);

  return null;
}
