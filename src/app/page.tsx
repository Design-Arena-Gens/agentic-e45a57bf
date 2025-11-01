"use client";

import { FormEvent, useMemo, useState } from "react";
import { generateSchedule, type ScheduleDay } from "@/lib/schedule";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [days, setDays] = useState(14);
  const [schedule, setSchedule] = useState<ScheduleDay[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const phaseSummary = useMemo(() => {
    const counts = new Map<string, number>();
    schedule.forEach((entry) => {
      counts.set(entry.phase, (counts.get(entry.phase) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([phase, count]) => ({
      phase,
      count,
    }));
  }, [schedule]);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    if (!topic.trim()) {
      setSchedule([]);
      return;
    }

    setSchedule(generateSchedule(topic, days));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 md:px-10 lg:px-16">
        <header className="flex flex-col gap-6 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-sky-500 p-[1px] shadow-xl">
          <div className="rounded-[calc(theme(borderRadius.3xl)-1px)] bg-slate-950 px-8 py-10 md:px-12 md:py-12">
            <p className="text-sm uppercase tracking-[0.4em] text-indigo-300">
              Learning Sprint Planner
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build a focused learning schedule tailored to your goal.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-300">
              Enter what you want to learn and how many days you have. We&apos;ll
              map out a day-by-day plan with milestones, practice prompts, and
              reflection points so you stay consistent and ship meaningful
              results.
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          <form
            onSubmit={handleGenerate}
            className="flex flex-col gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-lg backdrop-blur"
          >
            <div className="flex flex-col gap-3">
              <label
                htmlFor="topic"
                className="text-sm font-medium uppercase tracking-wide text-slate-300"
              >
                Topic or skill
              </label>
              <input
                id="topic"
                name="topic"
                placeholder="e.g. Full-stack TypeScript, UX research, Data storytelling"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white shadow-inner outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              />
              {submitted && !topic.trim() ? (
                <p className="text-sm text-rose-300">
                  Tell us what you want to learn so we can tailor the plan.
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3">
              <label
                htmlFor="days"
                className="text-sm font-medium uppercase tracking-wide text-slate-300"
              >
                Days until your target
              </label>
              <input
                id="days"
                name="days"
                type="number"
                min={1}
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white shadow-inner outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40"
              />
              <p className="text-sm text-slate-400">
                We&apos;ll adapt the intensity for shorter sprints.
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Generate my schedule
            </button>

            {phaseSummary.length > 0 ? (
              <dl className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-sm">
                <dt className="font-semibold text-indigo-200">
                  Phase breakdown
                </dt>
                {phaseSummary.map(({ phase, count }) => (
                  <dd
                    key={phase}
                    className="flex justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-slate-300"
                  >
                    <span>{phase}</span>
                    <span className="font-semibold text-white">
                      {count} {count === 1 ? "day" : "days"}
                    </span>
                  </dd>
                ))}
              </dl>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
                Your customised phase breakdown will appear here after you
                generate a schedule.
              </div>
            )}
          </form>

          <div className="flex flex-col gap-6">
            {schedule.length === 0 ? (
              <div className="flex h-full min-h-[340px] flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/30 px-8 text-center text-slate-400">
                <p className="text-lg font-medium text-slate-200">
                  Ready when you are.
                </p>
                <p className="mt-2 max-w-md">
                  Generate your personalised learning sprint and we&apos;ll lay
                  out focused actions for every day until your goal.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {schedule.map((day) => (
                  <article
                    key={day.day}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">
                        Day {day.day}
                      </p>
                      <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
                        {day.phase}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold text-white">
                      {day.focus}
                    </h2>

                    <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-slate-200">
                      {day.tasks.map((task) => (
                        <li key={task}>{task}</li>
                      ))}
                    </ul>

                    {day.milestone ? (
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-200">
                        <p className="font-semibold text-indigo-200">
                          Milestone
                        </p>
                        <p className="mt-1 text-slate-300">{day.milestone}</p>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
