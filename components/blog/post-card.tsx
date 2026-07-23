import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Card } from "@/components/ui/card";
import { MediaHolder } from "@/components/media/media-holder";
import type { Category, Person, Post } from "@/lib/cms";

/** Formats a CMS date string as a stable, locale-safe label. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Small round author avatar — real photo when set, initials otherwise. */
function AuthorAvatar({ person }: { person: Person }) {
  const initials = person.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (person.avatar) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={person.avatar}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold text-white"
    >
      {initials || "•"}
    </span>
  );
}

/** Blog post card (docs/PLAN.md §5.7). */
export function PostCard({
  post,
  categories,
  /** Heading level so the card fits its context (h2 under a page h1). */
  titleAs: Tag = "h3",
}: {
  post: Post;
  categories: Category[];
  titleAs?: "h2" | "h3";
}) {
  const categoryName =
    categories.find((c) => c.slug === post.category)?.name ?? post.category;

  return (
    <Card
      as="article"
      interactive
      padded={false}
      className="group flex h-full flex-col overflow-hidden"
    >
      <Link
        href={`/blog/${post.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative block overflow-hidden"
      >
        <MediaHolder
          src={post.coverImage}
          alt={post.title}
          icon="layers"
          className="rounded-none transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Solid chips so they stay readable over any cover/gradient. */}
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-soft">
          {categoryName}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-background">
          {post.readingMinutes} min read
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Tag className="font-display text-base font-bold leading-snug line-clamp-2 wrap-break-word">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors hover:text-primary"
          >
            {post.title}
          </Link>
        </Tag>
        <p className="mt-2 flex-1 text-sm text-muted line-clamp-3">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <AuthorAvatar person={post.author} />
            <span className="truncate text-sm font-medium text-foreground">
              {post.author.name}
            </span>
          </div>
          <time
            dateTime={post.publishedAt}
            className="shrink-0 text-xs uppercase tracking-wide text-muted"
          >
            {formatDate(post.publishedAt)}
          </time>
        </div>
      </div>
    </Card>
  );
}
