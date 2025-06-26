import React, { useState } from 'react';
import { Transaction, SortConfig } from '../types';
import { formatCurrency, formatDate, getDayName, calculateDailySale } from '../utils/calculations';
import { Edit2, Trash2, ArrowUpDown, Plus, ArrowUp, ArrowDown, Search, Loader2 } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  sortConfig: SortConfig;
  onSort: (field: keyof Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isLoading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onAddNew,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');


  const columns = [
    { field: 'date' as keyof Transaction, label: 'Date', width: 'min-w-[90px] w-[10%]' },
    { field: 'cashAmount' as keyof Transaction, label: 'Cash In', width: 'min-w-[80px] w-[9%]' },
    { field: 'onlineReceived' as keyof Transaction, label: 'Online In', width: 'min-w-[80px] w-[9%]' },
    { field: 'vendorAmount' as keyof Transaction, label: 'To Vendor', width: 'min-w-[80px] w-[9%]' },
    { field: 'expenses' as keyof Transaction, label: 'Expenses', width: 'min-w-[80px] w-[9%]' },
    { field: 'rahulAmount' as keyof Transaction, label: 'Rahul Exp.', width: 'min-w-[80px] w-[9%]' },
    { field: 'sagarAmount' as keyof Transaction, label: 'Sagar Exp.', width: 'min-w-[80px] w-[9%]' },
    { field: 'usedCash' as keyof Transaction, label: 'Cash Out', width: 'min-w-[80px] w-[9%]' },
    { field: 'onlineUsed' as keyof Transaction, label: 'Online Out', width: 'min-w-[80px] w-[9%]' },
  ];



  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const date = formatDate(transaction.date);
    const day = getDayName(transaction.date);
    
    return (
      date.toLowerCase().includes(searchLower) ||
      day.toLowerCase().includes(searchLower) ||
      transaction.cashAmount.toString().includes(searchTerm) ||
      transaction.onlineReceived.toString().includes(searchTerm) ||
      transaction.vendorAmount.toString().includes(searchTerm) ||
      transaction.expenses.toString().includes(searchTerm) ||
      transaction.rahulAmount.toString().includes(searchTerm) ||
      transaction.sagarAmount.toString().includes(searchTerm) ||
      transaction.usedCash.toString().includes(searchTerm) ||
      transaction.onlineUsed.toString().includes(searchTerm) ||
      calculateDailySale(transaction).toString().includes(searchTerm)
    );
  });

  const calculateTotals = () => {
    return filteredTransactions.reduce(
      (totals, transaction) => ({
        cashAmount: totals.cashAmount + transaction.cashAmount,
        onlineReceived: totals.onlineReceived + transaction.onlineReceived,
        vendorAmount: totals.vendorAmount + transaction.vendorAmount,
        expenses: totals.expenses + transaction.expenses,
        rahulAmount: totals.rahulAmount + transaction.rahulAmount,
        sagarAmount: totals.sagarAmount + transaction.sagarAmount,
        totalSale: totals.totalSale + calculateDailySale(transaction),
        usedCash: totals.usedCash + transaction.usedCash,
        onlineUsed: totals.onlineUsed + transaction.onlineUsed,
      }),
      {
        cashAmount: 0,
        onlineReceived: 0,
        vendorAmount: 0,
        expenses: 0,
        rahulAmount: 0,
        sagarAmount: 0,
        totalSale: 0,
        usedCash: 0,
        onlineUsed: 0,
      }
    );
  };

  const totals = calculateTotals();

  const SortButton = ({ field, children }: { field: keyof Transaction; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group w-full justify-between"
    >
      <span className="truncate">{children}</span>
      {sortConfig.field === field ? (
        sortConfig.direction === 'asc' ? (
          <ArrowUp 
            size={14} 
            className="text-blue-600 dark:text-blue-400 flex-shrink-0" 
          />
        ) : (
          <ArrowDown 
            size={14} 
            className="text-blue-600 dark:text-blue-400 flex-shrink-0" 
          />
        )
      ) : (
        <ArrowUpDown 
          size={14} 
          className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" 
        />
      )}
    </button>
  );

  // Create a custom sort function for total sale
  const handleTotalSaleSort = () => {
    // Create a virtual field for the total sale
    onSort('cashAmount' as keyof Transaction);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 animate-fade-in">
      <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">Transaction Log</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
              Manage daily financial entries. Click headers to sort.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={16} className="text-gray-400 dark:text-gray-500" />
              </span>
              <input 
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
              />
            </div>
            <button
              onClick={onAddNew}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={18} />
              Quick Add
            </button>
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <tr>
              {columns.map((column) => (
                <th key={column.field} className={`${column.width} px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200`}>
                  <SortButton field={column.field}>
                    {column.label}
                  </SortButton>
                </th>
              ))}
              <th className="min-w-[80px] w-[9%] px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                <button
                  onClick={handleTotalSaleSort}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group w-full justify-between"
                >
                  <span className="truncate">Total Sale</span>
                  <ArrowUpDown 
                    size={14} 
                    className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex-shrink-0" 
                  />
                </button>
              </th>
              <th className="min-w-[70px] w-[9%] px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-200">
            {/* Top Totals Row */}
            <tr className="bg-yellow-50 dark:bg-yellow-900/30 border-b-2 border-yellow-200 dark:border-yellow-800 font-semibold transition-colors duration-200">
              <td className="px-2 sm:px-3 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 transition-colors duration-200">TOTALS</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.cashAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.onlineReceived)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.vendorAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.expenses)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.rahulAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.sagarAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.usedCash)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.onlineUsed)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-blue-600 dark:text-blue-400 font-bold transition-colors duration-200">{formatCurrency(totals.totalSale)}</td>
              <td className="px-2 sm:px-3 py-3"></td>
            </tr>



            {/* Loading State */}
            {isLoading ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 size={36} className="text-blue-500 animate-spin-slow mb-2" />
                    <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">Loading transactions...</p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {/* Empty Search Results */}
                {filteredTransactions.length === 0 && searchTerm && (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center">
                      <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No transactions found matching "{searchTerm}".</p>
                      <button
                        onClick={() => setSearchTerm('')}
                        className="mt-2 text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                      >
                        Clear search
                      </button>
                    </td>
                  </tr>
                )}

                {/* Transaction Rows */}
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 animate-fade-in">
                    <td className="px-2 sm:px-3 py-3">
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">{formatDate(transaction.date)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline transition-colors duration-200">{getDayName(transaction.date)}</span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(transaction.cashAmount)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(transaction.onlineReceived)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.vendorAmount)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.expenses)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.rahulAmount)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.sagarAmount)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.usedCash)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(transaction.onlineUsed)}</td>
                    <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-200">
                      {formatCurrency(calculateDailySale(transaction))}
                    </td>
                    <td className="px-2 sm:px-3 py-3">
                      <div className="flex gap-1 sm:gap-2 justify-center">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}

            {/* Bottom Totals Row */}
            {filteredTransactions.length > 0 && (
              <tr className="bg-yellow-50 dark:bg-yellow-900/30 border-t-2 border-yellow-200 dark:border-yellow-800 font-semibold transition-colors duration-200">
                <td className="px-2 sm:px-3 py-3 text-sm font-bold text-gray-800 dark:text-gray-200 transition-colors duration-200">TOTALS</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.cashAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-green-600 dark:text-green-400 transition-colors duration-200">{formatCurrency(totals.onlineReceived)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.vendorAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.expenses)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.rahulAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.sagarAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.usedCash)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600 dark:text-red-400 transition-colors duration-200">{formatCurrency(totals.onlineUsed)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-blue-600 dark:text-blue-400 font-bold transition-colors duration-200">{formatCurrency(totals.totalSale)}</td>
                <td className="px-2 sm:px-3 py-3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredTransactions.length === 0 && !searchTerm && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 transition-colors duration-200">No transactions found for the selected period.</p>
          <button
            onClick={onAddNew}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Add Your First Transaction
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;