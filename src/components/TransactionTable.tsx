import React from 'react';
import { Transaction, SortConfig } from '../types';
import { formatCurrency, formatDate, getDayName, calculateDailySale } from '../utils/calculations';
import { Edit2, Trash2, ArrowUpDown, Plus, ArrowUp, ArrowDown } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  sortConfig: SortConfig;
  onSort: (field: keyof Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onAddNew,
}) => {
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

  const calculateTotals = () => {
    return transactions.reduce(
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
      className="flex items-center gap-1 hover:text-blue-600 transition-colors group w-full justify-between"
    >
      <span className="truncate">{children}</span>
      {sortConfig.field === field ? (
        sortConfig.direction === 'asc' ? (
          <ArrowUp 
            size={14} 
            className="text-blue-600 flex-shrink-0" 
          />
        ) : (
          <ArrowDown 
            size={14} 
            className="text-blue-600 flex-shrink-0" 
          />
        )
      ) : (
        <ArrowUpDown 
          size={14} 
          className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" 
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transaction Log</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage daily financial entries. Click headers to sort. 
            </p>
          </div>
          <button
            onClick={onAddNew}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Add
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th key={column.field} className={`${column.width} px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                  <SortButton field={column.field}>
                    {column.label}
                  </SortButton>
                </th>
              ))}
              <th className="min-w-[80px] w-[9%] px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <button
                  onClick={handleTotalSaleSort}
                  className="flex items-center gap-1 hover:text-blue-600 transition-colors group w-full justify-between"
                >
                  <span className="truncate">Total Sale</span>
                  <ArrowUpDown 
                    size={14} 
                    className="text-gray-400 group-hover:text-blue-600 flex-shrink-0" 
                  />
                </button>
              </th>
              <th className="min-w-[70px] w-[9%] px-2 sm:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Top Totals Row */}
            <tr className="bg-yellow-50 border-b-2 border-yellow-200 font-semibold">
              <td className="px-2 sm:px-3 py-3 text-sm font-bold">TOTALS</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-green-600">{formatCurrency(totals.cashAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-green-600">{formatCurrency(totals.onlineReceived)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.vendorAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.expenses)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.rahulAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.sagarAmount)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.usedCash)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.onlineUsed)}</td>
              <td className="px-2 sm:px-3 py-3 text-sm text-blue-600 font-bold">{formatCurrency(totals.totalSale)}</td>
              <td className="px-2 sm:px-3 py-3"></td>
            </tr>

            {/* Add New Row */}
            <tr className="bg-green-50 border-b-2 border-green-200">
              <td className="px-2 sm:px-3 py-3">
                <div className="flex flex-col gap-1">
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="text-xs sm:text-sm border border-gray-300 rounded px-1 py-1 w-full"
                  />
                  <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                    {getDayName(new Date().toISOString().split('T')[0])}
                  </span>
                </div>
              </td>
              {Array.from({ length: 8 }, (_, i) => (
                <td key={i} className="px-2 sm:px-3 py-3">
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full text-xs sm:text-sm border border-gray-300 rounded px-1 py-1"
                    min="0"
                  />
                </td>
              ))}
              <td className="px-2 sm:px-3 py-3">
                <span className="text-xs sm:text-sm font-medium">₹0</span>
              </td>
              <td className="px-2 sm:px-3 py-3">
                <button
                  onClick={onAddNew}
                  className="bg-green-600 text-white px-2 py-1 rounded text-xs sm:text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Plus size={14} className="hidden sm:inline" />
                  Add
                </button>
              </td>
            </tr>

            {/* Transaction Rows */}
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-3 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-medium">{formatDate(transaction.date)}</span>
                    <span className="text-xs text-gray-500 hidden sm:inline">{getDayName(transaction.date)}</span>
                  </div>
                </td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-green-600">{formatCurrency(transaction.cashAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-green-600">{formatCurrency(transaction.onlineReceived)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.vendorAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.expenses)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.rahulAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.sagarAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.usedCash)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm text-red-600">{formatCurrency(transaction.onlineUsed)}</td>
                <td className="px-2 sm:px-3 py-3 text-xs sm:text-sm font-medium text-blue-600">
                  {formatCurrency(calculateDailySale(transaction))}
                </td>
                <td className="px-2 sm:px-3 py-3">
                  <div className="flex gap-1 sm:gap-2 justify-center">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {/* Bottom Totals Row */}
            {transactions.length > 0 && (
              <tr className="bg-yellow-50 border-t-2 border-yellow-200 font-semibold">
                <td className="px-2 sm:px-3 py-3 text-sm font-bold">TOTALS</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-green-600">{formatCurrency(totals.cashAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-green-600">{formatCurrency(totals.onlineReceived)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.vendorAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.expenses)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.rahulAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.sagarAmount)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.usedCash)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-red-600">{formatCurrency(totals.onlineUsed)}</td>
                <td className="px-2 sm:px-3 py-3 text-sm text-blue-600 font-bold">{formatCurrency(totals.totalSale)}</td>
                <td className="px-2 sm:px-3 py-3"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No transactions found for the selected period.</p>
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