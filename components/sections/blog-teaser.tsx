import { LocaleLink as Link } from "@/components/ui/locale-link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/components/blog/post-card";
import { AnimateIn } from "@/components/motion/animate-in";
import { buttonStyles } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { blogTeaser } from "@/lib/content/home";
import type { Category, Post } from "@/lib/cms";

/** "Expert Reads" blog teaser (docs/PLAN.md §5.1 §9) — CMS-driven. */
export function BlogTeaser({
  posts,
  categories,
}: {
  posts: Post[];
  categories: Category[];
}) {
  return (
    <Section tone="alt">
      <div className="max-w-3xl">
        <Eyebrow>From the blog</Eyebrow>
        <h2 className="mt-3 text-display-md">{blogTeaser.title}</h2>
        <p className="mt-4 text-muted">{blogTeaser.subtitle}</p>
      </div>

      {/* Same card as the blog listing so the design stays consistent. */}
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <li key={post.slug} className="h-full">
            <AnimateIn delay={i * 0.1} className="h-full">
              <PostCard post={post} categories={categories} titleAs="h3" />
            </AnimateIn>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/blog" className={buttonStyles({ variant: "secondary" })}>
          {blogTeaser.cta}
        </Link>
      </div>
    </Section>
  );
}
