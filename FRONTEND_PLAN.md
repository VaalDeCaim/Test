# Frontend Development Plan

## Overview

Next.js 15 App Router + Hero UI v3 frontend for the bank statement converter SaaS. Auth0 for email + Google sign-in. Landing page for guests, protected dashboard for logged-in users.

---

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Hero UI v3** – all UI components
- **Auth0** – email + Google sign-in
- **Tailwind CSS** – styling (Hero UI dependency)
- **Zod** – form validation

---

## Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing (public)
│   ├── (auth)/              # Auth routes
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected
│   │   ├── layout.tsx       # Drawer layout
│   │   ├── convert/
│   │   ├── history/
│   │   ├── topup/
│   │   └── settings/
│   └── api/                 # API routes if needed
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Drawer.tsx
│   │   └── Footer.tsx
│   ├── landing/
│   ├── convert/
│   └── ...
├── lib/
│   ├── api.ts               # Backend API client
│   ├── auth.ts              # Auth0 helpers
│   └── utils.ts
└── ...
```

---

## Phase 1: Foundation

- [ ] Next.js 15 + TypeScript
- [ ] Hero UI v3 provider + theme
- [ ] Auth0 SDK (Next.js)
- [ ] API client (fetch with Bearer token)
- [ ] Env: NEXT_PUBLIC_AUTH0_*, NEXT_PUBLIC_API_URL

---

## Phase 2: Landing Page (Public)

- [ ] **Header**: Logo, nav anchors, Login, Create Account
- [ ] **Hero**: Headline, CTA, illustration
- [ ] **Features**: MT940/CAMT.053 → CSV/XLSX/QBO
- [ ] **Pricing**: Coins + Pro (from GET /users/pricing)
- [ ] **How it works**: 3-step flow
- [ ] **FAQ**: Accordion
- [ ] **Footer**: Links, copyright
- [ ] **SEO**: metadata, structured data, og:image

---

## Phase 3: Auth (Onboarding)

- [ ] Auth0 Universal Login (email + Google)
- [ ] Login page /login
- [ ] Signup page /signup (or redirect to Auth0)
- [ ] Callback handler
- [ ] Protected route middleware

---

## Phase 4: Dashboard Layout

- [ ] Left drawer (sidebar)
- [ ] Nav: Convert, History, Top Up, Settings
- [ ] Bottom: Logout, Settings
- [ ] User avatar + balance in header

---

## Phase 5: Pages

### Convert
- [ ] File upload (drag-drop)
- [ ] POST /uploads/init → presigned URL
- [ ] Upload to S3, POST /jobs
- [ ] Poll job status, show validation report
- [ ] Download CSV/XLSX/QBO

### History
- [ ] GET /jobs – table of jobs
- [ ] Status, format, date, actions (download)
- [ ] GET /exports/:id/:format for download

### Top Up
- [ ] GET /users/pricing – show packages
- [ ] POST /users/topup – redirect to Stripe
- [ ] Success/cancel return URLs

### Settings
- [ ] Profile (from /users/me)
- [ ] Subscription status
- [ ] Pro checkout link

---

## Backend Changes (if needed)

- [ ] CORS: allow frontend origin
- [ ] Auth0: ensure email + Google connections enabled
- [ ] FRONTEND_URL for Stripe redirects

---

## SEO (Landing)

- Title: "Bank Statement Converter | MT940 & CAMT.053 to CSV, XLSX, QBO"
- Meta description
- Open Graph
- Structured data (SoftwareApplication)
- Semantic HTML (header, main, section, footer)
