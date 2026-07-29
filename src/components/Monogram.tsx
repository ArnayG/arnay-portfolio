import { site } from "@/data/site";

const initials = `${site.firstName[0]}${site.lastName[0]}`;

type MonogramProps = {
  /** "mark" for the stamp on the front trim, "display" for the card back. */
  variant?: "mark" | "display";
  className?: string;
};

/**
 * The initials as a printer's mark. Hollow at display size, because a solid
 * block that large would outweigh the name it belongs to.
 */
export default function Monogram({ variant = "mark", className = "" }: MonogramProps) {
  const base = "font-grotesk font-black tracking-[-0.05em] italic uppercase";

  if (variant === "display") {
    return (
      <span
        aria-hidden="true"
        className={`text-outline block text-[3.25rem] leading-none ${base} ${className}`}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center border border-rule text-[10px] leading-none text-ink-muted ${base} ${className}`}
    >
      {initials}
    </span>
  );
}
