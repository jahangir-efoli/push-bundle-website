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
 * stuck paused). Dots jump to a slide; respects reduced-motion. Images are 4:5.
 *
 * Clicking/tapping the slider opens the current preview enlarged in a dimmed
 * lightbox (portaled to <body>) so the small UI mockups are readable; it closes
 * on backdrop click, the close button, or Escape.
 */
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
  const count = slides.length;
  const current = slides[index];

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
      className="relative aspect-4/5 overflow-hidden rounded-[0.9rem] bg-surface"
    >
      {/* Trigger layer — holds the slides, hint and dots plus the open/pause
          handlers. The lightbox portal is a SIBLING of this (not a child), so
          React portal event-bubbling can't route the portal's clicks/focus back
          into these handlers and leave the carousel stuck paused/reopening. */}
      <div
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onClick={() => setZoom(true)}
        className="absolute inset-0 cursor-zoom-in"
      >
        {slides.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={i === index ? slide.alt : ""}
            aria-hidden={i !== index}
            fill
            priority={i === 0}
            quality={90}
            sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 85vw"
            className={cn(
              "object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Hint that the preview is zoomable. */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3M11 8v6M8 11h6" />
          </svg>
        </span>

        {count > 1 && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/30 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-3.5 z-10 flex justify-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(i);
                  }}
                  aria-label={`Show slide ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2 rounded-full ring-1 ring-black/10 transition-all duration-300",
                    i === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60 hover:bg-white/85",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox — full image enlarged. Portaled to <body> so it escapes the
          Lenis transform wrapper (a transformed ancestor would otherwise trap
          this fixed element's containing block and leave the header uncovered).
          Click the backdrop, the close button, or press Escape to dismiss. */}
      {zoom &&
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
              className="relative aspect-4/5 h-[86vh] max-h-[86vh] max-w-[92vw] cursor-default"
            >
              <Image
                src={current.src}
                alt={current.alt}
                fill
                quality={90}
                sizes="(max-width: 640px) 92vw, 70vh"
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
