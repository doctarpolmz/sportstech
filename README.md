## SportsTech AI — Monorepo

This monorepo contains:
- `server`: Express API with Prisma (SQLite for dev), JWT auth, file uploads, Google API integration points, Socket.IO chat, schedules, lineups, and PDF export.
- `client`: React + Vite + TS + Tailwind UI with pages for Auth, Dashboard, Videos, Chat, Schedule, and Lineups.

Quickstart

1) Install deps

```bash
npm install
npm install -w server
npm install -w client
```

2) Configure server

```bash
cp server/.env.example server/.env
# edit server/.env and set DATABASE_URL
# e.g.
echo 'DATABASE_URL="file:./dev.db"' >> server/.env
```

3) Setup Prisma DB

```bash
npm run prisma:generate -w server
npm run prisma:migrate -w server
```

4) Run dev servers

```bash
npm run dev
```

The client runs at `http://localhost:5173` and proxies API/Uploads to `http://localhost:4000`.

Deployment Guide (high-level)
- Use PostgreSQL (e.g., Neon/Cloud SQL). Set `DATABASE_URL` accordingly.
- Configure object storage (GCS/S3) for uploads and serve via CDN.
- Provision Google Cloud credentials and set `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_API_KEY`.
- Use PM2 or a container runtime to run the server. Serve client as static build via CDN or reverse proxy.
- Configure HTTPS and CORS.
- Set environment secrets for JWT, SMTP, Google OAuth/Calendar.
- For scaling chat, use Redis adapter for Socket.IO.
