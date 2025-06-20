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
  createdAt: Date;
  updatedAt: Date;
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