#!/bin/bash

# Financial Tracker - Complete Docker Setup Script
# This script will set up everything with one command

echo "🚀 Financial Tracker - Complete Docker Setup"
echo "============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed and running
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info &> /dev/null; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Use docker-compose or docker compose based on availability
DOCKER_COMPOSE="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
fi

print_status "Using: $DOCKER_COMPOSE"

# Create docker-init directory if it doesn't exist
mkdir -p docker-init

# Create a basic database initialization script
cat > docker-init/01-init.sql << 'EOF'
-- Financial Tracker Database Initialization
-- This script ensures the database is ready for the application

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS financial_tracker;

-- Use the database
USE financial_tracker;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON financial_tracker.* TO 'financial_user'@'%';
FLUSH PRIVILEGES;

-- Log initialization
SELECT 'Financial Tracker Database Initialized Successfully!' as Status;
EOF

print_success "Created database initialization script"

# Stop and remove existing containers
print_status "Stopping existing containers..."
$DOCKER_COMPOSE down --remove-orphans

# Remove existing volumes (optional - uncomment if you want fresh database)
# print_warning "Removing existing volumes for fresh start..."
# docker volume rm $(docker volume ls -q --filter name=financial-tracker) 2>/dev/null || true

# Build and start all services
print_status "Building and starting all services..."
print_status "This may take a few minutes on first run..."

$DOCKER_COMPOSE up --build -d

# Wait for services to be healthy
print_status "Waiting for services to be ready..."
echo "This may take 1-2 minutes for database initialization and seeding..."

# Function to wait for service health
wait_for_service() {
    local service=$1
    local max_attempts=60
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker inspect --format='{{.State.Health.Status}}' "financial-tracker-$service" 2>/dev/null | grep -q "healthy"; then
            print_success "$service is healthy!"
            return 0
        fi
        
        echo -n "."
        sleep 5
        attempt=$((attempt + 1))
    done
    
    print_error "$service failed to become healthy within timeout"
    return 1
}

# Wait for database
print_status "Waiting for database to be ready..."
wait_for_service "db"

# Wait for backend
print_status "Waiting for backend to be ready..."
wait_for_service "backend"

# Show container status
print_status "Container Status:"
$DOCKER_COMPOSE ps

# Show application URLs and credentials
echo ""
echo "🎉 Financial Tracker is now running!"
echo "====================================="
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   Health Check: http://localhost:3001/api/health"
echo ""
echo "🔐 Default Login Credentials:"
echo "   COSMETIC BUSINESS:"
echo "     Admin: cosmetic_admin / cosmetic123"
echo "     User:  cosmetic_user / cosmetic123"
echo ""
echo "   CLOTHING BUSINESS:"
echo "     Admin: clothing_admin / clothing123"
echo "     User:  clothing_user / clothing123"
echo ""
echo "🗄️  Database Info:"
echo "   Host: localhost:3306"
echo "   Database: financial_tracker"
echo "   User: financial_user"
echo "   Password: financial_password"
echo ""
echo "📋 Useful Commands:"
echo "   View logs: $DOCKER_COMPOSE logs -f"
echo "   Stop all: $DOCKER_COMPOSE down"
echo "   Restart: $DOCKER_COMPOSE restart"
echo "   Fresh start: $DOCKER_COMPOSE down -v && $DOCKER_COMPOSE up -d"
echo ""
print_success "Setup completed successfully!"
echo ""
echo "🌐 Open http://localhost:3000 in your browser to start using the application!" 