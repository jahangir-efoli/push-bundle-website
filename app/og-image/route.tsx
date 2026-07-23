import { ImageResponse } from "next/og";

/**
 * Generated 1200×630 share card (docs/PLAN.md §7).
 * Plain route (not the reserved `opengraph-image` convention) so pages that set
 * their own `openGraph` still reference it explicitly via lib/seo/metadata.ts.
 *
 * next/og caveat: every element with >1 child must set display:flex.
 */
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1E27D6 0%, #2F6BFF 45%, #3AD9EE 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          {/* Plain glyphs only — next/og's default font lacks ▾/★ (render as
              tofu). Use SVG for the mark. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "rgba(255,255,255,0.18)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 64 64" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M24 16v20l-8-8" />
              <path d="M24 36l8-8" />
              <path d="M40 16v20l-8-8" />
              <path d="M40 36l8-8" />
            </svg>
          </div>
          PushBundle
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            fontSize: 76,
            fontWeight: 800,
            lineHeight: 1.05,
          }}
        >
          <span>Boost your AOV with the</span>
          <span>best Shopify bundle app</span>
        </div>

        <div style={{ display: "flex", marginTop: 28, fontSize: 32, color: "rgba(255,255,255,0.82)" }}>
          Mix &amp; match · Volume discounts · B2B bundles
        </div>

        <div style={{ display: "flex", marginTop: 48, fontSize: 28, fontWeight: 600 }}>
          4.9/5 · Built for Shopify · pushbundle.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
