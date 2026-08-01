# veil-dashboard

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Veil Dashboard is the web interface for the [Veil](https://veil.dev) LLM
gateway. It lets users manage their API keys, monitor token usage, and manage
their subscription plan — all in the browser.

It is the management layer on top of the [`veil-api`](../veil-api) gateway, and
complements the terminal-focused [`veil-cli`](../veil-cli) client.

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [API integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **API key management.** Create, list, and revoke `vl_live_xxx` keys used by
  local AI tools.
- **Usage monitoring.** Current-month token usage with quota progress and
  request history charts.
- **Billing management.** View the active plan and upgrade through Stripe.
- **Clerk authentication.** Passwordless sign-in backed by Clerk, with route
  protection for authenticated pages.
- **Responsive UI.** Tailwind CSS with Radix UI primitives and Recharts
  visualizations.

## Tech stack

| Concern | Technology |
|---------|------------|
| Build tool | Vite 5 |
| UI framework | React 18 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3, `tailwind-merge`, CVA, `tailwindcss-animate` |
| Components | Radix UI primitives (dialog, dropdown, label, progress, tooltip) |
| Data fetching | Axios + TanStack React Query |
| Routing | React Router 6 |
| Charts | Recharts |
| Auth | Clerk (`@clerk/clerk-react`) |
| Icons | lucide-react |

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A Clerk application (for the publishable key)
- A running instance of the [`veil-api`](../veil-api) gateway

### Setup

```bash
cd veil-dashboard
npm install

# Create the local environment file
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx" > .env.local
echo "VITE_API_URL=http://localhost:3000" >> .env.local

# Start the dev server
npm run dev
```

The app is available at `http://localhost:5173`.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key. The app fails fast at startup if it is missing. |
| `VITE_API_URL` | No | Base URL of the Veil API. Defaults to `http://localhost:8080`. |

## Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm run lint` | Run ESLint on `src/` |

## Project structure

```
src/
  pages/              Route-level pages (Dashboard, Usage, APIKeys, Billing,
                      Login, Activate)
  components/         Reusable UI and layout components (Radix, Tailwind)
  hooks/              Shared React hooks
  lib/
    api.ts            Axios client with Clerk token injection
    utils.ts          Shared helpers (cn, etc.)
  types/              TypeScript types
  App.tsx             Router, providers, and route definitions
```

The Vite config defines the `@` alias pointing to `src/`, and splits vendor,
Clerk, React Query, Recharts, and Radix into separate chunks for production
builds.

## API integration

All requests go through the shared Axios client in `src/lib/api.ts`, which:

- targets `VITE_API_URL` as its base URL;
- injects the Clerk session token as a `Bearer` header on every request;
- normalizes API errors into a single `Error` message.

Routes are protected client-side: unauthenticated users are redirected to
`/login`, and `/activate` handles onboarding flows.

## Contributing

- Run `npm run typecheck` and `npm run lint` before opening a pull request.
- Keep components small and typed; reuse the shared UI primitives.
- Keep this README and the env var contract in sync with code changes.

## License

MIT
