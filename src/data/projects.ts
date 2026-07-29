export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  /** Short grouping label, e.g. "Robotics", "Web". */
  category: string;
  description: string;
  stack: string[];
  period?: string;
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    title: "Track Insights",
    category: "Web",
    description:
      "A public data app for Indiana high-school track and field, built with two classmates after an athlete asked how their 4×800 time would have placed in other sectionals. I led the frontend — athlete dashboards, achievement badges, rankings, and query tools over a database of 23,000+ athletes and 62,500+ individual results.",
    stack: ["HTML", "Tailwind CSS", "daisyUI", "JavaScript"],
    period: "2025 — 2026",
    links: [{ label: "Live", href: "https://www.trackinsights.org" }],
  },
  {
    title: "Ready, Set, GO!",
    category: "App",
    description:
      "Track and field runs on numbers, but a new spectator has no way to tell whether a given mark is remarkable — world rankings come from opaque scoring tables. Built with a classmate to translate marks, rankings, and scores into something readable. Won Indiana's 7th District in the 2024 Congressional App Challenge, selected from 3,881 apps submitted nationally.",
    stack: ["HTML", "CSS", "JavaScript"],
    period: "2024",
    links: [
      {
        label: "Announcement",
        href: "https://www.congressionalappchallenge.us/24-in07/",
      },
    ],
  },
  {
    title: "Automated insulin dosing strategy in people with type 1 diabetes",
    category: "Simulation",
    description:
      "An ODE-based model of the insulin–glucose feedback loop, built during the Wolfram Summer Research Program: the differential-equation system, sensitivity testing, and visualisation pipelines. Earned a Staff's Pick badge on Wolfram Community, has passed 5,000 views, and led to an invitation to present at the Wolfram Technology Conference 2025.",
    stack: ["Wolfram Language"],
    period: "2025",
    links: [
      {
        label: "Write-up",
        href: "https://community.wolfram.com/groups/-/m/t/3499212",
      },
    ],
  },
  {
    title: "Two-segment hip–knee running model",
    category: "Simulation",
    description:
      "Extended the classical spring-mass model of running into a two-segment hip–knee system, deriving the equations of motion phase by phase and reconstructing a full apex-to-apex step cycle in a single model. Earned the Wolfram Emerging Leaders distinction, alongside an invite to become a Teaching Assistant, awarded to the top 20% of the WSRP cohort.",
    stack: ["Wolfram Language"],
    period: "2025",
    links: [
      {
        label: "Write-up",
        href: "https://community.wolfram.com/groups/-/m/t/3641221",
      },
    ],
  },
];
