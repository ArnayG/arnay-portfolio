import DisplayHeading from "@/components/DisplayHeading";

type SectionProps = {
  id: string;
  title: string;
  /** Optional hollow second line of the heading. */
  outline?: string;
  /** Small factual line above the heading: counts, dates, scope. */
  kicker?: string;
  children: React.ReactNode;
};

/**
 * Consistent header + spacing for every section in the content column.
 * Anchor offset is handled globally by scroll-padding-top on <html>.
 */
export default function Section({
  id,
  title,
  outline,
  kicker,
  children,
}: SectionProps) {
  return (
    <section id={id} className="border-t border-rule py-16 sm:py-20">
      {kicker ? (
        <p className="mb-4 font-mono text-[10px] tracking-[0.22em] text-ink-muted uppercase">
          {kicker}
        </p>
      ) : null}
      <DisplayHeading solid={title} outline={outline} />
      <div className="mt-10">{children}</div>
    </section>
  );
}
