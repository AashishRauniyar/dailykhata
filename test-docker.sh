#!/bin/bash

# Financial Tracker - Docker Test Script
# This script tests if all Docker services are working correctly

echo "🧪 Testing Financial Tracker Docker Setup"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    print_status "Testing: $test_name"
    
    if eval "$test_command" > /dev/null 2>&1; then
        print_success "$test_name"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$test_name"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Function to test HTTP endpoint
test_http_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="$3"
    
    print_status "Testing: $name"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_status" ]; then
        print_success "$name (HTTP $response)"
        ((TESTS_PASSED++))
        return 0
    else
        print_error "$name (HTTP $response, expected $expected_status)"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "🔍 Starting Docker services test..."
echo ""

# Test 1: Check if Docker is running
run_test "Docker daemon is running" "docker info"

# Test 2: Check if Docker Compose is available
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    print_error "Docker Compose not available"
    exit 1
fi

run_test "Docker Compose is available" "true"

# Test 3: Check if containers are running
print_status "Checking container status..."
containers=("financial-tracker-db" "financial-tracker-backend" "financial-tracker-frontend")

for container in "${containers[@]}"; do
    if docker ps --format "table {{.Names}}" | grep -q "$container"; then
        print_success "Container $container is running"
        ((TESTS_PASSED++))
    else
        print_error "Container $container is not running"
        ((TESTS_FAILED++))
    fi
done

# Test 4: Check container health
print_status "Checking container health..."
for container in "${containers[@]}"; do
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null)
    if [ "$health" = "healthy" ] || [ "$health" = "" ]; then
        if [ "$health" = "" ]; then
            print_warning "Container $container has no health check"
        else
            print_success "Container $container is healthy"
        fi
        ((TESTS_PASSED++))
    else
        print_error "Container $container is unhealthy (status: $health)"
        ((TESTS_FAILED++))
    fi
done

# Wait a moment for services to be ready
sleep 2

# Test 5: Test HTTP endpoints
echo ""
print_status "Testing HTTP endpoints..."

test_http_endpoint "Frontend (React app)" "http://localhost:3000" "200"
test_http_endpoint "Backend API health check" "http://localhost:3001/api/health" "200"

# Test 6: Test database connectivity
print_status "Testing database connectivity..."
if docker exec financial-tracker-db mysqladmin ping -h localhost -u financial_user -pfinancial_password --silent 2>/dev/null; then
    print_success "Database is accessible"
    ((TESTS_PASSED++))
else
    print_error "Database is not accessible"
    ((TESTS_FAILED++))
fi

# Test 7: Test database content
print_status "Testing database setup..."
result=$(docker exec financial-tracker-db mysql -u financial_user -pfinancial_password -e "USE financial_tracker; SHOW TABLES;" 2>/dev/null)
if echo "$result" | grep -q "users\|transactions"; then
    print_success "Database tables exist"
    ((TESTS_PASSED++))
else
    print_error "Database tables missing"
    ((TESTS_FAILED++))
fi

# Test 8: Test API endpoints (more detailed)
echo ""
print_status "Testing API functionality..."

# Test health endpoint response
health_response=$(curl -s "http://localhost:3001/api/health" 2>/dev/null)
if echo "$health_response" | grep -q "OK"; then
    print_success "Health endpoint returns valid response"
    ((TESTS_PASSED++))
else
    print_error "Health endpoint response invalid"
    ((TESTS_FAILED++))
fi

# Test 9: Check logs for errors
print_status "Checking for critical errors in logs..."
error_found=false

for container in "${containers[@]}"; do
    if docker logs "$container" 2>&1 | grep -i "error\|failed\|exception" | grep -v "DeprecationWarning" | grep -q .; then
        print_warning "Errors found in $container logs"
        error_found=true
    fi
done

if [ "$error_found" = false ]; then
    print_success "No critical errors in container logs"
    ((TESTS_PASSED++))
else
    print_error "Critical errors found in logs"
    ((TESTS_FAILED++))
fi

# Test 10: Check resource usage
print_status "Checking resource usage..."
high_memory=false
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}" | tail -n +2 | while read -r line; do
    if echo "$line" | grep -q "GiB"; then
        memory=$(echo "$line" | awk '{print $2}' | cut -d'G' -f1)
        if (( $(echo "$memory > 1.0" | bc -l) )); then
            high_memory=true
        fi
    fi
done

if [ "$high_memory" = false ]; then
    print_success "Memory usage is reasonable"
    ((TESTS_PASSED++))
else
    print_warning "High memory usage detected"
    ((TESTS_PASSED++))  # Not a failure, just a warning
fi

# Summary
echo ""
echo "📊 Test Results Summary"
echo "======================="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    print_success "All tests passed! 🎉"
    echo ""
    echo "✅ Your Financial Tracker Docker setup is working perfectly!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:3001"
    echo "   Health:   http://localhost:3001/api/health"
    echo ""
    echo "🔐 Login with default credentials:"
    echo "   cosmetic_admin / cosmetic123"
    echo "   clothing_admin / clothing123"
    exit 0
else
    print_error "Some tests failed. Please check the issues above."
    echo ""
    echo "🔧 Troubleshooting tips:"
    echo "1. Make sure all containers are running: docker-compose ps"
    echo "2. Check container logs: docker-compose logs"
    echo "3. Try restarting: docker-compose restart"
    echo "4. For a fresh start: docker-compose down -v && ./docker-start.sh"
    exit 1
fi 