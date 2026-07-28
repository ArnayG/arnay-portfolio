import Container from "@/components/Container";
import ThemeToggle from "@/components/ThemeToggle";
import { navLinks, site } from "@/data/site";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur">
      <Container>
        <nav className="flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a
            href="#top"
            className="font-mono text-[11px] font-medium tracking-[0.22em] uppercase"
          >
            {site.firstName}
            <span className="text-ink-muted">/</span>
          </a>

          {/* Below md the page is a single scroll and the card carries the
              links, so the jump list is dropped rather than hidden in a menu. */}
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-mono text-[11px] tracking-[0.18em] text-ink-muted uppercase transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <ThemeToggle />
            <a
              href={site.resumeUrl}
              className="border border-ink px-3 py-1.5 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              Resume
            </a>
          </div>
        </nav>
      </Container>
    </header>
  );
}
