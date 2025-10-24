# AgriRisk Intelligence Platform (ARIP)

AI-driven climate resilience and financial inclusion for Uganda's smallholder farmers.

## Monorepo Structure

```
services/
  api/           # Node.js + Express + TypeScript + Prisma + Socket.io
  ml/            # Python Flask microservice (ML scoring placeholder)
infra/
  db/            # Docker Compose for Postgres + PostGIS
apps/
  web/           # React + TypeScript (mobile-first)
```

## Prerequisites
- Node.js 18+
- Docker + Docker Compose

## Setup

1) Start Postgres + PostGIS
```bash
docker compose -f infra/db/docker-compose.yml up -d
```

2A) API env and Prisma (local Express server)
```bash
cd services/api
cp .env.example .env
echo "DATABASE_URL=postgresql://arip:arip@localhost:5432/arip" >> .env
echo "JWT_SECRET=devsecret" >> .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

2B) Vercel serverless API alternative
Place serverless API functions under `api/` as committed (auth, dashboard, farmers). Configure `DATABASE_URL` and `JWT_SECRET` in Vercel Project → Settings → Environment Variables. Deploy web from `apps/web` or monorepo root and point the frontend to your API via `window.__ARIP_API__` in `apps/web/index.html`.

3) ML service
```bash
cd services/ml
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

4) Web
```bash
cd apps/web
npm install
npm run dev
```

## Key Endpoints
- POST `/api/auth/register`, `/api/auth/login`
- GET `/api/farmers/:id/arip-score`
- POST `/api/loans/apply`
- GET `/api/dashboard/fsp-overview`

## Notes
- Prisma schema includes core tables. Extend with satellite, weather, mobile money, VSLA.
- Flask `/score` implements a placeholder scoring logic for iteration.
