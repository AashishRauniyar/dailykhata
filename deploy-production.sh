#!/bin/bash

echo "🚀 Deploying Financial Tracker to Production"
echo "=============================================="

# Navigate to backend directory
cd backend

# Create production .env file
echo "📝 Creating production environment file..."
cat > .env << EOF
# Database Configuration
DATABASE_URL="mysql://financial_user:GNNB1bJWq6Q/26waGECRGqKEz07UH+VRHJe3okUHpIw=@localhost:3307/financial_tracker"

# Server Configuration
PORT=8001
NODE_ENV=production

# CORS Configuration
FRONTEND_URL=https://www.rahulsagar.online

# JWT Configuration
JWT_SECRET=eo0prKI9/9cH58LSCjMkKpY7yDuM6XAU6tzviuB7TRL2LXuhxL4VT3cXbOuy58ENYAMtRq9Ech0gnecl9hh5bA==
JWT_EXPIRES_IN=7d

# Default User Credentials
COSMETIC_ADMIN_USERNAME=cosmetic_admin
COSMETIC_ADMIN_PASSWORD=cosmetic123
COSMETIC_USER_USERNAME=cosmetic
COSMETIC_USER_PASSWORD=sagarrahul
CLOTHING_ADMIN_USERNAME=clothing_admin
CLOTHING_ADMIN_PASSWORD=clothing123
CLOTHING_USER_USERNAME=kapada
CLOTHING_USER_PASSWORD=sagarrahul
EOF

# Install dependencies
echo "📦 Installing backend dependencies..."
npm ci --production

# Build the application
echo "🔨 Building backend application..."
npm run build

# Initialize database (if needed)
echo "🗄️  Initializing database..."
npm run init

# Start the server
echo "🚀 Starting backend server on port 8001..."
npm start 