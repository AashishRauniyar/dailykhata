import { useState, useEffect, useMemo } from 'react';
import { Transaction, DateFilter, SortConfig } from '../types';
import { saveTransactions, loadTransactions, generateId } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadedTransactions = loadTransactions();
    setTransactions(loadedTransactions);
    setIsLoading(false);
  }, []);

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export const useFilteredTransactions = (transactions: Transaction[], dateFilter: DateFilter, sortConfig: SortConfig) => {
  return useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.field];
      let bValue = b[sortConfig.field];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [transactions, dateFilter, sortConfig]);
};