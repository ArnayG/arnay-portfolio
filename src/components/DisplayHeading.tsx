import type { ElementType } from "react";

type DisplayHeadingProps = {
  solid: string;
  /** Optional second line, rendered hollow. */
  outline?: string;
  as?: ElementType;
  size?: "hero" | "section";
  className?: string;
};

const sizes = {
  hero: "text-[clamp(2.75rem,10vw,6rem)]",
  section: "text-[clamp(1.875rem,5vw,3rem)]",
};

/**
 * The page's display treatment: heavy oblique grotesque, optionally with a
 * hollow second line. The outlined line drops to 700 so the stroke doesn't
 * close up the counters in a/e/o.
 */
export default function DisplayHeading({
  solid,
  outline,
  as: Tag = "h2",
  size = "section",
  className = "",
}: DisplayHeadingProps) {
  return (
    <Tag
      className={`font-grotesk font-black tracking-[-0.03em] uppercase italic leading-[0.85] ${sizes[size]} ${className}`}
    >
      <span className="block">{solid}</span>
      {outline ? (
        <span className="text-outline block font-bold">{outline}</span>
      ) : null}
    </Tag>
  );
}
