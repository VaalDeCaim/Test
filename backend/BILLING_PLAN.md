# Billing & User Plan

## Status: Implemented ✅

- DB schema, Stripe integration, user endpoints, webhooks
- Job creation deducts 1 coin (or Pro subscription bypasses)

## Monetization Models

### 1. Pro Subscription (Stripe)
- **Free**: Limited jobs/month (e.g. 5)
- **Pro**: Unlimited jobs, monthly/yearly subscription

### 2. Coins (Pay-as-you-go)
- Buy coin packages via Stripe one-time payment
- 1 job = 1 coin (configurable)
- Top-up balance anytime

---

## Data Model

### user_profiles
| Column | Type | Description |
|--------|------|-------------|
| user_id | varchar PK | Auth0 sub |
| stripe_customer_id | varchar | Stripe customer ID |
| created_at | timestamp | |
| updated_at | timestamp | |

### balances
| Column | Type | Description |
|--------|------|-------------|
| user_id | varchar PK | Auth0 sub |
| coins | integer | Coin balance |
| updated_at | timestamp | |

### subscriptions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| user_id | varchar | Auth0 sub |
| stripe_subscription_id | varchar | |
| plan | enum (free, pro) | |
| status | enum (active, canceled, past_due) | |
| current_period_end | timestamp | |
| created_at | timestamp | |
| updated_at | timestamp | |

### coin_transactions
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| user_id | varchar | Auth0 sub |
| type | enum (purchase, usage, refund) | |
| amount | integer | Coins +/– |
| stripe_payment_intent_id | varchar | For purchases |
| reference | varchar | Job ID for usage |
| created_at | timestamp | |

### subscription_history
| Column | Type | Description |
|--------|------|-------------|
| id | uuid PK | |
| user_id | varchar | |
| event | varchar | subscribed, canceled, renewed |
| plan | varchar | |
| stripe_event_id | varchar | |
| created_at | timestamp | |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /users/me | User + balance + subscription |
| GET | /users/balance | Coins balance |
| POST | /users/topup | Create Stripe checkout for coins |
| GET | /users/subscription | Current subscription |
| GET | /users/subscription/history | Subscription history |
| GET | /users/transactions | Coin transaction history |
| POST | /users/stripe/webhook | Stripe webhook (raw) |

---

## Coin Packages (configurable)

| Package | Coins | Price |
|---------|-------|-------|
| small | 50 | $5 |
| medium | 200 | $15 |
| large | 500 | $35 |

---

## Stripe Integration

- **Checkout Session** for one-time (coins) and subscription (Pro)
- **Webhooks**: checkout.session.completed, customer.subscription.*, invoice.paid
- **Customer** created on first purchase/subscription
