"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type HeroSlide = { src: string; alt: string };

/**
 * Hero image slider (docs/PLAN.md §5.1) — a smooth auto-advancing crossfade of
 * the feature previews. Pauses on hover/focus, dots jump to a slide, and it
 * respects reduced-motion (no auto-advance / no fade). Images are 4:5.
 */
export function HeroSlider({
  slides,
  interval = 4500,
}: {
  slides: HeroSlide[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const id = window.setInterval(
      () => setIndex((v) => (v + 1) % count),
      interval,
    );
    return () => window.clearInterval(id);
  }, [count, paused, interval]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="PushBundle feature previews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-surface"
    >
      {slides.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          aria-hidden={i !== index}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 85vw"
          className={cn(
            "object-cover transition-opacity duration-700 ease-out motion-reduce:transition-none",
            i === index ? "opacity-100" : "opacity-0",
          )}
        />
      ))}

      {count > 1 && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent"
          />
          <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(i)}
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
  );
}
