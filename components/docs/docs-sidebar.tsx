import { LocaleLink as Link } from "@/components/ui/locale-link";
import { cn } from "@/lib/utils";
import type { DocArticle } from "@/lib/cms";

/** Groups doc articles by category, preserving order. */
export function groupDocs(docs: DocArticle[]) {
  const groups = new Map<string, { name: string; items: DocArticle[] }>();
  for (const doc of docs) {
    const g = groups.get(doc.category) ?? { name: doc.categoryName, items: [] };
    g.items.push(doc);
    groups.set(doc.category, g);
  }
  return [...groups.values()];
}

/** Docs category tree (docs/PLAN.md §5.8b) — shared nav for home + article. */
export function DocsSidebar({
  docs,
  currentSlug,
}: {
  docs: DocArticle[];
  currentSlug?: string;
}) {
  const groups = groupDocs(docs);

  return (
    <nav aria-label="Documentation" className="space-y-6">
      {groups.map((group) => (
        <div key={group.name}>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {group.name}
          </p>
          <ul className="mt-2 space-y-1 border-l border-border">
            {group.items.map((doc) => {
              const active = doc.slug === currentSlug;
              return (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "-ml-px flex min-h-9 items-center border-l-2 pl-4 text-sm transition-colors",
                      active
                        ? "border-primary font-semibold text-primary"
                        : "border-transparent text-muted hover:border-border hover:text-foreground",
                    )}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
