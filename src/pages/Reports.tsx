import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { calculateFinancialSummary } from '../utils/calculations';
import { DateFilter, Transaction } from '../types';
import FinancialSummary from '../components/FinancialSummary';
import DateFilterComponent from '../components/DateFilter';
import { BarChart3, TrendingUp, Users, Calculator } from 'lucide-react';

const Reports: React.FC = () => {
  const { transactions } = useTransactions();
  
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    preset: 'this-month',
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction: Transaction) => {
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateFilter.startDate);
      const endDate = new Date(dateFilter.endDate);
      
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions, dateFilter]);
  
  const financialSummary = useMemo(() => {
    return calculateFinancialSummary(filteredTransactions);
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-blue-600 dark:text-blue-400 transition-colors duration-200" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Financial Reports</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Comprehensive business analytics and insights</p>
          </div>
        </div>

        <DateFilterComponent
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
        />
      </div>

      <FinancialSummary summary={financialSummary} />

      {/* Additional Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600 dark:text-green-400 transition-colors duration-200" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">Performance Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Profit Margin:</span>
              <span className="font-semibold text-green-600 dark:text-green-400 transition-colors duration-200">
                {financialSummary.totalSales > 0 
                  ? `${((financialSummary.netRevenueBeforeDistribution / financialSummary.totalSales) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Days Active:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-200">{financialSummary.uniqueDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Avg Daily Revenue:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-200">
                ₹{financialSummary.averageDailySales.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-blue-600 dark:text-blue-400 transition-colors duration-200" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">Partnership Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Rahul's Balance:</span>
              <span className={`font-semibold ${financialSummary.rahulNetShare >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors duration-200`}>
                ₹{financialSummary.rahulNetShare.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Sagar's Balance:</span>
              <span className={`font-semibold ${financialSummary.sagarNetShare >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors duration-200`}>
                ₹{financialSummary.sagarNetShare.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Business Retained:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-200">
                ₹{financialSummary.retainedProfit.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="text-purple-600 dark:text-purple-400 transition-colors duration-200" size={24} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Transactions:</span>
              <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">{filteredTransactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Expense Ratio:</span>
              <span className="font-semibold text-red-600 dark:text-red-400 transition-colors duration-200">
                {financialSummary.totalSales > 0 
                  ? `${((financialSummary.totalBusinessExpenses / financialSummary.totalSales) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Partner Withdrawals:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400 transition-colors duration-200">
                ₹{(financialSummary.rahulTotalWithdrawal + financialSummary.sagarTotalWithdrawal).toFixed(0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;