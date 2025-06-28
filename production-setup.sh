#!/bin/bash

echo "🚀 Setting up Financial Tracker for Production"
echo "=============================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production
cd backend && npm ci --production && cd ..

# Build applications
echo "🔨 Building applications..."
cd backend && npm run build && cd ..
npm run build

# Setup environment
echo "⚙️  Setting up environment..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "⚠️  Please configure backend/.env with production settings"
fi

echo "✅ Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure backend/.env with production database URL and JWT secret"
echo "2. Set up MySQL database: CREATE DATABASE financial_tracker;"
echo "3. Initialize database: cd backend && npm run init"
echo "4. Start backend: cd backend && npm start"
echo "5. Serve frontend build files with web server (nginx/apache)" 