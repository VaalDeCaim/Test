# Backend Development Plan

## Overview

NestJS REST API for the bank statement converter (MT940/CAMT.053 → CSV/XLSX/QBO). Auth via Auth0 JWT, PostgreSQL for jobs, MinIO/S3 for files, SQS for background processing.

---

## Phase 1: Foundation (Days 1–2)

### 1.1 NestJS Skeleton
- [x] Create NestJS project with TypeScript
- [x] Configure `package.json`, `tsconfig.json`, ESLint
- [x] Project structure: `src/modules/` (auth, jobs, uploads, exports)

### 1.2 Docker Compose
- [x] `docker-compose.yml`: Postgres 16, MinIO
- [x] `.env.example` with all required variables
- [x] Data volumes for persistence

### 1.3 PostgreSQL Schema
- [x] `jobs` table: id, user_id, status, format, raw_key, created_at, updated_at
- [x] Migrations (TypeORM or raw SQL)
- [x] Connection via `DATABASE_URL`

---

## Phase 2: Auth (Days 3–4)

### 2.1 Auth0 JWT Validation
- [x] `@nestjs/jwt` + `jwks-rsa` for JWKS validation
- [x] JwtAuthGuard: validate issuer, audience, signature, expiry
- [x] Config: `AUTH0_ISSUER_BASE_URL`, `AUTH0_AUDIENCE`

### 2.2 Scopes Guard
- [x] ScopesGuard: require `jobs:read`, `jobs:write`, `exports:download`
- [x] Decorator `@Scopes('jobs:read')` for route-level scopes

### 2.3 `/me` Endpoint
- [x] `GET /me` – return user info from JWT (sub, email, name)
- [x] Protected by JWT + `jobs:read` scope

---

## Phase 3: Upload Pipeline (Days 5–6)

### 3.1 Presigned URL
- [x] `POST /uploads/init` – body: `{ filename, contentType }`
- [x] Return `{ uploadUrl, key }` for direct S3/MinIO upload
- [x] Scope: `jobs:write`

### 3.2 S3/MinIO Service
- [x] `@aws-sdk/client-s3` with MinIO endpoint support
- [x] Buckets: `raw`, `exports`
- [x] Presigned PUT URL generation (15 min expiry)

### 3.3 Jobs + SQS
- [x] `POST /jobs` – body: `{ key }` (S3 key of uploaded file)
- [x] Create job in DB, enqueue to SQS
- [x] `GET /jobs/:id` – job status
- [x] `GET /jobs` – list user's jobs
- [x] SQS worker (or BullMQ for local dev without SQS)

---

## Phase 4: Parsers (Days 7–10)

### 4.1 Normalized Transaction Model
- [x] Interface: `Transaction { date, amount, currency, description, reference, ... }`
- [x] Shared across parsers and exporters

### 4.2 CAMT.053 Parser
- [x] XML parsing (fast-xml-parser or similar)
- [x] Map BkToCstmrStmt/Stmt/Ntry to Transaction[]
- [x] Validation: required fields, date format

### 4.3 MT940 Parser
- [x] Tag parsing: `:20:`, `:25:`, `:28C:`, `:60F/M`, `:61:`, `:86:`, `:62F/M`
- [x] Map to Transaction[]
- [x] Validation rules and error collection

### 4.4 Format Auto-Detection
- [x] Detect MT940 vs CAMT.053 from content
- [x] Store format in job record

---

## Phase 5: Exporters (Day 11)

### 5.1 CSV Exporter
- [x] Generate CSV from Transaction[]
- [x] Configurable delimiter, encoding

### 5.2 XLSX Exporter
- [x] Use `exceljs` or `xlsx`
- [x] Headers + data rows

### 5.3 QBO Exporter
- [x] QuickBooks Online format (IIF or QBO XML)
- [x] Map transactions to QBO structure

### 5.4 Signed Download
- [x] `GET /exports/:jobId/:format` – return presigned GET URL
- [x] Scope: `exports:download`
- [x] Short-lived URL (e.g. 5 min)

---

## Phase 6: Security & Polish (Days 12–13)

### 6.1 Security
- [x] Rate limiting (throttler)
- [x] CORS configuration
- [x] Helmet for headers
- [x] No sensitive data in logs

### 6.2 Retention
- [x] Lifecycle: auto-delete raw/exports after 24–72h (configurable)
- [x] Cron job (daily 3 AM), `RETENTION_HOURS` env

---

## Project Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/           # guards, decorators, filters
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── scopes.guard.ts
│   │   └── decorators/
│   │       └── scopes.decorator.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   └── auth.service.ts
│   │   ├── uploads/
│   │   │   ├── uploads.module.ts
│   │   │   ├── uploads.controller.ts
│   │   │   └── uploads.service.ts
│   │   ├── jobs/
│   │   │   ├── jobs.module.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── jobs.processor.ts   # worker
│   │   ├── exports/
│   │   │   ├── exports.module.ts
│   │   │   ├── exports.controller.ts
│   │   │   └── exports.service.ts
│   │   └── storage/
│   │       ├── storage.module.ts
│   │       └── storage.service.ts
│   ├── parsers/
│   │   ├── transaction.model.ts
│   │   ├── camt053.parser.ts
│   │   └── mt940.parser.ts
│   └── exporters/
│       ├── csv.exporter.ts
│       ├── xlsx.exporter.ts
│       └── qbo.exporter.ts
├── migrations/
├── docker-compose.yml
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH0_ISSUER_BASE_URL` | Auth0 tenant URL (e.g. https://tenant.auth0.com/) |
| `AUTH0_AUDIENCE` | API identifier |
| `S3_ENDPOINT` | MinIO/S3 endpoint |
| `S3_REGION` | Region |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |
| `S3_BUCKET_RAW` | Raw uploads bucket |
| `S3_BUCKET_EXPORTS` | Exports bucket |
| `SQS_QUEUE_URL` | (Optional) SQS queue for jobs |
| `PORT` | API port (default 3001) |

---

## Implementation Order

1. **Phase 1** – NestJS skeleton, Docker, DB schema ✅
2. **Phase 2** – Auth guards, `/me` ✅
3. **Phase 3** – Uploads, jobs, S3, queue ✅
4. **Phase 4** – Parsers (CAMT.053, MT940) ✅
5. **Phase 5** – Exporters, signed download ✅
6. **Phase 6** – Security hardening (throttler, helmet, CORS) ✅

## Additional (implemented)
- Validation report: `validationErrors`, `validationWarnings` on jobs
- Retention: cron purges files after `RETENTION_HOURS` (default 72)
- Billing: Stripe coins + Pro subscription

## Status

Backend implemented in `backend/`. Run `docker compose up -d`, `npm run migration:run`, then `npm run start:dev`.
