import Section from "@/components/Section";
import { research } from "@/data/research";

const papers = research.filter((item) => item.kind === "paper").length;
const posters = research.filter((item) => item.kind === "poster").length;

function plural(count: number, word: string) {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export default function Research() {
  return (
    <Section
      id="research"
      title="Research"
      kicker={`${plural(papers, "paper")} · ${plural(posters, "poster")}`}
    >
      <p className="mb-10 max-w-prose leading-relaxed text-ink-muted">
        Presented at both conferences as the only high-school author among
        industry researchers, working with Dr. Derek Leishman, VP of
        Translational Toxicology at Eli Lilly.
      </p>

      <ol className="space-y-8">
        {/* Static ordered list, so index keys are stable here, and titles are
            not guaranteed unique. */}
        {research.map((item, index) => (
          <li key={index} className="border-l-2 border-ink pl-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-ink-muted uppercase">
              {item.kind} · {item.year}
            </p>

            <h3 className="mt-1.5 text-lg leading-snug font-medium">
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                >
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>

            <p className="mt-1.5 text-sm text-ink">{item.venue}</p>

            {item.authors ? (
              <p className="mt-1 text-sm text-ink-muted">{item.authors}</p>
            ) : null}

            {item.summary ? (
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
                {item.summary}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </Section>
  );
}
