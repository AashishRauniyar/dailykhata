# 🚀 Financial Tracker - Coolify Deployment Guide

Deploy your Financial Tracker application to any VPS using Coolify with this step-by-step guide.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Coolify installed** on your VPS
- ✅ **Git repository** with your Financial Tracker code
- ✅ **SSH access** to your VPS
- ⚪ **Domain name** (optional - you can use IP or auto-generated subdomain)
- ⚪ **Available ports** (default: 8000, 8001, 3307)

## 🔌 Port Configuration

**Default ports (changed to avoid common conflicts):**
- **Frontend**: 8000 (was 3000)
- **Backend**: 8001 (was 3001)  
- **Database**: 3307 (was 3306)

### Checking for Port Conflicts
```bash
# Check if ports are already in use on your VPS
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :8001
sudo netstat -tulpn | grep :3307

# If ports are in use, you can change them in environment variables
```

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

# Port Configuration (changed to avoid conflicts)
BACKEND_PORT=8001
FRONTEND_PORT=8000
DB_PORT=3307
```

### 4. Choose Your Domain Option

#### Option A: No Custom Domain (IP Address Access) 🆓
**Perfect if you don't want to buy a domain:**

```env
# URL Configuration for IP access
FRONTEND_URL=http://your-vps-ip:8000
VITE_API_URL=http://your-vps-ip:8001/api
```

**Access your app at**: `http://your-vps-ip:8000`

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
3. **Enable SSL** (automatic with Let's Encrypt)

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

## 🛠️ Port Conflict Resolution

### If You Have Port Conflicts

**Check what's using your ports:**
```bash
# Check specific ports
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :8001
sudo netstat -tulpn | grep :3307

# See all used ports
sudo netstat -tulpn | grep LISTEN
```

**Use alternative ports:**
```env
# Example: Use ports 9000, 9001, 3308 instead
FRONTEND_PORT=9000
BACKEND_PORT=9001
DB_PORT=3308

# Update URLs accordingly
FRONTEND_URL=http://your-vps-ip:9000
VITE_API_URL=http://your-vps-ip:9001/api
```

### Common Port Alternatives

| Service | Default | Alternative Options |
|---------|---------|-------------------|
| Frontend | 8000 | 9000, 4000, 5000, 7000 |
| Backend | 8001 | 9001, 4001, 5001, 7001 |
| Database | 3307 | 3308, 3309, 5432, 5433 |

## 🔧 Advanced Configuration

### Reverse Proxy Setup

Coolify automatically configures reverse proxy for all domain options:

- **IP Access**: Direct port access (8000, 8001)
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
- **Frontend**: `http://your-vps-ip:8000`
- **Backend**: `http://your-vps-ip:8001/api/health`

**Option B/C (Domain/Subdomain):**
- **Frontend**: `https://your-domain.com` or `https://your-subdomain.coolify.app`
- **Backend**: `https://your-domain.com/api/health`

## 🌐 Accessing Your Application

### Without Custom Domain (IP Access)
After successful deployment with IP configuration:

- **Main Application**: `http://your-vps-ip:8000`
- **API Endpoints**: `http://your-vps-ip:8001/api`
- **Health Check**: `http://your-vps-ip:8001/api/health`

**Pros**: 
- ✅ Free - no domain cost
- ✅ Immediate access
- ✅ Simple setup

**Cons**: 
- ❌ No SSL (unless you configure manually)
- ❌ Hard to remember IP address and port
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
- ✅ No port management needed

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

#### 2. Port Conflict Issues
```bash
# Check if ports are already in use
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :8001

# Solutions:
- Change FRONTEND_PORT and BACKEND_PORT in environment variables
- Stop conflicting services
- Use alternative ports (9000, 9001, etc.)
```

#### 3. Database Connection Issues
```bash
# Verify database environment variables
# Check if database container is running
docker ps | grep mysql

# Test database connection
docker exec financial-tracker-db mysqladmin ping -h localhost -u financial_user -p
```

#### 4. SSL Certificate Issues (Domain/Subdomain only)
```bash
# In Coolify dashboard:
Application → Domains → Regenerate SSL Certificate

# Verify domain DNS records point to your VPS (custom domain only)
nslookup your-domain.com
```

#### 5. Application Not Accessible

**For IP Access:**
```bash
# Check if ports are open
telnet your-vps-ip 8000
telnet your-vps-ip 8001

# Check firewall settings
sudo ufw status

# If ports are blocked, open them:
sudo ufw allow 8000
sudo ufw allow 8001
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
- [ ] **Firewall**: Necessary ports open, unnecessary ports closed
- [ ] **Port Conflicts**: Verified no conflicts with existing applications

## 🔒 Security Best Practices

1. **Change Default Credentials**: Update all default usernames/passwords
2. **Use Strong JWT Secret**: Minimum 64 characters, randomly generated
3. **Enable SSL When Possible**: Use domain/subdomain option for SSL
4. **Regular Updates**: Keep containers and dependencies updated
5. **Monitor Logs**: Regular monitoring for security issues
6. **Database Security**: Use strong database passwords
7. **Network Security**: Use Coolify's internal networking
8. **Firewall Configuration**: Only open necessary ports
9. **Port Management**: Use non-standard ports to avoid conflicts and reduce attack surface

## 🆓 Recommended Setup for No Domain

If you don't want to buy a domain, here's the best approach:

### Option 1: Coolify Auto-Subdomain (Recommended) ⭐
```env
# Let Coolify generate: https://financial-tracker-abc123.coolify.app
FRONTEND_URL=https://financial-tracker-abc123.coolify.app
VITE_API_URL=https://financial-tracker-abc123.coolify.app/api
```

**Benefits**: Free SSL, professional look, easy to share, no port management

### Option 2: IP Access (Simple)
```env
# Use your VPS IP directly with custom ports
FRONTEND_URL=http://your-vps-ip:8000
VITE_API_URL=http://your-vps-ip:8001/api
FRONTEND_PORT=8000
BACKEND_PORT=8001
DB_PORT=3307
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
curl http://localhost:8001/api/health
docker-compose ps
docker logs financial-tracker-backend --tail=50

# Check port usage
sudo netstat -tulpn | grep :8000
sudo netstat -tulpn | grep :8001
```

---

**🎉 Congratulations!** Your Financial Tracker is now running on production infrastructure with Coolify - no domain purchase required and no port conflicts with your existing apps!

Need help? Check the logs, verify environment variables, ensure all containers are healthy, and verify no port conflicts exist. 