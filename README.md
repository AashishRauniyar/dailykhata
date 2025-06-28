# Financial Tracker - Full Stack Application

A comprehensive financial tracking application built with React, TypeScript, Node.js, Express, Prisma, and MySQL.

## 🚀 Features

- **Daily Transaction Tracking**: Record cash amounts, online payments, expenses, and distributions
- **Real-time Calculations**: Automatic financial summaries and profit/loss calculations
- **Date Filtering**: Filter transactions by custom date ranges
- **Data Export/Import**: Export data to Excel/PDF and import from Excel
- **MySQL Database**: Persistent data storage with MySQL
- **API Backend**: RESTful API built with Node.js and Express
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Router
- Axios
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL Database
- CORS support

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd financial-tracker
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Set Up MySQL Database

1. Start your MySQL server
2. Create a new database:

```sql
CREATE DATABASE financial_tracker;
```

3. Create a MySQL user (optional but recommended):

```sql
CREATE USER 'financial_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON financial_tracker.* TO 'financial_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Environment Configuration

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/financial_tracker"

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
```

Replace `username` and `password` with your MySQL credentials.

### 5. Set Up Database Schema

```bash
cd backend

# Generate Prisma client
npm run prisma:generate

# Push the schema to the database
npm run prisma:push

# Or run migrations (if you want migration files)
# npm run prisma:migrate
```

### 6. Start the Application

#### Option 1: Start both frontend and backend together
```bash
# From the root directory
npm run dev:fullstack
```

#### Option 2: Start separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

## 🔧 Development Commands

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands
```bash
cd backend
npm run dev              # Start development server with nodemon
npm run build            # Build TypeScript to JavaScript
npm run start            # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio (database GUI)
```

## 📊 API Endpoints

The backend provides the following REST API endpoints:

- `GET /api/health` - Health check
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/date-range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Get transactions by date range
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🗃️ Database Schema

The application uses a single `transactions` table with the following structure:

```sql
CREATE TABLE transactions (
  id VARCHAR(255) PRIMARY KEY,
  date VARCHAR(255) NOT NULL,
  cashAmount DOUBLE DEFAULT 0,
  onlineReceived DOUBLE DEFAULT 0,
  vendorAmount DOUBLE DEFAULT 0,
  expenses DOUBLE DEFAULT 0,
  rahulAmount DOUBLE DEFAULT 0,
  sagarAmount DOUBLE DEFAULT 0,
  usedCash DOUBLE DEFAULT 0,
  onlineUsed DOUBLE DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/financial_tracker"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables (Optional)

Create a `.env` file in the root directory to customize the API URL:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Production Deployment

### Backend Deployment

1. Build the backend:
```bash
cd backend
npm run build
```

2. Set production environment variables
3. Start the production server:
```bash
npm start
```

### Frontend Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check your DATABASE_URL in the .env file
   - Verify database user permissions

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill the process using the port: `lsof -ti:3001 | xargs kill -9`

3. **CORS Errors**
   - Ensure FRONTEND_URL in backend .env matches your frontend URL
   - Check that both servers are running

4. **Prisma Issues**
   - Run `npm run prisma:generate` after schema changes
   - Run `npm run prisma:push` to sync database schema

### Getting Help

If you encounter any issues:

1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MySQL server is running and accessible

For more help, please open an issue on the repository. 