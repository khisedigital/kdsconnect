# Security Controls (MASVS-Aligned — Frontend Scope)

This document describes what the **KDS Wholesale Connect** React Native client implements today and what **must** be enforced by the backend and platform.

References: [OWASP MASVS](https://github.com/OWASP/owasp-masvs).

---

## MASVS-STORAGE

| Control | Frontend | Backend / platform |
|---------|----------|-------------------|
| Sensitive data not in logs | Access/refresh tokens are never logged in `secureStorage` or HTTP client | Avoid token logging server-side |
| Credentials storage | Access + refresh tokens in **Keychain** (`react-native-keychain`), device-only accessibility | Issue short-lived access tokens + rotatable refresh tokens |
| Non-sensitive prefs | Onboarding flag, role preview in **AsyncStorage** only — no passwords/tokens | N/A |
| Redux | Session **user profile** only; tokens **not** in Redux or redux-persist | N/A |

---

## MASVS-CRYPTO

| Control | Frontend | Backend |
|---------|----------|---------|
| TLS | Uses system `fetch` — **no TLS disable**, no custom trust bypass | Valid certificates, HSTS, TLS 1.2+ |
| Secrets in repo | No API keys or hardcoded secrets in source | Keys in secure CI/secrets manager |

---

## MASVS-AUTH

| Control | Frontend | Backend |
|---------|----------|---------|
| Bearer tokens | Attached via `Authorization` header from Keychain | Validate JWT/session, revoke on logout |
| Refresh | Placeholder `onUnauthorized` hook — **not implemented** until `/auth/refresh` contract exists | Refresh rotation, reuse detection |
| Logout | Clears Keychain locally; best-effort server logout | Invalidate refresh tokens server-side |
| Password handling | Sent only in login/register API calls (HTTPS); never stored locally | Hashing (Argon2/bcrypt), rate limiting, MFA policy TBD |

---

## MASVS-NETWORK

| Control | Frontend | Backend |
|---------|----------|---------|
| Timeouts | `AbortController` per request (`requestTimeoutMs`) | Reasonable server timeouts |
| Error handling | Normalized errors; no silent fake success in production | Consistent error schema |
| Dev preview | Fixtures isolated; gated by `enableDevPreview` | Staging data separate from production |

---

## MASVS-PLATFORM

| Control | Frontend | Backend |
|---------|----------|---------|
| Jailbreak/root | Not detected in app layer yet — consider commercial SDK if policy requires | Risk-based step-up auth |
| Screenshots / background | OS defaults; sensitive screens should use `FLAG_SECURE` (Android) / blur in app switcher when implemented | N/A |

---

## MASVS-CODE

| Control | Frontend | Backend |
|---------|----------|---------|
| TypeScript strict | Enabled project-wide | N/A |
| Dependency hygiene | Pin versions; audit in CI | Same |

---

## Retailer vs supplier authorization

Role (`retailer` | `supplier`) is stored in client state for UX routing only. **All authorization must be enforced server-side** on every endpoint (products, RFQs, supplier dashboard, etc.).

---

## Checklist before production release

- [ ] `enableDevPreview: false` in production config
- [ ] Production `apiBaseUrl` points to live API
- [ ] Refresh token flow implemented and tested
- [ ] Certificate pinning evaluated (if required by organizational policy)
- [ ] Penetration test on auth + order/RFQ flows
- [ ] Privacy policy aligned with data collected (profile, addresses, order history)
