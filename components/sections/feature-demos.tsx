import { Section } from "@/components/ui/section";
import { Icon, type IconName } from "@/components/ui/icon";
import { buttonStyles } from "@/components/ui/button";
import { site } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { showcase } from "@/lib/content/showcase";
import { VolumeBundleStage } from "@/components/demos/volume-bundle-stage";
import { CrossSellStage } from "@/components/demos/cross-sell-stage";
import { MixMatchSingleStage } from "@/components/demos/mix-match-single-stage";
import { MixMatchMultiStage } from "@/components/demos/mix-match-multi-stage";
import { ByobStage } from "@/components/demos/byob-stage";

/** Live demo for each feature id. */
const DEMOS: Record<string, React.ComponentType> = {
  volume: VolumeBundleStage,
  "cross-sell": CrossSellStage,
  "mix-single": MixMatchSingleStage,
  "mix-multi": MixMatchMultiStage,
  byob: ByobStage,
};

/** Copy for one bundle demo (localized; the live demo is keyed by `id`). */
export type FeatureDemoItem = {
  id: string;
  icon: string;
  tab: string;
  title: string;
  description: string;
  howItWorks: string;
  benefits: string;
  flexibility: string;
  cta: string;
};

/** Section labels + a11y strings shared by every demo (localized). */
export type FeatureDemoLabels = {
  howItWorks: string;
  benefits: string;
  flexibility: string;
  /** Rendered as "{title} — {livePreview}". */
  livePreview: string;
  opensNewTab: string;
};

const DEFAULT_LABELS: FeatureDemoLabels = {
  howItWorks: "How it Works",
  benefits: "Benefits",
  flexibility: "Flexibility",
  livePreview: "live preview",
  opensNewTab: "(opens in a new tab)",
};

/**
 * Features page — each bundle type gets its own full section: the live,
 * interactive demo on one side and its copy on the other, alternating
 * left/right down the page. The preview sits in a white app-window frame
 * (`pb-light`) so it reads as a real storefront regardless of theme.
 */
export function FeatureDemos({
  features = showcase.features,
  labels = DEFAULT_LABELS,
}: {
  features?: readonly FeatureDemoItem[];
  labels?: FeatureDemoLabels;
} = {}) {
  return (
    <>
      {features.map((f, i) => {
        const Demo = DEMOS[f.id];
        if (!Demo) return null;
        const reverse = i % 2 === 1;
        const sections = [
          { label: labels.howItWorks, body: f.howItWorks },
          { label: labels.benefits, body: f.benefits },
          { label: labels.flexibility, body: f.flexibility },
        ];
        return (
          <Section key={f.id} tone={reverse ? "alt" : "default"}>
            <div
              className={cn(
                "grid items-center gap-8 lg:gap-14",
                reverse
                  ? "lg:grid-cols-[minmax(0,1fr)_1.7fr]"
                  : "lg:grid-cols-[1.7fr_minmax(0,1fr)]",
              )}
            >
              {/* Live demo in an app-window frame */}
              <div className={cn("min-w-0", reverse && "lg:order-2")}>
                <div className="rounded-2xl bg-gradient-border p-1.5 shadow-lift">
                  <div className="pb-light overflow-hidden rounded-[0.9rem] bg-surface text-foreground">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <span className="flex gap-1.5" aria-hidden="true">
                        <span className="size-2.5 rounded-full bg-warm/70" />
                        <span className="size-2.5 rounded-full bg-warning/70" />
                        <span className="size-2.5 rounded-full bg-success/70" />
                      </span>
                      <span className="ml-2 truncate text-xs text-muted">
                        {f.title} — {labels.livePreview}
                      </span>
                    </div>
                    {/* data-lenis-prevent: native scroll inside the box. */}
                    <div
                      data-lenis-prevent
                      className="scrollbar-brand max-h-128 overflow-y-auto"
                    >
                      <Demo />
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className={cn("min-w-0", reverse && "lg:order-1")}>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  <Icon name={f.icon as IconName} className="size-4" />
                  {f.tab}
                </span>
                <h2 className="mt-4 text-display-md text-balance">{f.title}</h2>
                <p className="mt-3 text-lg text-muted">{f.description}</p>

                <div className="mt-6 space-y-5">
                  {sections.map((s) => (
                    <div key={s.label}>
                      <h3 className="text-base font-bold text-foreground">
                        {s.label}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {s.body}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <a
                    href={site.shopifyAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: "gradient" })}
                  >
                    {f.cta}
                    <span className="sr-only"> {labels.opensNewTab}</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </Section>
        );
      })}
    </>
  );
}
