import React, { useRef, useState } from 'react';
import { Transaction } from '../types';
import { Download, Upload, FileText, Database, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatCurrency, calculateDailySale } from '../utils/calculations';

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ transactions, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string>('');

  // Calculate summary data for reports
  const calculateSummary = () => {
    return transactions.reduce(
      (summary, transaction) => {
        summary.totalCashIn += transaction.cashAmount || 0;
        summary.totalOnlineIn += transaction.onlineReceived || 0;
        summary.totalVendorAmount += transaction.vendorAmount || 0;
        summary.totalExpenses += transaction.expenses || 0;
        summary.totalRahulAmount += transaction.rahulAmount || 0;
        summary.totalSagarAmount += transaction.sagarAmount || 0;
        summary.totalCashOut += transaction.usedCash || 0;
        summary.totalOnlineOut += transaction.onlineUsed || 0;
        summary.totalSale += calculateDailySale(transaction);
        return summary;
      },
      {
        totalCashIn: 0,
        totalOnlineIn: 0,
        totalVendorAmount: 0,
        totalExpenses: 0,
        totalRahulAmount: 0,
        totalSagarAmount: 0,
        totalCashOut: 0,
        totalOnlineOut: 0,
        totalSale: 0,
      }
    );
  };

  // Export to PDF with professional formatting
  const exportToPDF = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header with business name and report details
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Daily Khata Book Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Total Transactions: ${transactions.length}`, pageWidth / 2, 38, { align: 'center' });
    
    // Add summary section
    const summary = calculateSummary();
    const netProfit = summary.totalSale - (summary.totalExpenses + summary.totalCashOut + summary.totalOnlineOut) - summary.totalVendorAmount;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Summary', 14, 55);
    
    const summaryData = [
      ['Total Sales', formatCurrency(summary.totalSale)],
      ['Cash Received', formatCurrency(summary.totalCashIn)],
      ['Online Received', formatCurrency(summary.totalOnlineIn)],
      ['Vendor Payments', formatCurrency(summary.totalVendorAmount)],
      ['Business Expenses', formatCurrency(summary.totalExpenses + summary.totalCashOut + summary.totalOnlineOut)],
      ['Partner Withdrawals', formatCurrency(summary.totalRahulAmount + summary.totalSagarAmount)],
      ['Net Profit', formatCurrency(netProfit)],
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Category', 'Amount']],
      body: summaryData,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [66, 139, 202], textColor: 255, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40, halign: 'right' } },
    });

    // Add transaction details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    doc.text('Transaction Details', 14, (doc as any).lastAutoTable.finalY + 20);

    const transactionData = transactions.map(transaction => [
      transaction.date,
      formatCurrency(transaction.cashAmount),
      formatCurrency(transaction.onlineReceived),
      formatCurrency(transaction.vendorAmount),
      formatCurrency(transaction.expenses),
      formatCurrency(transaction.rahulAmount),
      formatCurrency(transaction.sagarAmount),
      formatCurrency(transaction.usedCash),
      formatCurrency(transaction.onlineUsed),
      formatCurrency(calculateDailySale(transaction)),
    ]);

    autoTable(doc, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      startY: (doc as any).lastAutoTable.finalY + 25,
      head: [['Date', 'Cash In', 'Online In', 'Vendor', 'Expenses', 'Rahul', 'Sagar', 'Cash Out', 'Online Out', 'Daily Sale']],
      body: transactionData,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [40, 167, 69], textColor: 255, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 16, halign: 'right' },
        2: { cellWidth: 16, halign: 'right' },
        3: { cellWidth: 16, halign: 'right' },
        4: { cellWidth: 16, halign: 'right' },
        5: { cellWidth: 16, halign: 'right' },
        6: { cellWidth: 16, halign: 'right' },
        7: { cellWidth: 16, halign: 'right' },
        8: { cellWidth: 16, halign: 'right' },
        9: { cellWidth: 18, halign: 'right' },
      },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    });

    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, doc.internal.pageSize.height - 10, { align: 'right' });
      doc.text('Generated by Daily Khata Book System', 14, doc.internal.pageSize.height - 10);
    }

    doc.save(`khata-book-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Export to Excel with professional formatting
  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert('No transactions to export');
      return;
    }

    const summary = calculateSummary();
    const netProfit = summary.totalSale - (summary.totalExpenses + summary.totalCashOut + summary.totalOnlineOut) - summary.totalVendorAmount;
    const currentDate = new Date().toLocaleDateString();

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // === SUMMARY SHEET ===
    const summaryData = [
      ['Daily Khata Book Report', '', '', ''],
      ['', '', '', ''],
      [`Generated on: ${currentDate}`, '', '', ''],
      [`Total Transactions: ${transactions.length}`, '', '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['FINANCIAL SUMMARY', '', '', ''],
      ['', '', '', ''],
      ['Category', 'Amount (₹)', '', ''],
      ['Total Sales', summary.totalSale, '', ''],
      ['Cash Received', summary.totalCashIn, '', ''],
      ['Online Received', summary.totalOnlineIn, '', ''],
      ['Vendor Payments', summary.totalVendorAmount, '', ''],
      ['Business Expenses', summary.totalExpenses + summary.totalCashOut + summary.totalOnlineOut, '', ''],
      ['Partner Withdrawals', summary.totalRahulAmount + summary.totalSagarAmount, '', ''],
      ['Net Profit', netProfit, '', ''],
      ['', '', '', ''],
      ['', '', '', ''],
      ['BREAKDOWN DETAILS', '', '', ''],
      ['', '', '', ''],
      ['Income Sources:', '', '', ''],
      ['• Cash Amount', summary.totalCashIn, '', ''],
      ['• Online Received', summary.totalOnlineIn, '', ''],
      ['Total Income', summary.totalCashIn + summary.totalOnlineIn, '', ''],
      ['', '', '', ''],
      ['Expense Categories:', '', '', ''],
      ['• Vendor Payments', summary.totalVendorAmount, '', ''],
      ['• Business Expenses', summary.totalExpenses, '', ''],
      ['• Cash Used', summary.totalCashOut, '', ''],
      ['• Online Used', summary.totalOnlineOut, '', ''],
      ['• Rahul Withdrawals', summary.totalRahulAmount, '', ''],
      ['• Sagar Withdrawals', summary.totalSagarAmount, '', ''],
      ['Total Expenses', summary.totalVendorAmount + summary.totalExpenses + summary.totalCashOut + summary.totalOnlineOut + summary.totalRahulAmount + summary.totalSagarAmount, '', '']
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

    // Set column widths for summary sheet
    summarySheet['!cols'] = [
      { width: 25 },  // Category column
      { width: 15 },  // Amount column
      { width: 10 },  // Empty column
      { width: 10 }   // Empty column
    ];

    // Merge cells for title
    summarySheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
      { s: { r: 6, c: 0 }, e: { r: 6, c: 3 } }, // Financial Summary header
      { s: { r: 18, c: 0 }, e: { r: 18, c: 3 } } // Breakdown Details header
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Financial Summary');

    // === TRANSACTIONS SHEET ===
    const transactionsData = [
      ['TRANSACTION DETAILS', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['Date', 'Cash In', 'Online In', 'Vendor Pay', 'Expenses', 'Rahul Exp', 'Sagar Exp', 'Cash Out', 'Online Out', 'Daily Sale', 'Created', 'Updated'],
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
        calculateDailySale(transaction),
        new Date(transaction.createdAt).toLocaleDateString(),
        new Date(transaction.updatedAt).toLocaleDateString()
      ]),
      ['', '', '', '', '', '', '', '', '', '', '', ''],
      ['TOTALS:', summary.totalCashIn, summary.totalOnlineIn, summary.totalVendorAmount, summary.totalExpenses, summary.totalRahulAmount, summary.totalSagarAmount, summary.totalCashOut, summary.totalOnlineOut, summary.totalSale, '', '']
    ];

    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);

    // Set column widths for transactions sheet
    transactionsSheet['!cols'] = [
      { width: 12 },  // Date
      { width: 10 },  // Cash In
      { width: 12 },  // Online In
      { width: 12 },  // Vendor Pay
      { width: 10 },  // Expenses
      { width: 12 },  // Rahul Exp
      { width: 12 },  // Sagar Exp
      { width: 10 },  // Cash Out
      { width: 12 },  // Online Out
      { width: 12 },  // Daily Sale
      { width: 12 },  // Created
      { width: 12 }   // Updated
    ];

    // Merge title row
    transactionsSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }
    ];

    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transaction Details');

    // === ANALYTICS SHEET ===
    interface MonthlyStats {
      month: string;
      transactions: number;
      totalSale: number;
      totalIncome: number;
      totalExpenses: number;
      netProfit: number;
    }

    const monthlyData = transactions.reduce((acc, transaction) => {
      const month = transaction.date.substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = {
          month,
          transactions: 0,
          totalSale: 0,
          totalIncome: 0,
          totalExpenses: 0,
          netProfit: 0
        };
      }
      const dailySale = calculateDailySale(transaction);
      acc[month].transactions += 1;
      acc[month].totalSale += dailySale;
      acc[month].totalIncome += (transaction.cashAmount + transaction.onlineReceived);
      acc[month].totalExpenses += (transaction.vendorAmount + transaction.expenses + transaction.usedCash + transaction.onlineUsed + transaction.rahulAmount + transaction.sagarAmount);
      acc[month].netProfit = acc[month].totalIncome - acc[month].totalExpenses;
      return acc;
    }, {} as Record<string, MonthlyStats>);

    const analyticsData = [
      ['MONTHLY ANALYTICS', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Month', 'Transactions', 'Total Sales', 'Total Income', 'Total Expenses', 'Net Profit'],
      ...Object.values(monthlyData).map((month: MonthlyStats) => [
        month.month,
        month.transactions,
        month.totalSale,
        month.totalIncome,
        month.totalExpenses,
        month.netProfit
      ]),
      ['', '', '', '', '', ''],
      ['AVERAGES & INSIGHTS', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Average Daily Sale', summary.totalSale / transactions.length, '', '', '', ''],
      ['Average Transaction Value', (summary.totalCashIn + summary.totalOnlineIn) / transactions.length, '', '', '', ''],
      ['Profit Margin %', ((netProfit / summary.totalSale) * 100).toFixed(2) + '%', '', '', '', ''],
      ['Cash vs Online Ratio', `${((summary.totalCashIn / (summary.totalCashIn + summary.totalOnlineIn)) * 100).toFixed(1)}% Cash`, '', '', '', '']
    ];

    const analyticsSheet = XLSX.utils.aoa_to_sheet(analyticsData);

    // Set column widths for analytics sheet
    analyticsSheet['!cols'] = [
      { width: 12 },  // Month
      { width: 12 },  // Transactions
      { width: 15 },  // Total Sales
      { width: 15 },  // Total Income
      { width: 15 },  // Total Expenses
      { width: 15 }   // Net Profit
    ];

    // Merge headers
    analyticsSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 5 } }
    ];

    XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics');

    // Save the file
    XLSX.writeFile(workbook, `Daily-Khata-Book-Report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

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
      'Daily Sale',
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
        calculateDailySale(transaction),
        new Date(transaction.createdAt).toISOString(),
        new Date(transaction.updatedAt).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `khata-book-${new Date().toISOString().split('T')[0]}.csv`);
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

    const exportData = {
      exportInfo: {
        generatedOn: new Date().toISOString(),
        totalTransactions: transactions.length,
        summary: calculateSummary(),
      },
      transactions: transactions
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `khata-book-backup-${new Date().toISOString().split('T')[0]}.json`);
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
    
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      // Handle Excel files
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
          
          if (jsonData.length < 2) {
            throw new Error('Excel file must contain at least header row and one data row.');
          }
          
          const dataRows = jsonData.slice(1) as unknown[][];
          
          const importedTransactions: Transaction[] = dataRows
            .filter(row => row.length > 0 && row[0]) // Filter out empty rows
            .map((row, index) => ({
              id: `imported_${Date.now()}_${index}`,
              date: String(row[0] || new Date().toISOString().split('T')[0]),
              cashAmount: parseFloat(String(row[1])) || 0,
              onlineReceived: parseFloat(String(row[2])) || 0,
              vendorAmount: parseFloat(String(row[3])) || 0,
              expenses: parseFloat(String(row[4])) || 0,
              rahulAmount: parseFloat(String(row[5])) || 0,
              sagarAmount: parseFloat(String(row[6])) || 0,
              usedCash: parseFloat(String(row[7])) || 0,
              onlineUsed: parseFloat(String(row[8])) || 0,
              createdAt: row[10] ? new Date(String(row[10])) : new Date(),
              updatedAt: row[11] ? new Date(String(row[11])) : new Date(),
              businessType: 'COSMETIC' as const, // Default value for imported transactions
              userId: 'imported-user', // Default value for imported transactions
            }));

          processImportedTransactions(importedTransactions);
          
        } catch (error) {
          console.error('Excel import error:', error);
          setImportMessage(`Excel import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsImporting(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Handle CSV and JSON files
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let importedTransactions: Transaction[];

          if (file.name.endsWith('.json')) {
            const parsedData = JSON.parse(content);
            
            // Handle different JSON formats
            if (parsedData.transactions && Array.isArray(parsedData.transactions)) {
              // Handle our backup format with metadata
              importedTransactions = parsedData.transactions;
            } else if (Array.isArray(parsedData)) {
              // Handle simple array format
              importedTransactions = parsedData;
            } else {
              throw new Error('Invalid JSON format. Expected transactions array or backup format.');
            }
          } else if (file.name.endsWith('.csv')) {
            const lines = content.split('\n');
            if (lines.length < 2) {
              throw new Error('CSV file must contain at least header row and one data row.');
            }
            
            importedTransactions = lines.slice(1)
              .filter(line => line.trim()) // Remove empty lines
              .map((line, index) => {
                const values = line.split(',');
                return {
                  id: `imported_${Date.now()}_${index}`,
                  date: values[0]?.trim() || new Date().toISOString().split('T')[0],
                  cashAmount: parseFloat(values[1]) || 0,
                  onlineReceived: parseFloat(values[2]) || 0,
                  vendorAmount: parseFloat(values[3]) || 0,
                  expenses: parseFloat(values[4]) || 0,
                  rahulAmount: parseFloat(values[5]) || 0,
                  sagarAmount: parseFloat(values[6]) || 0,
                  usedCash: parseFloat(values[7]) || 0,
                  onlineUsed: parseFloat(values[8]) || 0,
                  createdAt: values[10] ? new Date(values[10]) : new Date(),
                  updatedAt: values[11] ? new Date(values[11]) : new Date(),
                  businessType: 'COSMETIC' as const, // Default value for imported transactions
                  userId: 'imported-user', // Default value for imported transactions
                };
              });
          } else {
            throw new Error('Unsupported file format. Please use CSV, JSON, or Excel files.');
          }

          processImportedTransactions(importedTransactions);
          
        } catch (error) {
          console.error('Import error:', error);
          setImportMessage(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          setIsImporting(false);
        }
      };
      reader.readAsText(file);
    }
  };

  // Process imported transactions (common logic)
  const processImportedTransactions = (importedTransactions: Transaction[]) => {
    try {
      // Validate imported data
      if (!Array.isArray(importedTransactions)) {
        throw new Error('Invalid file format. Expected an array of transactions.');
      }

      // Basic validation for transaction structure
      const validTransactions = importedTransactions.filter(transaction => {
        return transaction && typeof transaction === 'object' && 
               transaction.date && 
               typeof transaction.cashAmount === 'number';
      });

      if (validTransactions.length === 0) {
        throw new Error('No valid transactions found in the file.');
      }

      onImport(validTransactions);
      setImportMessage(
        `Successfully imported ${validTransactions.length} transactions.` +
        (validTransactions.length !== importedTransactions.length 
          ? ` (${importedTransactions.length - validTransactions.length} invalid records were skipped)` 
          : '')
      );
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Processing error:', error);
      setImportMessage(`Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
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

      <div className="space-y-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            Export Data
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={exportToPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={transactions.length === 0}
            >
              <FileText size={18} />
              Export PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={transactions.length === 0}
            >
              <FileSpreadsheet size={18} />
              Export Excel
            </button>
            <button
              onClick={exportToCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={transactions.length === 0}
            >
              <FileText size={18} />
              Export CSV
            </button>
            <button
              onClick={exportToJSON}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={transactions.length === 0}
            >
              <Download size={18} />
              Export JSON
            </button>
          </div>
          {transactions.length === 0 ? (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg transition-colors duration-200">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 transition-colors duration-200">
                No transactions available to export. Add some transactions first.
              </p>
            </div>
          ) : (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors duration-200">
              <p className="text-sm text-blue-700 dark:text-blue-300 transition-colors duration-200">
                <strong>Ready to export {transactions.length} transactions:</strong>
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 mt-2 space-y-1">
                <li>• <strong>PDF:</strong> Professional report with summary and detailed transactions</li>
                <li>• <strong>Excel:</strong> Multi-sheet workbook with summary and transaction data</li>
                <li>• <strong>CSV:</strong> Simple format for data analysis and spreadsheet import</li>
                <li>• <strong>JSON:</strong> Complete backup with metadata for system restore</li>
              </ul>
            </div>
          )}
        </div>

        {/* Import Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            Import Data
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xlsx"
              onChange={handleFileImport}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
              disabled={isImporting}
            >
              <Upload size={18} />
              {isImporting ? 'Importing...' : 'Select File to Import'}
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md border border-gray-200 dark:border-gray-600 transition-colors duration-200">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 transition-colors duration-200">
              Supported Formats:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 transition-colors duration-200">
              <li>• <strong>CSV files:</strong> Must have the same column structure as exported files</li>
              <li>• <strong>JSON files:</strong> Should contain transaction data or backup files</li>
              <li>• <strong>Excel files:</strong> Will read the first sheet with transaction data</li>
            </ul>
          </div>
          
          {importMessage && (
            <div className={`p-4 rounded-md text-sm ${
              importMessage.includes('Successfully') 
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
            } transition-colors duration-200`}>
              <strong>{importMessage.includes('Successfully') ? 'Success!' : 'Error!'}</strong>
              <br />
              {importMessage}
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default ExportImport; 