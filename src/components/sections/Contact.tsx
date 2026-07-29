import DisplayHeading from "@/components/DisplayHeading";
import { site } from "@/data/site";

export default function Contact() {
  return (
    <div className="max-w-2xl">
      <DisplayHeading solid="Get in" outline="Touch" />

      <p className="mt-8 leading-relaxed text-ink-muted">
        I&apos;m looking for software engineering internships. If you think
        there&apos;s a fit, or you just want to talk about something I built, my
        inbox is open.
      </p>

      <a
        href={`mailto:${site.email}`}
        className="shadow-hard mt-8 inline-flex items-center border border-ink bg-paper px-5 py-3 font-mono text-sm tracking-[0.1em] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
      >
        {site.email}
      </a>

      <ul className="mt-8 flex flex-wrap gap-5">
        {site.socials.map((social) => (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink"
            >
              {social.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
