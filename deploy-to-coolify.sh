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

# Port configuration
echo ""
echo "🔌 PORT CONFIGURATION:"
echo "======================"
echo ""
echo "Default ports for Financial Tracker:"
echo "  Frontend: 8000"
echo "  Backend:  8001" 
echo "  Database: 3307"
echo ""
print_warning "If you have port conflicts, you can change these in the environment variables."
echo ""

read -p "Do you want to use different ports? (y/N): " -n 1 -r use_different_ports
echo ""

if [[ $use_different_ports =~ ^[Yy]$ ]]; then
    echo ""
    echo "Enter your preferred ports:"
    read -p "Frontend port (default 8000): " frontend_port
    read -p "Backend port (default 8001): " backend_port
    read -p "Database port (default 3307): " db_port
    
    # Use defaults if empty
    FRONTEND_PORT=${frontend_port:-8000}
    BACKEND_PORT=${backend_port:-8001}
    DB_PORT=${db_port:-3307}
    
    print_status "Using custom ports: Frontend=$FRONTEND_PORT, Backend=$BACKEND_PORT, Database=$DB_PORT"
else
    FRONTEND_PORT=8000
    BACKEND_PORT=8001
    DB_PORT=3307
    print_status "Using default ports: Frontend=$FRONTEND_PORT, Backend=$BACKEND_PORT, Database=$DB_PORT"
fi

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

# Ask user about domain preference
echo "🌐 DOMAIN CONFIGURATION:"
echo "========================"
echo ""
echo "Choose your deployment option:"
echo "1) 🆓 IP Address Access (no domain needed)"
echo "2) 🎯 Coolify Auto-Generated Subdomain (free SSL)"
echo "3) 💰 Custom Domain (you own a domain)"
echo ""

read -p "Enter your choice (1-3): " -n 1 -r domain_choice
echo ""
echo ""

case $domain_choice in
    1)
        print_status "Selected: IP Address Access"
        URL_TYPE="IP"
        print_warning "You'll need to replace 'your-vps-ip' with your actual VPS IP address"
        FRONTEND_URL="http://your-vps-ip:$FRONTEND_PORT"
        VITE_API_URL="http://your-vps-ip:$BACKEND_PORT/api"
        ;;
    2)
        print_status "Selected: Coolify Auto-Generated Subdomain"
        URL_TYPE="AUTO_SUBDOMAIN"
        print_warning "Coolify will generate a subdomain like: financial-tracker-abc123.coolify.app"
        FRONTEND_URL="https://your-auto-generated-subdomain.coolify.app"
        VITE_API_URL="https://your-auto-generated-subdomain.coolify.app/api"
        ;;
    3)
        print_status "Selected: Custom Domain"
        URL_TYPE="CUSTOM"
        print_warning "Make sure your domain DNS points to your VPS IP"
        FRONTEND_URL="https://your-domain.com"
        VITE_API_URL="https://your-domain.com/api"
        ;;
    *)
        print_warning "Invalid choice, defaulting to IP Address Access"
        URL_TYPE="IP"
        FRONTEND_URL="http://your-vps-ip:$FRONTEND_PORT"
        VITE_API_URL="http://your-vps-ip:$BACKEND_PORT/api"
        ;;
esac

# Create a secrets file for reference
cat > deployment-secrets.txt << EOF
# Financial Tracker - Generated Production Secrets
# Copy these to your Coolify environment variables

# Security
JWT_SECRET=$JWT_SECRET

# Database
MYSQL_PASSWORD=$DB_PASSWORD
MYSQL_ROOT_PASSWORD=$ROOT_PASSWORD

# Base Configuration
MYSQL_DATABASE=financial_tracker
MYSQL_USER=financial_user
NODE_ENV=production

# Port Configuration
BACKEND_PORT=$BACKEND_PORT
FRONTEND_PORT=$FRONTEND_PORT
DB_PORT=$DB_PORT

# URL Configuration ($URL_TYPE)
FRONTEND_URL=$FRONTEND_URL
VITE_API_URL=$VITE_API_URL
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

case $URL_TYPE in
    "IP")
        echo "4. 🌍 IP Access Setup:"
        echo "   - No domain configuration needed"
        echo "   - Update FRONTEND_URL and VITE_API_URL with your VPS IP"
        echo "   - Ensure ports $FRONTEND_PORT and $BACKEND_PORT are open in firewall"
        echo ""
        echo "   Example environment variables:"
        echo "   FRONTEND_URL=http://123.456.789.10:$FRONTEND_PORT"
        echo "   VITE_API_URL=http://123.456.789.10:$BACKEND_PORT/api"
        echo "   FRONTEND_PORT=$FRONTEND_PORT"
        echo "   BACKEND_PORT=$BACKEND_PORT"
        echo "   DB_PORT=$DB_PORT"
        ;;
    "AUTO_SUBDOMAIN")
        echo "4. 🌍 Auto-Subdomain Setup:"
        echo "   - Go to Domains tab in Coolify"
        echo "   - Click 'Generate Domain' button"
        echo "   - Copy the generated subdomain"
        echo "   - Update FRONTEND_URL and VITE_API_URL with the subdomain"
        echo "   - Enable SSL (automatic with Let's Encrypt)"
        echo ""
        echo "   Example environment variables:"
        echo "   FRONTEND_URL=https://financial-tracker-abc123.coolify.app"
        echo "   VITE_API_URL=https://financial-tracker-abc123.coolify.app/api"
        echo "   FRONTEND_PORT=$FRONTEND_PORT"
        echo "   BACKEND_PORT=$BACKEND_PORT"
        echo "   DB_PORT=$DB_PORT"
        ;;
    "CUSTOM")
        echo "4. 🌍 Custom Domain Setup:"
        echo "   - Point your domain DNS to your VPS IP"
        echo "   - Go to Domains tab in Coolify"
        echo "   - Add Domain: your-domain.com"
        echo "   - Enable SSL (automatic with Let's Encrypt)"
        echo "   - Update FRONTEND_URL and VITE_API_URL with your domain"
        echo ""
        echo "   Example environment variables:"
        echo "   FRONTEND_URL=https://your-domain.com"
        echo "   VITE_API_URL=https://your-domain.com/api"
        echo "   FRONTEND_PORT=$FRONTEND_PORT"
        echo "   BACKEND_PORT=$BACKEND_PORT"
        echo "   DB_PORT=$DB_PORT"
        ;;
esac

echo ""
echo "5. 🗄️  Configure Storage:"
echo "   - Name: mysql-data"
echo "   - Mount Path: /var/lib/mysql"
echo "   - Host Path: /data/financial-tracker/mysql"
echo ""
echo "6. 🚀 Deploy:"
echo "   - Click Deploy button"
echo "   - Monitor logs for completion"
echo ""
echo "📖 For detailed instructions, see: COOLIFY_DEPLOYMENT.md"
echo ""
print_warning "Remember to:"
echo "  - Update environment variables with actual URLs/IPs"
echo "  - Change default user passwords after first login"
echo "  - Delete deployment-secrets.txt after deployment"

case $URL_TYPE in
    "IP")
        echo "  - Open firewall ports $FRONTEND_PORT and $BACKEND_PORT if needed"
        echo "  - Make sure no other apps are using ports $FRONTEND_PORT, $BACKEND_PORT, $DB_PORT"
        ;;
    "AUTO_SUBDOMAIN")
        echo "  - Generate subdomain in Coolify Domains tab"
        echo "  - Update URLs with the generated subdomain"
        ;;
    "CUSTOM")
        echo "  - Configure DNS A record pointing to your VPS IP"
        echo "  - Wait for DNS propagation before deployment"
        ;;
esac

echo ""
print_success "Ready for Coolify deployment! 🎉"

case $URL_TYPE in
    "IP")
        echo ""
        echo "📱 After deployment, access your app at:"
        echo "   http://your-vps-ip:$FRONTEND_PORT"
        ;;
    "AUTO_SUBDOMAIN")
        echo ""
        echo "📱 After deployment, access your app at:"
        echo "   https://your-generated-subdomain.coolify.app"
        ;;
    "CUSTOM")
        echo ""
        echo "📱 After deployment, access your app at:"
        echo "   https://your-domain.com"
        ;;
esac

echo ""
echo "🔌 Port Summary:"
echo "================"
echo "Frontend: $FRONTEND_PORT"
echo "Backend:  $BACKEND_PORT"
echo "Database: $DB_PORT" 