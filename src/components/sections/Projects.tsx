import Section from "@/components/Section";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <Section id="projects" title="Projects" kicker={`${projects.length} selected`}>
      <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2">
        {projects.map((project, index) => (
          <li
            key={index}
            className="flex flex-col bg-paper p-5 transition-colors hover:bg-paper/60"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-ink-muted uppercase">
              {project.category}
              {project.period ? ` · ${project.period}` : ""}
            </p>

            <h3 className="mt-1.5 text-lg font-medium">{project.title}</h3>

            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
              {project.description}
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
              {project.stack.map((tech, techIndex) => (
                <li
                  key={techIndex}
                  className="font-mono text-[10px] tracking-[0.14em] text-ink-muted uppercase"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {project.links?.length ? (
              <ul className="mt-4 flex flex-wrap gap-4">
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[11px] tracking-[0.14em] uppercase underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
