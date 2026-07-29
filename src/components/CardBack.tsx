import CropMarks from "@/components/CropMarks";
import Monogram from "@/components/Monogram";
import Rosette from "@/components/Rosette";
import SiteAddress from "@/components/SiteAddress";
import { site } from "@/data/site";

/**
 * The reverse. A real card puts its flourish here and keeps the working
 * details on the front, so this side is the monogram over an engraved ground,
 * the tools underneath it, and a colophon on the trim.
 *
 * The address repeats from the front on purpose: this face can be exported on
 * its own, and an image with no way back to the site is a dead end.
 */
export default function CardBack() {
  return (
    <>
      <CropMarks />

      <div className="flex h-full flex-col">
        <p className="font-mono text-[10px] tracking-[0.2em] text-ink-muted uppercase">
          {site.firstName} {site.lastName}
        </p>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <Rosette className="pointer-events-none absolute h-44 w-44" />
          <Monogram variant="display" />
        </div>

        {/* Separators are real elements rather than ::after content, because
            the exporter paints the DOM and can't see pseudo-elements. */}
        <ul className="flex flex-wrap items-baseline justify-center gap-x-2 font-mono text-[9px] tracking-[0.16em] text-ink-muted uppercase">
          {site.skills.map((skill, index) => (
            <li key={skill} className="flex items-baseline gap-2">
              {skill}
              {index < site.skills.length - 1 && (
                <span aria-hidden="true" className="text-rule">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-rule pt-2.5">
          <span className="font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase">
            {site.location}
          </span>
          <SiteAddress className="shrink-0 font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase" />
        </div>
      </div>
    </>
  );
}
