import Section from "@/components/Section";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <Section id="projects" title="Projects">
      <ul className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <li
            key={project.title}
            className="flex flex-col rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent"
          >
            <h3 className="text-lg font-medium">{project.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <li key={tech} className="font-mono text-xs text-muted">
                  {tech}
                </li>
              ))}
            </ul>
            {(project.repo || project.demo) && (
              <div className="mt-4 flex gap-4 text-sm">
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Live demo
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Section>
  );
}
