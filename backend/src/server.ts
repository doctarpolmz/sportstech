import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import videoRoutes from './routes/video.routes';
import coachRoutes from './routes/coach.routes';
import messageRoutes from './routes/message.routes';
import scheduleRoutes from './routes/schedule.routes';
import lineupRoutes from './routes/lineup.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { initWebSocketServer } from './services/websocket.service';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/lineups', lineupRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SportsTech AI API is running' });
});

// Error handler
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });

  // Initialize WebSocket server
  initWebSocketServer(server);
}).catch(err => {
  console.error('❌ Failed to connect to database:', err);
  process.exit(1);
});
