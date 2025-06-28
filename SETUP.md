# 🔐 Multi-Business Financial Tracker Setup Guide

This application now supports secure authentication with separate data isolation for **Cosmetic** and **Clothing** businesses.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Set Up MySQL Database

Create a MySQL database:
```sql
CREATE DATABASE financial_tracker;
```

### 3. Configure Environment

Create `backend/.env` file:
```env
DATABASE_URL="mysql://username:password@localhost:3306/financial_tracker"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-in-production-make-it-very-long-and-random
JWT_EXPIRES_IN=7d
```

### 4. Initialize Database

```bash
cd backend
npm run prisma:generate
npm run prisma:push
npm run seed
```

### 5. Start the Application

```bash
# Start both frontend and backend
npm run dev:fullstack
```

## 🔑 Default Login Credentials

The seeding script creates these demo accounts:

### 🧴 **Cosmetic Business**
- **Admin**: `cosmetic_admin` / `cosmetic123`
- **User**: `cosmetic_user` / `cosmetic123`

### 👕 **Clothing Business**
- **Admin**: `clothing_admin` / `clothing123`  
- **User**: `clothing_user` / `clothing123`

## 🏗️ Architecture Overview

### **Business Separation**
- Each user belongs to either COSMETIC or CLOTHING business
- Transactions are automatically filtered by business type
- Users can only see/modify their own business data
- Admins can view all data across businesses

### **User Roles**
- **ADMIN**: Can view all transactions, manage users, access admin features
- **USER**: Can only view/manage transactions for their assigned business

### **Security Features**
- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on auth endpoints
- Automatic token validation
- Business-level data isolation

## 🛡️ Security Considerations

1. **Change JWT Secret**: Replace the JWT_SECRET in production with a strong, random key
2. **Database Security**: Use strong MySQL credentials and restrict database access
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Authentication endpoints have built-in rate limiting

## 📊 Business Data Isolation

### **How It Works**
- Each transaction is automatically tagged with the user's business type
- API endpoints filter data based on the authenticated user's business
- Frontend automatically shows only relevant business data
- Cross-business data access is prevented at the database level

### **Admin Access**
- Admin users can view data across all businesses
- Useful for multi-business owners or accounting purposes
- Maintains audit trail of who created each transaction

## 🔧 Development Commands

```bash
# Backend commands
cd backend
npm run dev                # Start development server
npm run build             # Build for production  
npm run seed              # Create demo users
npm run prisma:studio     # Open database GUI
npm run prisma:generate   # Regenerate Prisma client

# Frontend commands  
npm run dev              # Start frontend development
npm run build            # Build frontend for production
npm run dev:fullstack    # Start both frontend and backend
```

## 🐛 Troubleshooting

### **Login Issues**
- Verify MySQL is running
- Check DATABASE_URL in backend/.env
- Ensure database was seeded: `cd backend && npm run seed`

### **CORS Errors**
- Verify FRONTEND_URL in backend/.env matches your frontend URL
- Ensure both servers are running on correct ports

### **Token Errors**
- Check JWT_SECRET is set in backend/.env
- Clear browser localStorage if switching between environments

### **Business Data Issues**
- Verify user is assigned to correct business type
- Check that transactions are being created with proper business association

## 🔄 Creating New Users

### Via API (Admin Only)
```javascript
POST /api/auth/register
{
  "username": "new_user",
  "password": "secure_password",
  "businessType": "COSMETIC" | "CLOTHING",
  "role": "USER" | "ADMIN"
}
```

### Programmatically
Add users to the seeding script in `backend/src/utils/seedDatabase.ts`

## 📈 Usage Examples

### **Cosmetic Business User**
1. Login with `cosmetic_user` / `cosmetic123`
2. See only cosmetic business transactions
3. Create new transactions automatically tagged as COSMETIC
4. Cannot access clothing business data

### **Admin User**
1. Login with `cosmetic_admin` / `cosmetic123`
2. View transactions from all businesses
3. Access admin features (user management, etc.)
4. Create transactions for their assigned business

## 🎯 Next Steps

Your financial tracker now supports:
- ✅ Secure authentication
- ✅ Multi-business data separation  
- ✅ Role-based access control
- ✅ Business-specific dashboards
- ✅ Data isolation and security

You can now safely run multiple businesses through the same application with complete data separation and security! 