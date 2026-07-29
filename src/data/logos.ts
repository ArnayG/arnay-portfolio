export type LogoAsset = {
  src: string;
  /** Intrinsic dimensions, so next/image can size without layout shift. */
  width: number;
  height: number;
  alt: string;
};

/**
 * Third-party marks identifying the institution or project each entry refers
 * to. All are roughly square, so Logo.tsx contains them in a square tile.
 */
export const logos = {
  stanford: {
    src: "/logos/stanford.png",
    width: 216,
    height: 331,
    alt: "Stanford University",
  },
  parkTudor: {
    src: "/logos/park-tudor.png",
    width: 2000,
    height: 1821,
    alt: "Park Tudor School",
  },
  sycamore: {
    src: "/logos/sycamore.png",
    width: 457,
    height: 437,
    alt: "Sycamore School",
  },
  trackInsights: {
    src: "/logos/track-insights.webp",
    width: 1080,
    height: 1080,
    alt: "Track Insights",
  },
  readySetGo: {
    src: "/logos/ready-set-go.png",
    width: 150,
    height: 150,
    alt: "Ready, Set, GO!",
  },
  wolfram: {
    src: "/logos/wolfram.svg",
    width: 200,
    height: 200,
    alt: "Wolfram",
  },
} satisfies Record<string, LogoAsset>;
