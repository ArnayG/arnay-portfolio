# arnay-portfolio

Personal portfolio site. Built with [Next.js](https://nextjs.org) (App Router),
TypeScript, and [Tailwind CSS](https://tailwindcss.com); served as a static
export from GoDaddy shared hosting at
[squarejumper.com/Arnay-Portfolio](https://squarejumper.com/Arnay-Portfolio/).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

Site content lives in `src/data/`, so you shouldn't need to touch component code
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

## Deploying

The site has no server side pieces, so `next.config.ts` sets `output: "export"`
and `npm run build` writes a plain HTML/CSS/JS bundle to `out/`. Upload the
*contents* of `out/` (including the `.htaccess`, which sets the 404 page and
cache headers) into `public_html/Arnay-Portfolio` on GoDaddy, via cPanel File
Manager or SFTP. There is no deploy hook, so every content change needs a
rebuild and a re-upload.

Because the site answers under a folder rather than at the domain root, the
sub-path lives in `src/lib/basePath.ts` and is read by both `next.config.ts`
and the components. Next prefixes `next/link` hrefs on its own but not
`next/image` sources or plain anchor hrefs, so anything served out of
`public/` goes through the `asset()` helper in that file. Moving the site to a
domain root or a subdomain means setting `basePath` to `""` and rebuilding;
skipping that rebuild leaves every asset URL pointing at the old sub-path.
