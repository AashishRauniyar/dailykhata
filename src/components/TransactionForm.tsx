import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { X, Save, AlertCircle, Calendar, DollarSign } from 'lucide-react';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'businessType' | 'userId' | 'user'>) => void;
  editingTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
}) => {
  const [formData, setFormData] = useState<{
    date: string;
    cashAmount: string | number;
    onlineReceived: string | number;
    vendorAmount: string | number;
    expenses: string | number;
    rahulAmount: string | number;
    sagarAmount: string | number;
    usedCash: string | number;
    onlineUsed: string | number;
  }>({
    date: new Date().toISOString().split('T')[0],
    cashAmount: '',
    onlineReceived: '',
    vendorAmount: '',
    expenses: '',
    rahulAmount: '',
    sagarAmount: '',
    usedCash: '',
    onlineUsed: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeSection, setActiveSection] = useState<'income' | 'expenses' | 'withdrawals'>('income');

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
        cashAmount: '',
        onlineReceived: '',
        vendorAmount: '',
        expenses: '',
        rahulAmount: '',
        sagarAmount: '',
        usedCash: '',
        onlineUsed: '',
      });
    }
    setErrors({});
    setActiveSection('income');
  }, [editingTransaction, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    // Check for negative values
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'date' && value !== '' && parseFloat(value as string) < 0) {
        newErrors[key] = 'Value cannot be negative';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Convert empty strings to 0 for submission
      const submissionData = {
        date: formData.date,
        cashAmount: parseFloat(formData.cashAmount as string) || 0,
        onlineReceived: parseFloat(formData.onlineReceived as string) || 0,
        vendorAmount: parseFloat(formData.vendorAmount as string) || 0,
        expenses: parseFloat(formData.expenses as string) || 0,
        rahulAmount: parseFloat(formData.rahulAmount as string) || 0,
        sagarAmount: parseFloat(formData.sagarAmount as string) || 0,
        usedCash: parseFloat(formData.usedCash as string) || 0,
        onlineUsed: parseFloat(formData.onlineUsed as string) || 0,
      };
      onSubmit(submissionData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'date' ? value : value,
    }));
    
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderInputField = (
    field: string,
    label: string,
    value: number | string,
    colorClass: string,
    icon?: React.ReactNode
  ) => (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${colorClass} transition-colors duration-200 flex items-center gap-2`}>
        {icon}
        {label}
      </label>
      <input
        type={field === 'date' ? 'date' : 'number'}
        value={value}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500`}
        placeholder={field === 'date' ? '' : '0.00'}
        step="0.01"
        min="0"
        required={field === 'date'}
      />
      {errors[field] && (
        <div className="text-red-600 dark:text-red-400 flex items-center gap-1 text-sm transition-colors duration-200">
          <AlertCircle size={14} />
          {errors[field]}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  const totalIncome = (parseFloat(formData.cashAmount as string) || 0) + (parseFloat(formData.onlineReceived as string) || 0);
  const totalExpenses = (parseFloat(formData.vendorAmount as string) || 0) + (parseFloat(formData.expenses as string) || 0) + (parseFloat(formData.usedCash as string) || 0) + (parseFloat(formData.onlineUsed as string) || 0);
  const totalWithdrawals = (parseFloat(formData.rahulAmount as string) || 0) + (parseFloat(formData.sagarAmount as string) || 0);
  const netAmount = totalIncome - totalExpenses - totalWithdrawals;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors duration-200 animate-slide-in">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter transaction details below</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Date Section */}
          <div className="mb-8">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              {renderInputField('date', 'Transaction Date', formData.date, 'text-gray-700 dark:text-gray-300', <Calendar size={16} />)}
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
            {[
              { key: 'income', label: 'Income', color: 'text-green-700 dark:text-green-400' },
              { key: 'expenses', label: 'Expenses', color: 'text-red-700 dark:text-red-400' },
              { key: 'withdrawals', label: 'Withdrawals', color: 'text-blue-700 dark:text-blue-400' }
            ].map((section) => (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key as any)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeSection === section.key
                    ? 'bg-white dark:bg-gray-800 shadow-sm ' + section.color
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            
            {/* Income Section */}
            {activeSection === 'income' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Income Sources
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInputField('cashAmount', 'Cash Received (₹)', formData.cashAmount, 'text-green-700 dark:text-green-400')}
                  {renderInputField('onlineReceived', 'Online Received (₹)', formData.onlineReceived, 'text-green-700 dark:text-green-400')}
                </div>
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Total Income: <span className="font-semibold">₹{totalIncome.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Expenses Section */}
            {activeSection === 'expenses' && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Business Expenses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInputField('vendorAmount', 'Vendor Payments (₹)', formData.vendorAmount, 'text-red-700 dark:text-red-400')}
                  {renderInputField('expenses', 'Other Expenses (₹)', formData.expenses, 'text-red-700 dark:text-red-400')}
                  {renderInputField('usedCash', 'Cash Used (₹)', formData.usedCash, 'text-red-700 dark:text-red-400')}
                  {renderInputField('onlineUsed', 'Online Payments (₹)', formData.onlineUsed, 'text-red-700 dark:text-red-400')}
                </div>
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <div className="text-sm text-red-700 dark:text-red-300">
                    Total Expenses: <span className="font-semibold">₹{totalExpenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Withdrawals Section */}
            {activeSection === 'withdrawals' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                  <DollarSign size={20} />
                  Partner Withdrawals
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderInputField('rahulAmount', 'Rahul Withdrawal (₹)', formData.rahulAmount, 'text-blue-700 dark:text-blue-400')}
                  {renderInputField('sagarAmount', 'Sagar Withdrawal (₹)', formData.sagarAmount, 'text-blue-700 dark:text-blue-400')}
                </div>
                <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    Total Withdrawals: <span className="font-semibold">₹{totalWithdrawals.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex justify-between items-center">
              <span className="text-purple-700 dark:text-purple-300 font-medium">Net Amount:</span>
              <span className={`text-lg font-bold ${netAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                ₹{netAmount.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Income (₹{totalIncome.toLocaleString()}) - Expenses (₹{totalExpenses.toLocaleString()}) - Withdrawals (₹{totalWithdrawals.toLocaleString()})
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Save size={18} />
              {editingTransaction ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;