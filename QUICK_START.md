# 🚀 Financial Tracker - Quick Start

## Choose Your Setup Method

### 🏠 Local Development (Docker)

**Get everything running locally in 5 minutes:**

```bash
./docker-start.sh
```

### 🌐 Production Deployment (Coolify + VPS)

**Deploy to your VPS with Coolify:**

```bash
./deploy-to-coolify.sh
```

---

## 📱 Access Your Application

### Local Development
| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application interface |
| **Backend API** | http://localhost:3001 | API endpoints |
| **Health Check** | http://localhost:3001/api/health | Service status |
| **Database** | localhost:3306 | MySQL database |

### Production (with your domain)
| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://your-domain.com | Main application interface |
| **Backend API** | https://your-domain.com/api | API endpoints |
| **Health Check** | https://your-domain.com/api/health | Service status |
| **SSL** | Automatic | Let's Encrypt via Coolify |

---

## 🔐 Login Credentials

### Cosmetic Business
- **Admin**: `cosmetic_admin` / `cosmetic123`
- **User**: `cosmetic_user` / `cosmetic123`

### Clothing Business  
- **Admin**: `clothing_admin` / `clothing123`
- **User**: `clothing_user` / `clothing123`

> **⚠️ Important**: Change these default passwords after first login in production!

---

## 📋 Quick Commands

### Local Docker Development
```bash
# Start everything
./docker-start.sh

# Stop everything  
./docker-stop.sh

# Test if everything is working
./test-docker.sh

# View logs
docker-compose logs -f

# Complete reset (fresh start)
docker-compose down -v && ./docker-start.sh
```

### Coolify Production Deployment
```bash
# Prepare for deployment (generates secrets, commits changes)
./deploy-to-coolify.sh

# Then in Coolify dashboard:
# 1. Create new application
# 2. Connect git repository
# 3. Set environment variables (from generated secrets)
# 4. Add domain and enable SSL
# 5. Deploy

# Monitor deployment
# View logs in Coolify dashboard
```

---

## 🛠️ What's Included?

### Local Development Setup
- ✅ **3 Docker containers** working together
- ✅ **Automatic database migration** and seeding
- ✅ **Health monitoring** for all services
- ✅ **Hot reload** for development
- ✅ **Complete isolation** from your system

### Production Deployment (Coolify)
- ✅ **Production-optimized** containers
- ✅ **Automatic SSL certificates** (Let's Encrypt)
- ✅ **Domain management** and routing
- ✅ **Database persistence** and backups
- ✅ **Health monitoring** and auto-restart
- ✅ **Environment variable** management
- ✅ **Zero-downtime deployments**

---

## 🚨 Troubleshooting

### Local Development
1. **Check service status**: `docker-compose ps`
2. **View logs**: `docker-compose logs [service-name]`
3. **Test everything**: `./test-docker.sh`
4. **Fresh start**: `docker-compose down -v && ./docker-start.sh`

### Coolify Production
1. **Check deployment logs** in Coolify dashboard
2. **Verify health endpoints**: Visit `/api/health`
3. **Check environment variables** in Coolify settings
4. **Monitor resource usage** in Coolify dashboard

### Common Issues

**Port already in use (local):**
```bash
# Stop conflicting services
docker stop $(docker ps -q)
# Or change ports in docker-compose.yml
```

**Build fails (Coolify):**
- Check git repository access
- Verify docker-compose.prod.yml syntax
- Check environment variables

**Database connection issues:**
- Verify database credentials
- Check if database container is running
- Test connection via health check

---

## 📖 Need More Details?

- **[Coolify Deployment Guide](COOLIFY_DEPLOYMENT.md)** - Complete production deployment
- **[Docker Setup Guide](DOCKER_SETUP.md)** - Detailed local development setup
- **[Full README](README.md)** - Complete project documentation

---

## 🎯 What's Next?

### After Local Setup:
1. **Open**: http://localhost:3000
2. **Login** with default credentials
3. **Start adding** your business transactions
4. **Explore** all features and reports

### After Production Deployment:
1. **Verify** your domain is working with SSL
2. **Login** and **change default passwords**
3. **Add real business data**
4. **Set up backups** and monitoring
5. **Share with your team**

---

**🎉 Happy tracking!** Your Financial Tracker is ready to manage your business finances efficiently! 