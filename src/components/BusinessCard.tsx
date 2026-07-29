import CardStage from "@/components/CardStage";
import CropMarks from "@/components/CropMarks";
import Portrait from "@/components/Portrait";
import { site } from "@/data/site";

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase">
        {label}
      </dt>
      <dd className="text-right font-mono text-[11px] text-ink">{value}</dd>
    </div>
  );
}

/**
 * The card itself is static markup; CardStage adds the interactive shell —
 * the cursor-driven tilt and the export controls — around it.
 */
export default function BusinessCard() {
  return (
    <CardStage>
      <CropMarks />

      {/* Portrait sits beside the name rather than above it: a card-shaped
          card stays short enough to actually pin on a laptop viewport. */}
      <div className="flex items-start gap-4">
        <div className="w-24 shrink-0">
          <Portrait />
        </div>
        <h1 className="font-grotesk text-2xl font-black tracking-[-0.03em] uppercase italic leading-[0.85]">
          <span className="block">{site.firstName}</span>
          <span className="block">{site.lastName}</span>
        </h1>
      </div>

      <p className="mt-4">
        <span className="inline-block bg-ink px-2 py-1 font-mono text-[10px] tracking-[0.2em] text-paper uppercase">
          {site.role}
        </span>
      </p>

      <p className="mt-2.5 text-sm leading-snug text-ink-muted">
        {site.cardline}
      </p>

      <dl className="mt-4 border-t border-rule pt-1.5">
        <MetaRow label="Location" value={site.location} />
        <MetaRow label="Status" value={site.availability} />
      </dl>

      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-3">
        {site.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.14em] text-ink-muted uppercase transition-colors hover:text-ink"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>

      <a
        href={site.resumeUrl}
        className="shadow-hard-sm mt-4 inline-flex items-center gap-2 border border-ink px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-transform hover:translate-x-px hover:translate-y-px"
      >
        Resume
        <span aria-hidden="true" className="text-mark">
          [↓]
        </span>
      </a>
    </CardStage>
  );
}
