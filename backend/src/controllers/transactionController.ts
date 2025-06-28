import { Request, Response } from 'express';
import prisma from '../config/database';
import { UserRole } from '@prisma/client';

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Build where clause based on user role and business
    const whereClause = user.role === UserRole.ADMIN 
      ? {} // Admin can see all transactions
      : { businessType: user.businessType }; // Regular users only see their business transactions

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            username: true,
            businessType: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
            businessType: true
          }
        }
      }
    });
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user has access to this transaction
    if (user.role !== UserRole.ADMIN && transaction.businessType !== user.businessType) {
      return res.status(403).json({ error: 'Access denied to this transaction' });
    }
    
    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const {
      date,
      cashAmount,
      onlineReceived,
      vendorAmount,
      expenses,
      rahulAmount,
      sagarAmount,
      usedCash,
      onlineUsed
    } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        date,
        cashAmount: parseFloat(cashAmount) || 0,
        onlineReceived: parseFloat(onlineReceived) || 0,
        vendorAmount: parseFloat(vendorAmount) || 0,
        expenses: parseFloat(expenses) || 0,
        rahulAmount: parseFloat(rahulAmount) || 0,
        sagarAmount: parseFloat(sagarAmount) || 0,
        usedCash: parseFloat(usedCash) || 0,
        onlineUsed: parseFloat(onlineUsed) || 0,
        businessType: user.businessType, // Automatically set to user's business
        userId: user.userId
      },
      include: {
        user: {
          select: {
            username: true,
            businessType: true
          }
        }
      }
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // First, check if transaction exists and user has access
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user has access to this transaction
    if (user.role !== UserRole.ADMIN && existingTransaction.businessType !== user.businessType) {
      return res.status(403).json({ error: 'Access denied to this transaction' });
    }

    const {
      date,
      cashAmount,
      onlineReceived,
      vendorAmount,
      expenses,
      rahulAmount,
      sagarAmount,
      usedCash,
      onlineUsed
    } = req.body;

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        date,
        cashAmount: parseFloat(cashAmount) || 0,
        onlineReceived: parseFloat(onlineReceived) || 0,
        vendorAmount: parseFloat(vendorAmount) || 0,
        expenses: parseFloat(expenses) || 0,
        rahulAmount: parseFloat(rahulAmount) || 0,
        sagarAmount: parseFloat(sagarAmount) || 0,
        usedCash: parseFloat(usedCash) || 0,
        onlineUsed: parseFloat(onlineUsed) || 0,
      },
      include: {
        user: {
          select: {
            username: true,
            businessType: true
          }
        }
      }
    });

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

export const deleteTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // First, check if transaction exists and user has access
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Check if user has access to this transaction
    if (user.role !== UserRole.ADMIN && existingTransaction.businessType !== user.businessType) {
      return res.status(403).json({ error: 'Access denied to this transaction' });
    }
    
    await prisma.transaction.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

export const getTransactionsByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    // Build where clause based on user role and business
    const whereClause = {
      date: {
        gte: startDate as string,
        lte: endDate as string
      },
      ...(user.role === UserRole.ADMIN 
        ? {} // Admin can see all transactions
        : { businessType: user.businessType }) // Regular users only see their business transactions
    };

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            username: true,
            businessType: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions by date range:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const getBusinessStats = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Build where clause based on user role and business
    const whereClause = user.role === UserRole.ADMIN 
      ? {} // Admin can see stats for all businesses
      : { businessType: user.businessType }; // Regular users only see their business stats

    const stats = await prisma.transaction.groupBy({
      by: ['businessType'],
      where: whereClause,
      _sum: {
        cashAmount: true,
        onlineReceived: true,
        vendorAmount: true,
        expenses: true,
        rahulAmount: true,
        sagarAmount: true,
        usedCash: true,
        onlineUsed: true
      },
      _count: {
        id: true
      }
    });

    res.json({ stats });
  } catch (error) {
    console.error('Error fetching business stats:', error);
    res.status(500).json({ error: 'Failed to fetch business statistics' });
  }
}; 