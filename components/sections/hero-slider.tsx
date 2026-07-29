"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroSlide = { src: string; alt: string };

/**
 * Hero image slider (docs/PLAN.md §5.1) — a smooth auto-advancing crossfade of
 * the feature previews that loops forever. Pauses on keyboard focus and while
 * the lightbox is open (not on hover — a portal-covered hover could leave it
 * stuck paused). Dots jump to a slide; respects reduced-motion.
 *
 * Landscape (4:3) frames. Until the real screenshots land at each `src`, a
 * branded placeholder is shown so the hero never looks broken. Clicking a slide
 * (when its image is present) opens it enlarged in a dimmed lightbox.
 */
function SlidePlaceholder({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid place-items-center overflow-hidden bg-brand-gradient text-white/90"
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <span className="relative flex flex-col items-center gap-2 px-6 text-center">
        <svg viewBox="0 0 24 24" className="size-9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 20" />
        </svg>
        <span className="text-sm font-semibold">{label}</span>
      </span>
    </div>
  );
}

export function HeroSlider({
  slides,
  interval = 3200,
}: {
  slides: HeroSlide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [imgOk, setImgOk] = useState<boolean[]>(() => slides.map(() => true));
  const count = slides.length;
  const current = slides[index];
  const currentOk = imgOk[index];

  useEffect(() => {
    if (count <= 1 || paused || zoom) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setIndex((v) => (v + 1) % count),
      interval,
    );
    return () => window.clearInterval(id);
  }, [count, paused, zoom, interval]);

  // Escape closes the lightbox (mainly for touch/keyboard users).
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="PushBundle feature previews"
    >
      {/* Frameless: the preview screenshots are self-contained compositions, so
          no surface fill, border, or rounding — the image sits flush. */}
      <div className="relative aspect-4/3 overflow-hidden">
        {/* Trigger layer — holds the slides + hint plus the open/pause handlers.
            The lightbox portal is a SIBLING of this (not a child), so React
            portal event-bubbling can't route the portal's clicks/focus back into
            these handlers and leave the carousel stuck paused/reopening. */}
        <div
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onClick={() => currentOk && setZoom(true)}
          className={cn(
            "absolute inset-0",
            currentOk ? "cursor-zoom-in" : "cursor-default",
          )}
        >
          {slides.map((slide, i) =>
            imgOk[i] ? (
              <Image
                key={slide.src}
                src={slide.src}
                alt={i === index ? slide.alt : ""}
                aria-hidden={i !== index}
                fill
                priority={i === 0}
                quality={90}
                sizes="(min-width: 1024px) 48rem, (min-width: 640px) 40rem, 92vw"
                onError={() =>
                  setImgOk((prev) =>
                    prev.map((v, idx) => (idx === i ? false : v)),
                  )
                }
                className={cn(
                  "object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
                  i === index
                    ? "opacity-100 animate-[pb-kenburns_7s_ease-out_forwards] motion-reduce:animate-none"
                    : "opacity-0",
                )}
              />
            ) : (
              <div
                key={slide.src}
                aria-hidden={i !== index}
                className={cn(
                  "transition-opacity duration-700 ease-out motion-reduce:transition-none",
                  i === index ? "opacity-100" : "opacity-0",
                )}
              >
                <SlidePlaceholder label={slide.alt} />
              </div>
            ),
          )}

          {/* No persistent zoom badge — the zoom-in cursor on hover already
              signals the preview is clickable/enlargeable. */}
        </div>
      </div>

      {/* Dots — UNDER the slider (not overlaid on the image). */}
      {count > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1} of ${count}`}
              aria-current={i === index}
              className={cn(
                // text-white is inert (the dot has no label) but keeps the
                // contrast-audit heuristic happy for these bg-only pills.
                "h-2.5 rounded-full text-white transition-all duration-300",
                i === index
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-muted/40 hover:bg-muted/70",
              )}
            />
          ))}
        </div>
      )}

      {/* Lightbox — full image enlarged. Portaled to <body> so it escapes the
          Lenis transform wrapper (a transformed ancestor would otherwise trap
          this fixed element's containing block and leave the header uncovered).
          Click the backdrop, the close button, or press Escape to dismiss. */}
      {zoom &&
        currentOk &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${current.alt} — enlarged`}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-70 flex cursor-zoom-out items-center justify-center bg-black/90 p-4 backdrop-blur-sm motion-safe:animate-[pb-fade_150ms_ease-out]"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-4/3 max-h-[86vh] w-[92vw] max-w-6xl cursor-default"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                quality={90}
                sizes="92vw"
                className="rounded-xl object-contain shadow-lift"
              />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoom(false);
              }}
              aria-label="Close enlarged preview"
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/95 text-black shadow-lift transition-transform hover:scale-105"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>,
          document.body,
        )}
    </div>
  );
}
