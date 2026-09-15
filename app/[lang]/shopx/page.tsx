import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Icon, type IconName } from "@/components/ui/icon";
import { AnimateIn } from "@/components/motion/animate-in";
import { ShopxCountdown } from "@/components/shopx/countdown";
import { buttonStyles } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo/metadata";
import { installUrl, site } from "@/lib/site-config";
import { isLocale, type Locale } from "@/i18n/config";

/**
 * ShopX 2026 sponsor landing page (`/shopx`).
 *
 * PushBundle is a Gold Sponsor of ShopX 2026 (Sep 17, 2026 · Ho Chi Minh City).
 * Reached via a QR code on physical banners + brochures, so it opens with a
 * "you found us" moment and drives three actions: install the app, book a booth
 * demo, and grab a ShopX ticket. Deliberately a dark, futuristic one-off that
 * fuses the event's AI-native vibe with PushBundle's cyan→indigo brand gradient;
 * it renders the same in light/dark using raw palette tokens.
 */

const toLocale = (lang: string): Locale => (isLocale(lang) ? lang : "en");

const EVENT_URL = "https://2026.shopxevent.com/";
const TICKET_URL = "https://2026.shopxevent.com/checkout";

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

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "layers",
    title: "Mix & Match bundles",
    body: "Let shoppers build their own packs and curated sets — the buying experience that turns browsers into bigger carts.",
  },
  {
    icon: "gauge",
    title: "Lift AOV on autopilot",
    body: "Volume discounts, BOGO, and tiered pricing fire automatically at checkout — no theme edits, no code.",
  },
  {
    icon: "sparkles",
    title: "Built for the AI-commerce era",
    body: "Clean, agent-friendly bundle data and native cart logic that fit right into the agentic checkout ShopX is all about.",
  },
  {
    icon: "globe",
    title: "Native Shopify, ready for APAC",
    body: "Fast, multi-currency, and Online Store 2.0-native — bundles that feel instant for shoppers across the region.",
  },
];

const BOOTH: { icon: IconName; text: string }[] = [
  { icon: "wand", text: "A 5-minute live build — watch a bundle go from zero to storefront." },
  { icon: "cart", text: "An exclusive ShopX offer for merchants we meet at the event." },
  { icon: "shield", text: "Face-time with the team behind the app — bring your hardest use case." },
];

const STATS: { value: string; label: string }[] = [
  { value: "250+", label: "Operators" },
  { value: "18", label: "Speakers" },
  { value: "17", label: "Sponsors" },
  { value: "6", label: "Media partners" },
];

const META = [
  { icon: "calendar" as IconName, text: "Thursday, Sep 17, 2026" },
  { icon: "globe" as IconName, text: "New World Saigon Hotel · Ho Chi Minh City" },
  { icon: "sparkles" as IconName, text: "AI-native ecommerce summit" },
];

export default function ShopxPage() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--pb-bg-950)", color: "var(--pb-text-100)" }}
    >
      {/* Aurora + grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(48rem 30rem at 12% -8%, color-mix(in oklab, var(--pb-cyan-400) 26%, transparent), transparent 60%), radial-gradient(44rem 30rem at 92% 4%, color-mix(in oklab, var(--pb-indigo-700) 55%, transparent), transparent 62%), radial-gradient(40rem 26rem at 60% 110%, color-mix(in oklab, var(--pb-coral-500) 16%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(70% 60% at 50% 0%, #000, transparent 80%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 0%, #000, transparent 80%)",
        }}
      />

      <div className="relative">
        {/* ============ HERO ============ */}
        <Container className="pt-16 pb-14 lg:pt-24 lg:pb-20">
          <AnimateIn>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lift"
              style={{
                backgroundImage: "linear-gradient(135deg,#ffe9a8,#e8b34a 55%,#b8860b)",
                color: "#3a2a06",
              }}
            >
              <Icon name="sparkles" className="size-3.5" />
              Gold Sponsor
            </span>
          </AnimateIn>

          <AnimateIn delay={0.05}>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              ShopX 2026 · Ho Chi Minh City
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-display-lg font-extrabold leading-[1.02] text-balance text-white">
              PushBundle{" "}
              <span
                className="bg-brand-gradient bg-clip-text text-transparent"
                style={{ WebkitBoxDecorationBreak: "clone" }}
              >
                ×
              </span>{" "}
              ShopX 2026
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-medium text-pretty text-white/80">
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
                <li key={m.text} className="flex items-center gap-2.5 text-sm text-white/75">
                  <span
                    className="grid size-8 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
                    style={{ color: "var(--pb-cyan-400)" }}
                  >
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
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">
                Doors open in
              </p>
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
              <a
                href={TICKET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "inverse", size: "lg" })}
              >
                Get your ShopX ticket
              </a>
              <a
                href={site.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: "inverseOutline", size: "lg" })}
              >
                Book a booth demo
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-sm text-white/50">
              <span style={{ color: "var(--pb-cyan-400)" }}>
                <Icon name="sparkles" className="size-4" />
              </span>
              Scanned our QR at the event? You&apos;re in exactly the right place.
            </p>
          </AnimateIn>
        </Container>

        {/* ============ WHY PUSHBUNDLE ============ */}
        <Container className="pb-16 lg:pb-24">
          <AnimateIn>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "var(--pb-coral-400)" }}>
              Why merchants stop by
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-display-sm font-bold text-balance text-white">
              The bundling engine behind higher-AOV Shopify stores
            </h2>
          </AnimateIn>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <AnimateIn key={f.title} delay={(i % 4) * 0.08} className="h-full">
                <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]">
                  <span className="inline-grid size-12 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
                    <Icon name={f.icon} className="size-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-pretty text-white/65">{f.body}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </Container>

        {/* ============ AT THE BOOTH ============ */}
        <Container className="pb-16 lg:pb-24">
          <AnimateIn>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(40rem 22rem at 100% 0%, color-mix(in oklab, var(--pb-cyan-400) 20%, transparent), transparent 60%), radial-gradient(36rem 22rem at 0% 100%, color-mix(in oklab, var(--pb-indigo-700) 55%, transparent), transparent 60%)",
                }}
              />
              <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                    Booth · ShopX 2026
                  </p>
                  <h2 className="mt-3 font-display text-display-sm font-bold text-balance text-white">
                    Meet us on the floor
                  </h2>
                  <p className="mt-4 max-w-lg text-pretty text-white/70">
                    Find the PushBundle stand at New World Saigon on September 17.
                    Bring your store — we&apos;ll show you the fastest path to a
                    bigger cart.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={site.calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyles({ variant: "inverse", size: "lg" })}
                    >
                      Book a demo slot
                    </a>
                    <a
                      href={EVENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonStyles({ variant: "inverseOutline", size: "lg" })}
                    >
                      View the agenda
                    </a>
                  </div>
                </div>

                <ul className="space-y-4">
                  {BOOTH.map((b) => (
                    <li
                      key={b.text}
                      className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                    >
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5"
                        style={{ color: "var(--pb-cyan-400)" }}
                      >
                        <Icon name={b.icon} className="size-5" />
                      </span>
                      <p className="text-sm text-white/80">{b.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimateIn>
        </Container>

        {/* ============ STATS ============ */}
        <Container className="pb-16 lg:pb-24">
          <AnimateIn>
            <p className="text-center text-sm font-semibold uppercase tracking-widest text-white/45">
              ShopX 2025, in numbers
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-sm"
                >
                  <p className="bg-brand-gradient bg-clip-text font-display text-4xl font-extrabold text-transparent">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/55">
                    {s.label}
                  </p>
                </div>
              ))}
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
                  <a
                    href={TICKET_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: "inverseOutline", size: "lg" })}
                  >
                    Get your ShopX ticket
                  </a>
                </div>
                <p className="mt-6 text-sm text-white/85">
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
