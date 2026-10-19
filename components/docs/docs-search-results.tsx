"use client";

import { useSearchParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/ui/locale-link";
import { DocsSearch, Highlighted } from "@/components/docs/docs-search";
import { DocRow } from "@/components/docs/doc-row";
import { searchDocs, type DocIndexEntry } from "@/lib/docs/search";
import type { DocsContent } from "@/i18n/content";
import { fmt } from "@/lib/utils";

/**
 * /docs/search results (docs/PLAN.md §5.8a). Reads `?q=` in the browser — the
 * page shell is prerendered, so this sits under a Suspense boundary.
 */
export function DocsSearchResults({
  docs,
  content,
}: {
  docs: DocIndexEntry[];
  content: Pick<DocsContent, "search" | "results" | "article">;
}) {
  const q = (useSearchParams().get("q") ?? "").trim();
  const results = searchDocs(docs, q);
  const topics = new Set(results.map((d) => d.categoryName)).size;
  const r = content.results;

  return (
    <>
      {/* key: a new ?q= (e.g. from the header back button) resets the box. */}
      <DocsSearch key={q} docs={docs} ui={content.search} initialQuery={q} size="md" />

      <div role="status" className="mt-8">
        {q ? (
          <>
            <p className="font-display text-xl font-bold">
              {fmt(results.length === 1 ? r.countOne : r.countOther, {
                n: results.length,
                q,
              })}
            </p>
            {results.length > 0 && (
              <p className="mt-1 text-sm text-muted">{fmt(r.across, { n: topics })}</p>
            )}
          </>
        ) : (
          <p className="text-muted">{r.prompt}</p>
        )}
      </div>

      {q && results.length === 0 && (
        <p className="mt-6 rounded-2xl border border-border bg-surface-subtle p-8 text-center text-muted">
          {r.empty}{" "}
          <Link href="/contact-us" className="font-semibold text-primary underline underline-offset-4">
            {r.askTeam}
          </Link>
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-6 grid gap-3">
          {results.map((doc) => (
            <li key={doc.slug}>
              <DocRow
                doc={doc}
                topic={doc.categoryName}
                minRead={content.article.minRead}
                title={<Highlighted text={doc.title} query={q} />}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
