/** Copies of the ellipse. Enough to read as a weave, few enough to stay airy. */
const COPIES = 22;

/**
 * An engine-turned rosette, the guilloche figure engraved on banknotes and
 * share certificates. One ellipse is drawn over and over, each copy rotated a
 * little further, so the pattern comes out of the overlaps rather than any
 * single line. Hairline weights keep it a ground, not a subject.
 *
 * Carries a viewBox so the exporter can rasterise it at full output scale.
 */
export default function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      aria-hidden="true"
      fill="none"
      stroke="var(--rule)"
      className={className}
    >
      <circle r="97" strokeWidth="0.9" />
      <circle r="91" strokeWidth="0.4" />
      {Array.from({ length: COPIES }, (_, i) => (
        <ellipse
          key={i}
          rx="90"
          ry="31"
          strokeWidth="0.5"
          transform={`rotate(${(i * 180) / COPIES})`}
        />
      ))}
      <circle r="26" strokeWidth="0.5" />
    </svg>
  );
}
