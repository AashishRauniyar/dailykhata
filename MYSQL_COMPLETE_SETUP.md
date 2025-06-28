# 🗄️ MySQL Complete Setup Guide

This guide covers everything you need to set up MySQL for the Financial Tracker application.

## 📋 MySQL Installation

### Windows
```bash
# Option 1: Download MySQL Installer
# Go to: https://dev.mysql.com/downloads/installer/
# Download MySQL Installer for Windows
# Run installer and select "MySQL Server 8.0"

# Option 2: Using XAMPP (Includes MySQL + phpMyAdmin)
# Download XAMPP from: https://www.apachefriends.org/
# Install and start MySQL service from XAMPP Control Panel

# Option 3: Using Chocolatey
choco install mysql

# Option 4: Using Winget
winget install Oracle.MySQL
```

### macOS
```bash
# Option 1: Using Homebrew (Recommended)
brew install mysql
brew services start mysql

# Option 2: Download from MySQL website
# Go to: https://dev.mysql.com/downloads/mysql/
# Download MySQL Community Server for macOS

# Option 3: Using MacPorts
sudo port install mysql8 +server
```

### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install MySQL Server
sudo apt install mysql-server

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure installation (recommended)
sudo mysql_secure_installation
```

### Linux (CentOS/RHEL/Fedora)
```bash
# CentOS/RHEL 8+
sudo dnf install mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Fedora
sudo dnf install community-mysql-server
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

## 🔧 MySQL Configuration

### 1. Start MySQL Service
```bash
# Windows (if installed as service)
net start mysql

# Windows (XAMPP)
# Start MySQL from XAMPP Control Panel

# macOS
brew services start mysql
# or
sudo /usr/local/mysql/support-files/mysql.server start

# Linux
sudo systemctl start mysql
```

### 2. Secure MySQL Installation (Recommended)
```bash
# Run security script
mysql_secure_installation

# Follow prompts:
# - Set root password
# - Remove anonymous users: Y
# - Disallow root login remotely: Y
# - Remove test database: Y
# - Reload privilege tables: Y
```

### 3. Connect to MySQL
```bash
# Connect as root
mysql -u root -p

# If no password set during installation
mysql -u root
```

## 🏗️ Database Setup for Financial Tracker

### 1. Create Database
```sql
-- Connect to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE financial_tracker;

-- Create dedicated user (recommended for production)
CREATE USER 'financial_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON financial_tracker.* TO 'financial_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify database creation
SHOW DATABASES;

-- Use the database
USE financial_tracker;

-- Exit MySQL
EXIT;
```

### 2. Configuration File (my.cnf)
```ini
# Location varies by OS:
# Windows: C:\ProgramData\MySQL\MySQL Server 8.0\my.ini
# macOS: /usr/local/etc/my.cnf
# Linux: /etc/mysql/my.cnf

[mysqld]
# Basic Settings
port = 3306
socket = /tmp/mysql.sock
datadir = /var/lib/mysql

# Character Set
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# InnoDB Settings
innodb_buffer_pool_size = 128M
innodb_log_file_size = 64M
innodb_file_per_table = 1

# Security
bind-address = 127.0.0.1

[client]
default-character-set = utf8mb4
```

## ⚙️ Application Configuration

### 1. Environment Variables (.env)
```env
# Database Configuration
DATABASE_URL="mysql://financial_user:your_secure_password@localhost:3306/financial_tracker"

# Alternative format for root user
# DATABASE_URL="mysql://root:root_password@localhost:3306/financial_tracker"

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random
JWT_EXPIRES_IN=24h
```

### 2. Initialize Database Schema
```bash
# Navigate to backend directory
cd backend

# Generate Prisma client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push

# Seed database with demo users
npm run seed

# Verify tables were created
mysql -u financial_user -p financial_tracker
SHOW TABLES;
DESCRIBE users;
DESCRIBE transactions;
EXIT;
```

## 🐳 Docker MySQL Setup

### 1. Using Docker Compose (Included)
```bash
# Start MySQL container with the application
docker-compose up mysql

# Or start everything
docker-compose up -d
```

### 2. Standalone Docker MySQL
```bash
# Run MySQL container
docker run --name financial-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=financial_tracker \
  -e MYSQL_USER=financial_user \
  -e MYSQL_PASSWORD=financial_password \
  -p 3306:3306 \
  -d mysql:8.0

# Connect to containerized MySQL
docker exec -it financial-mysql mysql -u financial_user -p
```

## 🔍 MySQL Management Tools

### 1. Command Line Tools
```bash
# MySQL CLI (included with MySQL)
mysql -u username -p database_name

# MySQL Workbench (GUI)
# Download from: https://dev.mysql.com/downloads/workbench/

# mysqldump for backups
mysqldump -u username -p database_name > backup.sql

# Restore from backup
mysql -u username -p database_name < backup.sql
```

### 2. Web-based Tools
```bash
# phpMyAdmin (if using XAMPP)
# Access at: http://localhost/phpmyadmin

# Adminer (lightweight alternative)
# Download from: https://www.adminer.org/
```

### 3. Prisma Studio (Included with project)
```bash
cd backend
npm run prisma:studio
# Opens at: http://localhost:5555
```

## 🧪 Testing MySQL Connection

### 1. Direct MySQL Test
```bash
# Test connection
mysql -u financial_user -p -e "SELECT 1 as test;"

# Test database access
mysql -u financial_user -p financial_tracker -e "SHOW TABLES;"
```

### 2. Application Test
```bash
# Test Prisma connection
cd backend
npx prisma db pull

# Test with Node.js
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$connect().then(() => {
  console.log('✅ Database connected successfully');
  process.exit(0);
}).catch(error => {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
});
"
```

## 🚀 Quick Start Commands

### Complete Setup (Copy & Paste)
```bash
# 1. Install dependencies
npm install
cd backend && npm install && cd ..

# 2. Setup environment
cd backend
cp env.example .env
# Edit .env with your MySQL credentials

# 3. Initialize database (assumes MySQL is running)
npm run prisma:generate
npm run prisma:push
npm run seed

# 4. Start application
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend (new terminal)
cd .. && npm run dev
```

## 🐛 Common MySQL Issues & Solutions

### 1. Access Denied Error
```bash
# Reset root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Connection Refused
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Start MySQL service
sudo systemctl start mysql  # Linux
brew services start mysql  # macOS
```

### 3. Port 3306 Already in Use
```bash
# Find process using port 3306
sudo lsof -i :3306  # macOS/Linux
netstat -ano | findstr :3306  # Windows

# Change MySQL port in my.cnf
[mysqld]
port = 3307

# Update DATABASE_URL accordingly
DATABASE_URL="mysql://user:pass@localhost:3307/financial_tracker"
```

### 4. Character Set Issues
```sql
-- Set proper character set
ALTER DATABASE financial_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Permission Issues
```sql
-- Grant all privileges to user
GRANT ALL PRIVILEGES ON financial_tracker.* TO 'financial_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📊 MySQL Performance Optimization

### 1. Basic Optimizations
```sql
-- Check current settings
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'max_connections';

-- Optimize for development
SET GLOBAL innodb_buffer_pool_size = 134217728; -- 128MB
SET GLOBAL max_connections = 200;
```

### 2. Monitoring
```sql
-- Check running processes
SHOW PROCESSLIST;

-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'financial_tracker'
GROUP BY table_schema;
```

## 🔒 Security Best Practices

### 1. User Management
```sql
-- Create application-specific user
CREATE USER 'financial_app'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON financial_tracker.* TO 'financial_app'@'localhost';

-- Avoid using root for applications
-- Remove unnecessary users
DROP USER 'test'@'localhost';
```

### 2. Network Security
```bash
# Bind to localhost only in my.cnf
[mysqld]
bind-address = 127.0.0.1

# Use SSL for production
[mysqld]
ssl-ca = ca.pem
ssl-cert = server-cert.pem
ssl-key = server-key.pem
```

## 📈 Backup & Restore

### 1. Backup Database
```bash
# Full backup
mysqldump -u financial_user -p financial_tracker > backup_$(date +%Y%m%d).sql

# Structure only
mysqldump -u financial_user -p --no-data financial_tracker > schema.sql

# Data only
mysqldump -u financial_user -p --no-create-info financial_tracker > data.sql
```

### 2. Restore Database
```bash
# Restore from backup
mysql -u financial_user -p financial_tracker < backup_20241201.sql

# Restore to new database
mysql -u financial_user -p -e "CREATE DATABASE financial_tracker_restore;"
mysql -u financial_user -p financial_tracker_restore < backup_20241201.sql
```

## 🎯 Production Considerations

### 1. Configuration
```ini
# Production my.cnf settings
[mysqld]
innodb_buffer_pool_size = 1G  # 70-80% of available RAM
max_connections = 500
innodb_log_file_size = 256M
query_cache_size = 128M
tmp_table_size = 64M
max_heap_table_size = 64M
```

### 2. Monitoring
```bash
# Install MySQL monitoring tools
# - MySQL Enterprise Monitor
# - Percona Monitoring and Management (PMM)
# - Zabbix with MySQL templates
```

## 🆘 Emergency Commands

```bash
# Stop MySQL safely
mysqladmin -u root -p shutdown

# Force stop (if hanging)
sudo pkill mysql  # Linux/macOS
taskkill /F /IM mysqld.exe  # Windows

# Reset MySQL root password
sudo systemctl stop mysql
sudo mysqld_safe --skip-grant-tables &
mysql -u root
UPDATE mysql.user SET authentication_string=PASSWORD('newpassword') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
sudo systemctl start mysql
```

---

## ✅ Final Verification

After setup, verify everything works:

1. ✅ MySQL service is running
2. ✅ Database `financial_tracker` exists
3. ✅ User `financial_user` can connect
4. ✅ Prisma can connect and generate client
5. ✅ Tables are created successfully
6. ✅ Demo data is seeded
7. ✅ Application connects and runs

Your MySQL setup is now complete! 🎉 