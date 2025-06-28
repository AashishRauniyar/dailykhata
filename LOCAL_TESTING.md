# 🧪 Local Testing Guide

This guide will help you set up and test the Financial Tracker application on your local machine.

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js 18+** (recommended: v18.17.0 or later)
- **MySQL 8.0+** server running
- **Git** for version control
- **npm** or **yarn** package manager

## 🚀 Quick Setup & Test

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Database Setup
```bash
# Start MySQL server (if not running)
# Windows: Start MySQL service from Services or XAMPP
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql

# Create database
mysql -u root -p
CREATE DATABASE financial_tracker;
EXIT;
```

### 3. Environment Configuration
```bash
# Configure backend environment
cd backend
cp env.example .env
```

Edit `backend/.env` with your settings:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/financial_tracker"
JWT_SECRET="your-super-secret-jwt-key-for-testing-make-it-long"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

### 4. Initialize Database
```bash
# From backend directory
cd backend
npm run prisma:generate
npm run prisma:push
npm run seed
```

### 5. Start Applications
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend (new terminal)
npm run dev
```

## 🔗 Access URLs

Once both servers are running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## 🔑 Test Credentials

### Cosmetic Business
- **Admin**: `cosmetic_admin` / `cosmetic123`
- **User**: `cosmetic_user` / `cosmetic123`

### Clothing Business
- **Admin**: `clothing_admin` / `clothing123`
- **User**: `clothing_user` / `clothing123`

## 🧪 Testing Scenarios

### 1. Authentication Testing
```bash
# Test login API directly
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cosmetic_admin","password":"cosmetic123"}'

# Expected response: JWT token and user data
```

### 2. Business Separation Testing
1. **Login as Cosmetic Admin**
   - Create some transactions
   - Note the data shown

2. **Logout and Login as Clothing Admin**
   - Verify you cannot see cosmetic transactions
   - Create different transactions

3. **Login as Regular User**
   - Verify limited access (no user management)
   - Can only see own business data

### 3. Transaction CRUD Testing
1. **Create Transaction**
   - Fill out the transaction form
   - Verify automatic calculations
   - Check data persistence

2. **Update Transaction**
   - Edit an existing transaction
   - Verify changes are saved
   - Check business type remains correct

3. **Delete Transaction**
   - Delete a transaction
   - Verify removal from list
   - Check database consistency

### 4. API Endpoints Testing
```bash
# Get health status
curl http://localhost:3001/api/health

# Login and get token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"cosmetic_admin","password":"cosmetic123"}' | \
  jq -r '.token')

# Get user profile
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/auth/profile

# Get transactions
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/transactions

# Create transaction
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-01-15","cashAmount":1000,"onlineReceived":500}' \
  http://localhost:3001/api/transactions
```

## 🔍 Database Testing

### Using Prisma Studio
```bash
cd backend
npm run prisma:studio
```
- Opens at http://localhost:5555
- Browse and edit data visually
- Verify business separation

### Using MySQL CLI
```bash
mysql -u root -p financial_tracker

-- Check users
SELECT id, username, businessType, role, isActive FROM User;

-- Check transactions by business
SELECT u.username, u.businessType, t.date, t.cashAmount 
FROM Transaction t 
JOIN User u ON t.userId = u.id 
ORDER BY u.businessType, t.date;

-- Verify business separation
SELECT businessType, COUNT(*) as transaction_count 
FROM Transaction 
GROUP BY businessType;
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Test connection
mysql -u root -p -e "SELECT 1;"

# Reset database if needed
cd backend
npm run prisma:push --force-reset
npm run seed
```

#### 2. Port Already in Use
```bash
# Check what's using the port
netstat -ano | findstr :3001  # Windows
lsof -i :3001  # macOS/Linux

# Kill the process or use different port
# Edit backend/.env to change PORT=3002
```

#### 3. CORS Issues
- Ensure `FRONTEND_URL` in backend/.env matches your frontend URL
- Check browser console for CORS errors
- Verify both servers are running

#### 4. JWT Token Issues
```bash
# Check token in browser storage
# Open Developer Tools → Application → Local Storage
# Look for 'auth_token' and 'auth_user'

# Clear tokens if needed
localStorage.clear()
```

#### 5. Prisma Client Issues
```bash
cd backend
npm run prisma:generate
npm run prisma:push
```

## 📊 Performance Testing

### Load Testing with curl
```bash
# Test multiple simultaneous logins
for i in {1..10}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"cosmetic_admin","password":"cosmetic123"}' &
done
wait

# Test transaction creation load
TOKEN="your_jwt_token_here"
for i in {1..20}; do
  curl -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"date\":\"2024-01-$(printf %02d $i)\",\"cashAmount\":$((RANDOM % 1000))}" \
    http://localhost:3001/api/transactions &
done
wait
```

## 🧪 Frontend Testing

### Manual UI Testing Checklist
- [ ] Login with all 4 demo accounts
- [ ] Create transactions with different data
- [ ] Test date filtering (today, week, month, year, custom)
- [ ] Test sorting by different columns (date, amount, etc.)
- [ ] Test responsive design (resize browser)
- [ ] Test dark/light mode switching
- [ ] Test export functionality
- [ ] Test import functionality
- [ ] Test form validation (negative numbers, required fields)
- [ ] Test logout functionality
- [ ] Test navigation between pages

### Browser Testing
Test in multiple browsers:
- Chrome/Chromium
- Firefox
- Safari (if on macOS)
- Edge

## 🔧 Development Testing

### Hot Reload Testing
1. **Backend Changes**
   - Edit any file in `backend/src/`
   - Server should restart automatically (nodemon)
   - Test API endpoints still work

2. **Frontend Changes**
   - Edit any file in `src/`
   - Browser should refresh automatically (Vite HMR)
   - Test UI updates immediately

### Build Testing
```bash
# Test production builds
npm run build  # Frontend
cd backend && npm run build  # Backend

# Test production startup
cd backend && npm start
```

## 📝 Test Data Reset

### Quick Reset
```bash
cd backend
npm run prisma:push --force-reset
npm run seed
```

### Custom Test Data
Edit `backend/src/utils/seedDatabase.ts` to add your own test data, then:
```bash
cd backend
npm run seed
```

## 🚀 Next Steps

Once local testing is complete:
1. Run production build tests
2. Test Docker deployment locally
3. Test environment variable configurations
4. Prepare for production deployment

## 📞 Getting Help

If you encounter issues:
1. Check the console logs (both frontend and backend)
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check environment variables are set correctly
5. Review the troubleshooting section above

Happy testing! 🎉 