# SortX — Interactive Sorting Algorithm Visualizer

SortX is a React, TypeScript, Express, tRPC, and Drizzle application for exploring sorting algorithms through event-driven animations and live metrics.

## Requirements

- Node.js 20+
- pnpm 10+
- MySQL, if you want to use the persistence endpoints

## Run in VS Code

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser. The development server serves both the React client and the API.

## Useful commands

```bash
pnpm check       # TypeScript validation
pnpm test        # Vitest suite
pnpm build       # Production build
pnpm start       # Serve the production build
pnpm db:migrate  # Apply checked-in Drizzle migrations
```

For database-backed preferences, quiz attempts, saved datasets, and visualization sessions, create a `.env` file with a `DATABASE_URL` MySQL connection string before running `pnpm db:migrate`. Do not commit `.env` files or credentials.

## Project structure

- `client/src/App.tsx` — application routes, pages, and visualizer interactions
- `client/src/lib/algorithms.ts` — typed sorting event engine and dataset generators
- `server/routers.ts` — tRPC API surface
- `server/db.ts` — database persistence helpers
- `drizzle/` — schema and migrations
- `shared/` — shared types and constants
