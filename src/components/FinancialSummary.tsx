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
      icon: <TrendingUp className="text-green-600" size={24} />,
      color: 'green',
    },
    {
      title: 'Business Expenses',
      value: summary.totalBusinessExpenses,
      icon: <TrendingDown className="text-red-600" size={24} />,
      color: 'red',
    },
    {
      title: 'Net Revenue',
      value: summary.netRevenueBeforeDistribution,
      icon: <DollarSign className="text-blue-600" size={24} />,
      color: 'blue',
    },
    {
      title: 'Retained Profit',
      value: summary.retainedProfit,
      icon: <Calculator className="text-purple-600" size={24} />,
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Calculator size={24} />
        Financial Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className={`bg-${card.color}-50 border border-${card.color}-200 rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-600">{card.title}</div>
              {card.icon}
            </div>
            <div className={`text-2xl font-bold text-${card.color}-600`}>
              {formatCurrency(card.value)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="text-blue-600" size={20} />
            <div className="text-sm font-medium text-gray-600">Partner Shares</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rahul Net Share:</span>
              <span className={`font-semibold ${summary.rahulNetShare >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.rahulNetShare)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sagar Net Share:</span>
              <span className={`font-semibold ${summary.sagarNetShare >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.sagarNetShare)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="text-orange-600" size={20} />
            <div className="text-sm font-medium text-gray-600">Withdrawals</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rahul:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(summary.rahulTotalWithdrawal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sagar:</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(summary.sagarTotalWithdrawal)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="text-purple-600" size={20} />
            <div className="text-sm font-medium text-gray-600">Performance</div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Daily Sales:</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(summary.averageDailySales)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Active Days:</span>
              <span className="font-semibold text-purple-600">
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