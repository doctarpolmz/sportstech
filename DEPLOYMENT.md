# ARIP Deployment Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Pre-deployment Checklist](#pre-deployment-checklist)
3. [Production Deployment](#production-deployment)
4. [USSD Integration](#ussd-integration)
5. [Database Setup](#database-setup)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## 🖥️ System Requirements

### Minimum Server Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04 LTS or higher
- **Node.js**: 18.x or higher
- **Database**: MongoDB 5.x or PostgreSQL 14+

### Recommended for Production
- **CPU**: 4+ cores
- **RAM**: 8GB+
- **Storage**: 50GB+ SSD
- **Load Balancer**: Nginx or HAProxy
- **CDN**: Cloudflare or AWS CloudFront

## ✅ Pre-deployment Checklist

### 1. Environment Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install build essentials
sudo apt install -y build-essential

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Security Configuration
- [ ] Set strong JWT_SECRET
- [ ] Configure firewall (UFW)
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Enable HTTPS only
- [ ] Configure CORS properly
- [ ] Set secure HTTP headers

### 3. Database Setup
- [ ] Install MongoDB or PostgreSQL
- [ ] Create database and user
- [ ] Configure connection string
- [ ] Set up backups
- [ ] Enable authentication

## 🚀 Production Deployment

### Step 1: Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd arip-platform

# Install dependencies
npm run install-all

# Build frontend
cd client && npm run build
cd ..
```

### Step 2: Environment Configuration

Create production `.env` file:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Secret (Generate strong secret)
JWT_SECRET=$(openssl rand -base64 32)

# Database
DATABASE_URL=mongodb://localhost:27017/arip_production
# OR for PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/arip

# USSD Gateway (Africa's Talking)
USSD_GATEWAY_URL=https://api.africastalking.com/version1/messaging
USSD_API_KEY=your_production_api_key
USSD_USERNAME=your_username
USSD_SHORTCODE=*384*96#

# Mobile Money Integration
MTN_MOMO_API_KEY=your_production_mtn_key
MTN_MOMO_API_SECRET=your_mtn_secret
AIRTEL_MONEY_API_KEY=your_production_airtel_key

# Satellite Data API
SATELLITE_API_KEY=your_production_satellite_key
AGROMONITORING_API_KEY=your_agromonitoring_key

# SMS Configuration
SMS_API_KEY=your_production_sms_key
SMS_SENDER_ID=ARIP

# Client URL
CLIENT_URL=https://arip.ug
```

### Step 3: Configure Nginx

Install and configure Nginx:

```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/arip
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name arip.ug www.arip.ug;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name arip.ug www.arip.ug;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/arip.ug/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/arip.ug/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Serve React frontend
    location / {
        root /var/www/arip/client/build;
        try_files $uri /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/arip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d arip.ug -d www.arip.ug

# Auto-renewal
sudo certbot renew --dry-run
```

### Step 5: Start Application with PM2

```bash
# Start the application
pm2 start server/index.js --name arip-api

# Save PM2 configuration
pm2 save

# Enable startup on boot
pm2 startup systemd
```

### Step 6: Configure Firewall

```bash
# Allow SSH
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable
```

## 📱 USSD Integration

### Africa's Talking Setup

1. **Create Account**
   - Sign up at https://africastalking.com
   - Verify your account
   - Get sandbox/production API keys

2. **Configure USSD Service**
   ```bash
   # In Africa's Talking dashboard:
   # 1. Go to USSD > Create Channel
   # 2. Set callback URL: https://arip.ug/api/ussd
   # 3. Request shortcode: *384*96#
   # 4. Test in sandbox mode first
   ```

3. **Test USSD Flow**
   ```bash
   # Use Africa's Talking simulator
   # Or dial the test shortcode from registered number
   ```

### Alternative USSD Providers

- **Twilio**: https://www.twilio.com
- **Nexmo (Vonage)**: https://www.vonage.com
- **Direct Telco Integration**: Contact MTN/Airtel Business

## 💾 Database Setup

### MongoDB Setup

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongosh
> use arip_production
> db.createUser({
    user: "arip_admin",
    pwd: "secure_password",
    roles: ["readWrite", "dbAdmin"]
  })
```

### PostgreSQL Setup (Alternative)

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
> CREATE DATABASE arip_production;
> CREATE USER arip_admin WITH PASSWORD 'secure_password';
> GRANT ALL PRIVILEGES ON DATABASE arip_production TO arip_admin;
```

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# View logs
pm2 logs arip-api

# Monitor resources
pm2 monit

# Restart application
pm2 restart arip-api

# View status
pm2 status
```

### Log Management

```bash
# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

### Backup Strategy

```bash
# MongoDB backup script
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

mongodump --out $BACKUP_DIR/$DATE
tar -czf $BACKUP_DIR/arip_backup_$DATE.tar.gz $BACKUP_DIR/$DATE
rm -rf $BACKUP_DIR/$DATE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Monitoring Tools

- **PM2 Plus**: Application monitoring
- **Prometheus + Grafana**: Metrics and dashboards
- **Sentry**: Error tracking
- **UptimeRobot**: Uptime monitoring

## 🔄 Updates & Maintenance

### Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install
cd client && npm install && cd ..

# Rebuild frontend
cd client && npm run build && cd ..

# Restart application
pm2 restart arip-api
```

### Database Migrations

```bash
# Run migrations (when implemented)
npm run migrate

# Rollback if needed
npm run migrate:rollback
```

## 🆘 Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs arip-api --lines 100

# Check if port is in use
sudo lsof -i :5000
```

### USSD not working
- Verify callback URL is accessible
- Check Africa's Talking dashboard for errors
- Test with USSD simulator
- Verify API keys are correct

### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection string
# Verify firewall allows database port
```

## 📞 Support

For deployment support:
- **Technical Support**: tech@arip.ug
- **Documentation**: https://docs.arip.ug
- **Emergency**: +256-XXX-XXXXXX

---

**Deployment Checklist Summary:**
- [ ] Server provisioned
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Database set up
- [ ] SSL certificates installed
- [ ] Nginx configured
- [ ] Application deployed with PM2
- [ ] Firewall configured
- [ ] USSD integration tested
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
