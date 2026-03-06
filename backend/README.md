# Bank Statement Converter API

NestJS backend for MT940/CAMT.053 → CSV/XLSX/QBO conversion.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start infrastructure (Docker)

```bash
docker compose up -d
```

This starts PostgreSQL 16 and MinIO (S3-compatible storage).

### 3. Configure environment

Copy `.env.example` to `.env` and adjust:

```bash
cp .env.example .env
```

For **local dev without Auth0**, set `AUTH_DISABLED=true` in `.env`.

### 4. Run migrations

```bash
npm run migration:run
```

### 5. Start the API

```bash
npm run start:dev
```

API: http://localhost:3001  
Swagger docs: http://localhost:3001/api

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/me` | Current user (JWT) |
| GET | `/users/me` | User + balance + subscription |
| GET | `/users/balance` | Coins balance |
| POST | `/users/topup` | Create Stripe checkout for coins |
| POST | `/users/subscription/checkout` | Create Stripe checkout for Pro |
| GET | `/users/subscription` | Current subscription |
| GET | `/users/subscription/history` | Subscription history |
| GET | `/users/transactions` | Coin transaction history |
| GET | `/users/packages` | Available coin packages |
| GET | `/users/pricing` | **Public** – prices per operation, coin packages, Pro |
| POST | `/uploads/init` | Get presigned upload URL |
| POST | `/jobs` | Create conversion job (1 coin or Pro) |
| GET | `/jobs` | List user jobs |
| GET | `/jobs/:id` | Get job status |
| GET | `/exports/:jobId/:format` | Get presigned download URL (csv/xlsx/qbo) |

## Flow

1. `POST /uploads/init` → get presigned URL
2. Upload file directly to S3/MinIO using the URL
3. `POST /jobs` with `{ key }` → job is created and processed
4. `GET /jobs/:id` → poll until status is `completed`
5. `GET /exports/:jobId/csv` (or xlsx, qbo) → get download URL

## Retention

- Raw and export files are auto-deleted after `RETENTION_HOURS` (default 72).
- Cron runs daily at 3:00 AM. Set `RETENTION_DISABLED=true` to disable.

## Billing

- **Coins**: Buy packages (small/medium/large) via Stripe. 1 job = 1 coin.
- **Pro**: Monthly subscription for unlimited jobs.
- Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRO_PRICE_ID` for full billing.
- Without Stripe: balance/subscription endpoints work; topup/checkout will fail.

## Auth

- **Production**: Auth0 JWT with scopes `jobs:read`, `jobs:write`, `exports:download`
- **Local dev**: Set `AUTH_DISABLED=true` to bypass Auth0
