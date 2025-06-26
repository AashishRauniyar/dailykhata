import { useState, useEffect, useMemo } from 'react';
import { Transaction, DateFilter, SortConfig } from '../types';
import { transactionAPI } from '../utils/api';
import { loadTransactions } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactionsFromAPI = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await transactionAPI.getAll();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions from API:', err);
      setError('Failed to load transactions from server');
      // Fallback to local storage
      const localTransactions = loadTransactions();
      setTransactions(localTransactions);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactionsFromAPI();
  }, []);

  const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'businessType' | 'userId' | 'user'>) => {
    try {
      setError(null);
      const newTransaction = await transactionAPI.create(transactionData);
      setTransactions(prev => [...prev, newTransaction]);
      return newTransaction;
    } catch (err) {
      console.error('Failed to create transaction:', err);
      setError('Failed to create transaction');
      throw err;
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setError(null);
      const updatedTransaction = await transactionAPI.update(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    } catch (err) {
      console.error('Failed to update transaction:', err);
      setError('Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      await transactionAPI.delete(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Failed to delete transaction');
      throw err;
    }
  };

  const mergeTransactions = async (importedTransactions: Transaction[]) => {
    try {
      setError(null);
      let importedCount = 0;
      
      for (const transaction of importedTransactions) {
        // Check if transaction already exists
        const exists = transactions.some(existing => 
          existing.date === transaction.date &&
          existing.cashAmount === transaction.cashAmount &&
          existing.onlineReceived === transaction.onlineReceived &&
          existing.vendorAmount === transaction.vendorAmount &&
          existing.expenses === transaction.expenses &&
          existing.rahulAmount === transaction.rahulAmount &&
          existing.sagarAmount === transaction.sagarAmount &&
          existing.usedCash === transaction.usedCash &&
          existing.onlineUsed === transaction.onlineUsed
        );
        
        if (!exists) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { id, createdAt, updatedAt, businessType, userId, user, ...transactionData } = transaction;
          await transactionAPI.create(transactionData);
          importedCount++;
        }
      }
      
      // Reload transactions to get the latest data
      await loadTransactionsFromAPI();
      
      return importedCount;
    } catch (err) {
      console.error('Failed to merge transactions:', err);
      setError('Failed to merge transactions');
      throw err;
    }
  };

  const refreshTransactions = () => {
    loadTransactionsFromAPI();
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    mergeTransactions,
    refreshTransactions,
  };
};

export const useFilteredTransactions = (transactions: Transaction[], dateFilter: DateFilter, sortConfig: SortConfig) => {
  return useMemo(() => {
    const filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortConfig.field];
      const bValue = b[sortConfig.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase();
        const bLower = bValue.toLowerCase();
        
        if (aLower < bLower) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aLower > bLower) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }

      return 0;
    });

    return filtered;
  }, [transactions, dateFilter, sortConfig]);
};