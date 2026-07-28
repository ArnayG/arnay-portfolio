export type ResearchItem = {
  kind: "paper" | "poster";
  title: string;
  /** Journal, conference, or venue name. */
  venue: string;
  year: string;
  /** Full author list as you'd cite it. */
  authors?: string;
  /** DOI or link to the publication. */
  link?: string;
  summary?: string;
};

/**
 * TODO: replace with your published paper and two conference posters.
 * Include the DOI/link where you have one — it's the difference between a
 * claim and a verifiable credential.
 */
export const research: ResearchItem[] = [
  {
    kind: "paper",
    title: "TODO: Paper title",
    venue: "TODO: Journal or conference",
    year: "TODO",
    authors: "TODO: Author list, as published",
    link: "",
    summary:
      "TODO: one or two sentences a non-specialist can follow — the question, what you did, what you found.",
  },
  {
    kind: "poster",
    title: "TODO: First poster title",
    venue: "TODO: International conference name",
    year: "TODO",
    authors: "TODO: Author list",
    summary: "TODO: what the poster presented.",
  },
  {
    kind: "poster",
    title: "TODO: Second poster title",
    venue: "TODO: International conference name",
    year: "TODO",
    authors: "TODO: Author list",
    summary: "TODO: what the poster presented.",
  },
];
