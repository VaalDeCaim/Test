# StatementFlow Frontend

Next.js 16 frontend for the bank statement converter app. Uses Hero UI v3, Auth0, and Tailwind CSS.

## Setup

1. Copy `.env.example` to `.env.local`
2. **Dev bypass (no Auth0)**: Set `DEV_AUTH_BYPASS=true` and `NEXT_PUBLIC_DEV_AUTH_BYPASS=true`. Sign in with `test@gmail.com` / `123456`. Backend should have `AUTH_DISABLED=true` to accept requests. Only works when `NODE_ENV !== 'production'`.
3. **Auth0** (for production): Create a Regular Web Application, set `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, add callback/logout URLs, enable Email + Google.
4. Set `APP_BASE_URL=http://localhost:3000` and `NEXT_PUBLIC_API_URL` (default `http://localhost:3001`)
5. Generate `AUTH0_SECRET`: `openssl rand -hex 32`

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm start
```

## Pages

- `/` - Landing page (public)
- `/auth/login` - Auth0 login (or `/auth/dev-login` when dev bypass)
- `/convert` - Convert bank statements (protected)
- `/history` - Conversion history (protected)
- `/topup` - Buy coins / Pro subscription (protected)
- `/settings` - Profile, balance, subscription (protected)
- `/privacy` - Privacy policy
- `/terms` - Terms of service
