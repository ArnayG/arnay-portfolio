import { site } from "@/data/site";

export default function Hero() {
  return (
    <section id="top" className="py-20 sm:py-28">
      <p className="font-mono text-sm text-accent">Hi, my name is</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
        {site.name}
      </h1>
      <p className="mt-3 text-xl text-muted sm:text-2xl">{site.role}</p>
      <p className="mt-6 max-w-xl leading-relaxed text-muted">{site.summary}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#projects"
          className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          View my work
        </a>
        <a
          href={`mailto:${site.email}`}
          className="inline-flex items-center rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-surface"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
}
