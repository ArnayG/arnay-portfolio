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

/**
 * Ordered oldest → newest; the section reverses it so college reads first.
 * TODO: replace these placeholders with your real schools.
 */
export const education: School[] = [
  {
    level: "middle",
    name: "TODO: Middle School",
    period: "TODO — TODO",
    gpa: "TODO",
  },
  {
    level: "high",
    name: "TODO: High School",
    period: "TODO — TODO",
    location: "TODO: City, State",
    gpa: "TODO",
    testScores: [
      { label: "SAT", score: "TODO" },
      { label: "ACT", score: "TODO" },
    ],
    activities: [
      "TODO: robotics team, clubs, leadership roles",
      "TODO: competitions, awards",
    ],
  },
  {
    level: "college",
    name: "TODO: College",
    period: "TODO — TODO",
    location: "TODO: City, State",
    major: "TODO: Major",
  },
];
