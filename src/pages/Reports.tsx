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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
            <p className="text-sm text-gray-600">Comprehensive business analytics and insights</p>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-green-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Profit Margin:</span>
              <span className="font-semibold text-green-600">
                {financialSummary.totalSales > 0 
                  ? `${((financialSummary.netRevenueBeforeDistribution / financialSummary.totalSales) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Days Active:</span>
              <span className="font-semibold text-blue-600">{financialSummary.uniqueDays}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Daily Revenue:</span>
              <span className="font-semibold text-purple-600">
                ₹{financialSummary.averageDailySales.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Partnership Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rahul's Balance:</span>
              <span className={`font-semibold ${financialSummary.rahulNetShare >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{financialSummary.rahulNetShare.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sagar's Balance:</span>
              <span className={`font-semibold ${financialSummary.sagarNetShare >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{financialSummary.sagarNetShare.toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Business Retained:</span>
              <span className="font-semibold text-purple-600">
                ₹{financialSummary.retainedProfit.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="text-purple-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-800">Quick Stats</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Transactions:</span>
              <span className="font-semibold text-gray-800">{filteredTransactions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Expense Ratio:</span>
              <span className="font-semibold text-red-600">
                {financialSummary.totalSales > 0 
                  ? `${((financialSummary.totalBusinessExpenses / financialSummary.totalSales) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Partner Withdrawals:</span>
              <span className="font-semibold text-orange-600">
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