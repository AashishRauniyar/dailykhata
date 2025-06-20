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
      updateTransaction(editingTransaction.id, transactionData);
    }
    setIsFormOpen(false);
    setEditingTransaction(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <History className="text-blue-600 hidden sm:block" size={24} />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-sm text-gray-600">View and manage all your business transactions</p>
          </div>
        </div>

        <DateFilterComponent
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <TransactionTable
          transactions={filteredTransactions}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAddNew={() => {}} // Disabled in history view
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