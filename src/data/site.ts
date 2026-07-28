export type SocialLink = {
  label: string;
  href: string;
};

/**
 * Single source of truth for the personal details shown across the site.
 * TODO: replace every placeholder below with your real information.
 */
export const site = {
  name: "Arnay",
  role: "Incoming CS student & aspiring software engineer",
  summary:
    "TODO: two or three sentences on what you build, what you're interested in, and what you're looking for. Keep it specific — recruiters skim this first.",
  email: "you@example.com",
  location: "TODO: City, State",
  resumeUrl: "/resume.pdf",
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
