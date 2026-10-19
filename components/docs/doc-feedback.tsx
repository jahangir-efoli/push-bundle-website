"use client";

import { useState } from "react";
import { trackEvent } from "@/components/integrations/analytics";
import type { DocsContent } from "@/i18n/content";

/**
 * "Was this guide helpful?" — each vote is a GA4 `doc_feedback` event
 * ({ doc_slug, helpful: "yes" | "no" }), so the guides that need work show up
 * in Analytics. Only counted where GA runs (production + cookie consent).
 */
export function DocFeedback({
  slug,
  content,
}: {
  slug: string;
  content: DocsContent["article"]["feedback"];
}) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  const send = (helpful: "yes" | "no") => {
    setVote(helpful);
    trackEvent("doc_feedback", { doc_slug: slug, helpful });
  };

  return (
    <div className="flex min-h-18 flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-soft">
      <p role="status" className="mr-auto font-semibold">
        {vote === null
          ? content.question
          : vote === "yes"
            ? content.thanksYes
            : content.thanksNo}
      </p>
      {vote === null && (
        <div className="flex gap-2">
          {(["yes", "no"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => send(v)}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary-subtle"
            >
              <span aria-hidden="true">{v === "yes" ? "👍" : "👎"}</span>
              {v === "yes" ? content.yes : content.no}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
