# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Next.js dev server (webpack, not Turbopack; port 3000).
- `npm run build` — production build (webpack).
- `npm run start` — run the production build.
- `npm run lint` — ESLint (flat config via `eslint-config-next`).
- `node --test tests/` — run the full test suite (Node's built-in test runner, not Jest/Vitest — there is no test script in package.json). Run a single file with `node --test tests/cart.test.mjs`, or a subtree with `node --test tests/catalog-v2/`.
- `npx prisma generate` — regenerate the Prisma client after any schema change.
- `npx prisma migrate deploy` — apply pending migrations. **Never use `prisma migrate dev`** — migrations are authored by hand in `prisma/migrations*/.../migration.sql` and applied only with `deploy` (see `prisma/schema.prisma` header and `docs/cutover-checklist.md`).
- `node scripts/create-first-admin.mjs` — bootstrap the first SUPER_ADMIN user.

Env vars are documented in `.env.example` (copy to `.env.local`). `DATABASE_URL` points at a single MariaDB/MySQL database — there is no shadow or dev database; schema changes go through reviewed migration SQL, not `prisma migrate dev`.

## Architecture

This is a Next.js (App Router) watch/strap e-commerce storefront with a built-in admin panel, backed by Prisma + MariaDB.

**Two parallel catalog layers exist on purpose:** `src/server/catalog/` (v1, original schema) and `src/server/catalog-v2/` (new schema, under active migration — see `docs/schema-corrections-proposal.md`, `docs/ORDERED_SCHEMA_IMPLEMENTATION_AUDIT.md`, `docs/migration-approval-package.md`, `docs/cutover-checklist.md`). Check which layer a feature touches before assuming the schema shape; `prisma/schema.prisma` is a draft tracking the v2 target and is validated against `prisma/drafts/watchwebsite-schema.prisma`. Do not run destructive DB commands or apply migrations without explicit authorization — the cutover checklist treats this as a manually gated, step-by-step process.

**`src/server/` is the server-only domain layer**, grouped by concern rather than by route:
- `auth/` — admin session cookies, TOTP/MFA, password hashing (`@node-rs/argon2`), password reset tokens/mailer, env validation.
- `rbac/` — permission constants (`permissions.js`) are the single source of truth for permission keys; admin role/permission data is seeded into the DB from these, not hardcoded elsewhere.
- `catalog/` and `catalog-v2/` — product/category rules, schemas (zod), mappers, image handling, storefront read paths. `*-rules.js` files encode business validation; `*-schemas.js` are zod schemas; `storefront.js`/`admin-read.js` are the read-side query layers.
- `commerce/` — checkout, coupons, stock, order totals/state — storefront-side business logic independent of admin.
- `audit/` — writes to the audit log table that admin mutations are expected to record.
- `db.js` / `db-config.js` — Prisma client singleton and connection config.

**`src/admin/`** holds the admin panel's UI-side code (views, components, hooks, client-side catalog helpers), separate from `src/app/admin*` which holds the Next.js routes/pages themselves (`src/app/admin/(panel)` for the authenticated panel, `src/app/admin/login`, `mfa-setup`, `mfa-verify`, `forgot-password`, `reset-password` for the auth flow). `src/app/admin-preview/[view]` is a preview-only route.

**Storefront state** is Redux Toolkit (`src/app/store.js`), with slices under `src/app/features/{cart,checkout,product}/`. Cart state has a persistence middleware (`cartPersistence`) prepended to the store.

**Products are database-driven**, not static: `src/app/straps/[slug]/page.jsx` serves published straps from the DB, and `/product-details/` permanently redirects to `/our-shop/` (see `next.config.mjs`) since the old static product page was removed.

Images are served unoptimized (`images.unoptimized: true` in `next.config.mjs`) — Next's image optimizer is not in the loop. Product images uploaded via admin are handled through `src/server/catalog/image-service.js` / `image-actions.js` and stored under `/storage/` (gitignored, outside the repo's tracked `public/images/`).

## Testing conventions

Tests use Node's built-in `node:test` and `node:assert/strict`, organized to mirror `src/server/`: `tests/auth/`, `tests/catalog-admin/` (v1), `tests/catalog-v2/`, `tests/admin/` (admin UI/page-prop logic), plus top-level `tests/cart.test.mjs`, `tests/checkout.test.mjs`, `tests/catalog.test.mjs`. Integration tests that need a real database are gated on `TEST_DATABASE_URL` and skip when it's unset (see `.env.example`).
