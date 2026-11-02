# API Contracts (Required — Not Implemented)

Status: **pending backend team**. The mobile app defines TypeScript interfaces and proposed paths in `src/services/api/endpoints.ts`. Production builds call these URLs via `fetch` and surface **network / HTTP / contract-pending** errors until the API is live.

Dev-only fixtures (`src/services/api/fixtures/`) are used **only** when `appConfig.enableDevPreview === true` (local `__DEV__` development). They must not represent live success in production.

---

## General

| Requirement | Notes |
|-------------|--------|
| Base URL | Configured per environment in `src/config/env.ts` |
| Auth | `Authorization: Bearer <accessToken>` on protected routes |
| JSON | Request/response `application/json` |
| Errors | `{ code?, message?, details? }` with appropriate HTTP status |
| Pagination | `{ items, page, pageSize, totalItems, totalPages }` |

---

## Auth (`/auth/*`)

| Method | Path | Request | Response | Status |
|--------|------|---------|----------|--------|
| POST | `/auth/login` | `LoginRequest` | `AuthSession` | **Required** |
| POST | `/auth/register/retailer` | `RegisterRetailerRequest` | `AuthSession` | **Required** |
| POST | `/auth/register/supplier` | `RegisterSupplierRequest` | `AuthSession` | **Required** |
| POST | `/auth/password-reset` | `PasswordResetRequest` | `204` | **Required** |
| POST | `/auth/refresh` | `{ refreshToken }` | `{ accessToken, expiresAt? }` | **Required** |
| POST | `/auth/logout` | — | `204` | **Required** |
| GET | `/auth/me` | — | `AuthUser` | **Required** |

Types: `src/types/auth.ts` (marked as proposed contract).

---

## Products

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/products` | `PaginatedResponse<Product>` + filters | **Required** |
| GET | `/products/:id` | `Product` | **Required** |
| GET | `/products/categories` | `ProductCategory[]` | **Required** |

Types: `src/types/product.ts`.

---

## RFQs

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/rfqs` | `PaginatedResponse<Rfq>` | **Required** |
| GET | `/rfqs/:id` | `Rfq` | **Required** |
| POST | `/rfqs` | `Rfq` | **Required** |
| POST | `/rfqs/:id/submit` | `Rfq` | **Required** |

Types: `src/types/rfq.ts`.

---

## Quotations

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/rfqs/:rfqId/quotations` | `Quotation[]` | **Required** |
| GET | `/quotations/:id` | `Quotation` | **Required** |
| GET | `/rfqs/:rfqId/quotations/compare` | `QuotationComparison` | **Required** |

Types: `src/types/quotation.ts`.

---

## Group buying

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/group-buy/campaigns` | `PaginatedResponse<GroupBuyCampaign>` | **Required** |
| GET | `/group-buy/campaigns/:id` | `GroupBuyCampaign` | **Required** |
| POST | `/group-buy/campaigns/:id/join` | `GroupBuyParticipation` | **Required** |
| GET | `/group-buy/participations` | `GroupBuyParticipation[]` | **Required** |

Types: `src/types/groupBuying.ts`.

---

## Orders

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/orders` | `PaginatedResponse<Order>` | **Required** |
| GET | `/orders/:id` | `Order` | **Required** |
| POST | `/orders` | `Order` | **Required** |
| POST | `/orders/:id/cancel` | `Order` | **Required** |

Types: `src/types/order.ts`.

---

## Notifications

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/notifications` | `PaginatedResponse<AppNotification>` | **Required** |
| POST | `/notifications/:id/read` | `204` | **Required** |
| POST | `/notifications/read-all` | `204` | **Required** |

Types: `src/types/notification.ts`.

---

## Profile

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/profile` | `BusinessProfile` | **Required** |
| PATCH | `/profile` | `BusinessProfile` | **Required** |
| POST | `/profile/delivery-addresses` | `DeliveryAddress` | **Required** |

Types: `src/types/profile.ts`.

---

## Supplier

| Method | Path | Response | Status |
|--------|------|----------|--------|
| GET | `/supplier/dashboard` | Dashboard summary | **Required** |
| GET | `/supplier/products` | `PaginatedResponse<Product>` | **Required** |
| GET | `/supplier/orders` | `PaginatedResponse<Order>` | **Required** |

---

## Mobile integration notes

1. When contracts are published, replace placeholder base URLs in `src/config/env.ts`.
2. Implement refresh in `createHttpClient` `onUnauthorized` using `/auth/refresh`.
3. Set `enableDevPreview: false` for all store/release builds.
4. Add integration tests against staging before disabling dev preview in QA builds.
