import { Transaction } from '../types';

const STORAGE_KEY = 'khata-book-transactions';

export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

export const loadTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt),
    }));
  } catch {
    return [];
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};