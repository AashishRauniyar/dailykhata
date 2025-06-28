import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../config/database';
import { BusinessType, UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, businessType, role = 'USER' } = req.body;

    if (!username || !password || !businessType) {
      return res.status(400).json({ 
        error: 'Username, password, and business type are required' 
      });
    }

    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists' 
      });
    }

    // Validate business type
    if (!Object.values(BusinessType).includes(businessType)) {
      return res.status(400).json({ 
        error: 'Invalid business type. Must be COSMETIC or CLOTHING' 
      });
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be ADMIN or USER' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        businessType: businessType as BusinessType,
        role: role as UserRole
      },
      select: {
        id: true,
        username: true,
        businessType: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });

    res.status(201).json({ 
      message: 'User created successfully', 
      user 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        businessType: true,
        role: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        error: 'Account is deactivated. Please contact administrator.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const payload = { 
      userId: user.id, 
      username: user.username,
      businessType: user.businessType,
      role: user.role
    };
    const options: SignOptions = { expiresIn: '24h' };
    const token = jwt.sign(payload, JWT_SECRET, options);

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request & { user?: any }, res: Response) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  try {
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        businessType: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
};

export const getAllUsers = async (req: Request & { user?: any }, res: Response) => {
  try {
    // Only admins can view all users
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        businessType: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            transactions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

export const updateUserStatus = async (req: Request & { user?: any }, res: Response) => {
  try {
    // Only admins can update user status
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean value' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isActive },
      select: {
        id: true,
        username: true,
        businessType: true,
        role: true,
        isActive: true
      }
    });

    res.json({ 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: updatedUser 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
}; 