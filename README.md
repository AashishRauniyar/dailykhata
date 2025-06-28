# Financial Tracker - Complete Business Management System

A comprehensive financial tracking application built with React, Node.js, and MySQL, designed for managing daily business transactions, expenses, and revenue across multiple business types.

## 🚀 Quick Start (One Command Setup)

### Option 1: Local Development with Docker ⭐
**Get everything running locally in under 5 minutes:**

```bash
# Clone the repository
git clone <your-repo-url>
cd project

# Start everything with Docker (recommended)
./docker-start.sh
```

### Option 2: Production Deployment with Coolify 🌐
**Deploy to your VPS with Coolify:**

```bash
# Prepare for deployment
./deploy-to-coolify.sh

# Follow the generated instructions to deploy via Coolify
```

**That's it!** 🎉

---

## 📱 Access Your Application

### Local Development
- 📱 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:3001
- 🗄️ **Database**: Automatically configured and seeded

### Production (with your domain)
- 📱 **Frontend**: https://your-domain.com
- 🔧 **Backend API**: https://your-domain.com/api
- 🔒 **SSL**: Automatically configured

### Default Login Credentials

**Cosmetic Business:**
- Admin: `cosmetic_admin` / `cosmetic123`
- User: `cosmetic_user` / `cosmetic123`

**Clothing Business:**
- Admin: `clothing_admin` / `clothing123`
- User: `clothing_user` / `clothing123`

## ✨ Features

### 💰 Financial Management
- **Daily Transaction Tracking**: Record cash and online transactions
- **Multi-Business Support**: Separate tracking for Cosmetic and Clothing businesses
- **Expense Management**: Track vendor payments, general expenses, and individual expenses
- **Real-time Calculations**: Automatic daily sale calculations and profit tracking

### 📊 Analytics & Reporting
- **Financial Summaries**: Daily, weekly, and monthly overviews
- **Export/Import**: Excel and PDF export functionality
- **Historical Data**: Complete transaction history with search and filtering
- **Visual Reports**: Charts and graphs for business insights

### 🔐 Security & Access Control
- **JWT Authentication**: Secure login system
- **Role-based Access**: Admin and User roles
- **Business Separation**: Users can only access their business data
- **Session Management**: Secure token handling

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching support
- **Real-time Updates**: Live data synchronization
- **Intuitive Interface**: Clean, modern design with easy navigation

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Prisma** ORM for database management
- **JWT** for authentication
- **MySQL** for data persistence

### Infrastructure
- **Docker** for containerization
- **Docker Compose** for orchestration
- **Nginx** for frontend serving
- **Health checks** for service monitoring

## 📋 Deployment Options

### Option 1: Local Docker (Recommended for Development) ⭐
```bash
./docker-start.sh
```

### Option 2: Coolify (Production VPS Deployment) 🌐
```bash
./deploy-to-coolify.sh
# Follow the generated instructions
```

### Option 3: Local Development
```bash
# Install dependencies
npm install
cd backend && npm install

# Setup database (MySQL required)
# See MYSQL_COMPLETE_SETUP.md for database setup

# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
npm run dev
```

### Option 4: Manual Docker
```bash
docker-compose up --build -d
```

## 📖 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get started in minutes
- **[Coolify Deployment Guide](COOLIFY_DEPLOYMENT.md)** - Complete VPS deployment with Coolify
- **[Docker Setup Guide](DOCKER_SETUP.md)** - Complete Docker setup instructions
- **[Local Setup Guide](SETUP.md)** - Local development setup
- **[MySQL Setup Guide](MYSQL_COMPLETE_SETUP.md)** - Database configuration
- **[Local Testing Guide](LOCAL_TESTING.md)** - Testing procedures

## 🎯 Usage Guide

### Adding Transactions
1. Navigate to "Daily Khata" page
2. Click "Quick Add" or use the transaction form
3. Fill in the transaction details:
   - **Cash In**: Money received in cash
   - **Online In**: Money received through online payments
   - **To Vendor**: Payments made to suppliers
   - **Expenses**: General business expenses
   - **Rahul/Sagar Exp**: Individual expense tracking
   - **Cash Out**: Cash used for expenses
   - **Online Out**: Online payments made

### Viewing Reports
1. Go to "Reports" page
2. Select date range and business type
3. View financial summaries and charts
4. Export data as Excel or PDF

### Managing Data
1. Use "History" page to view all transactions
2. Search and filter transactions
3. Edit or delete entries as needed
4. Export/import data for backup

## 🔧 Management Commands

### Local Docker Commands
```bash
# Start everything
./docker-start.sh

# Stop everything
./docker-stop.sh

# Test everything is working
./test-docker.sh

# View logs
docker-compose logs -f

# Complete reset
docker-compose down -v && ./docker-start.sh
```

### Coolify Deployment Commands
```bash
# Prepare for deployment
./deploy-to-coolify.sh

# Check deployment status (in Coolify dashboard)
# Monitor logs and health checks
```

### Development Commands
```bash
# Frontend development
npm run dev

# Backend development
cd backend && npm run dev

# Database operations
cd backend && npm run prisma:studio
cd backend && npm run prisma:migrate
```

## 🔍 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Health Check
- `GET /api/health` - Service health status

## 🚨 Troubleshooting

### Local Development Issues

**Port conflicts:**
```bash
# Check what's using the ports
netstat -tulpn | grep :3000
netstat -tulpn | grep :3001
netstat -tulpn | grep :3306
```

**Database connection issues:**
```bash
# Check database logs
docker-compose logs mysql

# Test connection
docker-compose exec mysql mysql -u financial_user -p
```

**Services not starting:**
```bash
# Check all service status
docker-compose ps

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
```

### Production (Coolify) Issues

**Check deployment logs:**
- Go to Coolify dashboard → Your application → Logs

**Health check endpoints:**
- Frontend: `https://your-domain.com`
- Backend: `https://your-domain.com/api/health`

**Database issues:**
- Check environment variables in Coolify
- Verify storage configuration
- Monitor container logs

### Reset Everything
```bash
# Local reset
docker-compose down -v && ./docker-start.sh

# Production reset (Coolify)
# Redeploy application through Coolify dashboard
```

## 📊 Project Structure

```
project/
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema
│   └── Dockerfile           # Backend container
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── pages/               # Page components
│   ├── utils/               # Frontend utilities
│   └── types/               # TypeScript types
├── docker-compose.yml       # Local development
├── docker-compose.prod.yml  # Production deployment
├── docker-start.sh          # One-command local setup
├── deploy-to-coolify.sh     # Coolify deployment prep
└── COOLIFY_DEPLOYMENT.md    # Deployment guide
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Getting Started

Choose your deployment method:

### 🏠 Local Development
```bash
./docker-start.sh
```

### 🌐 Production Deployment (Coolify)
```bash
./deploy-to-coolify.sh
```

Then open your application in the browser and start managing your business finances!

---

**Need help?** 
- **Local setup**: [Docker Setup Guide](DOCKER_SETUP.md)
- **Production deployment**: [Coolify Deployment Guide](COOLIFY_DEPLOYMENT.md)
- **Quick reference**: [Quick Start Guide](QUICK_START.md) 