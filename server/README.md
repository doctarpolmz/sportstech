## SportsTech AI Server

Local development quickstart:

1. Copy `.env.example` to `.env` and set values.
2. Set `DATABASE_URL="file:./dev.db"` in env.
3. Install deps and setup Prisma:

```bash
npm install -w server
npm run prisma:generate -w server
npm run prisma:migrate -w server
```

4. Run the server:

```bash
npm run dev -w server
```

APIs (high-level):
- `POST /api/auth/register|login|refresh|forgot|reset` authentication
- `GET /api/auth/verify?token=...` email verification
- `GET /api/users/me`, `POST /api/users/me/photo` profile
- `POST /api/videos/upload` (multipart `video`) + optional `sport`
- `GET /api/videos` list, `GET /api/videos/:id`
- `POST /api/chat/thread`, `GET /api/chat/thread`, `GET /api/chat/messages/:threadId`
- `POST /api/schedules`, `GET /api/schedules`, `POST /api/schedules/:id/calendar`
- `POST /api/lineups`, `GET /api/lineups`
- `GET /api/export/coach-report/:videoId` PDF report
- `POST /api/coach/assign`, `GET /api/coach/athletes`, `POST /api/coach/drill`, `GET /api/coach/drills`
