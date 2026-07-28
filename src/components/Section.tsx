type SectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

/** Consistent heading + spacing wrapper for every section on the home page. */
export default function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-16 sm:py-20">
      <h2 className="mb-8 font-mono text-xs uppercase tracking-widest text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}
