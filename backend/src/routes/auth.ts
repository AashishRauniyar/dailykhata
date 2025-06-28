import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  login,
  register,
  getProfile,
  getAllUsers,
  updateUserStatus
} from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Rate limiting for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 registration attempts per hour
  message: {
    error: 'Too many registration attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes
router.post('/login', authLimiter, login);
router.post('/register', registerLimiter, register);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.get('/users', authenticateToken, requireAdmin, getAllUsers);
router.patch('/users/:userId/status', authenticateToken, requireAdmin, updateUserStatus);

export default router; 