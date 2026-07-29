import Section from "@/components/Section";
import { hobbies } from "@/data/hobbies";

export default function Hobbies() {
  return (
    <Section id="hobbies" title="Hobbies">
      <dl className="divide-y divide-rule border-y border-rule">
        {hobbies.map((hobby, index) => (
          <div
            key={index}
            className="grid gap-1 py-4 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <dt className="font-mono text-[11px] tracking-[0.16em] uppercase">
              {hobby.name}
            </dt>
            {hobby.detail ? (
              <dd className="text-sm leading-relaxed text-ink-muted">
                {hobby.detail}
              </dd>
            ) : null}
          </div>
        ))}
      </dl>
    </Section>
  );
}
