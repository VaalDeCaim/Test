# Backend Code Review

## Summary

Code review of the bank statement converter backend (auth, billing, jobs, parsers, retention, storage).

---

## High Priority

### 1. Auth Bypass (AUTH_DISABLED)
- **Risk:** If enabled in production, all endpoints become unauthenticated
- **Fix:** Restrict to `NODE_ENV !== 'production'`, add startup warning

### 2. Stripe Webhook
- **Risk:** Empty `STRIPE_WEBHOOK_SECRET` causes unpredictable behavior; errors return 200
- **Fix:** Reject when secret not set; return 401 on verification failure; log failures

---

## Medium Priority

### 3. Checkout URL Validation
- **Risk:** Open redirect via `successUrl`/`cancelUrl`
- **Fix:** `@IsUrl({ protocols: ['http','https'] })`; validate against `FRONTEND_URL`

### 4. Job Key Validation
- **Risk:** User-provided key used directly as S3 key
- **Fix:** Enforce format `uploads/<uuid>.<ext>`; allowlist extensions

### 5. Coin Parsing
- **Risk:** `parseInt` can return `NaN`, corrupting balances
- **Fix:** Validate `Number.isInteger(coins) && coins > 0`

### 6. Coin Deduction Race Condition
- **Risk:** Concurrent jobs can over-spend balance
- **Fix:** Atomic DB check-and-deduct or row locking

### 7. Job Failure – No Refund
- **Risk:** Coins deducted but not refunded when processing fails
- **Fix:** Refund coins in `processJob` catch block

### 8. Error Types
- **Fix:** Use `BadRequestException` instead of generic `Error` in billing

---

## Low Priority

### 9. PackageId Validation
- **Fix:** `@IsIn(['small', 'medium', 'large'])` in TopUpDto

### 10. Export Format/ExpiresIn
- **Fix:** `ParseEnumPipe` for format; validate expiresIn range

### 11. ConfigService
- **Fix:** Use `ConfigService` instead of `process.env` where applicable

### 12. RETENTION_DISABLED
- **Fix:** Document in `.env.example`

---

## Addressed in This PR

- [x] AUTH_DISABLED restricted to non-production
- [x] Stripe webhook: validate secret, return 401 on failure
- [x] Coin parsing validation
- [x] Refund coins on job failure
- [x] BadRequestException in billing
- [x] @IsIn for packageId
- [x] RETENTION_DISABLED in .env.example
- [x] Job key format validation
