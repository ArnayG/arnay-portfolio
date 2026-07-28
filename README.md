# arnay-portfolio

Personal portfolio site. Built with [Next.js](https://nextjs.org) (App Router),
TypeScript, and [Tailwind CSS](https://tailwindcss.com); deployed on
[Vercel](https://vercel.com).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

Site content lives in `src/data/` — you shouldn't need to touch component code
to update it:

| File                     | What it holds                               |
| ------------------------ | ------------------------------------------- |
| `src/data/site.ts`       | Name, role, summary, email, socials, skills |
| `src/data/projects.ts`   | Project cards                               |
| `src/data/experience.ts` | Experience entries                          |

Sections are composed in `src/app/page.tsx` and each lives in
`src/components/sections/`. Colors and fonts are defined as CSS variables in
`src/app/globals.css` and exposed to Tailwind via `@theme inline`, so
`bg-background`, `text-muted`, `border-border`, and `text-accent` work
everywhere. Dark mode follows the OS setting.

## Scripts

```bash
npm run dev     # local dev server
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```
