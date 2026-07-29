export type SocialLink = {
  label: string;
  href: string;
};

/** Single source of truth for the personal details shown across the site. */
export const site = {
  /** Split so the display type can set the surname as an outline. */
  firstName: "Arnay",
  lastName: "Garhyan",
  role: "Student @ Stanford",
  /** Small line under the name on the card. */
  cardline:
    "Pharmacokinetic modeling, simulation tooling, and robotics. R · Wolfram · Python",
  /** The hero display type: solid first line, outlined second. */
  headline: { solid: "Arnay", outline: "Garhyan" },
  summary:
    "Stanford CS student passionate about technology, AI, research, and making the world a better place.",
  email: "arnay@stanford.edu",
  location: "Indianapolis, IN",
  availability: "Open to summer 2027 internships",
  resumeUrl: "/resume.pdf",
  /**
   * Headshot in public/, or null for the placeholder frame. Dimensions are
   * carried alongside the path so next/image can size it without upscaling.
   * Photo by Bryan Chatlien.
   */
  photo: {
    src: "/arnay.jpeg",
    width: 320,
    height: 303,
  } as { src: string; width: number; height: number } | null,
  /**
   * The address printed on the card. Leave it null to show whatever host the
   * site is being served from; set it to override that with a tidier form
   * (say "arnaygarhyan.com" for a deploy that answers on a longer name).
   */
  website: null as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/ArnayG" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/arnay-g/" },
  ] satisfies SocialLink[],
  skills: [
    "Python",
    "Wolfram Language",
    "R",
    "Java",
    "HTML/CSS/JS",
    "C++",
    "Git",
  ],
};

export const navLinks = [
  { label: "Education", href: "#education" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Contact", href: "#contact" },
];
