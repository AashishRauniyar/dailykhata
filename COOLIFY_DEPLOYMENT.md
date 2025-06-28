# 🚀 Financial Tracker - Coolify Deployment Guide

Deploy your Financial Tracker application to any VPS using Coolify with this step-by-step guide.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Coolify installed** on your VPS
- ✅ **Git repository** with your Financial Tracker code
- ✅ **SSH access** to your VPS
- ⚪ **Domain name** (optional - you can use IP or auto-generated subdomain)

## 🚀 Quick Deployment Steps

### 1. Prepare Your Repository

Push your Financial Tracker code to a Git repository (GitHub, GitLab, etc.):

```bash
# If not already done
git add .
git commit -m "Financial Tracker ready for deployment"
git push origin main
```

### 2. Create New Application in Coolify

1. **Access Coolify Dashboard**: http://your-vps-ip:8000
2. **Create New Resource** → **Application**
3. **Choose Source**: Git Repository
4. **Repository URL**: Your git repository URL
5. **Branch**: `main` (or your preferred branch)
6. **Application Name**: `financial-tracker`

### 3. Configure Application Settings

#### Build Settings
- **Build Pack**: `Docker Compose`
- **Docker Compose File**: `docker-compose.prod.yml`
- **Base Directory**: `/` (root)

#### Environment Variables
Set these in Coolify's Environment tab:

```env
# Database Configuration
MYSQL_ROOT_PASSWORD=your-very-secure-root-password
MYSQL_DATABASE=financial_tracker
MYSQL_USER=financial_user
MYSQL_PASSWORD=your-secure-database-password

# Application Configuration  
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-minimum-64-characters-long
JWT_EXPIRES_IN=7d

# Port Configuration
BACKEND_PORT=3001
FRONTEND_PORT=3000
DB_PORT=3306
```

### 4. Choose Your Domain Option

#### Option A: No Custom Domain (IP Address Access) 🆓
**Perfect if you don't want to buy a domain:**

```env
# URL Configuration for IP access
FRONTEND_URL=http://your-vps-ip:3000
VITE_API_URL=http://your-vps-ip:3001/api
```

**Access your app at**: `http://your-vps-ip:3000`

#### Option B: Coolify Auto-Generated Subdomain 🎯
**Coolify can generate a free subdomain for you:**

1. **Go to Domains tab** in your application
2. **Click "Generate Domain"** - Coolify creates something like: `financial-tracker-abc123.coolify.app`
3. **Enable SSL** (automatic with Let's Encrypt)

```env
# URL Configuration for auto subdomain
FRONTEND_URL=https://financial-tracker-abc123.coolify.app
VITE_API_URL=https://financial-tracker-abc123.coolify.app/api
```

**Access your app at**: `https://financial-tracker-abc123.coolify.app`

#### Option C: Custom Domain 💰
**If you have your own domain:**

1. **Go to Domains tab** in your application
2. **Add Domain**: `your-domain.com`
3. **Enable SSL**: Coolify will automatically handle Let's Encrypt

```env
# URL Configuration for custom domain
FRONTEND_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api
```

### 5. Configure Storage (Persistent Database)

1. **Go to Storages tab**
2. **Add Storage**:
   - **Name**: `mysql-data`
   - **Mount Path**: `/var/lib/mysql`
   - **Host Path**: `/data/financial-tracker/mysql`

### 6. Deploy Application

1. **Click Deploy** button
2. **Monitor logs** in the deployment tab
3. **Wait for completion** (first deployment takes 5-10 minutes)

## 🔧 Advanced Configuration

### Reverse Proxy Setup

Coolify automatically configures reverse proxy for all domain options:

- **IP Access**: Direct port access (3000, 3001)
- **Auto Subdomain**: Full reverse proxy with SSL
- **Custom Domain**: Full reverse proxy with SSL

### Database Backup Configuration

Add to environment variables for automated backups:

```env
BACKUP_ENABLED=true
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
```

### Production Security

Ensure these environment variables are set securely:

```bash
# Generate secure JWT secret
openssl rand -base64 64

# Generate secure database passwords
openssl rand -base64 32
```

## 📊 Monitoring and Logs

### View Application Logs
```bash
# In Coolify dashboard
Application → Logs → View Real-time Logs
```

### Monitor Resources
```bash
# CPU, Memory, and Storage usage available in Coolify dashboard
Application → Resources
```

### Health Checks
Your application includes built-in health checks:

**Option A (IP Access):**
- **Frontend**: `http://your-vps-ip:3000`
- **Backend**: `http://your-vps-ip:3001/api/health`

**Option B/C (Domain/Subdomain):**
- **Frontend**: `https://your-domain.com` or `https://your-subdomain.coolify.app`
- **Backend**: `https://your-domain.com/api/health`

## 🌐 Accessing Your Application

### Without Custom Domain (IP Access)
After successful deployment with IP configuration:

- **Main Application**: `http://your-vps-ip:3000`
- **API Endpoints**: `http://your-vps-ip:3001/api`
- **Health Check**: `http://your-vps-ip:3001/api/health`

**Pros**: 
- ✅ Free - no domain cost
- ✅ Immediate access
- ✅ Simple setup

**Cons**: 
- ❌ No SSL (unless you configure manually)
- ❌ Hard to remember IP address
- ❌ Not professional looking

### With Coolify Auto-Subdomain
After successful deployment with auto-subdomain:

- **Main Application**: `https://financial-tracker-abc123.coolify.app`
- **API Endpoints**: `https://financial-tracker-abc123.coolify.app/api`
- **Health Check**: `https://financial-tracker-abc123.coolify.app/api/health`

**Pros**: 
- ✅ Free SSL certificate
- ✅ Professional subdomain
- ✅ Easy to remember
- ✅ Automatic reverse proxy

**Cons**: 
- ⚪ Depends on Coolify's domain service

### With Custom Domain
After successful deployment with custom domain:

- **Main Application**: `https://your-domain.com`
- **API Endpoints**: `https://your-domain.com/api`
- **Health Check**: `https://your-domain.com/api/health`

### Default Login Credentials

**Cosmetic Business:**
- Admin: `cosmetic_admin` / `cosmetic123`
- User: `cosmetic_user` / `cosmetic123`

**Clothing Business:**
- Admin: `clothing_admin` / `clothing123`
- User: `clothing_user` / `clothing123`

> **⚠️ Security Note**: Change default passwords after first login!

## 🔄 Updates and Maintenance

### Deploy Updates
1. **Push code changes** to your repository
2. **Trigger redeploy** in Coolify dashboard
3. **Monitor deployment** logs

### Database Management
```bash
# Access database via Coolify terminal
docker exec -it financial-tracker-db mysql -u financial_user -p

# Create database backup
docker exec financial-tracker-db mysqldump -u financial_user -p financial_tracker > backup.sql
```

### Container Management
```bash
# Restart specific service
docker restart financial-tracker-backend

# View container logs
docker logs financial-tracker-backend -f

# Check container status
docker ps
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check build logs in Coolify
Application → Deployments → View Logs

# Common solutions:
- Verify docker-compose.prod.yml syntax
- Check environment variables
- Ensure git repository is accessible
```

#### 2. Database Connection Issues
```bash
# Verify database environment variables
# Check if database container is running
docker ps | grep mysql

# Test database connection
docker exec financial-tracker-db mysqladmin ping -h localhost -u financial_user -p
```

#### 3. SSL Certificate Issues (Domain/Subdomain only)
```bash
# In Coolify dashboard:
Application → Domains → Regenerate SSL Certificate

# Verify domain DNS records point to your VPS (custom domain only)
nslookup your-domain.com
```

#### 4. Application Not Accessible

**For IP Access:**
```bash
# Check if ports are open
telnet your-vps-ip 3000
telnet your-vps-ip 3001

# Check firewall settings
sudo ufw status
```

**For Domain/Subdomain:**
```bash
# Check container status
docker ps

# Verify reverse proxy configuration
docker logs coolify-proxy
```

### Performance Optimization

#### Resource Limits
Set in Coolify application settings:
```yaml
Memory Limit: 2GB
CPU Limit: 1.0
```

#### Database Optimization
```sql
-- Optimize MySQL for production
SET GLOBAL innodb_buffer_pool_size = 1073741824;  -- 1GB
SET GLOBAL max_connections = 100;
```

## 📊 Production Checklist

Before going live:

- [ ] **Security**: Change all default passwords
- [ ] **SSL**: Verify HTTPS is working (domain/subdomain) or acceptable for IP access
- [ ] **Environment**: All production environment variables set
- [ ] **Backup**: Database backup strategy configured
- [ ] **Monitoring**: Health checks responding
- [ ] **Performance**: Load testing completed
- [ ] **DNS**: Domain properly configured (if using custom domain)
- [ ] **Firewall**: Unnecessary ports closed

## 🔒 Security Best Practices

1. **Change Default Credentials**: Update all default usernames/passwords
2. **Use Strong JWT Secret**: Minimum 64 characters, randomly generated
3. **Enable SSL When Possible**: Use domain/subdomain option for SSL
4. **Regular Updates**: Keep containers and dependencies updated
5. **Monitor Logs**: Regular monitoring for security issues
6. **Database Security**: Use strong database passwords
7. **Network Security**: Use Coolify's internal networking
8. **Firewall Configuration**: Only open necessary ports

## 🆓 Recommended Setup for No Domain

If you don't want to buy a domain, here's the best approach:

### Option 1: Coolify Auto-Subdomain (Recommended) ⭐
```env
# Let Coolify generate: https://financial-tracker-abc123.coolify.app
FRONTEND_URL=https://financial-tracker-abc123.coolify.app
VITE_API_URL=https://financial-tracker-abc123.coolify.app/api
```

**Benefits**: Free SSL, professional look, easy to share

### Option 2: IP Access (Simple)
```env
# Use your VPS IP directly
FRONTEND_URL=http://your-vps-ip:3000
VITE_API_URL=http://your-vps-ip:3001/api
```

**Benefits**: Simple, no dependencies, immediate access

## 📞 Support

### Coolify-Specific Issues
- **Coolify Documentation**: https://coolify.io/docs
- **Coolify Discord**: Community support available

### Application Issues
- **Check Logs**: Application → Logs in Coolify dashboard
- **Health Checks**: Visit `/api/health` endpoint
- **Database**: Use Coolify terminal to access containers

### Quick Diagnostics
```bash
# Run in Coolify terminal
curl http://localhost:3001/api/health
docker-compose ps
docker logs financial-tracker-backend --tail=50
```

---

**🎉 Congratulations!** Your Financial Tracker is now running on production infrastructure with Coolify - no domain purchase required!

Need help? Check the logs, verify environment variables, and ensure all containers are healthy. 