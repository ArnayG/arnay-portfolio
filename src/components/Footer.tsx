import Container from "@/components/Container";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-rule">
      <Container className="flex flex-col items-center justify-between gap-2 py-8 font-mono text-[10px] tracking-[0.18em] text-ink-muted uppercase sm:flex-row">
        <p>
          © {new Date().getFullYear()} {site.firstName} {site.lastName}
        </p>
        <p>Next.js · Tailwind CSS</p>
      </Container>
    </footer>
  );
}
