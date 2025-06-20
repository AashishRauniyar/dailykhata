import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { X, Save, AlertCircle } from 'lucide-react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    cashAmount: 0,
    onlineReceived: 0,
    vendorAmount: 0,
    expenses: 0,
    rahulAmount: 0,
    sagarAmount: 0,
    usedCash: 0,
    onlineUsed: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: editingTransaction.date,
        cashAmount: editingTransaction.cashAmount,
        onlineReceived: editingTransaction.onlineReceived,
        vendorAmount: editingTransaction.vendorAmount,
        expenses: editingTransaction.expenses,
        rahulAmount: editingTransaction.rahulAmount,
        sagarAmount: editingTransaction.sagarAmount,
        usedCash: editingTransaction.usedCash,
        onlineUsed: editingTransaction.onlineUsed,
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        cashAmount: 0,
        onlineReceived: 0,
        vendorAmount: 0,
        expenses: 0,
        rahulAmount: 0,
        sagarAmount: 0,
        usedCash: 0,
        onlineUsed: 0,
      });
    }
    setErrors({});
  }, [editingTransaction, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    // Check for negative values
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'date' && typeof value === 'number' && value < 0) {
        newErrors[key] = 'Value cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'date' ? value : parseFloat(value) || 0,
    }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transition-colors duration-200 animate-slide-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <label className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                required
              />
              {errors.date && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.date}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-green-700 dark:text-green-400 mb-2 transition-colors duration-200">
                Cash In (₹)
              </label>
              <input
                type="text"
                value={formData.cashAmount}
                onChange={(e) => handleInputChange('cashAmount', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.cashAmount && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.cashAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-green-700 dark:text-green-400 mb-2 transition-colors duration-200">
                Online In (₹)
              </label>
              <input
                type="text"
                value={formData.onlineReceived}
                onChange={(e) => handleInputChange('onlineReceived', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.onlineReceived && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.onlineReceived}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-red-700 dark:text-red-400 mb-2 transition-colors duration-200">
                To Vendor (₹)
              </label>
              <input
                type="text"
                value={formData.vendorAmount}
                onChange={(e) => handleInputChange('vendorAmount', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.vendorAmount && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.vendorAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-red-700 dark:text-red-400 mb-2 transition-colors duration-200">
                Expenses (₹)
              </label>
              <input
                type="text"
                value={formData.expenses}
                onChange={(e) => handleInputChange('expenses', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.expenses && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.expenses}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-blue-700 dark:text-blue-400 mb-2 transition-colors duration-200">
                Rahul Exp. (₹)
              </label>
              <input
                type="text"
                value={formData.rahulAmount}
                onChange={(e) => handleInputChange('rahulAmount', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.rahulAmount && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.rahulAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-blue-700 dark:text-blue-400 mb-2 transition-colors duration-200">
                Sagar Exp. (₹)
              </label>
              <input
                type="text"
                value={formData.sagarAmount}
                onChange={(e) => handleInputChange('sagarAmount', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.sagarAmount && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.sagarAmount}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-red-700 dark:text-red-400 mb-2 transition-colors duration-200">
                Cash Out (₹)
              </label>
              <input
                type="text"
                value={formData.usedCash}
                onChange={(e) => handleInputChange('usedCash', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.usedCash && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.usedCash}
                </div>
              )}
            </div>

            <div>
              <label className="block text-base font-medium text-red-700 dark:text-red-400 mb-2 transition-colors duration-200">
                Online Out (₹)
              </label>
              <input
                type="text"
                value={formData.onlineUsed}
                onChange={(e) => handleInputChange('onlineUsed', e.target.value)}
                className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                placeholder="0.00"
              />
              {errors.onlineUsed && (
                <div className="mt-1 text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
                  <AlertCircle size={14} />
                  {errors.onlineUsed}
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;