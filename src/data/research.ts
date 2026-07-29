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

export const research: ResearchItem[] = [
  {
    kind: "paper",
    title:
      "Development of a population pharmacokinetics model and an R-Shiny simulation platform for moxifloxacin pharmacokinetics in non-human primates",
    venue: "Journal of Pharmacokinetics and Pharmacodynamics, 53(3)",
    year: "2026",
    authors: "Arnay Garhyan, Derek Leishman",
    link: "https://doi.org/10.1007/s10928-026-10030-1",
    summary:
      "Moxifloxacin is the standard positive control in primate cardiac-safety testing, but ethical and practical limits on blood sampling leave its pharmacokinetics thinly measured. Built a population PK model from 48 cynomolgus monkeys and wrapped it in an open-source R-Shiny tool that reconstructs a full concentration profile from only a handful of samples.",
  },
  {
    kind: "poster",
    title:
      "Development of population pharmacokinetics model and R-Shiny simulation platform for moxifloxacin in non-human primates",
    venue:
      "American Society for Clinical Pharmacology & Therapeutics (ASCPT) Annual Meeting",
    year: "2025",
    authors: "Arnay Garhyan, Derek Leishman",
    link: "https://ascpt2025.eventscribe.net/fsPopup.asp?PresenterID=1781309&mode=posterPresenterInfo",
    summary:
      "Presented the population pharmacokinetics model and the R-Shiny simulation platform that became the 2026 paper.",
  },
  {
    kind: "poster",
    title:
      "Development and Evaluation of PKPD Models for QT Interval Changes Post-Moxifloxacin Dosing in Non-Human Primates",
    venue: "American Conference on Pharmacometrics (ACoP)",
    year: "2025",
    authors: "Arnay Garhyan, Derek Leishman",
    link: "https://acop2025.eventscribe.net/fsPopup.asp?PresenterID=1875599&mode=posterPresenterInfo",
    summary:
      "Linked pharmacodynamic models mapping moxifloxacin plasma concentrations to QT-interval effects, comparing structural PD models to identify the most accurate exposure–response relationship.",
  },
];
