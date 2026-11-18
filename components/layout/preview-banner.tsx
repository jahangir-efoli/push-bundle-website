/**
 * Draft-preview notice (docs/cmd.md — Draft preview). A draft must never be
 * mistaken for the live page. Rendered by any CMS page that is showing draft
 * content (blog posts, landing pages).
 */
export function PreviewBanner() {
  return (
    <div className="bg-warm px-gutter py-2.5 text-center text-sm font-semibold text-white">
      Preview mode — showing unpublished content.{" "}
      {/* Full navigation to the route handler (clears draft mode); not a page. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/preview/exit" className="underline underline-offset-2">
        Exit preview
      </a>
    </div>
  );
}
