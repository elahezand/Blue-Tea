# Blue Tea API

The Express API uses MongoDB for persistent data and Redis for caching and phone verification codes.

## Local setup

1. Start MongoDB and Redis.
2. Copy `.env.example` to `.env` and configure the database URI and distinct token secrets.
3. Run `npm ci` and `npm run dev`.
4. Check http://localhost:4000/api/health. This endpoint checks that the API responds.

The repository has no seed command. Populate a development database with the data needed for the pages you want to exercise.

## Phone sign-in

Configure `SMS_USER`, `SMS_PASS` and `SMS_PATTERN` with your IPPanel credentials and verification template. Redis stores verification codes and tracks attempts. Set `ADMIN_PHONE` to the intended administrator's phone number in international format if needed.

## API and checks

All routes are mounted under `/api`. The [route index](src/routes/index.ts) lists the route groups. Protected routes use cookies issued by the authentication endpoints. Some route groups contain operations that currently return HTTP 501.

Run `npm run typecheck` to check TypeScript, `npm run build` to compile, and `npm start` to run the compiled server.
