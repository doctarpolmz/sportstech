# SportsTech AI - Quick Start Guide

Get SportsTech AI up and running in minutes!

## ⚡ Quick Setup (5 minutes)

### Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ MongoDB 6+ installed and running
- ✅ Git installed

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd sportstech-ai

# Run automated setup
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Install all dependencies (root, backend, frontend)
- Create upload directories
- Copy .env.example to .env
- Build backend and frontend

### 2. Configure Environment

Edit `.env` file with your settings:

```bash
# Minimal configuration to get started
MONGODB_URI=mongodb://localhost:27017/sportstech-ai
JWT_SECRET=your-random-secret-key-change-this
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**Optional but recommended:**
- Add YouTube API key for video recommendations
- Add Google Cloud credentials for video analysis
- Configure SMTP for email features

### 3. Start MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Or if using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend App: http://localhost:5173

### 5. Access the Application

Open your browser and go to: **http://localhost:5173**

## 🎯 First Steps

### Create Your First Account

1. Click "Sign up" on the login page
2. Choose role: **Athlete** or **Coach**
3. Fill in your details
4. (Optional) Verify email if SMTP is configured

### Test the Features

#### As an Athlete:
1. **Upload a Video**
   - Go to "My Videos"
   - Click "Upload Video"
   - Select a sports video (MP4, MOV, AVI)
   - Add title and select sport
   - Click "Upload"

2. **View Dashboard**
   - See your video count
   - View performance metrics
   - Check upcoming schedules

3. **Explore Messages**
   - Send messages to your coach
   - Real-time chat via WebSocket

#### As a Coach:
1. **Add Athletes**
   - Go to "My Athletes"
   - Add athletes to your roster

2. **Create Schedule**
   - Go to "Schedule"
   - Click "Create Schedule"
   - Set training session details

3. **Design Lineup**
   - Go to "Lineup Designer"
   - Create team formation
   - Position players on field

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
kill -9 $(lsof -t -i:5000)

# Or change port in .env
PORT=5001
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod
```

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
```

### WebSocket Connection Failed
- Ensure backend is running
- Check browser console for errors
- Verify JWT token is valid

## 📚 Next Steps

### Configure Google Cloud APIs

1. **Video Intelligence API** (for AI analysis)
   - Create project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Video Intelligence API
   - Create service account
   - Download JSON credentials
   - Save as `backend/google-credentials.json`

2. **YouTube Data API** (for video recommendations)
   - Enable YouTube Data API v3
   - Create API key
   - Add to `.env`: `YOUTUBE_API_KEY=your-key`

3. **Google Calendar API** (optional)
   - Enable Calendar API
   - Configure OAuth 2.0
   - Add credentials to `.env`

### Configure Email

Using Gmail:
1. Enable 2-Factor Authentication
2. Generate App Password
3. Update `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

## 🚀 Development Workflow

### Run Separately
```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Linting
```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

## 📖 Documentation

- **[README.md](./README.md)** - Complete project overview
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide
- **[API.md](./API.md)** - API endpoint documentation
- **[FEATURES.md](./FEATURES.md)** - Complete features list

## 🐛 Common Issues

### Issue: "Module not found"
**Solution:** Run `npm install` in the affected directory

### Issue: "Cannot connect to MongoDB"
**Solution:** 
```bash
sudo systemctl start mongod
# Check status
sudo systemctl status mongod
```

### Issue: Video upload fails
**Solution:** 
- Check upload directory exists: `backend/uploads/videos`
- Verify MAX_FILE_SIZE in .env
- Check disk space

### Issue: Google API errors
**Solution:**
- Verify credentials file exists
- Check API is enabled in Google Cloud Console
- Verify service account permissions

### Issue: Email not sending
**Solution:**
- Use Gmail App Password (not regular password)
- Check SMTP settings
- Review server logs

## 💡 Tips & Tricks

### Fast Development
- Use React DevTools for debugging
- Enable MongoDB logging for database queries
- Use Postman/Insomnia for API testing
- Check browser console for WebSocket messages

### Testing with Multiple Roles
1. Create two accounts (one athlete, one coach)
2. Use different browsers or incognito mode
3. Test coach-athlete interactions

### Performance
- Keep MongoDB indexes updated
- Compress videos before upload
- Use browser caching
- Enable gzip compression in production

### Security
- Change JWT_SECRET before deployment
- Never commit .env file
- Use HTTPS in production
- Implement rate limiting

## 🎓 Learning Resources

### Technologies Used
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Google Cloud Video Intelligence](https://cloud.google.com/video-intelligence/docs)

### Tutorials
- [Node.js + TypeScript](https://nodejs.dev/learn/nodejs-with-typescript)
- [React + TypeScript](https://react-typescript-cheatsheet.netlify.app/)
- [MongoDB + Mongoose](https://mongoosejs.com/docs/guide.html)
- [WebSocket Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

## 🤝 Getting Help

### Before Asking for Help
1. Check documentation
2. Search existing issues
3. Check browser console
4. Review server logs
5. Verify environment variables

### Where to Get Help
- **GitHub Issues**: [Create an issue](repository-url/issues)
- **Email**: support@sportstech.ai
- **Documentation**: All .md files in repository

### Reporting Bugs
Include:
- Error message
- Steps to reproduce
- Environment (OS, Node version, Browser)
- Screenshots if applicable
- Relevant logs

## 🎉 Success Checklist

After setup, verify these work:

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can create an account
- [ ] Can login successfully
- [ ] Can upload a video
- [ ] Dashboard displays correctly
- [ ] Can send messages
- [ ] Can create schedule (coach)
- [ ] MongoDB stores data correctly
- [ ] WebSocket connects successfully

## 🌟 What's Next?

1. **Explore Features**: Try all the features listed in FEATURES.md
2. **Customize**: Modify UI, add new features
3. **Deploy**: Follow DEPLOYMENT.md for production
4. **Integrate APIs**: Set up Google Cloud services
5. **Scale**: Add more sports, features, integrations

---

**Ready to revolutionize sports training with AI!** 🏆

Need help? Check the docs or create an issue on GitHub.
