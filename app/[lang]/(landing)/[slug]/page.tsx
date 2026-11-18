import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHtml } from "@/components/cms/landing-html";
import { getLandingPage } from "@/lib/cms/landing";
import { OG_IMAGE, SITE_NAME } from "@/lib/seo/site";

/**
 * CMS landing page at the site root (`/<slug>`; English, so `/de/<slug>` etc.
 * render the same page and canonical back to `/<slug>`). Static routes
 * (`/pricing`, `/blog`, …) take precedence over this dynamic segment.
 *
 * The header/footer switches are applied by ./layout.tsx. The content is the
 * editor's own HTML and layout: rendered as received, full width, with no
 * article/prose wrapper.
 */
type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  if (!page) return {};

  const canonical = page.canonicalUrl || `/${page.slug}`;
  const title = page.metaTitle || page.title;
  const description = page.metaDescription ?? undefined;
  const image = page.ogImage ?? OG_IMAGE;

  return {
    // An editor-set meta title is used verbatim; the plain title gets the
    // site's "%s | PushBundle" template like every other page.
    title: page.metaTitle ? { absolute: page.metaTitle } : page.title,
    description,
    alternates: { canonical },
    // Drafts (preview) and noIndex pages must never be indexed.
    robots:
      page.noIndex || page.isPreview ? { index: false, follow: false } : undefined,
    // A page that sets `openGraph` doesn't inherit the root card, so set the
    // full card (url/title/image) or shares would show the home page's.
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  const page = await getLandingPage(slug);
  // A root [slug] catches every unknown URL — real 404s must stay 404s.
  if (!page) notFound();

  return <LandingHtml html={page.content} />;
}
