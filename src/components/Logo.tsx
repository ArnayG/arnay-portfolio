import Image from "next/image";
import CropMarks from "@/components/CropMarks";
import type { LogoAsset } from "@/data/logos";

type LogoProps = {
  logo: LogoAsset;
  className?: string;
};

/**
 * Marks sit contained in a rounded tile that follows the active theme, with the
 * same registration marks as the business card so the two read as one system.
 */
export default function Logo({ logo, className = "" }: LogoProps) {
  return (
    <span
      className={`relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-rule bg-paper p-1.5 ${className}`}
    >
      <CropMarks size="sm" />
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
