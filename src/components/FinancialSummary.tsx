import React from 'react';
import { FinancialSummary } from '../types';
import { formatCurrency } from '../utils/calculations';
import { TrendingUp, TrendingDown, DollarSign, Users, Calculator } from 'lucide-react';

interface FinancialSummaryProps {
  summary: FinancialSummary;
}

const FinancialSummaryComponent: React.FC<FinancialSummaryProps> = ({ summary }) => {
  const summaryCards = [
    {
      title: 'Total Sales',
      value: summary.totalSales,
      icon: <TrendingUp className="text-green-600 dark:text-green-400" size={24} />,
      bgClass: 'bg-green-50 dark:bg-green-900/30',
      borderClass: 'border-green-200 dark:border-green-800',
      textClass: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Business Expenses',
      value: summary.totalBusinessExpenses,
      icon: <TrendingDown className="text-red-600 dark:text-red-400" size={24} />,
      bgClass: 'bg-red-50 dark:bg-red-900/30',
      borderClass: 'border-red-200 dark:border-red-800',
      textClass: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Net Revenue',
      value: summary.netRevenueBeforeDistribution,
      icon: <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />,
      bgClass: 'bg-blue-50 dark:bg-blue-900/30',
      borderClass: 'border-blue-200 dark:border-blue-800',
      textClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Retained Profit',
      value: summary.retainedProfit,
      icon: <Calculator className="text-purple-600 dark:text-purple-400" size={24} />,
      bgClass: 'bg-purple-50 dark:bg-purple-900/30',
      borderClass: 'border-purple-200 dark:border-purple-800',
      textClass: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2 transition-colors duration-200">
        <Calculator size={24} className="text-purple-600 dark:text-purple-400" />
        Financial Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className={`${card.bgClass} border ${card.borderClass} rounded-lg p-4 transition-colors duration-200 hover:shadow-md animate-fade-in`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">{card.title}</div>
              {card.icon}
            </div>
            <div className={`text-2xl font-bold ${card.textClass} transition-colors duration-200`}>
              {formatCurrency(card.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-600 dark:text-blue-400" size={20} />
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Partner Shares</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Rahul Net Share:</span>
              <span className={`font-semibold ${summary.rahulNetShare >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors duration-200`}>
                {formatCurrency(summary.rahulNetShare)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Sagar Net Share:</span>
              <span className={`font-semibold ${summary.sagarNetShare >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} transition-colors duration-200`}>
                {formatCurrency(summary.sagarNetShare)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-orange-600 dark:text-orange-400" size={20} />
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Withdrawals</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Rahul:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400 transition-colors duration-200">
                {formatCurrency(summary.rahulTotalWithdrawal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Sagar:</span>
              <span className="font-semibold text-orange-600 dark:text-orange-400 transition-colors duration-200">
                {formatCurrency(summary.sagarTotalWithdrawal)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-colors duration-200 hover:shadow-md animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="text-purple-600 dark:text-purple-400" size={20} />
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors duration-200">Performance</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Avg Daily Sales:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-200">
                {formatCurrency(summary.averageDailySales)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">Active Days:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400 transition-colors duration-200">
                {summary.uniqueDays}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummaryComponent;