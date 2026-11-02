# KDS Wholesale Connect

Mobile frontend for **KDS Wholesale Connect** by Khise Digital Solution Private Limited.

B2B wholesale purchasing for retailers and suppliers — Android and iOS via React Native CLI.

## Stack

- React Native **0.88** (CLI, not Expo)
- TypeScript (strict)
- React Navigation (auth + role-based tabs)
- Redux Toolkit + secure Keychain token storage
- React Hook Form + Zod
- Jest + React Native Testing Library

## Quick start

Run these from the `mobile/` directory (repo root is a monorepo with `mobile/` + `backend/`):

```bash
cd mobile
npm install
npm start
```

### Android

```bash
npm run android
```

Requires Android SDK, JDK 17, and an emulator or device.

### iOS

```bash
bundle install
npm run pods
npm run ios
```

Requires Xcode, CocoaPods, and an iOS Simulator or device.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Metro bundler |
| `npm run android` / `npm run ios` | Native run |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm test` | Jest |
| `npm run verify` | typecheck + lint + tests |

## Architecture

```
src/
  app/           # navigation, providers, Redux store
  components/    # design system UI, forms, feedback
  features/      # auth, retailer & supplier flows
  services/      # API client, secure storage
  theme/         # design tokens
  types/         # domain models (proposed contracts)
  config/        # environment / API base URL
```

## Backend boundary

The backend is owned by a separate team. This app ships:

1. Typed domain models and service interfaces
2. HTTP client with auth header + error normalization
3. **Development preview** fixtures (`enableDevPreview`, `__DEV__` only)
4. Contract docs in [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md)

Production builds must keep `enableDevPreview: false`. Fixtures never silently replace live APIs outside development.

## Security

See [`docs/SECURITY.md`](docs/SECURITY.md). Tokens use platform Keychain/Keystore. Passwords and tokens are never stored in AsyncStorage or Redux persistence.

## Development preview

On the sign-in screen (dev builds only), **Development preview** lets you explore retailer or supplier UI without a live API. It is labeled and disabled outside `__DEV__`.

## Environment

Configure API base URLs in `src/config/env.ts` until a secrets-free env injection mechanism is adopted for CI/CD.
