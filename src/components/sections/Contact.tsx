import Section from "@/components/Section";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <Section id="contact" title="Contact">
      <div className="max-w-xl">
        <p className="leading-relaxed text-muted">
          I&apos;m looking for software engineering internships. If you think
          there&apos;s a fit — or you just want to talk about something I built —
          my inbox is open.
        </p>
        <a
          href={`mailto:${site.email}`}
          className="mt-6 inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          {site.email}
        </a>
        <ul className="mt-8 flex flex-wrap gap-5 text-sm">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-foreground"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
