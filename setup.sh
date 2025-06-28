#!/bin/bash

# Financial Tracker Setup Script
echo "🚀 Setting up Financial Tracker Full-Stack Application"
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher) first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating environment configuration..."
    cp backend/env.example backend/.env
    echo "⚠️  Please edit backend/.env with your MySQL credentials before continuing"
    echo "   DATABASE_URL=\"mysql://username:password@localhost:3306/financial_tracker\""
    echo ""
    echo "After editing the .env file, run:"
    echo "   cd backend && npm run prisma:push"
    echo "   npm run dev:fullstack"
else
    echo "✅ Environment file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Ensure MySQL is running"
echo "2. Create a database: CREATE DATABASE financial_tracker;"
echo "3. Edit backend/.env with your database credentials"
echo "4. Run: cd backend && npm run prisma:push"
echo "5. Start the application: npm run dev:fullstack"
echo ""
echo "The application will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend API: http://localhost:3001" 