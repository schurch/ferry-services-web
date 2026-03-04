# Ferry Services Web

React + TypeScript web app for viewing Scottish ferry service status, disruption details, schedules, and vessel/location maps.

## Tech Stack

- React 18
- TypeScript
- Vite 5
- React Router (hash routing)

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm

## Getting Started

```bash
npm install
npm run dev
```

Vite will start a local dev server (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev`: start the local development server
- `npm run build`: create a production build in `dist/`
- `npm run preview`: preview the production build locally

## API Configuration

The app requests backend data under `/api`, and Vite proxies this to:

- `https://scottishferryapp.com`

This proxy is configured for both `dev` and `preview` in [`vite.config.ts`](/Users/stefanchurch/Documents/Source/ferry-services-web/vite.config.ts).

## Google Maps (Optional)

Service detail pages can render vessel/location markers with Google Maps.

Set an environment variable before running:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

For local development, create `.env.local` in the project root:

```dotenv
VITE_GOOGLE_MAPS_API_KEY=your_key_here
```

Without this key, the app still works and shows a fallback message instead of the map.

## Routing

The app uses `HashRouter`, so routes are hash-based (for example `#/service/123`), which helps with static hosting.

## Build Output

Production files are generated into `dist/` and can be hosted on any static file server.
