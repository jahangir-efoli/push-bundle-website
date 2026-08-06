"use client";

import { useState } from "react";
import Image from "next/image";
import { BundleMockup } from "@/components/visuals/bundle-mockup";

/**
 * Right-hand visual for the "Seamless Mobile Bundling Experience" section.
 *
 * Shows the real phone illustration dropped at `/images/mobile/mobile-experience.png`
 * (a ~900×1200, 3:4 transparent PNG). Until that file exists it falls back to the
 * code-drawn `BundleMockup` in its phone frame, so the section never renders a
 * broken image.
 */
export function MobileVisual({ alt }: { alt: string }) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div className="mx-auto w-full max-w-[18rem] rounded-[2rem] border-8 border-foreground/85 bg-brand-gradient p-3 shadow-lift">
        <BundleMockup />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <Image
        src="/images/mobile/mobile-experience.png"
        alt={alt}
        width={3342}
        height={3600}
        quality={95}
        sizes="(min-width: 1024px) 34rem, 92vw"
        className="h-auto w-full"
        onError={() => setOk(false)}
      />
    </div>
  );
}
