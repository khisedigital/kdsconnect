# KDS Connect API

Node.js + Express + Sequelize + MySQL backend for the KDS Wholesale Connect app.

## Stack

- **Express 5** — HTTP API under `/v1`
- **Sequelize** — model-based ORM
- **MySQL** — primary datastore
- **JWT** — access + refresh tokens (refresh tokens hashed at rest)
- **Zod** — request validation
- **Helmet / CORS / rate limit / bcrypt** — baseline security

## Layout

```
src/
  app.js              Express app factory
  server.js           Boot + DB sync
  config/             Env + Sequelize
  models/             Sequelize models + associations
  controllers/        Thin HTTP adapters
  services/           Business logic
  routes/             Route maps matching the mobile API contracts
  middleware/         Auth, validate, errors
  validators/         Zod schemas
  db/                 migrate + seed
```

## Setup

1. Create MySQL database:

```sql
CREATE DATABASE kdsconnect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Copy env and adjust credentials:

```bash
cp .env.example .env
```

3. Install and run:

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Health check: `GET http://localhost:4000/v1/health`

## Demo users (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dev.kdsconnect.local` | `Passw0rd!` |
| Sales | `sales@dev.kdsconnect.local` | `Passw0rd!` |
| Retailer | `retailer@dev.kdsconnect.local` | `Passw0rd!` |
| Supplier | `supplier@dev.kdsconnect.local` | `Passw0rd!` |

Dev mobile OTP: `123456` (from `DEV_OTP_CODE`).

## API surface (aligned with the app)

| Area | Prefix |
|------|--------|
| Auth | `/v1/auth/*` |
| Products | `/v1/products` |
| RFQs | `/v1/rfqs` |
| Orders | `/v1/orders` |
| Support | `/v1/support/queries*` |
| Admin | `/v1/admin/*` |
| Sales | `/v1/sales/*` |
| Supplier | `/v1/supplier/*` |

Auth header: `Authorization: Bearer <accessToken>`

## Security notes

- Passwords hashed with bcrypt (cost from `BCRYPT_ROUNDS`)
- Refresh tokens stored as SHA-256 hashes; rotated on refresh
- Role guards on admin / sales / supplier / support routes
- Rate limiting + Helmet + CORS allow-list
- Validation errors return `{ code, message, details }` for the mobile client
- Never commit real `.env` secrets; use long random JWT secrets in production

## Point the mobile app at this API

In `mobile/src/config/env.ts`, set `apiBaseUrl` to `http://localhost:4000/v1` (or your Mac LAN IP for a physical device) and turn off `enableDevPreview` when ready to hit live HTTP.
