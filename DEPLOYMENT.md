# SportsTech AI - Deployment Guide

## Prerequisites

- **Node.js**: v18+ 
- **MongoDB**: v6+ (local or MongoDB Atlas)
- **Google Cloud Account**: For Video Intelligence API
- **YouTube Data API Key**: For video recommendations
- **SMTP Email Service**: For email verification (Gmail recommended)

## Environment Setup

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/sportstech-ai
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sportstech-ai

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Google Cloud APIs
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=./backend/google-credentials.json
YOUTUBE_API_KEY=your-youtube-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=SportsTech AI <noreply@sportstech.ai>

# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=104857600

# WebSocket
WS_PORT=5001
```

### 3. Google Cloud Setup

#### Video Intelligence API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the **Cloud Video Intelligence API**
4. Create a service account:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Grant "Video Intelligence Admin" role
   - Create and download JSON key
5. Save the JSON key as `backend/google-credentials.json`

#### YouTube Data API

1. In Google Cloud Console, enable **YouTube Data API v3**
2. Go to APIs & Services > Credentials
3. Create API Key
4. Restrict the key to YouTube Data API v3
5. Add the key to your `.env` file

#### Google Calendar API (Optional)

1. Enable **Google Calendar API**
2. Configure OAuth 2.0 consent screen
3. Create OAuth 2.0 Client ID
4. Add authorized redirect URIs

### 4. Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security > 2-Step Verification > App passwords
   - Generate new app password
   - Use this password in `SMTP_PASS`

## Development

### Start Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:backend   # Backend on port 5000
npm run dev:frontend  # Frontend on port 5173
```

Access the application at `http://localhost:5173`

## Production Deployment

### Option 1: Traditional Server (Ubuntu/Debian)

#### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx
```

#### 2. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd sportstech-ai

# Install dependencies
npm install

# Build applications
npm run build

# Create production .env file
cp .env.example .env
nano .env  # Edit with production values
```

#### 3. Configure PM2 (Process Manager)

```bash
# Install PM2
sudo npm install -g pm2

# Start backend
cd backend
pm2 start dist/server.js --name sportstech-api

# Serve frontend with PM2 (optional) or use Nginx
pm2 serve ../frontend/dist 5173 --name sportstech-frontend --spa

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/sportstech-ai
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/sportstech-ai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Uploads
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/sportstech-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile for Backend

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
```

#### 2. Create Dockerfile for Frontend

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: sportstech-ai

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/sportstech-ai
    env_file:
      - .env
    depends_on:
      - mongodb
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Deploy with Docker:

```bash
docker-compose up -d
```

### Option 3: Cloud Platform Deployment

#### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create apps
heroku create sportstech-api
heroku create sportstech-frontend

# Add MongoDB
heroku addons:create mongolab:sandbox -a sportstech-api

# Set environment variables
heroku config:set JWT_SECRET=your-secret -a sportstech-api
heroku config:set YOUTUBE_API_KEY=your-key -a sportstech-api

# Deploy backend
cd backend
git push heroku main

# Deploy frontend
cd ../frontend
git push heroku main
```

#### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Railway / Render

Both platforms offer simple deployment:
1. Connect GitHub repository
2. Configure environment variables
3. Deploy with one click

## MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Configure network access (add your IP or 0.0.0.0/0 for all)
4. Create database user
5. Get connection string and add to `.env`

## Post-Deployment Checklist

- [ ] Update `FRONTEND_URL` in `.env` to production domain
- [ ] Configure CORS origins in backend
- [ ] Set up SSL certificate
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure monitoring (PM2, New Relic, DataDog)
- [ ] Set up logging (Winston, Loggly)
- [ ] Test all API endpoints
- [ ] Test file uploads
- [ ] Test WebSocket connections
- [ ] Verify email sending
- [ ] Test video analysis with Google Cloud APIs
- [ ] Configure CDN for static assets (optional)

## Monitoring & Maintenance

### PM2 Monitoring

```bash
pm2 monit
pm2 logs
pm2 restart all
```

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/sportstech-ai" --out=/backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/sportstech-ai" /backup/20231225
```

### Logs

```bash
# Backend logs
pm2 logs sportstech-api

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running: `sudo systemctl status mongod`
   - Verify connection string in `.env`
   - Check firewall rules

2. **Google Cloud API Errors**
   - Verify credentials file path
   - Check API is enabled in Google Cloud Console
   - Verify service account permissions

3. **WebSocket Connection Failed**
   - Check Nginx WebSocket proxy configuration
   - Verify WS_PORT is correct
   - Check firewall allows WebSocket connections

4. **File Upload Fails**
   - Check upload directory permissions: `chmod 755 backend/uploads`
   - Verify `MAX_FILE_SIZE` in `.env`
   - Check disk space

5. **Email Not Sending**
   - Verify SMTP credentials
   - Check app password for Gmail
   - Review email logs

## Security Recommendations

1. **Use strong JWT_SECRET** (minimum 32 characters)
2. **Enable HTTPS** in production
3. **Set secure CORS origins** (not wildcard)
4. **Implement rate limiting** on API endpoints
5. **Sanitize user inputs**
6. **Keep dependencies updated**: `npm audit fix`
7. **Use environment variables** for all secrets
8. **Enable MongoDB authentication**
9. **Regularly backup database**
10. **Monitor API usage and costs** (Google Cloud, MongoDB Atlas)

## Scaling Considerations

- Use **load balancer** (Nginx, HAProxy) for multiple backend instances
- Implement **Redis** for session management and caching
- Use **CDN** (Cloudflare, CloudFront) for static assets
- Consider **message queue** (RabbitMQ, Redis) for video processing
- Use **cloud storage** (S3, Google Cloud Storage) for videos
- Implement **horizontal scaling** with Kubernetes

## Support

For issues or questions:
- GitHub Issues: [your-repo-url]/issues
- Documentation: [your-docs-url]
- Email: support@sportstech.ai
