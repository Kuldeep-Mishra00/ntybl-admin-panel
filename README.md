# NTYBL Admin Panel

CMS-style admin panel for the [NTYBL landing page](../Taste-Your-Best-Life-main) — manage leads, Home images, Philosophy, Wellness Areas, Testimonials, FAQ, and Footer social links without touching code.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5174 (or whatever port Vite picks). Copy `.env.example` to `.env.local` and point `VITE_API_URL` at the backend (see `/server` in the landing page repo — `npm run dev:memdb` there for a zero-setup local backend).

Log in with whichever admin account the backend has seeded (`npm run seed:admin` there, or the auto-seeded dev account printed by `dev:memdb`).

## Pages

- **Leads** — table of all form submissions + CSV export
- **Home Images** — the two Hero section images
- **Philosophy** — intro paragraph + the 7 pillar cards
- **Wellness Areas** — the 3 landing-page cards, each with an image, tags, and YouTube video IDs
- **Testimonials** — client stories with photo, rating, quote
- **FAQ** — question/answer pairs
- **Footer Links** — social media icons + URLs
- **Account Settings** — change the admin username/password

## Build

```bash
npm run build
npm run preview
```

## Deploy

Any static host (Netlify/Vercel) works — this is a pure client-side SPA. Set `VITE_API_URL` to the deployed backend's URL as a build-time environment variable, and make sure that backend's `CORS_ORIGINS` includes wherever this ends up deployed.
