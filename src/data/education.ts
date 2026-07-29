export type TestScore = {
  label: string;
  score: string;
};

import { logos, type LogoAsset } from "@/data/logos";

export type School = {
  level: "middle" | "high" | "college";
  name: string;
  period: string;
  location?: string;
  logo?: LogoAsset;
  /** College only. */
  major?: string;
  gpa?: string;
  testScores?: TestScore[];
  activities?: string[];
};

/** Ordered oldest → newest; the section reverses it so college reads first. */
export const education: School[] = [
  {
    level: "middle",
    name: "Sycamore School",
    period: "Pre-K to 2022",
    location: "Indianapolis, IN",
    logo: logos.sycamore,
  },
  {
    level: "high",
    name: "Park Tudor School",
    period: "2022–2026",
    location: "Indianapolis, IN",
    logo: logos.parkTudor,
    gpa: "4.0 / 4.0 unweighted",
    testScores: [
      { label: "SAT", score: "1600" },
      { label: "AP", score: "13 exams, all 5s" },
    ],
    activities: [
      "Co-President of the Computer Science Club, leading the advanced cohort of 35+ students and running ACSL preparation meetings that qualified 10+ peers for All-Stars.",
      "Lead programmer and notebooker for VEX team 6842K Killer Instinct: 2026 VEX Robotics World Championship Division Champions and Indiana State Champions, with 44 judged awards and a global ranking inside the top ten of 6,000+ teams.",
      "Co-founded and taught the school's first VEX Robotics summer camp, for 20+ middle-school students.",
      "Best Delegate at Georgetown's North American Invitational MUN (one of 40 recognised out of 3,300+ delegates) and at Dayton MUN, plus a Verbal Commendation at the Indiana University MUN conference.",
      "Summa Cum Laude inductee (top 10% by GPA) and twice AP Scholar with Distinction.",
    ],
  },
  {
    level: "college",
    name: "Stanford University",
    period: "2026–2030",
    location: "Stanford, CA",
    major: "Computer Science",
    logo: logos.stanford,
  },
];
