# Portfolio Website

A modern, bilingual (EN/FA) developer portfolio built with Next.js, Tailwind CSS, and Framer Motion. Features glass morphism design, neon light effects, and deployment to Cloudflare Workers via OpenNext.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Cloudflare Workers (`@opennextjs/cloudflare`)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/                # App Router pages (locale-free)
  components/         # UI components
  data/               # Profile & project data
  i18n/               # Translations (en, fa)
  lib/                # Utilities
public/images/        # Static assets
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, about, skills, experience, featured projects) |
| `/projects` | All projects grid |
| `/projects/[slug]` | Project detail with gallery |
| `/contact` | Contact / hire me page |

Language (EN/FA) is switched client-side; routes stay the same.

## Customization

1. Update personal info in `src/data/profile.ts`
2. Edit translations in `src/i18n/messages/`
3. Add/edit projects in `src/data/projects.ts`
4. Replace placeholder images in `public/images/`
5. See `CONTENT_CHECKLIST.md` for full list of needed assets

## Deployment

```bash
npm run deploy
```

Or connect this GitHub repository in the Cloudflare dashboard (Workers Builds). Deploy command:

```bash
npx opennextjs-cloudflare build && npx opennextjs-cloudflare deploy
```

## Scripts

```bash
npm run dev        # Next.js development server
npm run build      # Next.js production build
npm run preview    # Build + preview in Workers runtime (workerd)
npm run deploy     # Build + deploy to Cloudflare Workers
npm run upload     # Build + upload a new Worker version
npm run cf-typegen # Generate CloudflareEnv types
npm run lint       # ESLint
```
