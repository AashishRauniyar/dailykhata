import express from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByDateRange,
  getBusinessStats
} from '../controllers/transactionController';
import { authenticateToken, enforceBusinessSeparation } from '../middleware/authMiddleware';

const router = express.Router();

// Apply authentication to all transaction routes
router.use(authenticateToken);
router.use(enforceBusinessSeparation);

// GET /api/transactions - Get all transactions
router.get('/', getAllTransactions);

// GET /api/transactions/date-range - Get transactions by date range
router.get('/date-range', getTransactionsByDateRange);

// GET /api/transactions/:id - Get transaction by ID
router.get('/:id', getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransaction);

// GET /api/transactions/stats - Get business statistics
router.get('/stats', getBusinessStats);

export default router; 