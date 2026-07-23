/**
 * JSON-LD structured data (docs/PLAN.md §7 SEO/AEO/GEO).
 * Server Component — emits a script tag with no client cost.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Server-generated, no user input — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
