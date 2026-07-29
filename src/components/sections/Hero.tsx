import DisplayHeading from "@/components/DisplayHeading";
import { site } from "@/data/site";

export default function Hero() {
  return (
    <section id="top" className="py-12 sm:py-16">
      {/* The card carries the name and the page's <h1>, so the hero states
          the role instead, since repeating the name reads as a mistake. */}
      <DisplayHeading
        solid={site.headline.solid}
        outline={site.headline.outline}
        size="hero"
      />

      <p className="mt-8 max-w-xl leading-relaxed text-ink-muted">
        {site.summary}
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {site.skills.map((skill, index) => (
          <li
            key={index}
            className="border border-rule px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
