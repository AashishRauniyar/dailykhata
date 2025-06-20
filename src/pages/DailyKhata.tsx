import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction, SortConfig } from '../types';
import { formatCurrency, calculateDailySale, exportToCSV } from '../utils/calculations';
import { Calendar, Plus, Download } from 'lucide-react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';

const DailyKhata: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });

  // Sort transactions by sortConfig
  const sortedTransactions = [...transactions].sort((a, b) => {
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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleAddNew = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
    } else {
      addTransaction(transaction);
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    exportToCSV(transactions);
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
    <div className="space-y-4 pb-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600 hidden sm:block" size={24} />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Daily Khata</h1>
              <p className="text-sm text-gray-600">Business transaction records</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {transactions.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                title="Export to CSV"
              >
                <Download size={18} />
                Export CSV
              </button>
            )}
            <button
              onClick={handleAddNew}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus size={18} />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Transaction Table */}
        <TransactionTable
          transactions={sortedTransactions}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddNew={handleAddNew}
        />

        {/* TOTALS Section - Without Slider */}
        <div className="mt-4 sm:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <div className="text-sm sm:text-base font-bold text-gray-800 mb-2">TOTALS</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Cash In</div>
              <div className="text-sm sm:text-base font-semibold text-green-600">{formatCurrency(totals.cashAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Online In</div>
              <div className="text-sm sm:text-base font-semibold text-green-600">{formatCurrency(totals.onlineReceived)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">To Vendor</div>
              <div className="text-sm sm:text-base font-semibold text-red-600">{formatCurrency(totals.vendorAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Expenses</div>
              <div className="text-sm sm:text-base font-semibold text-red-600">{formatCurrency(totals.expenses)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Rahul Exp.</div>
              <div className="text-sm sm:text-base font-semibold text-blue-600">{formatCurrency(totals.rahulAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Sagar Exp.</div>
              <div className="text-sm sm:text-base font-semibold text-blue-600">{formatCurrency(totals.sagarAmount)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Cash Out</div>
              <div className="text-sm sm:text-base font-semibold text-red-600">{formatCurrency(totals.usedCash)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Online Out</div>
              <div className="text-sm sm:text-base font-semibold text-red-600">{formatCurrency(totals.onlineUsed)}</div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-gray-500">Total Sale</div>
              <div className="text-sm sm:text-base font-semibold text-purple-600">{formatCurrency(totals.totalSale)}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-green-600 font-medium">Total Income</div>
            <div className="text-base sm:text-xl font-bold text-green-700">
              {formatCurrency(totals.cashAmount + totals.onlineReceived)}
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-red-600 font-medium">Total Expenses</div>
            <div className="text-base sm:text-xl font-bold text-red-700">
              {formatCurrency(totals.vendorAmount + totals.expenses + totals.usedCash + totals.onlineUsed)}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-blue-600 font-medium">Partner Withdrawals</div>
            <div className="text-base sm:text-xl font-bold text-blue-700">
              {formatCurrency(totals.rahulAmount + totals.sagarAmount)}
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="text-xs sm:text-sm text-purple-600 font-medium">Net Profit</div>
            <div className="text-base sm:text-xl font-bold text-purple-700">
              {formatCurrency(
                (totals.cashAmount + totals.onlineReceived) - 
                (totals.vendorAmount + totals.expenses + totals.usedCash + totals.onlineUsed) - 
                (totals.rahulAmount + totals.sagarAmount)
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