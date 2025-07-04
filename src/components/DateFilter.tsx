import React from 'react';
import { DateFilter } from '../types';
import { Calendar } from 'lucide-react';

interface DateFilterProps {
  dateFilter: DateFilter;
  onDateFilterChange: (filter: DateFilter) => void;
}

const DateFilterComponent: React.FC<DateFilterProps> = ({ dateFilter, onDateFilterChange }) => {
  const handlePresetChange = (preset: 'today' | 'this-week' | 'this-month' | 'this-year' | 'custom') => {
    let startDate = dateFilter.startDate;
    let endDate = dateFilter.endDate;
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    switch (preset) {
      case 'today':
        startDate = todayStr;
        endDate = todayStr;
        break;
      case 'this-week': {
        // Get first day of current week (Sunday)
        const first = new Date(today);
        const day = today.getDay();
        first.setDate(today.getDate() - day);
        
        startDate = first.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      }
      case 'this-month': {
        // Get first day of current month
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        
        startDate = first.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      }
      case 'this-year': {
        // Get first day of current year
        const first = new Date(today.getFullYear(), 0, 1);
        
        startDate = first.toISOString().split('T')[0];
        endDate = todayStr;
        break;
      }
      case 'custom':
        // Keep existing dates
        break;
    }
    
    onDateFilterChange({
      startDate,
      endDate,
      preset,
    });
  };
  
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onDateFilterChange({
      ...dateFilter,
      [field]: value,
      preset: 'custom',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 mb-4 sm:mb-6 transition-colors duration-200 animate-fade-in">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">Date Filter</h3>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {(['today', 'this-week', 'this-month', 'this-year'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetChange(preset)}
              className={`px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                dateFilter.preset === preset
                  ? 'bg-blue-600 dark:bg-blue-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {preset.charAt(0).toUpperCase() + preset.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">From:</span>
            <input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap transition-colors duration-200">To:</span>
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateFilterComponent;