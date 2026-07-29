import Image from "next/image";
import { site } from "@/data/site";

/**
 * Renders the headshot when site.photo is set, otherwise a drafting-style
 * empty frame at the same 4:5 ratio so the card doesn't reflow on swap.
 */
export default function Portrait() {
  if (site.photo) {
    return (
      <div className="aspect-square w-full overflow-hidden border border-ink">
        <Image
          src={site.photo.src}
          alt={`${site.firstName} ${site.lastName}`}
          width={site.photo.width}
          height={site.photo.height}
          sizes="96px"
          priority
          className="h-full w-full object-cover grayscale contrast-125"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-square w-full items-center justify-center border border-rule">
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--rule)" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--rule)" />
      </svg>
      <span className="relative bg-paper px-2 font-mono text-[10px] tracking-[0.2em] text-ink-muted uppercase">
        Portrait
      </span>
    </div>
  );
}
