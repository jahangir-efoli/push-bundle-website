"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll (docs/PLAN.md §6).
 *
 * Guardrails honored here:
 *  - Disabled entirely when the user prefers reduced motion (native scroll).
 *  - Anchor links keep working (Lenis intercepts same-page hashes).
 *  - Started after mount, so first paint never waits on it (§7).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const start = () => {
      if (lenisRef.current || media.matches) return;

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      const raf = (time: number) => {
        lenis.raf(time);
        frameRef.current = requestAnimationFrame(raf);
      };
      frameRef.current = requestAnimationFrame(raf);
    };

    // Respect the setting now, and if the user changes it mid-session.
    if (media.matches) stop();
    else start();

    const onChange = () => (media.matches ? stop() : start());
    media.addEventListener("change", onChange);

    return () => {
      media.removeEventListener("change", onChange);
      stop();
    };
  }, []);

  return <>{children}</>;
}
