import Section from "@/components/Section";
import { experience } from "@/data/experience";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-8">
        {experience.map((item) => (
          <li
            key={`${item.organization}-${item.period}`}
            className="grid gap-2 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <p className="font-mono text-xs text-muted sm:pt-1">{item.period}</p>
            <div>
              <h3 className="font-medium">
                {item.role}
                <span className="text-muted"> · {item.organization}</span>
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
                {item.points.map((point) => (
                  <li key={point} className="before:mr-2 before:content-['—']">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
