import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { BusinessType, UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

interface JWTPayload {
  userId: string;
  username: string;
  businessType: BusinessType;
  role: UserRole;
  iat: number;
  exp: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded as JWTPayload;
    next();
  });
};

// Middleware to check if user is active (optional - can be added to routes that need it)
export const requireActiveUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // In a real application, you might want to check the database here
  // to ensure the user is still active
  next();
};

// Middleware to check admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(403).json({ error: 'Admin privileges required' });
  }

  next();
};

// Middleware to check business access
export const requireBusinessAccess = (businessType: BusinessType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.businessType !== businessType && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ 
        error: `Access denied. This resource is only available to ${businessType.toLowerCase()} business users.` 
      });
    }

    next();
  };
};

// Middleware to ensure user can only access their own business data
export const enforceBusinessSeparation = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Admin can access all business data
  if (req.user.role === UserRole.ADMIN) {
    return next();
  }

  // For non-admin users, they can only access their own business data
  // This will be enforced in the controllers by filtering based on req.user.businessType
  next();
}; 