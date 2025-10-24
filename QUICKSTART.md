# ARIP Quick Start Guide

Get the AgriRisk Intelligence Platform running in 5 minutes!

## 🚀 Installation

### Step 1: Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install-all
```

### Step 2: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# The default configuration works for development!
# Edit .env only if you need to customize settings
```

### Step 3: Start the Platform
```bash
# Start both frontend and backend servers
npm run dev
```

The platform will start:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Try It Out!

### 1. Access the Web Platform

Open your browser and go to: **http://localhost:3000**

### 2. Login with Demo Accounts

Choose one of these demo accounts:

#### 👨‍🌾 Farmer Account
- **Email**: `farmer@demo.com`
- **Password**: `demo123`
- **What you can do**:
  - View your credit score (175/200)
  - Apply for loans
  - See climate data for your farm
  - Check insurance coverage

#### 🏦 Financial Service Provider (FSP)
- **Email**: `fsp@demo.com`
- **Password**: `demo123`
- **What you can do**:
  - View portfolio dashboard
  - Review loan applications
  - Analyze borrower risk
  - Make lending decisions

#### 👤 Administrator
- **Email**: `admin@demo.com`
- **Password**: `demo123`
- **What you can do**:
  - View platform analytics
  - Monitor impact metrics
  - Track growth trends
  - Manage system settings

### 3. Test USSD Integration

The USSD endpoint is available at:
```
POST http://localhost:5000/api/ussd
```

Test with curl:
```bash
curl -X POST http://localhost:5000/api/ussd \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test123",
    "serviceCode": "*384*96#",
    "phoneNumber": "+256700000001",
    "text": ""
  }'
```

You'll see the USSD menu response!

## 📱 Mobile Testing

The platform is fully responsive. Test on mobile by:

1. Find your local IP address:
   ```bash
   # On Linux/Mac
   ifconfig | grep "inet "
   
   # On Windows
   ipconfig
   ```

2. Access from your phone:
   ```
   http://YOUR_LOCAL_IP:3000
   ```

## 🔑 Key Features to Explore

### For Farmers:
1. **Dashboard** - See your credit score and farm stats
2. **Credit Score** - Detailed breakdown of your ARIP score
3. **Loan Application** - Apply for climate-smart loans
4. **Language Switcher** - Try English, Luganda, or Runyankole

### For FSPs:
1. **Portfolio Overview** - UGX 2.84B in active loans
2. **Loan Applications** - Review pending farmer applications
3. **Risk Distribution** - See borrower risk categories
4. **Performance Metrics** - 94% repayment rate tracking

### For Admins:
1. **Impact Dashboard** - Platform-wide metrics
2. **Financial Inclusion** - 33% credit access (up from 11%)
3. **Climate Resilience** - 52% adoption of climate-smart practices
4. **Growth Trends** - Visual charts of platform growth

## 🌍 Language Support

Switch languages from the top navigation:
- 🇬🇧 **English**
- 🇺🇬 **Luganda** (Tukusanyukidde!)
- 🇺🇬 **Runyankole** (Tukusiimye!)

## 📊 API Testing

The API is available at `http://localhost:5000/api`

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get Credit Score
```bash
curl -X POST http://localhost:5000/api/credit/score \
  -H "Content-Type: application/json" \
  -d '{
    "farmerId": "test",
    "location": "Wakiso",
    "landSize": 2.5,
    "crops": ["Coffee", "Maize"],
    "mobileMoneyData": {"transactionFrequency": 8},
    "vslaData": {"repaymentRate": 0.95}
  }'
```

## 🔧 Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill

# Kill process on port 5000
lsof -ti:5000 | xargs kill
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm run install-all
```

### Frontend Not Loading
```bash
# Rebuild the frontend
cd client
npm run build
cd ..
```

## 📚 Next Steps

1. **Read the Documentation**
   - [README.md](README.md) - Full platform overview
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

2. **Customize the Platform**
   - Edit `.env` for your API keys
   - Modify branding in frontend
   - Add real database connection
   - Integrate actual USSD gateway

3. **Deploy to Production**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up SSL certificates
   - Configure production database
   - Enable monitoring

## 💡 Pro Tips

1. **USSD Testing**: Use Africa's Talking sandbox for free USSD testing
2. **Database**: Add MongoDB or PostgreSQL for data persistence
3. **Mobile Money**: Integrate MTN MoMo and Airtel Money APIs
4. **Satellite Data**: Connect to real satellite data providers
5. **Security**: Change default passwords before production!

## 🆘 Getting Help

- **Issues**: Check the README.md troubleshooting section
- **API Questions**: See API_DOCUMENTATION.md
- **Deployment**: Follow DEPLOYMENT.md step-by-step
- **Community**: Join our developer community

## 🎉 Success!

You now have a fully functional AgriRisk Intelligence Platform running locally!

**What's working:**
- ✅ Responsive web platform (mobile + desktop)
- ✅ USSD integration endpoint
- ✅ Credit scoring system (ARIP Score)
- ✅ Multi-language support (English, Luganda, Runyankole)
- ✅ Farmer, FSP, and Admin dashboards
- ✅ Loan application system
- ✅ Climate data integration
- ✅ Portfolio management
- ✅ Analytics and impact metrics

**Start building the future of agricultural finance in Uganda!** 🌾🇺🇬

---

**Need help?** Check the full README.md or open an issue on GitHub.
