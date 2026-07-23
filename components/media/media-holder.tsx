import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

/**
 * Image holder (docs/PLAN.md §5.7c, §5.6).
 *
 * Renders the CMS image when one is provided; otherwise a branded gradient
 * placeholder so the layout is complete before real assets land (§9 #10).
 * Phase 9 swaps the <img> for <Image> once the CMS host is in remotePatterns.
 *
 * Always decorative when there's no image (aria-hidden); a real image carries
 * its `alt`.
 */
export function MediaHolder({
  src,
  alt,
  ratio = "aspect-video",
  className,
  icon = "layers",
  label,
}: {
  src?: string;
  alt?: string;
  ratio?: string;
  className?: string;
  icon?: IconName;
  label?: string;
}) {
  if (src) {
    return (
      /* CMS host goes into next/image remotePatterns in Phase 9; the
         placeholder path renders today. */
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={alt ?? ""}
        className={cn("h-full w-full object-cover", ratio, className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid place-items-center overflow-hidden bg-brand-gradient text-white/90",
        ratio,
        className,
      )}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative flex flex-col items-center gap-2">
        <Icon name={icon} className="size-8" />
        {label && <span className="text-xs font-semibold">{label}</span>}
      </div>
    </div>
  );
}

/** Square logo holder (partners) — shows initials when no logo is set. */
export function LogoHolder({
  src,
  name,
  className,
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const initials = name
    .replace(/[^a-zA-Z\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={`${name} logo`}
        className={cn("size-12 rounded-xl object-contain", className)}
        loading="lazy"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-12 shrink-0 place-items-center rounded-xl bg-brand-gradient font-display text-lg font-bold text-white",
        className,
      )}
    >
      {initials || "•"}
    </span>
  );
}
