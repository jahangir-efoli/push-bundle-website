import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { AnimateIn } from "@/components/motion/animate-in";
import { ShopxCountdown } from "@/components/shopx/countdown";
import { FeatureShowcase } from "@/components/sections/feature-showcase";
import { buttonStyles } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { installUrl, site } from "@/lib/site-config";
import { isLocale, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * ShopX 2026 sponsor landing page (`/shopx`).
 *
 * PushBundle is a Gold Sponsor of ShopX 2026 (Sep 17, 2026 · Ho Chi Minh City).
 * Reached via a QR code on physical banners + brochures, so it opens with a
 * "you found us" moment and drives three actions: install the app, schedule a
 * meeting with the team, and become an efoli partner.
 *
 * Design (ui-ux-pro-max): dark futuristic + Bento-grid composition, glassmorphic
 * cards, aurora/grid backdrop, and neon cyan accents fused with PushBundle's
 * cyan→indigo brand gradient. Typography is a scoped sci-fi/HUD pairing —
 * Orbitron for display numerals/headline, JetBrains Mono for tactical labels —
 * layered over the site's Jakarta body for readability. Renders identically in
 * light/dark via raw palette tokens.
 */

// Scoped to this page only (via the .variable classes on the root wrapper), so
// the sci-fi pairing never leaks into the rest of the site.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-orbitron",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

const HEAD = { fontFamily: "var(--font-orbitron)" } as const;
const MONO = { fontFamily: "var(--font-jetbrains)" } as const;
const CYAN = { color: "var(--pb-cyan-400)" } as const;

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

const EVENT_URL = "https://2026.shopxevent.com/";
const PARTNER_URL = "https://partners.efoli.com/signup";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = toLocale(lang);
  return pageMetadata({
    title: "PushBundle × ShopX 2026",
    description:
      "PushBundle is a proud Gold Sponsor of ShopX 2026 — the AI-native ecommerce summit in Ho Chi Minh City. Meet us at the booth, book a demo, and boost your Shopify AOV with Mix & Match bundles.",
    path: "/shopx",
    locale,
    ogTitle: "PushBundle × ShopX 2026 — Gold Sponsor",
  });
}

/** Mono HUD label — the tactical eyebrow used across sections. */
function Kicker({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <p
      className={cn("text-xs font-medium uppercase tracking-[0.22em] text-white/55", className)}
      style={{ ...MONO, ...style }}
    >
      {children}
    </p>
  );
}

const MEET: { icon: IconName; text: string }[] = [
  { icon: "wand", text: "A 5-minute live build — watch a bundle go from zero to storefront." },
  { icon: "cart", text: "An exclusive ShopX offer for merchants we meet during the event." },
  { icon: "shield", text: "Face-time with the team behind the app — bring your hardest use case." },
];

const META = [
  { icon: "calendar" as IconName, text: "Thu · Sep 17, 2026" },
  { icon: "globe" as IconName, text: "New World Saigon · Ho Chi Minh City" },
  { icon: "sparkles" as IconName, text: "AI-native ecommerce summit" },
];

/** Shared glass-card surface — one elevation scale, one hover behavior. */
const CARD =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]";

export default function ShopxPage() {
  return (
    <div
      className={cn("relative overflow-hidden", orbitron.variable, jetbrains.variable)}
      style={{ backgroundColor: "var(--pb-bg-950)", color: "var(--pb-text-100)" }}
    >
      {/* Aurora + grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(48rem 30rem at 12% -8%, color-mix(in oklab, var(--pb-cyan-400) 26%, transparent), transparent 60%), radial-gradient(44rem 30rem at 92% 4%, color-mix(in oklab, var(--pb-indigo-700) 55%, transparent), transparent 62%), radial-gradient(40rem 26rem at 60% 112%, color-mix(in oklab, var(--pb-coral-500) 14%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(72% 60% at 50% 0%, #000, transparent 82%)",
          WebkitMaskImage: "radial-gradient(72% 60% at 50% 0%, #000, transparent 82%)",
        }}
      />

      <div className="relative">
        {/* ============ HERO ============ */}
        <Container className="pt-16 pb-14 lg:pt-24 lg:pb-20">
          <AnimateIn>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em]"
              style={{
                ...MONO,
                backgroundImage: "linear-gradient(135deg,#ffe9a8,#e8b34a 55%,#b8860b)",
                color: "#3a2a06",
                boxShadow: "0 8px 30px -8px rgba(232,179,74,0.5)",
              }}
            >
              <Icon name="sparkles" className="size-3.5" />
              Gold Sponsor
            </span>
          </AnimateIn>

          <AnimateIn delay={0.05}>
            <Kicker className="mt-6">ShopX 2026 · Ho Chi Minh City</Kicker>
            <h1
              className="mt-3 max-w-4xl text-[clamp(2.4rem,6vw,4.25rem)] font-black uppercase leading-[1.03] tracking-tight text-balance text-white"
              style={HEAD}
            >
              PushBundle{" "}
              <span className="bg-brand-gradient bg-clip-text text-transparent">×</span>{" "}
              ShopX 2026
            </h1>
            <p className="mt-6 max-w-2xl text-xl font-medium text-pretty text-white/80">
              Where AI × ecommerce takes shape in APAC — and where smarter Shopify
              bundling meets you in person.
            </p>
            <p className="mt-4 max-w-2xl text-pretty text-white/60">
              We&apos;re proud to back the region&apos;s AI-native ecommerce summit.
              Come see how PushBundle turns Mix &amp; Match bundles into a bigger
              average order value — automatically, on any Shopify store.
            </p>
          </AnimateIn>

          {/* Event meta */}
          <AnimateIn delay={0.1}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {META.map((m) => (
                <li key={m.text} className="flex items-center gap-2.5 text-sm text-white/75" style={MONO}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5" style={CYAN}>
                    <Icon name={m.icon} className="size-4" />
                  </span>
                  {m.text}
                </li>
              ))}
            </ul>
          </AnimateIn>

          {/* Countdown */}
          <AnimateIn delay={0.15}>
            <div className="mt-10">
              <Kicker className="mb-3 text-white/45">Doors open in</Kicker>
              <ShopxCountdown />
            </div>
          </AnimateIn>

          {/* CTAs */}
          <AnimateIn delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={installUrl("shopx")}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "gradient", size: "lg", className: "shadow-lift" })}
              >
                Install PushBundle — free
                <Icon name="arrow-right" className="size-5" />
              </a>
              <a href={PARTNER_URL} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "inverse", size: "lg" })}>
                Become a partner
              </a>
              <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "inverseOutline", size: "lg" })}>
                Schedule a meeting
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/50">
              <span style={CYAN}>
                <Icon name="sparkles" className="size-4" />
              </span>
              Scanned our QR at the event? You&apos;re in exactly the right place.
            </p>
          </AnimateIn>
        </Container>

        {/* ============ LIVE DEMO SHOWCASE ============ */}
        {/* The site's interactive bundle demo. Wrapped in `.dark` so its
            theme-aware section always renders its dark variant, matching this
            forced-dark page regardless of the visitor's global theme. */}
        <div className="dark mb-16 lg:mb-24">
          <FeatureShowcase />
        </div>

        {/* ============ SCHEDULE A MEETING ============ */}
        <Container className="pb-16 lg:pb-24">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(40rem 22rem at 100% 0%, color-mix(in oklab, var(--pb-cyan-400) 18%, transparent), transparent 60%), radial-gradient(36rem 22rem at 0% 100%, color-mix(in oklab, var(--pb-indigo-700) 50%, transparent), transparent 60%)",
                }}
              />
              <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <Kicker>Let&apos;s meet · ShopX 2026</Kicker>
                  <h2 className="mt-3 font-display text-display-sm font-bold text-balance text-white">
                    Book a 1:1 with the team
                  </h2>
                  <p className="mt-4 max-w-lg text-pretty text-white/70">
                    In Ho Chi Minh City for ShopX — or anywhere in APAC? Grab a slot with
                    the PushBundle team. Bring your store and we&apos;ll map the fastest
                    path to a bigger cart.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href={site.calendlyUrl} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "inverse", size: "lg" })}>
                      Schedule a meeting
                    </a>
                    <a href={EVENT_URL} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "inverseOutline", size: "lg" })}>
                      View the agenda
                    </a>
                  </div>
                </div>

                <ul className="space-y-4">
                  {MEET.map((b, i) => (
                    <AnimateIn key={b.text} delay={0.06 + i * 0.06}>
                      <li className={cn(CARD, "flex items-start gap-3.5 p-4")}>
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5" style={CYAN}>
                          <Icon name={b.icon} className="size-5" />
                        </span>
                        <p className="text-sm text-white/80">{b.text}</p>
                      </li>
                    </AnimateIn>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateIn>
        </Container>

        {/* ============ FINAL CTA ============ */}
        <Container className="pb-20 lg:pb-28">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60rem 32rem at 50% -25%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(70rem 44rem at 50% 135%, rgba(6,8,26,0.55), transparent 62%)",
                }}
              />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl font-display text-display-md font-extrabold text-balance text-white">
                  Start free during ShopX — and keep the momentum
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/95">
                  Install in minutes, launch your first bundle before the closing
                  keynote, and watch your average order value climb.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={installUrl("shopx-footer")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: "inverse", size: "lg", className: "shadow-lift" })}
                  >
                    Start your 14-day free trial
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
                <p className="mt-6 text-sm text-white/85" style={MONO}>
                  Rated {site.rating.score}/5 by Shopify merchants · Gold Sponsor of ShopX 2026
                </p>
              </div>
            </div>
          </AnimateIn>
        </Container>
      </div>
    </div>
  );
}
