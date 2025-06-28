#!/bin/bash

# Financial Tracker - Docker Stop Script
# This script will stop all Docker services gracefully

echo "🛑 Stopping Financial Tracker Services"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Use docker-compose or docker compose based on availability
DOCKER_COMPOSE="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
fi

print_status "Stopping all services..."
$DOCKER_COMPOSE down

print_status "Removing unused networks..."
docker network prune -f

print_success "Financial Tracker services stopped successfully!"
echo ""
echo "To start again, run: ./docker-start.sh"
echo "To completely reset (including database), run: $DOCKER_COMPOSE down -v" 