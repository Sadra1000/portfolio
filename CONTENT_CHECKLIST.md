# Content Checklist

Items needed from you to complete the portfolio. Replace placeholder values with your real content.

## Personal Info (`src/data/profile.ts`)

- [ ] Full name
- [ ] Email address
- [ ] Telegram username (e.g. `@yourusername`)
- [ ] GitHub profile URL
- [ ] LinkedIn profile URL
- [ ] Profile photo (recommended: 400×400px, square, `.webp` or `.jpg`)

## Translations (`src/i18n/messages/en.json` & `fa.json`)

- [ ] Hero name and role title
- [ ] About me description (personalized)
- [ ] Experience entries (role, company, period, description)
- [ ] Meta title and description for SEO
- [ ] Terminal command responses (optional customization)

## Skills (`src/data/profile.ts`)

- [ ] Review and update skill lists per category (mobile, frontend, backend, tools)
- [ ] Add or remove categories if needed

## Projects (`src/data/projects.ts`)

For each project provide:

- [ ] Project title (English & Farsi)
- [ ] Short description (English & Farsi) — shown on card hover
- [ ] Long description (English & Farsi) — shown on detail page
- [ ] Tech stack tags
- [ ] GitHub repository URL
- [ ] Live demo URL (if available)
- [ ] Screenshots (recommended: 800×450px, 16:9 ratio)
  - Multiple images per project supported
  - Place in `public/images/projects/`
  - Update image paths in `projects.ts`

### Current placeholder projects to replace:

1. `flutter-ecommerce` — E-Commerce Mobile App
2. `nextjs-dashboard` — Analytics Dashboard
3. `fastapi-api` — REST API Platform
4. `portfolio-website` — This portfolio site

## Images Directory Structure

```
public/images/
  avatar-placeholder.svg  → replace with your photo
  projects/
    ecommerce-1.svg       → replace with real screenshots
    ecommerce-2.svg
    ecommerce-3.svg
    dashboard-1.svg
    dashboard-2.svg
    api-1.svg
    api-2.svg
    portfolio-1.svg
```

## Optional Future Content

- [ ] Resume/CV file (`public/resume.pdf`)
- [ ] Favicon (`public/favicon.ico`)
- [ ] Open Graph image (`public/og-image.png`, 1200×630px)
- [ ] Blog posts (when blog section is added)
- [ ] Testimonials / client reviews
- [ ] Additional social links (Twitter/X, Instagram, etc.)

## GitHub Pages Setup

After pushing to GitHub:

1. Go to repository **Settings → Pages**
2. Set source to **GitHub Actions**
3. If repo name is `username.github.io`, set `NEXT_PUBLIC_BASE_PATH` to `""` in `.github/workflows/deploy.yml`
4. For project pages (`username.github.io/repo-name`), the workflow already sets the base path automatically

## Recommended Image Specs

| Asset | Size | Format |
|-------|------|--------|
| Avatar | 400×400 | WebP/JPG |
| Project screenshots | 800×450 (16:9) | WebP/PNG |
| OG image | 1200×630 | PNG |
| Favicon | 32×32 | ICO/PNG |
