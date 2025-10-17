import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUploadDir } from './utils/paths.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import videoRoutes from './routes/videos.js';
import chatRoutes from './routes/chat.js';
import scheduleRoutes from './routes/schedules.js';
import lineupRoutes from './routes/lineups.js';
import exportRoutes from './routes/export.js';
import coachRoutes from './routes/coach.js';

import { attachSocketHandlers } from './socket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }
});

attachSocketHandlers(io);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Static uploads (consistent resolution)
const uploadDir = getUploadDir();
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SportsTech AI API' });
});

app.get('/', (req, res) => {
  res.send('SportsTech AI API');
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/lineups', lineupRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/coach', coachRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`SportsTech AI server listening on http://localhost:${PORT}`);
});
