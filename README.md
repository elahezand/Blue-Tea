# Blue Tea

Blue Tea is a café website and shop with public menus, product listings, articles, and user and admin panels. The Next.js frontend lives in `client/` and the Express API lives in `server/`.

## Local setup

1. Start MongoDB and Redis. Use Node.js 22 or later and npm.
2. In `server/`, copy `.env.example` to `.env`, replace the token secrets, and run `npm ci` followed by `npm run dev`.
3. In `client/`, copy `.env.example` to `.env.local` and run `npm ci` followed by `npm run dev`.
4. Open http://localhost:3000. The API health endpoint is http://localhost:4000/api/health.

Phone sign-in requires IPPanel credentials and Redis. See the [backend guide](server/README.md) for configuration.

## Checks

- In `client/`, run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- In `server/`, run `npm run typecheck` and `npm run build`.

Set `NEXT_PUBLIC_API_URL` to the deployed API base URL, including `/api`, and `NEXT_PUBLIC_SITE_URL` to the public frontend URL. Set the backend `CLIENT_URL` to the frontend origin. Menu image requests to `/uploads/menu/` are forwarded to the origin configured in `NEXT_PUBLIC_API_URL`.
