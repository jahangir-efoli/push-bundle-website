"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Product thumbnail for the interactive demos. Shows the real photo when `src`
 * is provided and loads; if `src` is missing or 404s, it renders `fallback`
 * (the demo's original emoji / colour-tee / icon) — so every demo looks complete
 * before the real product images are uploaded, and swaps to the photo the moment
 * a file lands at the path.
 *
 * The image is `object-contain` so product photos of any aspect ratio show in
 * full (never cropped); pair it with a white tile so the letterbox is seamless
 * for images shot on white. It inherits the container's border-radius, so
 * callers keep their existing box (size, ring, rounding) unchanged.
 */
export function ProductThumb({
  src,
  alt,
  fallback,
  className,
}: {
  src?: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}) {
  const [ok, setOk] = useState(true);

  if (src && ok) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setOk(false)}
        className={cn("h-full w-full rounded-[inherit] object-contain", className)}
      />
    );
  }

  return <>{fallback}</>;
}
