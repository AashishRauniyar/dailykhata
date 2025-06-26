export interface Transaction {
  id: string;
  date: string;
  cashAmount: number;
  onlineReceived: number;
  vendorAmount: number;
  expenses: number;
  rahulAmount: number;
  sagarAmount: number;
  usedCash: number;
  onlineUsed: number;
  businessType: 'COSMETIC' | 'CLOTHING';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    username: string;
    businessType: 'COSMETIC' | 'CLOTHING';
  };
}

export interface FinancialSummary {
  totalSales: number;
  totalBusinessExpenses: number;
  netRevenueBeforeDistribution: number;
  rahulTotalWithdrawal: number;
  sagarTotalWithdrawal: number;
  rahulNetShare: number;
  sagarNetShare: number;
  retainedProfit: number;
  averageDailySales: number;
  uniqueDays: number;
}

export interface DateFilter {
  startDate: string;
  endDate: string;
  preset: 'today' | 'this-week' | 'this-month' | 'this-year' | 'custom';
}

export interface SortConfig {
  field: keyof Transaction;
  direction: 'asc' | 'desc';
}

export interface User {
  id: string;
  username: string;
  businessType: 'COSMETIC' | 'CLOTHING';
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  businessType: 'COSMETIC' | 'CLOTHING';
  role?: 'ADMIN' | 'USER';
}