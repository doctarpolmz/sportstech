#!/bin/bash

# SportsTech AI Setup Script
# This script automates the initial setup of the SportsTech AI application

set -e

echo "🏆 SportsTech AI - Setup Script"
echo "================================"
echo ""

# Check Node.js version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is installed
echo "🗄️  Checking MongoDB..."
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB is installed"
else
    echo "⚠️  MongoDB not found. Please install MongoDB to continue."
    echo "Visit: https://www.mongodb.com/docs/manual/installation/"
fi
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..
echo "✅ Backend dependencies installed"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "✅ Frontend dependencies installed"
echo ""

# Create upload directories
echo "📁 Creating upload directories..."
mkdir -p backend/uploads/videos
mkdir -p backend/uploads/photos
echo "✅ Upload directories created"
echo ""

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update .env with your configuration"
else
    echo "ℹ️  .env file already exists"
fi
echo ""

# Check for Google credentials
if [ ! -f backend/google-credentials.json ]; then
    echo "⚠️  Google Cloud credentials not found"
    echo "Please download your service account JSON from Google Cloud Console"
    echo "and save it as: backend/google-credentials.json"
else
    echo "✅ Google Cloud credentials found"
fi
echo ""

# Build backend
echo "🔨 Building backend..."
cd backend
npm run build
cd ..
echo "✅ Backend built successfully"
echo ""

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..
echo "✅ Frontend built successfully"
echo ""

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your configuration:"
echo "   - MongoDB connection string"
echo "   - JWT secret"
echo "   - Google Cloud credentials"
echo "   - YouTube API key"
echo "   - Email SMTP settings"
echo ""
echo "2. Add Google Cloud credentials:"
echo "   - Download service account JSON"
echo "   - Save as: backend/google-credentials.json"
echo ""
echo "3. Start MongoDB:"
echo "   sudo systemctl start mongod"
echo ""
echo "4. Start development servers:"
echo "   npm run dev"
echo ""
echo "5. Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - README.md"
echo "   - DEPLOYMENT.md"
echo "   - API.md"
echo ""
echo "🎉 Happy coding!"
