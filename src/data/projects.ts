export type Project = {
  title: string;
  /** Short grouping label, e.g. "Robotics", "Web". */
  category: string;
  description: string;
  stack: string[];
  period?: string;
  repo?: string;
  demo?: string;
};

/** TODO: replace these placeholders with your real projects. */
export const projects: Project[] = [
  {
    title: "TODO: Robotics project",
    category: "Robotics",
    description:
      "TODO: what it did, what you were responsible for, and the hardest problem you solved.",
    stack: ["TODO", "TODO"],
    period: "TODO",
  },
  {
    title: "TODO: First website",
    category: "Web",
    description:
      "TODO: who it was for and what it needed to do. Lead with impact where you have it.",
    stack: ["TODO", "TODO"],
    period: "TODO",
    repo: "https://github.com/ArnayG",
  },
  {
    title: "TODO: Second website",
    category: "Web",
    description: "TODO: another site. Drop this entry if two is enough.",
    stack: ["TODO"],
    period: "TODO",
    repo: "https://github.com/ArnayG",
  },
];
