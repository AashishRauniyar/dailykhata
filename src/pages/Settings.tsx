import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { Settings, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const exportData = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `khata-book-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        localStorage.setItem('khata-book-transactions', JSON.stringify(importedData));
        alert('Data imported successfully! Please refresh the page.');
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    localStorage.removeItem('khata-book-transactions');
    setShowDeleteConfirm(false);
    alert('All data cleared successfully! Please refresh the page.');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="text-blue-600" size={24} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600">Manage your khata book preferences and data</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Data Management */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Management</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-green-800">Export Data</h4>
                  <p className="text-sm text-green-600">Download your transaction data as JSON backup</p>
                </div>
                <button
                  onClick={exportData}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-blue-800">Import Data</h4>
                  <p className="text-sm text-blue-600">Restore transaction data from JSON backup</p>
                </div>
                <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer">
                  <Upload size={18} />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">Clear All Data</h4>
                  <p className="text-sm text-red-600">Permanently delete all transactions (cannot be undone)</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{transactions.length}</div>
                <div className="text-sm text-gray-600">Total Transactions</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {new Set(transactions.map(t => t.date)).size}
                </div>
                <div className="text-sm text-gray-600">Active Days</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {Math.round((localStorage.getItem('khata-book-transactions')?.length || 0) / 1024)}KB
                </div>
                <div className="text-sm text-gray-600">Data Size</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
            <div className="text-sm text-gray-600 space-y-2">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete all transaction data? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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