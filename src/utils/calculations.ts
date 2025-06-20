import { Transaction, FinancialSummary } from '../types';

export const calculateDailySale = (transaction: Transaction): number => {
  return transaction.cashAmount + transaction.onlineReceived;
};

export const calculateBusinessExpenses = (transaction: Transaction): number => {
  return transaction.expenses + transaction.vendorAmount + transaction.usedCash + transaction.onlineUsed;
};

export const calculateFinancialSummary = (transactions: Transaction[]): FinancialSummary => {
  const totalSales = transactions.reduce((sum, t) => sum + calculateDailySale(t), 0);
  const totalBusinessExpenses = transactions.reduce((sum, t) => sum + calculateBusinessExpenses(t), 0);
  const netRevenueBeforeDistribution = totalSales - totalBusinessExpenses;
  
  const rahulTotalWithdrawal = transactions.reduce((sum, t) => sum + t.rahulAmount, 0);
  const sagarTotalWithdrawal = transactions.reduce((sum, t) => sum + t.sagarAmount, 0);
  
  const rahulNetShare = (netRevenueBeforeDistribution / 2) - rahulTotalWithdrawal;
  const sagarNetShare = (netRevenueBeforeDistribution / 2) - sagarTotalWithdrawal;
  
  const retainedProfit = netRevenueBeforeDistribution - rahulTotalWithdrawal - sagarTotalWithdrawal;
  
  const uniqueDays = new Set(transactions.map(t => t.date)).size;
  const averageDailySales = uniqueDays > 0 ? totalSales / uniqueDays : 0;

  return {
    totalSales,
    totalBusinessExpenses,
    netRevenueBeforeDistribution,
    rahulTotalWithdrawal,
    sagarTotalWithdrawal,
    rahulNetShare,
    sagarNetShare,
    retainedProfit,
    averageDailySales,
    uniqueDays
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

export const exportToCSV = (transactions: Transaction[]): void => {
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Define CSV headers
  const headers = [
    'Date',
    'Day',
    'Cash In (₹)',
    'Online In (₹)',
    'To Vendor (₹)',
    'Expenses (₹)',
    'Rahul Exp. (₹)',
    'Sagar Exp. (₹)',
    'Cash Out (₹)',
    'Online Out (₹)',
    'Total Sale (₹)'
  ];

  // Convert transactions to CSV rows
  const csvRows = sortedTransactions.map(transaction => {
    const totalSale = calculateDailySale(transaction);
    return [
      formatDate(transaction.date),
      getDayName(transaction.date),
      transaction.cashAmount.toFixed(2),
      transaction.onlineReceived.toFixed(2),
      transaction.vendorAmount.toFixed(2),
      transaction.expenses.toFixed(2),
      transaction.rahulAmount.toFixed(2),
      transaction.sagarAmount.toFixed(2),
      transaction.usedCash.toFixed(2),
      transaction.onlineUsed.toFixed(2),
      totalSale.toFixed(2)
    ];
  });

  // Calculate totals row
  const totals = transactions.reduce(
    (acc, transaction) => {
      acc.cashAmount += transaction.cashAmount;
      acc.onlineReceived += transaction.onlineReceived;
      acc.vendorAmount += transaction.vendorAmount;
      acc.expenses += transaction.expenses;
      acc.rahulAmount += transaction.rahulAmount;
      acc.sagarAmount += transaction.sagarAmount;
      acc.usedCash += transaction.usedCash;
      acc.onlineUsed += transaction.onlineUsed;
      acc.totalSale += calculateDailySale(transaction);
      return acc;
    },
    {
      cashAmount: 0,
      onlineReceived: 0,
      vendorAmount: 0,
      expenses: 0,
      rahulAmount: 0,
      sagarAmount: 0,
      usedCash: 0,
      onlineUsed: 0,
      totalSale: 0
    }
  );

  // Add totals row
  csvRows.push([
    'TOTALS',
    '',
    totals.cashAmount.toFixed(2),
    totals.onlineReceived.toFixed(2),
    totals.vendorAmount.toFixed(2),
    totals.expenses.toFixed(2),
    totals.rahulAmount.toFixed(2),
    totals.sagarAmount.toFixed(2),
    totals.usedCash.toFixed(2),
    totals.onlineUsed.toFixed(2),
    totals.totalSale.toFixed(2)
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows.map(row => row.join(','))
  ].join('\n');

  // Create a Blob and download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set filename with current date
  const today = new Date();
  const filename = `daily_khata_export_${today.toISOString().split('T')[0]}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};