#!/bin/bash

# Financial Tracker Local Testing Script
echo "🧪 Financial Tracker - Local Testing Script"
echo "==========================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
else
    print_error "npm not found"
    exit 1
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    print_status "MySQL client found"
else
    print_warning "MySQL client not found. Make sure MySQL server is running."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
print_info "Installing frontend dependencies..."
npm install --silent

print_info "Installing backend dependencies..."
cd backend
npm install --silent
cd ..

print_status "Dependencies installed"

# Check environment file
echo ""
echo "⚙️  Checking environment configuration..."
if [ -f "backend/.env" ]; then
    print_status "Environment file exists"
else
    print_warning "Environment file not found. Creating from example..."
    cd backend
    cp env.example .env
    cd ..
    print_warning "Please edit backend/.env with your database credentials"
fi

# Test database connection
echo ""
echo "🗄️  Testing database connection..."
cd backend
if npm run prisma:generate > /dev/null 2>&1; then
    print_status "Prisma client generated successfully"
else
    print_error "Failed to generate Prisma client"
    cd ..
    exit 1
fi

# Test builds
echo ""
echo "🔨 Testing builds..."
print_info "Building backend..."
if npm run build > /dev/null 2>&1; then
    print_status "Backend build successful"
else
    print_error "Backend build failed"
    cd ..
    exit 1
fi

cd ..
print_info "Building frontend..."
if npm run build > /dev/null 2>&1; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

# API Health Check Function
test_api_health() {
    local max_attempts=30
    local attempt=1
    
    print_info "Waiting for backend to start..."
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
            print_status "Backend API is responding"
            return 0
        fi
        
        echo -n "."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    print_error "Backend API not responding after $max_attempts seconds"
    return 1
}

# Test authentication
test_auth() {
    print_info "Testing authentication..."
    
    # Test login
    local response=$(curl -s -X POST http://localhost:3001/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{"username":"cosmetic_admin","password":"cosmetic123"}')
    
    if echo "$response" | grep -q "token"; then
        print_status "Authentication test passed"
        
        # Extract token for further tests
        local token=$(echo "$response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        
        # Test protected endpoint
        local profile_response=$(curl -s -H "Authorization: Bearer $token" \
            http://localhost:3001/api/auth/profile)
        
        if echo "$profile_response" | grep -q "cosmetic_admin"; then
            print_status "Protected endpoint test passed"
        else
            print_error "Protected endpoint test failed"
        fi
    else
        print_error "Authentication test failed"
        echo "Response: $response"
    fi
}

# Interactive testing mode
if [ "$1" = "--interactive" ]; then
    echo ""
    echo "🚀 Starting interactive testing mode..."
    echo ""
    
    print_info "Step 1: Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Test API health
    if test_api_health; then
        test_auth
        
        print_info "Step 2: You can now start the frontend in another terminal:"
        print_info "Run: npm run dev"
        print_info ""
        print_info "Access URLs:"
        print_info "• Frontend: http://localhost:5173"
        print_info "• Backend: http://localhost:3001"
        print_info "• Health: http://localhost:3001/api/health"
        print_info ""
        print_info "Demo Credentials:"
        print_info "• Cosmetic Admin: cosmetic_admin / cosmetic123"
        print_info "• Clothing Admin: clothing_admin / clothing123"
        print_info ""
        print_info "Press Ctrl+C to stop the backend server"
        
        # Wait for user interrupt
        wait $BACKEND_PID
    else
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
else
    echo ""
    print_status "All tests passed! ✨"
    echo ""
    print_info "To start testing:"
    print_info "1. Configure backend/.env with your database settings"
    print_info "2. Run: cd backend && npm run init"
    print_info "3. Run: $0 --interactive"
    echo ""
    print_info "Or manually start servers:"
    print_info "• Backend: cd backend && npm run dev"
    print_info "• Frontend: npm run dev"
fi 