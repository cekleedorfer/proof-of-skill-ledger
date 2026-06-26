# Proof-of-Skill Ledger 📈✅

Stop forgetting your wins. Start proving them.

A mobile-first ledger for tracking every professional and personal milestone — log events and micro-wins, tag the skills they grew, rate their significance, and let an AI copilot summarize the story. Mark highlights as portfolio-visible to build a shareable record of your growth.
## Inspiration

🔗 **Live app:** [proof-of-skill-ledger.vercel.app](https://proof-of-skill-ledger.vercel.app/)

Growth happens in tiny moments — a hard bug fixed, a hard conversation handled, a new skill that finally clicked. Almost none of it gets written down, and by the time a performance review, interview, or portfolio update rolls around, it's gone.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
* 📖 Chronological timeline of every professional and personal milestone
* 🧩 Sub-events ("micro-wins") nested under each milestone, each with its own skill tags and story
* ⭐ Significance ratings (1–5) so the biggest wins stand out
* 🏷️ Skill tagging across your whole history, rolled up into live stats
* 🧠 AI copilot that summarizes events and helps you reflect ("Summarize my growth," "Write my bio," "What am I best at?")
* 🔒 Private vs. portfolio visibility per event — keep some things for yourself, showcase others
* 🎨 Animated, glow-bubble timeline UI with a violet-to-pink gradient design system

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More
1. Log an event — title, date, category (professional / personal / both), and significance
2. Add sub-events under it as the story develops — what happened, what skill it grew, optional evidence link
3. Tag the skills involved; the app rolls these up into running totals (events, micro-wins, skills)
4. Mark standout events as **portfolio**-visible to build a shareable highlight reel
5. Ask the AI copilot to summarize your growth, surface your top skills, or draft a bio straight from your logged history

To learn more about Next.js, take a look at the following resources:
## Tech Stack

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
Proof-of-Skill Ledger was built using:

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
* Next.js 16 (App Router, Turbopack) – framework
* React 19 + TypeScript – unified, type-safe codebase
* Tailwind CSS 4 – styling and design tokens
* Framer Motion – timeline animation and ambient UI effects
* shadcn / Base UI – component primitives
* lucide-react – icon set
* Vercel – deployment target


## Installation & Running Locally
1. Clone the repository

```
git clone https://github.com/cekleedorfer/proof-of-skill-ledger.git
cd proof-of-skill-ledger
