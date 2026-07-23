import type { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { AnimateIn } from "@/components/motion/animate-in";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge, CHANGELOG_TONE } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Accordion } from "@/components/ui/accordion";
import { Tabs } from "@/components/ui/tabs";
import { Dropdown } from "@/components/ui/dropdown";

/**
 * Internal style guide (docs/PLAN.md §6 design-system kit).
 * Not part of the public site: noindexed and excluded from the sitemap.
 * Kept so the UI kit stays visually reviewable and test-covered.
 */
export const metadata: Metadata = {
  title: "UI Preview — PushBundle",
  robots: { index: false, follow: false },
};

const BRAND: Array<[string, string]> = [
  ["indigo-900", "#171C8F"],
  ["indigo-700", "#1E27D6"],
  ["blue-500", "#2C5BF0"],
  ["sky-400", "#2F6BFF"],
  ["cyan-400", "#3AD9EE"],
  ["cyan-600", "#0E9CB5"],
];

const FAQ = [
  {
    question: "What types of bundles can I create with PushBundle?",
    answer: "Mix & match, build-a-box, volume, fixed, and cross-sell bundles.",
    slug: "preview-bundles",
  },
  {
    question: "Can shoppers choose their own product variants for a bundle?",
    answer: "Yes — with per-variant quantity limits you control.",
    slug: "preview-variants",
  },
];

export default function UiPreview() {
  return (
    <>
      <Section tone="gradient" className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-90">
          Internal
        </p>
        <h1 className="mt-4 text-display-xl">UI Preview</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-90">
          Design tokens, typography, and the core component kit.
        </p>
      </Section>

      <Section>
        <h2 className="text-display-md">Typography</h2>
        <div className="mt-8 space-y-4">
          <p className="text-display-xl">Display XL — Plus Jakarta Sans</p>
          <p className="text-display-lg">Display LG — headings scale fluidly</p>
          <p className="text-display-md">Display MD</p>
          <p className="max-w-2xl text-muted">
            Body copy is set in Inter for interface legibility.
          </p>
        </div>
      </Section>

      <Section tone="alt">
        <h2 className="text-display-md">Brand palette</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {BRAND.map(([name, hex]) => (
            <div key={name} className="overflow-hidden rounded-lg shadow-soft">
              <div className="h-20" style={{ backgroundColor: hex }} />
              <div className="bg-surface p-3">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted">{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section tone="subtle">
        <h2 className="text-display-md">Buttons</h2>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="gradient">Gradient CTA</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </Section>

      <Section>
        <h2 className="text-display-md">Badges</h2>
        <div className="mt-8 flex flex-wrap gap-3">
          {(
            Object.entries(CHANGELOG_TONE) as Array<
              [string, (typeof CHANGELOG_TONE)[keyof typeof CHANGELOG_TONE]]
            >
          ).map(([label, tone]) => (
            <Badge key={label} tone={tone}>
              {label}
            </Badge>
          ))}
          <Badge tone="error">Deprecated</Badge>
        </div>
      </Section>

      <Section tone="alt">
        <h2 className="text-display-md">Cards &amp; scroll reveal</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {["Bundling Options", "Bundle Previews", "Bundle Scheduling"].map(
            (title, i) => (
              <AnimateIn key={title} delay={i * 0.1}>
                <Card interactive>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>
                    Only transform and opacity animate.
                  </CardDescription>
                </Card>
              </AnimateIn>
            ),
          )}
        </div>
      </Section>

      <Section tone="subtle">
        <h2 className="text-display-md">Form fields</h2>
        <form className="mt-8 grid max-w-xl gap-5">
          <Input label="Full Name" name="name" placeholder="Jane Merchant" />
          <Input
            label="Email"
            name="email"
            type="email"
            hint="We reply within 24 hours."
          />
          <Input label="Subject" name="subject" error="Please enter a subject." />
          <Textarea label="Your Message" name="message" />
          <div>
            <Button type="submit">Submit Form</Button>
          </div>
        </form>
      </Section>

      <Section>
        <h2 className="text-display-md">Tabs</h2>
        <Tabs
          className="mt-8"
          label="Bundle types"
          tabs={[
            {
              label: "Mix and Match",
              content: <p className="text-muted">Build your own packs.</p>,
            },
            {
              label: "Volume",
              content: <p className="text-muted">Quantity-tier discounts.</p>,
            },
            {
              label: "Cross-Sell",
              content: <p className="text-muted">Complementary products.</p>,
            },
          ]}
        />
      </Section>

      <Section tone="alt">
        <h2 className="text-display-md">Accordion</h2>
        <Accordion className="mt-8" items={FAQ} />
      </Section>

      <Section tone="subtle">
        <h2 className="text-display-md">Dropdown</h2>
        <div className="mt-8 flex gap-4">
          <Dropdown
            trigger="Resources"
            items={[
              { label: "Partners", href: "#" },
              { label: "Docs", href: "#" },
              { label: "Blog", href: "#" },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
