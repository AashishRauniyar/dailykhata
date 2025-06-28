# 🚀 Financial Tracker - Coolify Deployment Guide

Deploy your Financial Tracker application to any VPS using Coolify with this step-by-step guide.

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ **Coolify installed** on your VPS
- ✅ **Domain name** pointed to your VPS (optional but recommended)
- ✅ **Git repository** with your Financial Tracker code
- ✅ **SSH access** to your VPS

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

# URL Configuration (replace with your actual domain)
FRONTEND_URL=https://your-domain.com
VITE_API_URL=https://your-domain.com/api

# Port Configuration
BACKEND_PORT=3001
FRONTEND_PORT=3000
DB_PORT=3306
```

### 4. Configure Domains (Optional)

If you have a custom domain:

1. **Go to Domains tab** in your application
2. **Add Domain**: `your-domain.com`
3. **Enable SSL**: Coolify will automatically handle Let's Encrypt
4. **Add API Subdomain** (optional): `api.your-domain.com`

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

If using custom domains, Coolify automatically configures:
- ✅ SSL certificates via Let's Encrypt
- ✅ Reverse proxy routing
- ✅ Load balancing

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
- **Frontend**: `https://your-domain.com`
- **Backend**: `https://your-domain.com/api/health`
- **Database**: Monitored via Docker health checks

## 🌐 Accessing Your Application

After successful deployment:

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

#### 3. SSL Certificate Issues
```bash
# In Coolify dashboard:
Application → Domains → Regenerate SSL Certificate

# Verify domain DNS records point to your VPS
nslookup your-domain.com
```

#### 4. Application Not Accessible
```bash
# Check container status
docker ps

# Verify port configuration
docker port financial-tracker-frontend

# Check nginx logs
docker logs financial-tracker-frontend
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
- [ ] **SSL**: Verify HTTPS is working
- [ ] **Environment**: All production environment variables set
- [ ] **Backup**: Database backup strategy configured
- [ ] **Monitoring**: Health checks responding
- [ ] **Performance**: Load testing completed
- [ ] **DNS**: Domain properly configured
- [ ] **Firewall**: Unnecessary ports closed

## 🔒 Security Best Practices

1. **Change Default Credentials**: Update all default usernames/passwords
2. **Use Strong JWT Secret**: Minimum 64 characters, randomly generated
3. **Enable SSL**: Always use HTTPS in production
4. **Regular Updates**: Keep containers and dependencies updated
5. **Monitor Logs**: Regular monitoring for security issues
6. **Database Security**: Use strong database passwords
7. **Network Security**: Use Coolify's internal networking

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

**🎉 Congratulations!** Your Financial Tracker is now running on production infrastructure with Coolify!

Need help? Check the logs, verify environment variables, and ensure all containers are healthy. 