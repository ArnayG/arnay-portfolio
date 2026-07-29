export type Hobby = {
  name: string;
  /** Optional, since a hobby can stand on its name alone. */
  detail?: string;
};

export const hobbies: Hobby[] = [
  {
    name: "Saxophone & piano",
    detail: "Alto and tenor saxophone, and piano, since fourth grade.",
  },
  {
    name: "Golf",
    detail: "Three seasons on the school's team.",
  },
  {
    name: "Mechanical keyboards",
    detail: "Building and customizing, with a focus on feel and sound. Built: Class60, Voice65, QK65, and Tofu60.",
  },
];
