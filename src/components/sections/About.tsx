import Section from "@/components/Section";
import { site } from "@/data/site";

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
        <div className="space-y-4 leading-relaxed text-muted">
          {/* TODO: replace with a short bio — where you study, what pulled you into
              software, and the kind of problems you want to work on. */}
          <p>
            TODO: open with how you got into programming. A concrete origin story
            reads better than a list of adjectives.
          </p>
          <p>
            TODO: close with what you&apos;re looking for right now — the kind of
            internship, team, or problem space you want next.
          </p>
        </div>
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">
            Skills
          </h3>
          <ul className="flex flex-wrap gap-2">
            {site.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
