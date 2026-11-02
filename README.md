# KDS Wholesale Connect

Monorepo for **KDS Wholesale Connect** by Khise Digital Solution Private Limited.

```
kdsconnect/
├── mobile/     React Native app (Android + iOS)
└── backend/    Node.js + Express + Sequelize + MySQL API
```

## Mobile

```bash
cd mobile
npm install
npm start
npm run ios      # or: npm run android
```

## Backend

```bash
cd backend
cp .env.example .env   # set MySQL credentials
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

API: `http://localhost:4000/v1`  
Health: `GET /v1/health`

## Connect the app to the API

In `mobile/src/config/env.ts`, point `apiBaseUrl` at your API (e.g. `http://localhost:4000/v1` or your Mac LAN IP for a physical device) and set `enableDevPreview` to `false` when you want live HTTP instead of fixtures.
