export type TestScore = {
  label: string;
  score: string;
};

export type School = {
  level: "middle" | "high" | "college";
  name: string;
  period: string;
  location?: string;
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
    period: "Pre-K — 2022",
    location: "Indianapolis, IN",
  },
  {
    level: "high",
    name: "Park Tudor School",
    period: "2022 — 2026",
    location: "Indianapolis, IN",
    gpa: "4.0 / 4.0 unweighted",
    testScores: [
      { label: "SAT", score: "1600" },
      { label: "AP", score: "13 exams, all 5s" },
    ],
    activities: [
      "Co-President of the Computer Science Club — led the advanced cohort of 35+ students, running algorithm labs and ACSL prep cycles that qualified 20+ peers for All-Stars.",
      "Lead programmer for the VEX Robotics team — Indiana State Champions, 44 judged awards, ranked 14th of 6,244 teams nationally.",
      "Co-founded and taught the school's first VEX Robotics summer camp, for 20+ middle-school students.",
      "Best Delegate at Georgetown's North American Invitational MUN — one of 40 recognised out of 3,300+ delegates.",
      "Summa Cum Laude inductee (top 10% by GPA) and twice AP Scholar with Distinction.",
    ],
  },
  {
    level: "college",
    name: "Stanford University",
    period: "2026 — 2030",
    location: "Stanford, CA",
    major: "Computer Science",
  },
];
