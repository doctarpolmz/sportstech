# 🏆 SportsTech AI

> AI-Powered Sports Technique Analysis and Training Assistant

SportsTech AI is a comprehensive web application that uses Google Cloud Video Intelligence API and YouTube Data API to analyze athletic performance from uploaded videos, provide AI-driven feedback, and recommend personalized training resources.

## ✨ Features

### 🔐 Authentication & Account Management
- User registration with email verification
- Secure login with JWT authentication
- Password reset functionality
- Role-based access control (Athlete, Coach, Admin)
- Profile photo upload

### 🎥 Video Upload & AI Analysis
- Upload sports videos (MP4, MOV, AVI)
- AI-powered video analysis using Google Cloud Video Intelligence
- Performance scoring (0-100)
- Automated feedback on:
  - Strengths and achievements
  - Areas for improvement
  - Missing techniques
- YouTube video recommendations for skill enhancement

### 👨‍🏫 Coach Mode
- Manage athletes and teams
- View athlete performance history
- Add notes and feedback
- Analyze multiple videos
- Track athlete progress over time

### 💬 Real-Time Messaging
- WebSocket-based chat system
- Athlete-Coach communication
- Message read receipts
- Support for text, emojis, and file attachments

### 📅 Scheduling System
- Calendar view for training sessions
- Schedule management for coaches
- Notifications for upcoming events
- Optional Google Calendar integration

### 📋 Lineup Designer
- Interactive drag-and-drop field view
- Visual team formation designer
- Multiple sport support (Football, Basketball, etc.)
- Export lineups to image or PDF

### 📊 Performance Dashboard
- Performance metrics visualization
- Progress charts (Line, Bar, Radar)
- Historical performance tracking
- AI feedback summaries
- Coach's report export

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Radix UI (shadcn/ui)
- **State Management**: Zustand
- **Routing**: React Router v6
- **Animations**: Framer Motion
- **Charts**: Recharts
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **File Upload**: Multer
- **WebSocket**: ws library
- **Email**: Nodemailer
- **Validation**: express-validator

### APIs & Integrations
- **Google Cloud Video Intelligence API**: Video analysis
- **YouTube Data API v3**: Video recommendations
- **Google Calendar API**: Schedule integration
- **WebSocket**: Real-time messaging

### Development Tools
- **Language**: TypeScript
- **Package Manager**: npm
- **Linting**: ESLint
- **Code Quality**: Prettier (optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+
- Google Cloud account with Video Intelligence API enabled
- YouTube Data API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sportstech-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Set up Google Cloud credentials**
- Download service account JSON from Google Cloud Console
- Save as `backend/google-credentials.json`

5. **Create upload directories**
```bash
mkdir -p backend/uploads/videos backend/uploads/photos
```

6. **Start development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
sportstech-ai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── Layout.tsx  # Main layout component
│   │   ├── pages/          # Route pages
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Videos.tsx
│   │   │   ├── VideoAnalysis.tsx
│   │   │   ├── Messages.tsx
│   │   │   ├── Schedule.tsx
│   │   │   ├── CoachDashboard.tsx
│   │   │   └── LineupDesigner.tsx
│   │   ├── store/          # Zustand state management
│   │   ├── lib/            # Utilities and API client
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Root component
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Express backend application
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── models/         # MongoDB/Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic & external APIs
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── uploads/            # File storage
│   ├── package.json
│   └── tsconfig.json
│
├── .env.example            # Environment variables template
├── package.json            # Root package.json
├── DEPLOYMENT.md          # Deployment guide
└── README.md              # This file
```

## 🔑 Environment Variables

Key environment variables required:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/sportstech-ai

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./backend/google-credentials.json
YOUTUBE_API_KEY=your-youtube-api-key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Server
PORT=5000
FRONTEND_URL=http://localhost:5173
```

See `.env.example` for complete configuration.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile

### Videos
- `POST /api/videos/upload` - Upload video
- `GET /api/videos` - Get user videos
- `GET /api/videos/:id` - Get video details
- `POST /api/videos/:id/analyze` - Analyze video
- `DELETE /api/videos/:id` - Delete video

### Coach
- `GET /api/coach/athletes` - Get coach's athletes
- `POST /api/coach/athletes` - Add athlete
- `DELETE /api/coach/athletes/:id` - Remove athlete
- `POST /api/coach/notes` - Add note
- `GET /api/coach/notes/:athleteId` - Get notes
- `GET /api/coach/athletes/:id/videos` - Get athlete videos

### Messages
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user
- `PUT /api/messages/:id/read` - Mark message as read

### Schedule
- `POST /api/schedules` - Create schedule
- `GET /api/schedules` - Get schedules
- `PUT /api/schedules/:id` - Update schedule
- `DELETE /api/schedules/:id` - Delete schedule

### Lineup
- `POST /api/lineups` - Create lineup
- `GET /api/lineups` - Get lineups
- `GET /api/lineups/:id` - Get lineup details
- `PUT /api/lineups/:id` - Update lineup
- `DELETE /api/lineups/:id` - Delete lineup

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/performance-history` - Get performance history

## 🎯 Usage Guide

### For Athletes

1. **Sign Up**: Create an account as an athlete
2. **Upload Video**: Record and upload your training video
3. **Analyze**: Click "Analyze" to get AI-powered feedback
4. **Review Results**: 
   - View performance score
   - Read strengths and weaknesses
   - Watch recommended YouTube tutorials
5. **Track Progress**: Monitor improvement over time on dashboard
6. **Message Coach**: Communicate with your coach
7. **View Schedule**: Check upcoming training sessions

### For Coaches

1. **Sign Up**: Create account as a coach
2. **Add Athletes**: Invite or add athletes to your roster
3. **Review Videos**: Analyze athlete performance videos
4. **Add Notes**: Provide personalized feedback
5. **Create Lineups**: Design team formations
6. **Schedule Sessions**: Plan training and matches
7. **Track Progress**: Monitor athlete development

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Email verification
- Rate limiting (recommended for production)
- Input validation and sanitization
- CORS configuration
- Secure file upload handling
- Environment-based configuration

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📈 Performance Optimization

- Lazy loading for routes
- Image optimization
- Video compression (recommended)
- Database indexing
- API response caching
- CDN for static assets (production)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Traditional server setup (Ubuntu/Debian)
- Docker deployment
- Cloud platform deployment (Heroku, Vercel, Railway)
- MongoDB Atlas configuration
- SSL setup with Let's Encrypt
- PM2 process management
- Nginx configuration

## 🛡 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: support@sportstech.ai
- Documentation: [Link to docs]

## 🙏 Acknowledgments

- Google Cloud Video Intelligence API
- YouTube Data API
- React and TypeScript communities
- shadcn/ui for beautiful components
- All contributors and testers

---

**Built with ❤️ for athletes and coaches worldwide**
