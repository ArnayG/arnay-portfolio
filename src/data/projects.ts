export type Project = {
  title: string;
  description: string;
  stack: string[];
  repo?: string;
  demo?: string;
};

/** TODO: replace these placeholders with your real projects. */
export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "TODO: one or two sentences on what the project does, who it's for, and the hardest problem you solved building it.",
    stack: ["TypeScript", "React", "Node.js"],
    repo: "https://github.com/ArnayG",
  },
  {
    title: "Project Two",
    description:
      "TODO: lead with impact where you can — users served, latency cut, data processed.",
    stack: ["Python", "FastAPI", "PostgreSQL"],
    repo: "https://github.com/ArnayG",
  },
  {
    title: "Project Three",
    description:
      "TODO: a third project rounds out the section. Drop this entry if you'd rather show two strong ones.",
    stack: ["Java", "Spring"],
    repo: "https://github.com/ArnayG",
  },
];
