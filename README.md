## Learning Sprint Planner

Generate a personalised, day-by-day learning roadmap for any topic and deadline. Enter what you want to master and the number of days you have; the planner balances foundations, deliberate practice, project work, and reflection milestones so you always know what to do next.

## Getting Started

Install dependencies and start the local dev server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to explore the UI. The main page lives at `src/app/page.tsx`, and the scheduling logic can be found in `src/lib/schedule.ts`.

## Deploy on Vercel

Production deployments are handled through Vercel:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-e45a57bf
```

After deployment, verify the production URL:

```bash
curl https://agentic-e45a57bf.vercel.app
```
