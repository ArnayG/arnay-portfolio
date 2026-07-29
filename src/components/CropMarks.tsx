type CropMarksProps = {
  /** "md" for the business card, "sm" for the small logo tiles. */
  size?: "sm" | "md";
};

/**
 * Registration marks set just outside the trim, as on a printed card.
 * Class strings are spelled out rather than composed, so Tailwind can see them.
 */
const CORNERS = {
  sm: [
    "-top-1 -left-1 border-t border-l",
    "-top-1 -right-1 border-t border-r",
    "-bottom-1 -left-1 border-b border-l",
    "-bottom-1 -right-1 border-b border-r",
  ],
  md: [
    "-top-2 -left-2 border-t border-l",
    "-top-2 -right-2 border-t border-r",
    "-bottom-2 -left-2 border-b border-l",
    "-bottom-2 -right-2 border-b border-r",
  ],
} as const;

const ARM = {
  sm: "h-1.5 w-1.5",
  md: "h-2.5 w-2.5",
} as const;

/** Requires a positioned ancestor. */
export default function CropMarks({ size = "md" }: CropMarksProps) {
  return (
    <>
      {CORNERS[size].map((position) => (
        <span
          key={position}
          aria-hidden="true"
          className={`absolute border-ink ${ARM[size]} ${position}`}
        />
      ))}
    </>
  );
}
