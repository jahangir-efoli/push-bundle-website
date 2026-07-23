import { SITE_URL } from "@/lib/seo/site";

/**
 * Social share buttons (docs/PLAN.md §5.7c). Plain share-intent links — no
 * client JS, no third-party widgets. Server Component.
 */
export function ShareButtons({
  path,
  title,
  className = "",
}: {
  path: string;
  title: string;
  className?: string;
}) {
  const url = encodeURIComponent(`${SITE_URL}${path}`);
  const text = encodeURIComponent(title);

  const links = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      path: "M6.9 8.5H4V20h2.9V8.5ZM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3-1.6-4.4-3.8-4.4-1.7 0-2.5.9-3 1.6V8.5H10.4V20h2.9v-6.1c0-1.3.8-2 1.8-2s1.9.6 1.9 2V20H20v-6.4Z",
    },
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      path: "M18.9 3H21l-6.5 7.4L22 21h-6l-4.7-6.2L5.9 21H3.7l7-8L2 3h6.2l4.2 5.6L18.9 3Zm-1 16.2h1.2L7.2 4.7H5.9l12 14.5Z",
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      path: "M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z",
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="grid size-10 place-items-center rounded-full border border-white/25 text-white/75 transition-colors hover:border-white/50 hover:text-white"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="currentColor">
            <path d={l.path} />
          </svg>
        </a>
      ))}
    </div>
  );
}
