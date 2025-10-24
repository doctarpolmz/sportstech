# AgriRisk Intelligence Platform (ARIP)

AI-Driven Climate Resilience and Financial Inclusion for Uganda's Smallholder Farmers

This repository contains a full-stack, mobile-first web platform with USSD integration to deliver ARIP services.

## Apps
- `apps/server`: TypeScript Express backend with USSD endpoint and ARIP score engine
- `apps/web`: Vite + React + TypeScript frontend (mobile-first)

## Quick Start

```bash
# install deps at root workspaces
npm install

# start backend
npm run -w apps/server dev

# start frontend
npm run -w apps/web dev
```

## Environment
Create `apps/server/.env` with:

```
PORT=4000
AT_USERNAME=your_at_username
AT_API_KEY=your_at_api_key
AT_SHORTCODE=*123#
```

USSD endpoint (Africa's Talking-style): `POST /api/ussd` with form data `sessionId, serviceCode, phoneNumber, text`.
