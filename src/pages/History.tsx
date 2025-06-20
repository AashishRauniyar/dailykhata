import React, { useState, useMemo } from 'react';
import { useTransactions, useFilteredTransactions } from '../hooks/useTransactions';
import { DateFilter, SortConfig, Transaction } from '../types';
import TransactionTable from '../components/TransactionTable';
import DateFilterComponent from '../components/DateFilter';
import TransactionForm from '../components/TransactionForm';
import { History } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();
  
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    preset: 'this-month',
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'date',
    direction: 'desc',
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const filteredTransactions = useFilteredTransactions(transactions, dateFilter, sortConfig);

  const handleSort = (field: keyof Transaction) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleFormSubmit = (transactionData: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTransaction) {
      setIsLoading(true);
      // Simulate loading for better UX
      setTimeout(() => {
        updateTransaction(editingTransaction.id, transactionData);
        setIsLoading(false);
        setIsFormOpen(false);
        setEditingTransaction(undefined);
      }, 500);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <History className="text-blue-600 dark:text-blue-400 hidden sm:block transition-colors duration-200" size={24} />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Transaction History</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">View and manage all your business transactions</p>
          </div>
        </div>

        <DateFilterComponent
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
        <TransactionTable
          transactions={filteredTransactions}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAddNew={() => {}} // Disabled in history view
          isLoading={isLoading}
        />
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(undefined);
        }}
        onSubmit={handleFormSubmit}
        editingTransaction={editingTransaction}
      />
    </div>
  );
};

export default HistoryPage;