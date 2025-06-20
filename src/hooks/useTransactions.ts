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

  const mergeTransactions = (importedTransactions: Transaction[]) => {
    // Add metadata to imported transactions if missing
    const transactionsWithMetadata = importedTransactions.map(transaction => {
      // If the transaction already has an ID, keep it, otherwise generate a new one
      const id = transaction.id || generateId();
      const now = new Date();
      
      return {
        ...transaction,
        id,
        // If createdAt/updatedAt are missing, add them
        createdAt: transaction.createdAt || now,
        updatedAt: transaction.updatedAt || now,
      };
    });
    
    // Create a map of existing transactions by date for quick lookup
    const existingByDate = new Map<string, Transaction[]>();
    transactions.forEach(transaction => {
      if (!existingByDate.has(transaction.date)) {
        existingByDate.set(transaction.date, []);
      }
      existingByDate.get(transaction.date)?.push(transaction);
    });
    
    // Filter out imported transactions that are exact duplicates
    const filteredImports = transactionsWithMetadata.filter(imported => {
      const existingForDate = existingByDate.get(imported.date) || [];
      
      // Check if there's an exact match for all values (except id, createdAt, updatedAt)
      return !existingForDate.some(existing => 
        existing.cashAmount === imported.cashAmount &&
        existing.onlineReceived === imported.onlineReceived &&
        existing.vendorAmount === imported.vendorAmount &&
        existing.expenses === imported.expenses &&
        existing.rahulAmount === imported.rahulAmount &&
        existing.sagarAmount === imported.sagarAmount &&
        existing.usedCash === imported.usedCash &&
        existing.onlineUsed === imported.onlineUsed
      );
    });
    
    // Combine with existing transactions
    const updatedTransactions = [...transactions, ...filteredImports];
    
    // Sort by date (newest first)
    updatedTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
    
    return filteredImports.length;
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    mergeTransactions,
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