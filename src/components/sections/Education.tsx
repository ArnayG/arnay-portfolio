import Section from "@/components/Section";
import { education, type School } from "@/data/education";

const levelLabels: Record<School["level"], string> = {
  college: "College",
  high: "High school",
  middle: "Middle school",
};

/** Newest first; middle school stays a single quiet line at the end. */
const ordered = [...education].reverse();

export default function Education() {
  return (
    <Section id="education" title="Education" kicker="Schools · in reverse order">
      <ol className="space-y-10">
        {ordered.map((school, index) => (
          <li key={index} className="grid gap-3 sm:grid-cols-[3rem_1fr] sm:gap-6">
            <p
              aria-hidden="true"
              className="font-mono text-[11px] text-ink-muted tabular-nums"
            >
              {String(ordered.length - index).padStart(2, "0")}
            </p>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] text-ink-muted uppercase">
                {levelLabels[school.level]} · {school.period}
              </p>

              <h3 className="mt-1.5 text-lg font-medium">{school.name}</h3>

              {school.major ? (
                <p className="mt-1 text-sm text-ink-muted">{school.major}</p>
              ) : null}

              {school.location ? (
                <p className="mt-1 font-mono text-[11px] text-ink-muted">
                  {school.location}
                </p>
              ) : null}

              {school.gpa || school.testScores?.length ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {school.gpa ? (
                    <li className="border border-rule px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase">
                      GPA {school.gpa}
                    </li>
                  ) : null}
                  {school.testScores?.map((test, testIndex) => (
                    <li
                      key={testIndex}
                      className="border border-rule px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase"
                    >
                      {test.label} {test.score}
                    </li>
                  ))}
                </ul>
              ) : null}

              {school.activities?.length ? (
                <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-ink-muted">
                  {school.activities.map((activity, activityIndex) => (
                    <li
                      key={activityIndex}
                      className="before:mr-2 before:content-['—']"
                    >
                      {activity}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
