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
- `npm test`: run tests once with Vitest
- `npm run test:watch`: run tests in watch mode

## Project Structure

```text
src/
  api/           # API requests + payload mapping
  components/    # shared UI components
  maps/          # map point transformation logic
  pages/         # route-level pages
  utils/         # date/status helpers
  App.tsx        # router + app shell behavior
  main.tsx       # entrypoint/bootstrap
  styles.css     # global styles and theme tokens
  types.ts       # shared app/API types
```

## Theming

- The app follows the user's OS/browser theme automatically.
- Theme is applied at runtime via `data-theme` on `:root` and CSS variables in [`src/styles.css`](/Users/stefanchurch/Documents/Source/ferry-services-web/src/styles.css).

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

For deployed static builds, you can also set the key at runtime before the app script loads:

```html
<script>
  window.__FERRY_CONFIG__ = {
    googleMapsApiKey: "your_key_here"
  };
</script>
```

Build-time `VITE_GOOGLE_MAPS_API_KEY` still works and takes precedence if both are set.

## Routing

The app uses `HashRouter`, so routes are hash-based (for example `#/service/123`), which helps with static hosting.

## Testing

- Test runner: Vitest
- Component tests: React Testing Library + jsdom
- Setup file: [`src/test/setup.ts`](/Users/stefanchurch/Documents/Source/ferry-services-web/src/test/setup.ts)

Current test coverage includes:

- Date/time formatting helpers
- Service status text helpers
- Map point extraction logic
- API fetch/mapping behavior
- `ServiceDetailsPage` rendering and modal interactions

## Build Output

Production files are generated into `dist/` and can be hosted on any static file server.
