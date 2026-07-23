import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cn } from "@/lib/utils";

/**
 * SEO-friendly numbered pagination (docs/PLAN.md §5.7).
 * Renders real <a> links (crawlable), with the current page marked.
 * `basePath` is "/blog" or "/blog/category/{slug}"; page 1 has no /page/N.
 *
 * Compact/truncated for large corpora: always shows first + last, the current
 * page and its neighbours, and `…` gaps between — so 24 pages don't render as
 * 24 buttons.
 */

/** Build the page list with `"gap"` markers, e.g. [1, "gap", 11,12,13, "gap", 24]. */
function pageList(page: number, totalPages: number): Array<number | "gap"> {
  const SIBLINGS = 1; // pages either side of the current one
  const out: Array<number | "gap"> = [];
  const add = (n: number) => out.push(n);

  const start = Math.max(2, page - SIBLINGS);
  const end = Math.min(totalPages - 1, page + SIBLINGS);

  add(1);
  if (start > 2) out.push("gap");
  for (let n = start; n <= end; n++) add(n);
  if (end < totalPages - 1) out.push("gap");
  if (totalPages > 1) add(totalPages);
  return out;
}

export function Pagination({
  page,
  totalPages,
  basePath,
}: {
  page: number;
  totalPages: number;
  basePath: string;
}) {
  if (totalPages <= 1) return null;

  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`);
  const items = pageList(page, totalPages);

  const numberClass = (active: boolean) =>
    cn(
      "grid h-11 min-w-11 place-items-center rounded-lg px-3 text-sm font-semibold transition-colors",
      active
        ? "bg-primary text-primary-foreground"
        : "border border-border hover:bg-surface-subtle",
    );
  const stepClass =
    "flex h-11 items-center rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-subtle";

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev" className={stepClass}>
          ← Prev
        </Link>
      )}

      {items.map((item, i) =>
        item === "gap" ? (
          <span
            key={`gap-${i}`}
            aria-hidden="true"
            className="grid h-11 min-w-11 place-items-center text-sm text-muted"
          >
            …
          </span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={numberClass(item === page)}
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link href={href(page + 1)} rel="next" className={stepClass}>
          Next →
        </Link>
      )}
    </nav>
  );
}
