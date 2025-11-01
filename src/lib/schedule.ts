export type ScheduleDay = {
  day: number;
  phase: string;
  focus: string;
  tasks: string[];
  milestone?: string;
};

type PhaseConfig = {
  id: string;
  label: string;
  weight: number;
  focusTemplates: string[];
  taskTemplates: string[][];
  milestoneSummary: string;
};

const phaseConfigs: PhaseConfig[] = [
  {
    id: "orientation",
    label: "Orientation & Goals",
    weight: 0.1,
    focusTemplates: [
      "Clarify your motivation for {topic}",
      "Map the {topic} landscape",
      "Define what success looks like",
    ],
    taskTemplates: [
      [
        "Write a quick journal entry about why learning {topic} matters to you right now.",
        "Skim two high-level resources (article, video, podcast) to understand where {topic} is used.",
        "List the top sub-skills or themes inside {topic} that you will need to cover.",
      ],
      [
        "Capture the most common terminology you'll encounter while working with {topic}.",
        "Identify 3 creators or communities you can follow for trusted {topic} updates.",
        "Draft a one-sentence personal mission statement for this learning sprint.",
      ],
    ],
    milestoneSummary:
      "You can explain your 'why', the big picture of {topic}, and the skills you intend to level up.",
  },
  {
    id: "fundamentals",
    label: "Foundations",
    weight: 0.35,
    focusTemplates: [
      "Master the core concepts of {topic}",
      "Practice the fundamental workflows",
      "Translate concepts into your own words",
      "Teach back the essentials of {topic}",
    ],
    taskTemplates: [
      [
        "Work through one curated crash-course or textbook chapter on a core {topic} concept.",
        "Build a concise cheat sheet that captures the syntax, vocabulary, or mental models you learned.",
        "Summarize the key insight from today in 3 bullet points, focusing on where it applies in the real world.",
      ],
      [
        "Recreate an example or tutorial from scratch without copy-pasting.",
        "Highlight the 'why it works' behind each major step in the example.",
        "Create flashcards or spaced repetition prompts for the most confusing ideas so far.",
      ],
      [
        "Attempt a basic practice challenge sourced from documentation, a course, or a reputable blog.",
        "Check your solution against an official answer or peer example, noting differences.",
        "Share one reflection (journal, tweet, or message to a friend) about what clicked today.",
      ],
    ],
    milestoneSummary:
      "You have a working knowledge of the mandatory concepts and can solve guided {topic} problems.",
  },
  {
    id: "integration",
    label: "Integration & Practice",
    weight: 0.3,
    focusTemplates: [
      "Chain multiple {topic} skills together",
      "Debug and troubleshoot your own work",
      "Introduce realistic constraints",
      "Document reusable snippets and notes",
    ],
    taskTemplates: [
      [
        "Tackle a mini-project that forces you to combine at least 3 fundamental {topic} skills.",
        "Keep a running log of blockers you encounter and how you resolved them.",
        "Refine your personal notes to capture patterns or heuristics that saved you time.",
      ],
      [
        "Find an open-source project, template, or case study and analyze how they approach {topic}.",
        "Replicate a portion of that work, adapting it to your own interests or industry.",
        "Record a short Loom, voice note, or written recap walking through what you built.",
      ],
      [
        "Set a timer for a focused practice session (30-45 min) to reinforce weaker sub-skills.",
        "Intentionally introduce a constraint (time limit, limited tools, new requirement) and adapt.",
        "Draft questions you would ask a mentor about the rough edges you still feel.",
      ],
    ],
    milestoneSummary:
      "You can independently build small, cohesive outputs and recover from the most common {topic} roadblocks.",
  },
  {
    id: "project",
    label: "Applied Project",
    weight: 0.15,
    focusTemplates: [
      "Plan an end-to-end {topic} deliverable",
      "Build iteratively and gather feedback",
      "Polish, harden, and document outcomes",
    ],
    taskTemplates: [
      [
        "Define the scope of a capstone project that showcases applied {topic} skills; outline success criteria.",
        "Break the project into small deliverables and schedule them across the remaining days.",
        "Share your plan with an accountability partner or community for quick feedback.",
      ],
      [
        "Ship a first vertical slice of the project that proves your core concept.",
        "Invite a peer to review or test what you built and note the feedback without defending it.",
        "Log lessons learned and follow-up tasks in your project notes.",
      ],
      [
        "Polish the project: tighten documentation, improve UX/formatting, and validate edge cases.",
        "Prepare a short demo, blog post, or slide deck explaining the problem, solution, and learnings.",
        "Archive all resources, code, or artifacts in a single, easy-to-share location.",
      ],
    ],
    milestoneSummary:
      "You have a portfolio-ready {topic} artifact that demonstrates your ability to apply the skill under real constraints.",
  },
  {
    id: "reflection",
    label: "Review & Next Steps",
    weight: 0.1,
    focusTemplates: [
      "Reflect on progress and solidify retention",
      "Set up long-term maintenance systems",
      "Celebrate wins and define the next challenge",
    ],
    taskTemplates: [
      [
        "Run a retro: What worked, what was hard, and what you would change next time learning {topic}.",
        "Convert your best notes into a living knowledge base (Notion, Obsidian, GitHub repo).",
        "Plan spaced-repetition reviews or recurring practice sessions over the next month.",
      ],
      [
        "Identify one advanced resource or community to keep momentum going.",
        "Decide on the next project or stretch goal that will double down on your new {topic} skills.",
        "Celebrate: share your progress publicly or with someone who supported you.",
      ],
    ],
    milestoneSummary:
      "You know how to keep your {topic} skills sharp and have a concrete next growth target.",
  },
];

const clampTopic = (topic: string) => topic.trim() || "your topic";

const distributeDays = (totalDays: number) => {
  const minTotal = phaseConfigs.length;
  const safeTotal = Math.max(totalDays, minTotal);
  const raw = phaseConfigs.map((phase) =>
    Math.max(1, Math.round(phase.weight * safeTotal)),
  );
  let sum = raw.reduce((acc, value) => acc + value, 0);

  while (sum > safeTotal) {
    const idx = raw.findIndex((count, index) => count > 1 && index !== 0);
    if (idx === -1) break;
    raw[idx] -= 1;
    sum -= 1;
  }

  while (sum < safeTotal) {
    const idx = raw.indexOf(Math.min(...raw));
    raw[idx] += 1;
    sum += 1;
  }

  return raw;
};

const interpolate = (
  templates: string[],
  index: number,
  topic: string,
): string => {
  const template =
    templates[Math.min(index, templates.length - 1)] ??
    templates[templates.length - 1];
  return template.replaceAll("{topic}", topic);
};

const interpolateTasks = (
  templates: string[][],
  index: number,
  topic: string,
): string[] => {
  const template =
    templates[Math.min(index, templates.length - 1)] ??
    templates[templates.length - 1];
  return template.map((task) => task.replaceAll("{topic}", topic));
};

export const generateSchedule = (
  rawTopic: string,
  rawDays: number,
): ScheduleDay[] => {
  const topic = clampTopic(rawTopic);
  const days = Number.isFinite(rawDays) ? Math.max(1, Math.floor(rawDays)) : 1;
  const distribution = distributeDays(days);

  const plan: ScheduleDay[] = [];
  let dayCounter = 1;

  phaseConfigs.forEach((phase, phaseIndex) => {
    const phaseDays = distribution[phaseIndex];
    for (let i = 0; i < phaseDays; i += 1) {
      const milestone =
        i === phaseDays - 1
          ? phase.milestoneSummary.replaceAll("{topic}", topic)
          : undefined;

      plan.push({
        day: dayCounter,
        phase: phase.label,
        focus: interpolate(phase.focusTemplates, i, topic),
        tasks: interpolateTasks(phase.taskTemplates, i, topic),
        milestone,
      });
      dayCounter += 1;
    }
  });

  const extraDays = days - (dayCounter - 1);
  if (extraDays > 0) {
    for (let i = 0; i < extraDays; i += 1) {
      plan.push({
        day: dayCounter + i,
        phase: "Flex Day",
        focus: `Deepen a sub-skill within ${topic}`,
        tasks: [
          `Revisit the toughest concept from earlier days and create a focused drill for it.`,
          `Seek feedback from a community or mentor on your current ${topic} understanding.`,
          `Update your learning backlog with new questions to explore next.`,
        ],
        milestone:
          "You deliberately closed gaps and captured new questions to fuel the next iteration.",
      });
    }
  }

  return plan;
};
