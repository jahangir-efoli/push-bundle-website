"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

// useLayoutEffect on the client (re-apply before paint → no flash); useEffect
// during SSR to avoid the "useLayoutEffect does nothing on the server" warning.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Re-applies the saved theme after client navigations. Switching locale (or any
 * nav that re-renders the root `<html>`) makes React overwrite `<html>`'s
 * className from JSX, dropping the `.dark` class the inline ThemeScript set —
 * which only runs on a full page load. This restores it on every route change.
 */
export function ThemeSync() {
  const pathname = usePathname();

  useIsoLayoutEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      const dark =
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches);
      const root = document.documentElement;
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";
    } catch {
      // localStorage/matchMedia unavailable — leave whatever the script set.
    }
  }, [pathname]);

  return null;
}
