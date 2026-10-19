import type { DocEmbed as DocEmbedData } from "@/lib/cms";

/**
 * The article's video walkthrough — the CMS custom HTML section iframe, lifted
 * out of the body (lib/cms/http/mappers.ts#extractDocEmbed). Sized from the
 * iframe's own width/height, else 16:9. A hosted player gets the usual media
 * permissions; inline `srcdoc` HTML runs sandboxed with scripts only, so it
 * can animate but can't reach the page, cookies or storage.
 */
export function DocEmbed({ embed, title }: { embed: DocEmbedData; title: string }) {
  const ratio =
    embed.width && embed.height ? `${embed.width} / ${embed.height}` : "16 / 9";
  const label = embed.title || title;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-black shadow-soft">
      {embed.src ? (
        <iframe
          src={embed.src}
          title={label}
          loading="lazy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block w-full"
          style={{ aspectRatio: ratio }}
        />
      ) : (
        <iframe
          srcDoc={embed.srcdoc}
          title={label}
          loading="lazy"
          sandbox="allow-scripts"
          className="block w-full"
          style={{ aspectRatio: ratio }}
        />
      )}
    </div>
  );
}
