# StatementFlow Frontend

Next.js 16 frontend for the bank statement converter app. Uses Hero UI v3, Auth0, and Tailwind CSS.

## Setup

1. Copy `.env.example` to `.env.local`
2. Configure Auth0:
   - Create a Regular Web Application in Auth0
   - Set `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
   - Add `http://localhost:3000/auth/callback` to Allowed Callback URLs
   - Add `http://localhost:3000` to Allowed Logout URLs
   - Enable Email and Google in Auth0 Dashboard
3. Set `APP_BASE_URL=http://localhost:3000`
4. Set `NEXT_PUBLIC_API_URL` to your backend (default `http://localhost:3001`)
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
- `/auth/login` - Auth0 login
- `/convert` - Convert bank statements (protected)
- `/history` - Conversion history (protected)
- `/topup` - Buy coins / Pro subscription (protected)
- `/settings` - Profile, balance, subscription (protected)
- `/privacy` - Privacy policy
- `/terms` - Terms of service
