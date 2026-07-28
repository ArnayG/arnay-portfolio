export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Single source of truth for the personal details shown across the site.
 * TODO: replace every placeholder below with your real information.
 */
export const site = {
  /** Split so the display type can set the surname as an outline. */
  firstName: "Arnay",
  lastName: "TODO",
  role: "Software Engineer",
  /** Small line under the name on the card. */
  cardline: "Incoming CS student",
  /**
   * The hero display type. Deliberately the role, not the name — the card
   * already carries the name, and repeating it reads as a mistake.
   */
  headline: { solid: "Software", outline: "Engineer" },
  summary:
    "TODO: two or three sentences on what you build, what you're interested in, and what you're looking for. Keep it specific — recruiters skim this first.",
  email: "you@example.com",
  location: "TODO: City, State",
  availability: "Open to summer 2027 internships",
  resumeUrl: "/resume.pdf",
  /**
   * Path to a headshot in public/, or null for the placeholder frame.
   * A static import would fail the build while the file is missing, so this
   * stays a plain string: drop the file in public/ and set the path here.
   */
  photo: null as string | null,
  socials: [
    { label: "GitHub", href: "https://github.com/ArnayG" },
    { label: "LinkedIn", href: "https://linkedin.com/in/TODO" },
  ] satisfies SocialLink[],
  skills: [
    "TypeScript",
    "Python",
    "Java",
    "React",
    "Next.js",
    "Node.js",
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
