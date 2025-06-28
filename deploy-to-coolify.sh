#!/bin/bash

# Financial Tracker - Coolify Deployment Preparation Script
# This script prepares your project for deployment to Coolify

echo "🚀 Preparing Financial Tracker for Coolify Deployment"
echo "===================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_error "Git repository not initialized. Please run 'git init' first."
    exit 1
fi

print_status "Preparing deployment files..."

# Create production environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating production environment file..."
    cp env.production.example .env
    print_success "Created .env file from template"
    print_warning "Please edit .env file with your production values before deployment!"
else
    print_success ".env file already exists"
fi

# Ensure docker-init directory exists
mkdir -p docker-init

# Check if production docker-compose file exists
if [ ! -f "docker-compose.prod.yml" ]; then
    print_error "docker-compose.prod.yml not found. This file is required for Coolify deployment."
    exit 1
fi

print_success "Production docker-compose file found"

# Check if all required files exist
required_files=(
    "docker-compose.prod.yml"
    "Dockerfile.frontend"
    "backend/Dockerfile"
    "env.production.example"
    "COOLIFY_DEPLOYMENT.md"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -gt 0 ]; then
    print_error "Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "  - $file"
    done
    exit 1
fi

print_success "All required deployment files present"

# Generate secure secrets
print_status "Generating secure secrets for production..."

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 64 2>/dev/null || head -c 64 /dev/urandom | base64)
DB_PASSWORD=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)
ROOT_PASSWORD=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64)

echo ""
print_success "Generated secure secrets. Copy these to your Coolify environment variables:"
echo ""
echo "🔐 ENVIRONMENT VARIABLES FOR COOLIFY:"
echo "====================================="
echo "JWT_SECRET=$JWT_SECRET"
echo "MYSQL_PASSWORD=$DB_PASSWORD"
echo "MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD"
echo ""

# Create a secrets file for reference
cat > deployment-secrets.txt << EOF
# Financial Tracker - Generated Production Secrets
# Copy these to your Coolify environment variables

# Security
JWT_SECRET=$JWT_SECRET

# Database
MYSQL_PASSWORD=$DB_PASSWORD
MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD

# Other required variables (update with your values):
MYSQL_DATABASE=financial_tracker
MYSQL_USER=financial_user
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api
BACKEND_PORT=3001
FRONTEND_PORT=3000
DB_PORT=3306
EOF

print_success "Secrets saved to deployment-secrets.txt"
print_warning "Keep this file secure and delete it after deployment!"

# Check git status
print_status "Checking git repository status..."

if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them before deployment."
    echo ""
    print_status "Uncommitted changes:"
    git status --short
    echo ""
    
    read -p "Do you want to commit all changes now? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "Prepare for Coolify deployment - $(date '+%Y-%m-%d %H:%M:%S')"
        print_success "Changes committed"
    fi
fi

# Get git remote URL
remote_url=$(git remote get-url origin 2>/dev/null || echo "No remote configured")

print_status "Git repository information:"
echo "  Remote URL: $remote_url"
echo "  Current branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
echo "  Latest commit: $(git log -1 --pretty=format:'%h - %s' 2>/dev/null || echo 'No commits')"

echo ""
print_success "Deployment preparation completed!"
echo ""
echo "📋 NEXT STEPS FOR COOLIFY DEPLOYMENT:"
echo "======================================"
echo ""
echo "1. 🌐 Push to Git Repository:"
echo "   git push origin main"
echo ""
echo "2. 🔧 In Coolify Dashboard:"
echo "   - Create new Application"
echo "   - Select 'Git Repository' source"
echo "   - Repository URL: $remote_url"
echo "   - Build Pack: Docker Compose"
echo "   - Docker Compose File: docker-compose.prod.yml"
echo ""
echo "3. 🔑 Set Environment Variables in Coolify:"
echo "   (Copy from deployment-secrets.txt)"
echo ""
echo "4. 🗄️  Configure Storage:"
echo "   - Name: mysql-data"
echo "   - Mount Path: /var/lib/mysql"
echo "   - Host Path: /data/financial-tracker/mysql"
echo ""
echo "5. 🌍 Add Domain (optional):"
echo "   - Add your domain in Domains tab"
echo "   - Enable SSL (automatic with Let's Encrypt)"
echo ""
echo "6. 🚀 Deploy:"
echo "   - Click Deploy button"
echo "   - Monitor logs for completion"
echo ""
echo "📖 For detailed instructions, see: COOLIFY_DEPLOYMENT.md"
echo ""
print_warning "Remember to:"
echo "  - Update .env with your production values"
echo "  - Change default user passwords after first login"
echo "  - Delete deployment-secrets.txt after deployment"
echo ""
print_success "Ready for Coolify deployment! 🎉" 