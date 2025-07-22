import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Settings, Trash2, AlertTriangle, Moon, Sun } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };



  const clearAllData = () => {
    localStorage.removeItem('khata-book-transactions');
    setShowDeleteConfirm(false);
    alert('All data cleared successfully! Please refresh the page.');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-blue-600 dark:text-blue-400" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Manage your khata book preferences and data</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">Appearance</h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors duration-200">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-white transition-colors duration-200">Dark Mode</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Toggle between light and dark theme</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-full ${darkMode ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'} transition-colors duration-200`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Data Management */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">Data Management</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg transition-colors duration-200">
                <div>
                  <h4 className="font-medium text-red-800 dark:text-red-300 transition-colors duration-200">Clear All Data</h4>
                  <p className="text-sm text-red-600 dark:text-red-400 transition-colors duration-200">Permanently delete all transactions (cannot be undone)</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200">
                <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200">
                  <strong>Note:</strong> For data export and import functionality, please use the Export & Import section available in the Daily Khata page.
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">{transactions.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Transactions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                  {new Set(transactions.map(t => t.date)).size}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Active Days</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
                  {Math.round((localStorage.getItem('khata-book-transactions')?.length || 0) / 1024)}KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Data Size</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-200">About</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2 transition-colors duration-200">
              <p><strong>Khata Book</strong> - Digital Business Transaction Management</p>
              <p>Version: 1.0.0</p>
              <p>Data is stored locally in your browser's storage.</p>
              <p>Regular backups are recommended to prevent data loss.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 transition-colors duration-200 animate-slide-in">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white transition-colors duration-200">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-200">
              Are you sure you want to delete all transaction data? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;