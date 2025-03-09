'use client';

import React, { useState } from 'react';
import { 
  createBarChart, 
  createLineChart, 
  createPieChart,
  createSimpleReport,
  exportReportToPdf,
  processReconciliation
} from 'financial-reports';
import { ChartComponent } from 'financial-reports/components';

// Sample data
const monthlyRevenue = [42000, 49000, 57000, 61000, 56000, 63000];
const monthlyExpenses = [28000, 31000, 36000, 42000, 39000, 45000];
const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June'];

const accountTypes = ['Checking', 'Savings', 'Credit Card', 'Investment'];
const accountBalances = [15000, 35000, -4200, 125000];

const bankTransactions = [
  { id: 'b1', date: new Date('2023-06-15'), description: 'Client Payment - ABC Corp', amount: 5000, type: 'credit' },
  { id: 'b2', date: new Date('2023-06-18'), description: 'Office Supplies', amount: -350, type: 'debit' },
  { id: 'b3', date: new Date('2023-06-20'), description: 'Monthly Rent', amount: -2200, type: 'debit' },
  { id: 'b4', date: new Date('2023-06-25'), description: 'Client Payment - XYZ Inc', amount: 7500, type: 'credit' },
];

const bookTransactions = [
  { id: 'bk1', date: new Date('2023-06-15'), description: 'Client Payment - ABC Corp', amount: 5000, type: 'credit' },
  { id: 'bk2', date: new Date('2023-06-18'), description: 'Office Supplies', amount: -350, type: 'debit' },
  { id: 'bk3', date: new Date('2023-06-20'), description: 'Monthly Rent', amount: -2200, type: 'debit' },
  { id: 'bk4', date: new Date('2023-06-25'), description: 'Client Payment - XYZ Inc', amount: 7500, type: 'credit' },
  { id: 'bk5', date: new Date('2023-06-28'), description: 'Utilities', amount: -420, type: 'debit' },
];

/**
 * Financial Dashboard Example Component
 */
export default function FinancialDashboard() {
  const [isExporting, setIsExporting] = useState(false);
  
  // Create chart configurations
  const revenueChart = createBarChart(
    monthLabels,
    monthlyRevenue,
    {
      title: {
        display: true,
        text: 'Monthly Revenue'
      },
      legend: {
        display: false
      }
    }
  );
  
  const comparisonChart = createLineChart(
    monthLabels,
    [monthlyRevenue, monthlyExpenses],
    {
      title: {
        display: true,
        text: 'Revenue vs Expenses'
      }
    }
  );
  
  const accountsChart = createPieChart(
    accountTypes,
    accountBalances.map(balance => Math.abs(balance)),
    {
      title: {
        display: true,
        text: 'Account Distribution'
      }
    }
  );
  
  // Process reconciliation
  const reconciliationData = {
    account: {
      name: 'Business Checking',
      number: '1234567890',
      currency: 'USD',
      openingBalance: 10000,
      closingBalance: 19950
    },
    period: {
      startDate: new Date('2023-06-01'),
      endDate: new Date('2023-06-30')
    },
    bankTransactions,
    bookTransactions,
    settings: {
      fuzzyMatching: true,
      fuzzyThreshold: 0.7
    }
  };
  
  const reconciliationResults = processReconciliation(reconciliationData);
  
  // Handle export to PDF
  const handleExportToPdf = async () => {
    setIsExporting(true);
    
    try {
      // Create report
      const report = createSimpleReport('Monthly Financial Report', [
        {
          title: 'Revenue Overview',
          type: 'chart',
          content: revenueChart
        },
        {
          title: 'Revenue vs Expenses',
          type: 'chart',
          content: comparisonChart
        },
        {
          title: 'Monthly Summary',
          type: 'table',
          content: {
            headers: ['Month', 'Revenue', 'Expenses', 'Profit'],
            rows: monthLabels.map((month, index) => [
              month, 
              monthlyRevenue[index], 
              monthlyExpenses[index],
              monthlyRevenue[index] - monthlyExpenses[index]
            ]),
            summary: [
              'Total',
              monthlyRevenue.reduce((a, b) => a + b, 0),
              monthlyExpenses.reduce((a, b) => a + b, 0),
              monthlyRevenue.reduce((a, b) => a + b, 0) - monthlyExpenses.reduce((a, b) => a + b, 0)
            ]
          }
        },
        {
          title: 'Account Distribution',
          type: 'chart',
          content: accountsChart
        },
        {
          title: 'Bank Reconciliation',
          type: 'reconciliation',
          content: reconciliationData
        }
      ]);
      
      // Export to PDF
      const pdfBlob = await exportReportToPdf(report);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'financial-report.pdf';
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="financial-dashboard">
      <header className="dashboard-header">
        <h1>Financial Dashboard</h1>
        <button 
          className="export-button"
          onClick={handleExportToPdf}
          disabled={isExporting}
        >
          {isExporting ? 'Exporting...' : 'Export to PDF'}
        </button>
      </header>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Monthly Revenue</h2>
          <ChartComponent config={revenueChart} height={300} />
        </div>
        
        <div className="dashboard-card">
          <h2>Revenue vs Expenses</h2>
          <ChartComponent config={comparisonChart} height={300} />
        </div>
        
        <div className="dashboard-card">
          <h2>Account Distribution</h2>
          <ChartComponent config={accountsChart} height={300} />
        </div>
        
        <div className="dashboard-card">
          <h2>Bank Reconciliation</h2>
          <div className="reconciliation-summary">
            <div className="summary-item">
              <span>Status</span>
              <span className={reconciliationResults.summary.status === 'balanced' ? 'balanced' : 'unbalanced'}>
                {reconciliationResults.summary.status}
              </span>
            </div>
            <div className="summary-item">
              <span>Matched</span>
              <span>{reconciliationResults.matched.length} transactions</span>
            </div>
            <div className="summary-item">
              <span>Unmatched Bank</span>
              <span>{reconciliationResults.unmatchedBank.length} transactions</span>
            </div>
            <div className="summary-item">
              <span>Unmatched Book</span>
              <span>{reconciliationResults.unmatchedBook.length} transactions</span>
            </div>
            <div className="summary-item">
              <span>Match Percentage</span>
              <span>{reconciliationResults.summary.matchPercentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for the dashboard */}
      <style jsx>{`
        .financial-dashboard {
          font-family: 'Inter', sans-serif;
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        
        .export-button {
          background-color: #3f51b5;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .export-button:hover {
          background-color: #303f9f;
        }
        
        .export-button:disabled {
          background-color: #9fa8da;
          cursor: not-allowed;
        }
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
          gap: 20px;
        }
        
        .dashboard-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        .dashboard-card h2 {
          margin-top: 0;
          color: #333;
          font-size: 18px;
          margin-bottom: 15px;
        }
        
        .reconciliation-summary {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        
        .balanced {
          color: #4caf50;
          font-weight: bold;
        }
        
        .unbalanced {
          color: #f44336;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
} 