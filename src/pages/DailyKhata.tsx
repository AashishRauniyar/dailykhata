import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, SortConfig } from '../types';
import { formatCurrency, calculateDailySale } from '../utils/calculations';
import { Calendar, Plus } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import ExportImport from '../components/ExportImport';

const DailyKhata: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, mergeTransactions, error } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  // Sort transactions by sortConfig
  const sortedTransactions = [...transactions].sort((a, b) => {
    const aValue = a[sortConfig.field];
    const bValue = b[sortConfig.field];

    // Handle string values
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

    // Handle numeric values
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }

    // Default comparison for other types
    return 0;
  });

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        setOperationError(null);
        await deleteTransaction(id);
      } catch {
        setOperationError('Failed to delete transaction. Please try again.');
      }
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      setOperationError(null);
      setIsLoading(true);
      
      // Delete transactions sequentially to avoid overwhelming the server
      for (const id of ids) {
        await deleteTransaction(id);
      }
      
      // Show success message
      alert(`Successfully deleted ${ids.length} transactions.`);
    } catch {
      setOperationError('Failed to delete some transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkExport = (selectedTransactions: Transaction[]) => {
    if (selectedTransactions.length === 0) {
      alert('No transactions selected for export.');
      return;
    }

    // Export as CSV for selected transactions
    const headers = [
      'Date',
      'Cash Amount',
      'Online Received',
      'Vendor Amount',
      'Expenses',
      'Rahul Amount',
      'Sagar Amount',
      'Used Cash',
      'Online Used',
      'Daily Sale',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...selectedTransactions.map(transaction => [
        transaction.date,
        transaction.cashAmount,
        transaction.onlineReceived,
        transaction.vendorAmount,
        transaction.expenses,
        transaction.rahulAmount,
        transaction.sagarAmount,
        transaction.usedCash,
        transaction.onlineUsed,
        calculateDailySale(transaction),
        new Date(transaction.createdAt).toISOString(),
        new Date(transaction.updatedAt).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected-transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Successfully exported ${selectedTransactions.length} selected transactions.`);
  };

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'businessType' | 'userId' | 'user'>) => {
    try {
      setOperationError(null);
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transaction);
      } else {
        await addTransaction(transaction);
      }
      setIsModalOpen(false);
    } catch {
      setOperationError('Failed to save transaction. Please try again.');
    }
  };

  const handleImport = async (importedTransactions: Transaction[]) => {
    setIsLoading(true);
    try {
      setOperationError(null);
      const importedCount = await mergeTransactions(importedTransactions);
      alert(`Successfully imported ${importedCount} new transactions.`);
    } catch {
      setOperationError('Failed to import transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof Transaction) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const calculateTotals = () => {
    return transactions.reduce(
      (totals, transaction) => ({
        cashAmount: totals.cashAmount + transaction.cashAmount,
        onlineReceived: totals.onlineReceived + transaction.onlineReceived,
        vendorAmount: totals.vendorAmount + transaction.vendorAmount,
        expenses: totals.expenses + transaction.expenses,
        rahulAmount: totals.rahulAmount + transaction.rahulAmount,
        sagarAmount: totals.sagarAmount + transaction.sagarAmount,
        usedCash: totals.usedCash + transaction.usedCash,
        onlineUsed: totals.onlineUsed + transaction.onlineUsed,
        totalSale: totals.totalSale + calculateDailySale(transaction),
      }),
      {
        cashAmount: 0,
        onlineReceived: 0,
        vendorAmount: 0,
        expenses: 0,
        rahulAmount: 0,
        sagarAmount: 0,
        usedCash: 0,
        onlineUsed: 0,
        totalSale: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4 pb-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600 dark:text-blue-400 hidden sm:block transition-colors duration-200" size={24} />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Daily Khata</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Business transaction records</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={18} />
              New Transaction
            </button>
          </div>
        </div>

        {/* Error Display */}
        {(error || operationError) && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-red-700 dark:text-red-300 text-sm">
              {error || operationError}
            </div>
          </div>
        )}

        {/* Transaction Table */}
        <TransactionTable
          transactions={sortedTransactions}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          onAddNew={handleAddNew}
          isLoading={isLoading}
        />

        {/* TOTALS Section - Without Slider */}
        <div className="mt-4 sm:mt-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4 transition-colors duration-200">
          <div className="text-sm sm:text-base font-bold text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">TOTALS</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Cash In</div>
              <div className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.cashAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Online In</div>
              <div className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.onlineReceived)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">To Vendor</div>
              <div className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.vendorAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Expenses</div>
              <div className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.expenses)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Rahul Exp.</div>
              <div className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-200">{formatCurrency(totals.rahulAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Sagar Exp.</div>
              <div className="text-sm sm:text-base font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-200">{formatCurrency(totals.sagarAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Cash Out</div>
              <div className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.usedCash)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Online Out</div>
              <div className="text-sm sm:text-base font-semibold text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.onlineUsed)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">Total Sale</div>
              <div className="text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-200">{formatCurrency(totals.totalSale)}</div>
            </div>
          </div>
        </div>

        {/* Export/Import Section */}
        <div className="mt-4 sm:mt-6">
          <ExportImport 
            transactions={transactions}
            onImport={handleImport}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 text-center transition-colors duration-200 hover:shadow-md animate-fade-in">
            <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium transition-colors duration-200">Total Sales</div>
            <div className="text-base sm:text-xl font-bold text-green-700 dark:text-green-300 transition-colors duration-200">
              {formatCurrency(totals.totalSale)}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 text-center transition-colors duration-200 hover:shadow-md animate-fade-in">
            <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium transition-colors duration-200">Business Expenses</div>
            <div className="text-base sm:text-xl font-bold text-red-700 dark:text-red-300 transition-colors duration-200">
              {formatCurrency(totals.expenses + totals.usedCash + totals.onlineUsed)}
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3 sm:p-4 text-center transition-colors duration-200 hover:shadow-md animate-fade-in">
            <div className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 font-medium transition-colors duration-200">Vendor Payments</div>
            <div className="text-base sm:text-xl font-bold text-orange-700 dark:text-orange-300 transition-colors duration-200">
              {formatCurrency(totals.vendorAmount)}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4 text-center transition-colors duration-200 hover:shadow-md animate-fade-in">
            <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium transition-colors duration-200">Partner Withdrawals</div>
            <div className="text-base sm:text-xl font-bold text-blue-700 dark:text-blue-300 transition-colors duration-200">
              {formatCurrency(totals.rahulAmount + totals.sagarAmount)}
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 sm:p-4 text-center transition-colors duration-200 hover:shadow-md animate-fade-in">
            <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium transition-colors duration-200">Net Profit</div>
            <div className="text-base sm:text-xl font-bold text-purple-700 dark:text-purple-300 transition-colors duration-200">
              {formatCurrency(
                totals.totalSale - 
                (totals.expenses + totals.usedCash + totals.onlineUsed) - 
                totals.vendorAmount
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default DailyKhata;