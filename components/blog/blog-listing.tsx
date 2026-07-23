import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { BlogResults } from "@/components/blog/blog-results";
import type { Category, Paginated, Post } from "@/lib/cms";

/**
 * Shared blog listing (docs/PLAN.md §5.7) — used by the index, numbered
 * pagination, and category archive pages so they stay identical. The header
 * renders on the server; the filter panel, search, grid, and pagination live in
 * the client `BlogResults`.
 */
export function BlogListing({
  eyebrow = "Blog",
  title,
  intro,
  result,
  allPosts,
  categories,
  activeCategory,
  basePath,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  result: Paginated<Post>;
  /** Full post set for client-side search (falls back to the current page). */
  allPosts?: Post[];
  categories: Category[];
  activeCategory?: string;
  basePath: string;
}) {
  return (
    <Container className="py-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-display-lg text-balance">{title}</h1>
      {intro && <p className="mt-4 mb-8 max-w-2xl text-lg text-muted">{intro}</p>}

      <BlogResults
        pagePosts={result.items}
        allPosts={allPosts ?? result.items}
        categories={categories}
        activeCategory={activeCategory}
        page={result.page}
        totalPages={result.totalPages}
        basePath={basePath}
      />
    </Container>
  );
}
