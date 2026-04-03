# GMD Fences Landing Page

Landing page for GMD Fences — a commercial fence and gate solutions company.

## Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** — animations
- **globe.gl** — interactive 3D globe
- **React Hook Form** + **Zod** — contact form validation
- **PostgreSQL** + **Drizzle ORM** — database

## Project structure

```
app/
  page.tsx              ← Landing page (client component)
  layout.tsx            ← Root layout + metadata
  globals.css           ← Global styles
  api/
    healthz/route.ts    ← GET /api/healthz
components/
  InteractiveGlobe.tsx  ← Interactive 3D globe
lib/
  db/
    index.ts            ← PostgreSQL connection + Drizzle
    schema/index.ts     ← Table schemas
drizzle.config.ts       ← Drizzle Kit config
```

## Getting started

```bash
npm install

# Copy environment variables
cp .env.example .env.local
# Set DATABASE_URL in .env.local

npm run dev
```

App runs at `http://localhost:3000`.

## Commands

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Start production build
npm run typecheck  # TypeScript type check
npm run db:push    # Push DB schema (dev only)
```

## Environment variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/gmdfences
```
