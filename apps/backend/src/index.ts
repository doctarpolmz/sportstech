import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { router as apiRouter } from './routes/api.js';
import { registerSocketHandlers } from './socket/index.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  path: process.env.WS_PATH || '/socket.io',
  cors: { origin: process.env.CORS_ORIGIN || '*'}
});

export const prisma = new PrismaClient();
export const ioServer = io;
registerSocketHandlers(io);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', apiRouter);

const PORT = Number(process.env.PORT || 8080);
httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`SportsTech AI backend running on http://localhost:${PORT}`);
});
