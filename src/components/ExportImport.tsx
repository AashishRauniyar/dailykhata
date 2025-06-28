import React, { useRef, useState } from 'react';
import { Transaction } from '../types';
import { Download, Upload, FileText, Database } from 'lucide-react';

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ transactions, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string>('');

  // Export to CSV
  const exportToCSV = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const headers = [
      'Date',
      'Cash Amount',
      'Online Received',
      'Vendor Amount',
      'Expenses',
      'Rahul Amount',
      'Sagar Amount',
      'Used Cash',
      'Online Used',
      'Created At',
      'Updated At'
    ];

    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.date,
        transaction.cashAmount,
        transaction.onlineReceived,
        transaction.vendorAmount,
        transaction.expenses,
        transaction.rahulAmount,
        transaction.sagarAmount,
        transaction.usedCash,
        transaction.onlineUsed,
        new Date(transaction.createdAt).toISOString(),
        new Date(transaction.updatedAt).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const exportToJSON = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const jsonContent = JSON.stringify(transactions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportMessage('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let importedTransactions: Transaction[];

        if (file.name.endsWith('.json')) {
          importedTransactions = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          
          importedTransactions = lines.slice(1)
            .filter(line => line.trim()) // Remove empty lines
            .map((line, index) => {
              const values = line.split(',');
              return {
                id: `imported_${Date.now()}_${index}`,
                date: values[0],
                cashAmount: parseFloat(values[1]) || 0,
                onlineReceived: parseFloat(values[2]) || 0,
                vendorAmount: parseFloat(values[3]) || 0,
                expenses: parseFloat(values[4]) || 0,
                rahulAmount: parseFloat(values[5]) || 0,
                sagarAmount: parseFloat(values[6]) || 0,
                usedCash: parseFloat(values[7]) || 0,
                onlineUsed: parseFloat(values[8]) || 0,
                createdAt: values[9] ? new Date(values[9]) : new Date(),
                updatedAt: values[10] ? new Date(values[10]) : new Date(),
              };
            });
        } else {
          throw new Error('Unsupported file format. Please use CSV or JSON files.');
        }

        // Validate imported data
        if (!Array.isArray(importedTransactions)) {
          throw new Error('Invalid file format. Expected an array of transactions.');
        }

        // Basic validation for transaction structure
        const validTransactions = importedTransactions.filter(transaction => {
          return transaction && typeof transaction === 'object' && 
                 typeof transaction.date === 'string' &&
                 typeof transaction.cashAmount === 'number';
        });

        if (validTransactions.length === 0) {
          throw new Error('No valid transactions found in the file.');
        }

        onImport(validTransactions);
        setImportMessage(`Successfully imported ${validTransactions.length} transactions.`);
        
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        console.error('Import error:', error);
        setImportMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsImporting(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 transition-colors duration-200">
      <div className="flex items-center gap-3 mb-4">
        <Database className="text-blue-600 dark:text-blue-400 transition-colors duration-200" size={24} />
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            Export & Import
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Backup your data or import existing records
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Export Section */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            Export Data
          </h3>
          <div className="space-y-2">
            <button
              onClick={exportToCSV}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              disabled={transactions.length === 0}
            >
              <FileText size={18} />
              Export as CSV
            </button>
            <button
              onClick={exportToJSON}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              disabled={transactions.length === 0}
            >
              <Download size={18} />
              Export as JSON
            </button>
          </div>
          {transactions.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
              No transactions available to export
            </p>
          )}
        </div>

        {/* Import Section */}
        <div className="space-y-3">
          <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            Import Data
          </h3>
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
              disabled={isImporting}
            >
              <Upload size={18} />
              {isImporting ? 'Importing...' : 'Import File'}
            </button>
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
              Supports CSV and JSON files
            </p>
          </div>
          
          {importMessage && (
            <div className={`p-3 rounded-md text-sm ${
              importMessage.includes('Successfully') 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            } transition-colors duration-200`}>
              {importMessage}
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-600 transition-colors duration-200">
        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
          Import Guidelines:
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 transition-colors duration-200">
          <li>• CSV files should have the same column structure as exported files</li>
          <li>• JSON files should contain an array of transaction objects</li>
          <li>• Duplicate transactions will be merged based on date and amounts</li>
          <li>• Invalid or corrupted data will be filtered out during import</li>
        </ul>
      </div>
    </div>
  );
};

export default ExportImport; 