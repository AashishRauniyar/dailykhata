# Financial Tracker - Docker Setup Guide

## 🚀 One-Command Setup

Run this single command to set up everything (backend, frontend, database):

```bash
./docker-start.sh
```

That's it! The script will:
- ✅ Set up MySQL database with proper initialization
- ✅ Build and start the backend API with automatic database migration
- ✅ Build and start the frontend React application
- ✅ Create default user accounts for both businesses
- ✅ Configure proper networking between all services

## 📱 Application URLs

After running the setup script, you can access:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health
- **Database**: localhost:3306

## 🔐 Default Login Credentials

### Cosmetic Business
- **Admin**: `cosmetic_admin` / `cosmetic123`
- **User**: `cosmetic_user` / `cosmetic123`

### Clothing Business
- **Admin**: `clothing_admin` / `clothing123`
- **User**: `clothing_user` / `clothing123`

## 🗄️ Database Information

- **Host**: localhost:3306
- **Database**: financial_tracker
- **Username**: financial_user
- **Password**: financial_password
- **Root Password**: rootpassword

## 📋 Useful Commands

### Basic Operations
```bash
# Start everything
./docker-start.sh

# Stop everything
./docker-stop.sh

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Development Commands
```bash
# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up --build -d

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec mysql mysql -u financial_user -p financial_tracker
```

### Reset and Cleanup
```bash
# Complete reset (removes database data)
docker-compose down -v
./docker-start.sh

# Clean up unused Docker resources
docker system prune -f
```

## 🛠️ Manual Setup (Alternative)

If you prefer to run commands manually:

```bash
# 1. Create database initialization directory
mkdir -p docker-init

# 2. Build and start services
docker-compose up --build -d

# 3. Wait for services to be ready
docker-compose ps

# 4. Check health status
curl http://localhost:3001/api/health
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
If you get port conflicts:
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :3306

# Stop conflicting services or change ports in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check database logs
docker-compose logs mysql

# Test database connection
docker-compose exec mysql mysql -u financial_user -p financial_tracker
```

#### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Restart backend service
docker-compose restart backend
```

#### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up --build frontend
```

### Health Checks

Check service health:
```bash
# Overall status
docker-compose ps

# Specific health checks
curl http://localhost:3001/api/health
curl http://localhost:3000

# Database health
docker-compose exec mysql mysqladmin ping -h localhost -u financial_user -p
```

### Performance Issues

If services are slow to start:
- Increase memory allocation for Docker
- Wait longer for database initialization (first run takes more time)
- Check system resources: `docker stats`

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Database Backup
```bash
# Create backup
docker-compose exec mysql mysqldump -u financial_user -p financial_tracker > backup.sql

# Restore backup
docker-compose exec -T mysql mysql -u financial_user -p financial_tracker < backup.sql
```

### Logs Management
```bash
# View recent logs
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f

# Clean up logs
docker-compose down
docker system prune -f
```

## 🌐 Production Deployment

For production deployment, consider:

1. **Environment Variables**: Update sensitive credentials
2. **SSL/HTTPS**: Configure reverse proxy with SSL
3. **Database**: Use managed database service
4. **Monitoring**: Add health monitoring and logging
5. **Backup**: Implement automated backup strategy

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Test individual components: `curl http://localhost:3001/api/health`
4. Try a complete reset: `docker-compose down -v && ./docker-start.sh`

## 🎯 What's Included

### Backend (Node.js + Express + Prisma)
- RESTful API for financial transactions
- JWT authentication
- MySQL database integration
- Automatic database migration and seeding
- Health check endpoints

### Frontend (React + TypeScript + Vite)
- Modern React application with TypeScript
- Responsive design with Tailwind CSS
- API integration with backend
- Production-optimized build

### Database (MySQL 8.0)
- Persistent data storage
- Automatic initialization
- Health checks
- Default user accounts

### Infrastructure
- Docker containers for each service
- Service health monitoring
- Proper networking configuration
- Volume management for data persistence 