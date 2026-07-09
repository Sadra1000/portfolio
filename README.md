# Portfolio Website

A modern, bilingual (EN/FA) developer portfolio built with Next.js, Tailwind CSS, and Framer Motion. Features glass morphism design, neon light effects, interactive terminal, and static deployment to GitHub Pages.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Static Export)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** GitHub Actions → GitHub Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/en`.

## Project Structure

```
src/
  app/[locale]/       # Localized routes
  components/         # UI components
  data/               # Profile & project data
  i18n/               # Translations (en, fa)
  lib/                # Utilities
public/images/        # Static assets
```

## Pages

| Route | Description |
|-------|-------------|
| `/en` | Landing page (hero, about, skills, experience, featured projects) |
| `/en/projects` | All projects grid |
| `/en/projects/[slug]` | Project detail with gallery |
| `/en/contact` | Contact / hire me page |
| `/fa/...` | Same pages in Farsi (RTL) |

## Customization

1. Update personal info in `src/data/profile.ts`
2. Edit translations in `src/i18n/messages/`
3. Add/edit projects in `src/data/projects.ts`
4. Replace placeholder images in `public/images/`
5. See `CONTENT_CHECKLIST.md` for full list of needed assets

## Deployment

Push to `main` branch. GitHub Actions builds and deploys automatically.

**Before first deploy:**
1. Enable GitHub Pages with source = "GitHub Actions" in repo settings
2. If using a `username.github.io` repo, set `NEXT_PUBLIC_BASE_PATH: ""` in the workflow

## Scripts

```bash
npm run dev      # Development server
npm run build    # Static export to /out
npm run lint     # ESLint
node scripts/generate-placeholders.mjs  # Regenerate placeholder images
```
